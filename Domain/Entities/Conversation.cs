using Domain.Common;
using Domain.Shared;

namespace Domain.Entities
{
   public class Conversation : BaseEntity
    {
        public Guid CreatedByUserId { get; private set; }
        public AppUser CreatedByUser { get; private set; } = null!;

        public List<ConversationParticipant> Participants { get; private set; } = new();
        public List<Message> Messages { get; private set; } = new();


        public AppUser GetOtherParticipant(Guid currentUserId)
        {
            return Participants.FirstOrDefault(p => p.UserId != currentUserId)!.User;
        }

        public static Result<Conversation> CreateOneOnOne(
            AppUser creatorUser,
            AppUser otherUser)
        {
            if (creatorUser.Id == otherUser.Id)
            {
                return Result.Failure<Conversation>(
                    new Error(
                        "Conversation.Participants",
                        "A one-on-one conversation requires two different participants."
                    ));
            }

            var conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                CreatedByUserId = creatorUser.Id
            };

            conversation.AddParticipant(creatorUser);
            conversation.AddParticipant(otherUser);

            return Result.Success(conversation);
        }

        private void AddParticipant(AppUser user)
        {
            Participants.Add(new ConversationParticipant(Id, user));
        }
    }
}
