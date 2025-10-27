namespace Kalenner.Entities.Auth.Responses
{
    public class LoginResponse
    {
        public string Token { get; set; } = default!;
        public DateTime ExpiresAt { get; set; }
        public string Email { get; set; } = default!;
        public IEnumerable<string> Roles { get; set; } = new List<string>();
        public int CompanyId { get; set; }
    }
}
