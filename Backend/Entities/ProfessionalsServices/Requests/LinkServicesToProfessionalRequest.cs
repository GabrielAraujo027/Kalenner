namespace Kalenner.Entities.ProfessionalsServices.Requests
{
    public class LinkServicesToProfessionalRequest
    {
        public int ProfessionalId { get; set; }
        public List<LinkServiceItem> Items { get; set; } = new();
    }

    public class LinkServiceItem
    {
        public int ServiceId { get; set; }
        public int? DurationMinutesOverride { get; set; }
        public decimal? PriceOverride { get; set; }
    }
}
