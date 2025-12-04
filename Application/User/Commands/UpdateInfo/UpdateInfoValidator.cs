using FluentValidation;

namespace Application.User.Commands.UpdateInfo
{
    public class UpdateInfoValidator : AbstractValidator<UpdateInfoCommand>
    {
        public UpdateInfoValidator()
        {
            RuleFor( x=> x.email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.phoneNumber)
                .MaximumLength(15).WithMessage("Phone number must not exceed 15 characters.")
                .Matches(@"^\+?[0-9]*$").WithMessage("Phone number can only contain digits and an optional leading +.")
                .When(x => !string.IsNullOrWhiteSpace(x.phoneNumber));
            RuleFor(x => x.dateOfBirth)
                .LessThan(DateTime.UtcNow).WithMessage("Date of birth must be in the past.")
                .GreaterThan(DateTime.UtcNow.AddYears(-100)).WithMessage("Age cannot exceed 100 years.")
                .When(x => x.dateOfBirth.HasValue);

        }
    }
}
