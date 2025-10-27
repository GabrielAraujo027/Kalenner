using Kalenner.Entities.Appointments;
using Kalenner.Entities.Auth;
using Kalenner.Entities.Professionals;
using Kalenner.Entities.Services;

namespace Kalenner.Entities.Companies
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Slug { get; set; }
        public string? LogoUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }
        public string TimeZone { get; set; } = "America/Sao_Paulo";
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? CorporateName { get; set; }
        public string? CNPJ { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ApplicationUser>? Users { get; set; }
        public ICollection<Service>? Services { get; set; }
        public ICollection<Professional>? Professionals { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
