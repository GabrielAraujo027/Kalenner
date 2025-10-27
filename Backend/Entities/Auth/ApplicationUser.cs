using Kalenner.Entities.Appointments;
using Kalenner.Entities.Companies;
using Microsoft.AspNetCore.Identity;

namespace Kalenner.Entities.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public int CompanyId { get; set; } = default!;
        public Company Company { get; set; } = default!;
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
