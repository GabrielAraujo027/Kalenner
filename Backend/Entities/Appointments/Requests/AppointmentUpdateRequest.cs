using System.ComponentModel.DataAnnotations;
using Kalenner.Entities.Appointments.Enums;

namespace Kalenner.Entities.Appointments.Requests
{
    public class AppointmentUpdateRequest
    {
        public DateTime? Start { get; set; }
        public int? ProfessionalId { get; set; }
        public string? Notes { get; set; }
        public AppointmentStatus? Status { get; set; }
    }
}
