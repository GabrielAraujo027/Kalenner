namespace Kalenner.Entities.Professionals.Requests
{
    public class ProfessionalCreateRequest
    {
        public string Name { get; set; } = default!;
        public bool IsActive { get; set; } = true;
    }
}
