using Kalenner.Entities.Appointments.Enums;
using Kalenner.Entities.Auth;
using Kalenner.Entities.Companies;
using Kalenner.Entities.Professionals;
using Kalenner.Entities.Services;

namespace Kalenner.Entities.Appointments
{
    public class Appointment
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int ServiceId { get; set; }
        public Service Service { get; set; } = default!;

        public int? ProfessionalId { get; set; }
        public Professional? Professional { get; set; }

        public string? ClientId { get; set; }
        public ApplicationUser? Client { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
