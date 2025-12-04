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

    }
}
