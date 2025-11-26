using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using MediatR;

namespace Application.User.Commands.Create
{
    public sealed class RegisterCommandHandler
        : ICommandHandler<RegisterCommand, Guid>
    {
        private readonly IUserHelper _userHelper;

        public RegisterCommandHandler(IUserHelper userHelper)
        {
            _userHelper = userHelper;
        }

        public async Task<Result<Guid>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new AppUser
            (
                request.username,
                request.email,
                request.email
            );
            var identityResult = await _userHelper.CreateUserAsync(user, request.password);

            if (identityResult.Succeeded)
            {
                return Result.Success(user.Id);
            }

            var error = identityResult.Errors.Select(e => e.Description).FirstOrDefault() ?? "Unknown error";
            return Result.Failure<Guid>(new Domain.Shared.Error("AppUser.CreatingAccount", error)) ;
        }
    }
}
