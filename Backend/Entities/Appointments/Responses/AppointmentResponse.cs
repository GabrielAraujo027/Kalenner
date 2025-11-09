using Kalenner.Entities.Appointments.Enums;

namespace Kalenner.Entities.Appointments.Responses
{
    public class AppointmentResponse
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string? ServiceName { get; set; }
        public int? ProfessionalId { get; set; }
        public string? ProfessionalName { get; set; }
        public string? ClientId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public AppointmentStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
