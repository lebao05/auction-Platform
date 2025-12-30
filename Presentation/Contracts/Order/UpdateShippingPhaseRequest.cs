using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Order
{
    public class UpdateShippingPhaseRequest
    {
        public IFormFile ShippingInvoiceImage { get; set; } = null!;
    }

}
