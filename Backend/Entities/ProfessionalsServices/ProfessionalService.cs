using Kalenner.Entities.Professionals;
using Kalenner.Entities.Services;

namespace Kalenner.Entities.ProfessionalsServices
{
    public class ProfessionalService
    {
        public int Id { get; set; }
        public Professional Professional { get; set; } = default!;
        public Service Service { get; set; } = default!;
        public int? DurationMinutesOverride { get; set; }
        public decimal? PriceOverride { get; set; }
    }
}
