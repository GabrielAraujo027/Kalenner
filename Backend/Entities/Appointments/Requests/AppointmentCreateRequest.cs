using System.ComponentModel.DataAnnotations;

namespace Kalenner.Entities.Appointments.Requests
{
    public class AppointmentCreateRequest
    {
        [Required]
        public int ServiceId { get; set; }
        public int? ProfessionalId { get; set; }
        [Required]
        public DateTime Start { get; set; } 
        public string? Notes { get; set; }
    }
}
