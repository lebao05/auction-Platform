using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.SystemSetting.Commands.AdjustSetting
{
    public class AdjustSettingCommandHandler : ICommandHandler<AdjustSettingCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISystemSettingRepository _systemSettingRepository;
        public AdjustSettingCommandHandler(IUnitOfWork unitOfWork,
            ISystemSettingRepository systemSettingRepository)
        {
            _systemSettingRepository = systemSettingRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(AdjustSettingCommand request, CancellationToken cancellationToken)
        {
            var setting = await _systemSettingRepository.GetSystemSettingByKey(request.SystemKey,
                cancellationToken);

            if (setting == null)
            {
                return Result.Failure(new Error("SystemSetting.NotFound", "There is no setting with this key"));
            }
            setting!.SystemValue = request.SystemValue;
            await _unitOfWork.SaveChangesAsync();
            return Result.Success();
        }
    }
}
