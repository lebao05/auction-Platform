using Domain.Entities;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        //Task AddAsync(T entity, CancellationToken cancellationToken = default);
        //void Update(T entity);
        //void Remove(T entity);
        Task <AppUser?> GetUserById(Guid id, CancellationToken cancellationToken = default);
    }
}
