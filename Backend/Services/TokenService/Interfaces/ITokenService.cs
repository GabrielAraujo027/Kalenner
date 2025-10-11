using Kalenner.Entities.Auth;

namespace Kalenner.Services.TokenService.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateAsync(ApplicationUser user, IEnumerable<string> roles, DateTime expiresAt);
    }
}
