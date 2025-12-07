using Application.Abstractions.Messaging;

namespace Application.Product.Commands.CreateProduct
{
    public sealed record CreateProductCommand(
        Guid userId,
        string Name,
        long? BuyNowPrice,
        long StartPrice,
        long StepPrice,
        bool IsAutoRenewal,
        bool AllowAll,
        string Description,
        int Hours,
        Guid? CategoryId,
        List<string>? ImagePaths ,
        int mainIndex
    ) : ICommand<Guid>;
}
