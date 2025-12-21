namespace Presentation.Contracts.Product
{
    public sealed record AddDescriptionRequest(string description,Guid productId);
}
