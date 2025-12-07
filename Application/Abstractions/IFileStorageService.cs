namespace Application.Abstractions
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(string filePath, CancellationToken cancellationToken = default);
        Task DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
        Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default);

    }
}
