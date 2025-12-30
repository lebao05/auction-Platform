using Microsoft.AspNetCore.Http;
namespace Presentation.Contracts.Order
{
    public class UpdatePaymentPhaseRequest
    {
        public IFormFile? PaymentImage { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
