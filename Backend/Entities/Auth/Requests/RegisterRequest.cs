using System.ComponentModel.DataAnnotations;

namespace Kalenner.Entities.Auth.Requests
{
    public class RegisterRequest
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public int CompanyId { get; set; }
    }
}
