using Application.Abstractions;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;

namespace Infraestructure.Externals
{
    public class AzureBlobStorageService : IFileStorageService
    {
        private readonly string _connection;
        private readonly string _container;

        public AzureBlobStorageService(IConfiguration config)
        {
            _connection = config["AzureStorage:ConnectionString"]!;
            _container = config["AzureStorage:ContainerName"]!;
        }

        public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
        {
            var containerClient = new BlobContainerClient(_connection, _container);
            await containerClient.CreateIfNotExistsAsync();

            var blob = containerClient.GetBlobClient(fileName);

            await blob.UploadAsync(stream, new Azure.Storage.Blobs.Models.BlobHttpHeaders
            {
                ContentType = contentType
            });

            return blob.Uri.ToString();
        }
    }
}
