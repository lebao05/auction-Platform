using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void AddSellerRequest(SellerRequest request)
        {
            _context.SellerRequests.Add(request);
        }

        public async Task<SellerRequest?> GetSellerRequest(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.SellerRequests.Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<SellerRequest?> GetSellerRequestById(Guid rqId, CancellationToken cancellationToken = default)
        {
            return await _context.SellerRequests
                .Include(x => x.User)
                .FirstOrDefaultAsync(rq => rq.Id == rqId, cancellationToken);
        }

        public async Task<List<SellerRequest>> GetSellerRequestsWithQuery(
            string[] userNames,
            int pageNumber,
            int pageSize,
            bool createdAtDecesding,
            CancellationToken cancellationToken = default)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 20;

            IQueryable<SellerRequest> query = _context.SellerRequests
                .Include(x => x.User)
                .Where(x => x.Status == Domain.Enums.RequestStatus.Pending);

            // Only apply full-text search if there are userNames
            if (userNames != null && userNames.Length > 0)
            {
                var fts = string.Join(" AND ", userNames.Select(n => $"\"{n}*\""));
                query = query.Where(x => EF.Functions.Contains(x.User.FullName, fts));
            }

            // Sorting
            query = createdAtDecesding
                ? query.OrderByDescending(x => x.CreatedAt)
                : query.OrderBy(x => x.CreatedAt);

            // Paging
            query = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            return await query.ToListAsync(cancellationToken);
        }


        public async Task<AppUser?> GetUserByEmail(string email, CancellationToken cancellationToken = default)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }


        public async Task<AppUser?> GetUserById(Guid id, CancellationToken cancellationToken = default)
        => await _context.Users.FirstOrDefaultAsync( u=> u.Id == id , cancellationToken);

        public async Task<AppUser?> GetUserWithSellerRequest(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Users.Include(u => u.SellerRequests).FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        }
        public IQueryable<AppUser> GetUser()
        {
            return _context.Users.AsQueryable();
        }
    }
}
