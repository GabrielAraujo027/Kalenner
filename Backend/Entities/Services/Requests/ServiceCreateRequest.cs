namespace Kalenner.Entities.Services.Requests
{
    public class ServiceCreateRequest
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public int DurationMinutes { get; set; }
        public decimal? Price { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
