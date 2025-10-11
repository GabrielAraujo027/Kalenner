using Kalenner.Entities.Auth.Enums;
using Microsoft.AspNetCore.Identity;

namespace Kalenner.Entities.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public int IdEmpresa { get; set; }
        public UserType TipoUsuario { get; set; }
        public int? IdCliente { get; set; }
    }
}
