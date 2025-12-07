using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Product
{
    public class CreateProductRequest
    {
        public string Name { get; set; } = null!;
        public long? BuyNowPrice { get; set; }
        public long StartPrice { get; set; }
        public long StepPrice { get; set; }
        public bool IsAutoRenewal { get; set; }
        public bool AllowAll { get; set; } = true;
        public string Description { get; set; } = null!;
        public int Hours { get; set; }
        public Guid? CategoryId { get; set; }
        public List<IFormFile> Images { get; set; } = new();
        public int MainIndex { get; set; } = 0;
    }
}
