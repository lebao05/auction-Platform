using Domain.Common;
using System.Linq.Expressions;

namespace Domain.Repositories
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<T>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<List<T>> FindAsync(
            Expression<Func<T, bool>> predicate,
            CancellationToken cancellationToken = default);
        Task AddAsync(T entity, CancellationToken cancellationToken = default);
        //Task AddRangeAsync(
        //    IEnumerable<T> entities,
        //    CancellationToken cancellationToken = default);
        void Update(T entity);
        void Remove(T entity);
        //void RemoveRange(IEnumerable<T> entities);
    }
}
