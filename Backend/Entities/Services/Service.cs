using Kalenner.Entities.Appointments;
using Kalenner.Entities.Companies;
using Kalenner.Entities.ProfessionalsServices;

namespace Kalenner.Entities.Services
{
    public class Service
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public int DurationMinutes { get; set; }
        public decimal? Price { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ProfessionalService>? ProfessionalServices { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
