using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Product.Commands.CreateProduct
{
    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.userId)
                        .NotEmpty().WithMessage("UserId is required.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(200).WithMessage("Product name must not exceed 200 characters.");

            RuleFor(x => x.BuyNowPrice)
                .NotEqual( 0 )
                .GreaterThanOrEqualTo(x => x.StartPrice)
                .When(x => x.BuyNowPrice.HasValue)
                .WithMessage("BuyNowPrice ({PropertyValue}) must be greater than or equal to StartPrice ({ComparisonValue}).");


            RuleFor(x => x.StartPrice)
                .GreaterThan(0).WithMessage("StartPrice must be greater than 0.");

            RuleFor(x => x.StepPrice)
                .GreaterThan(0).WithMessage("StepPrice must be greater than 0.");

            RuleFor(x => x.Hours)
                .InclusiveBetween(1, 168) 
                .WithMessage("Hours must be between 1 and 168.");

            RuleFor(x => x.ImagePaths)
                .NotNull().WithMessage("Images are required.")
                .Must(list => list!.Count >= 3)
                .WithMessage("At least 3 images are required.");

            RuleFor(x => x.mainIndex)
                .GreaterThanOrEqualTo(-1)
                .Must((cmd, mainIndex) =>
                    mainIndex < (cmd.ImagePaths?.Count ?? 0))
                .WithMessage("Main image index is out of range.");
        }
    }
}
