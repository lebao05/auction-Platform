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
        public async Task<AppUser?> GetUserById(Guid id, CancellationToken cancellationToken = default)
        => await _context.Users.FirstOrDefaultAsync( u=> u.Id == id , cancellationToken);
    }
}
