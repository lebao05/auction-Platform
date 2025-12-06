namespace Application.Abstractions
{
    public interface IFileStorageService
    {
        Task<string> UploadAsync(Stream stream, string fileName, string contentType);
    }
}
