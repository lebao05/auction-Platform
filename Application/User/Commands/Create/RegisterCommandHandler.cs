using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Shared;

namespace Application.User.Commands.Create
{
    public sealed class RegisterCommandHandler
        : ICommandHandler<RegisterCommand,Guid>
    {
        private readonly IUserHelper _userHelper;

        public RegisterCommandHandler(IUserHelper userHelper)
        {
            _userHelper = userHelper;
        }

        public async Task<Result> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var identityResult = await _userHelper.CreateUserAsync(
                request.fullname,
                request.email,
                request.password
            );

            if (identityResult.Succeeded)
            {
                return Result.Success();
            }

            // Convert IdentityErrors → Domain Result failure
            var errors = identityResult.Errors.Select(e => e.Description).ToArray();
            return Result.Failure(errors);
        }
    }
}
