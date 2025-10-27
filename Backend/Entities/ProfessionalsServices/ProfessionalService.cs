using Kalenner.Entities.Professionals;
using Kalenner.Entities.Services;

namespace Kalenner.Entities.ProfessionalsServices
{
    public class ProfessionalService
    {
        public int Id { get; set; }

        public int ProfessionalId { get; set; }
        public Professional Professional { get; set; } = default!;

        public int ServiceId { get; set; }
        public Service Service { get; set; } = default!;

        public int? DurationMinutesOverride { get; set; }
        public decimal? PriceOverride { get; set; }
    }
}
