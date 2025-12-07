using Application.Abstractions;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;

namespace Infraestructure.Externals
{
    public class AzureBlobStorageService : IFileStorageService
    {
        private readonly BlobContainerClient _containerClient;

        public AzureBlobStorageService(IConfiguration config)
        {
            var connection = config["AzureStorage:ConnectionString"]
                             ?? throw new ArgumentNullException("AzureStorage:ConnectionString");
            var container = config["AzureStorage:ContainerName"]
                            ?? throw new ArgumentNullException("AzureStorage:ContainerName");

            _containerClient = new BlobContainerClient(connection, container);
            _containerClient.CreateIfNotExists(PublicAccessType.Blob);
        }

        public async Task<string> UploadFileAsync(string filePath, CancellationToken cancellationToken = default)
        {
            var fileName = Path.GetFileName(filePath);
            var blobClient = _containerClient.GetBlobClient(fileName);

            await using var fileStream = File.OpenRead(filePath);

            var blobHttpHeader = new BlobHttpHeaders
            {
                ContentType = GetContentType(filePath), // sets proper MIME type
                ContentDisposition = "inline"           // ensures browser displays inline
            };

            await blobClient.UploadAsync(fileStream, new BlobUploadOptions
            {
                HttpHeaders = blobHttpHeader,
                Conditions = null 
            }, cancellationToken);

            return blobClient.Uri.ToString();
        }

        private static string GetContentType(string filePath)
        {
            var ext = Path.GetExtension(filePath).ToLowerInvariant();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                ".bmp" => "image/bmp",
                _ => "application/octet-stream"
            };
        }


        public async Task DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
        {
            var blobName = Path.GetFileName(fileUrl);
            var blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
        }

        public async Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default)
        {
            var blobName = Path.GetFileName(fileUrl);
            var blobClient = _containerClient.GetBlobClient(blobName);
            return await blobClient.ExistsAsync(cancellationToken);
        }
    }
}
