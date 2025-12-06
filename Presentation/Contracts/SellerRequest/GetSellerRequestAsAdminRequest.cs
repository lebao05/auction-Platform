namespace Presentation.Contracts.SellerRequest
{
    public sealed record GetSellerRequestAsAdminRequest(string? query,int pageNumber,bool createdDecsending);
}
