using System.Net;
using Application.Abstractions;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace Infraestructure.Externals
{
    /// <summary>
    /// File storage via Cloudinary.
    /// Both AzureBlobStorageService and this are registered in DI;
    /// the active provider is selected in DependencyInjection.cs via FileStorage:Provider.
    /// </summary>
    public class CloudinaryService : IFileStorageService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration config)
        {
            var cloudName  = config["Cloudinary:CloudName"]
                             ?? throw new ArgumentNullException("Cloudinary:CloudName");
            var apiKey     = config["Cloudinary:ApiKey"]
                             ?? throw new ArgumentNullException("Cloudinary:ApiKey");
            var apiSecret  = config["Cloudinary:ApiSecret"]
                             ?? throw new ArgumentNullException("Cloudinary:ApiSecret");

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadFileAsync(
            string filePath,
            CancellationToken cancellationToken = default)
        {
            await using var stream = File.OpenRead(filePath);
            return await UploadStreamAsync(stream, Path.GetFileName(filePath), cancellationToken);
        }

        public async Task<string> UploadFileAsync(
            Stream fileStream,
            string fileName,
            CancellationToken cancellationToken = default)
        {
            return await UploadStreamAsync(fileStream, fileName, cancellationToken);
        }

        private async Task<string> UploadStreamAsync(
            Stream fileStream,
            string fileName,
            CancellationToken cancellationToken)
        {
            // Reset stream position in case the caller already read from it
            if (fileStream.CanSeek)
                fileStream.Position = 0;

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                PublicId = SanitizePublicId(Path.GetFileNameWithoutExtension(fileName)),
                // Overwrite existing file with the same public ID so old assets are replaced
                Overwrite = true,
                // Return a secure URL with the delivery type set to fetch for seamless display
                EagerTransforms = new List<Transformation>
                {
                    new Transformation().FetchFormat("auto").Quality("auto")
                }
            };

            var result = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

            if (result.Error != null)
                throw new InvalidOperationException($"Cloudinary upload failed: {result.Error.Message}");

            // SecureUrl returns the CDN URL with transformations baked in
            return result.SecureUrl.ToString();
        }

        public async Task DeleteFileAsync(
            string fileUrl,
            CancellationToken cancellationToken = default)
        {
            var publicId = ExtractPublicId(fileUrl);
            if (string.IsNullOrEmpty(publicId))
                return;

            var deletionParams = new DeletionParams(publicId);
            var result = await _cloudinary.DeleteResourcesAsync(publicId);

            if (result.Error != null)
                throw new InvalidOperationException($"Cloudinary delete failed: {result.Error.Message}");
        }

        public async Task<bool> FileExistsAsync(
            string fileUrl,
            CancellationToken cancellationToken = default)
        {
            var publicId = ExtractPublicId(fileUrl);
            if (string.IsNullOrEmpty(publicId))
                return false;

            var existsParams = new GetResourceParams(publicId);
            var result = await _cloudinary.GetResourceAsync(existsParams, cancellationToken);

            return result.StatusCode == HttpStatusCode.OK;
        }

        /// <summary>
        /// Strips the Cloudinary domain/path from a URL to recover the public ID.
        /// e.g. https://res.cloudinary.com/my-cloud/image/upload/v123/my-product → my-product
        /// </summary>
        private static string? ExtractPublicId(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl))
                return null;

            // Pattern: /image/upload/ (or /video/upload/, /raw/upload/) followed by the public ID
            var uploadMarker = "/image/upload/";
            var idx = fileUrl.LastIndexOf(uploadMarker, StringComparison.OrdinalIgnoreCase);

            // Also handle video/raw variants
            if (idx < 0)
            {
                uploadMarker = "/video/upload/";
                idx = fileUrl.LastIndexOf(uploadMarker, StringComparison.OrdinalIgnoreCase);
            }
            if (idx < 0)
            {
                uploadMarker = "/raw/upload/";
                idx = fileUrl.LastIndexOf(uploadMarker, StringComparison.OrdinalIgnoreCase);
            }

            if (idx < 0)
                return null;

            var afterMarker = fileUrl[(idx + uploadMarker.Length)..];

            // Remove version prefix (e.g. v1234/) if present
            var versionIdx = afterMarker.IndexOf("/v", StringComparison.Ordinal);
            if (versionIdx >= 0)
                afterMarker = afterMarker[(versionIdx + 1)..];

            // Public ID may contain a file extension; strip it
            var dotIdx = afterMarker.LastIndexOf('.');
            if (dotIdx > 0)
                afterMarker = afterMarker[..dotIdx];

            return afterMarker.TrimEnd('/');
        }

        /// <summary>
        /// Replaces characters that Cloudinary forbids in public IDs.
        /// </summary>
        private static string SanitizePublicId(string name)
        {
            var invalid = Path.GetInvalidFileNameChars();
            var sanitized = new string(name
                .Where(c => !invalid.Contains(c))
                .Select(c => char.IsWhiteSpace(c) ? '_' : c)
                .ToArray());

            // Cloudinary also forbids @ in public IDs
            return sanitized.Replace("@", "_at_");
        }
    }
}
