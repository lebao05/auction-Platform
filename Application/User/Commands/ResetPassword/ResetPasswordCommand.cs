using Application.Abstractions.Messaging;

namespace Application.User.Commands.ResetPassword
{
    public sealed record ResetPasswordCommand(
      string Email,
      string Otp,
      string NewPassword
  ) : ICommand;
}
