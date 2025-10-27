namespace Kalenner.Entities.ProfessionalsServices.Requests
{
    public class LinkProfessionalsToServiceRequest
    {
        public int ServiceId { get; set; }
        public List<LinkProfessionalItem> Items { get; set; } = new();
    }

    public class LinkProfessionalItem
    {
        public int ProfessionalId { get; set; }
        public int? DurationMinutesOverride { get; set; }
        public decimal? PriceOverride { get; set; }
    }
}
