namespace Kalenner.Entities.Auth.Requests
{
    public class CadastroRequest
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}
