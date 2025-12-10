namespace Presentation.Contracts.Product
{
    public class AddToBlackListRequest
    {
        public Guid BidderId { get; set; }
        public Guid ProductId { get; set; }
    }
}
