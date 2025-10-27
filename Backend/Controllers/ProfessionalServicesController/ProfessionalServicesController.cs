using Kalenner.Entities.Auth;
using Kalenner.Entities.ProfessionalsServices;
using Kalenner.Entities.ProfessionalsServices.Requests;
using Kalenner.Infra;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Controllers.ProfessionalServicesController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfessionalServicesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfessionalServicesController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet("professional/{professionalId:int}")]
        public async Task<ActionResult<IEnumerable<object>>> GetServicesByProfessional([FromRoute] int professionalId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var exists = await _db.Professionals.AnyAsync(p => p.Id == professionalId && p.CompanyId == user.CompanyId);
            if (!exists) return NotFound();

            var data = await _db.ProfessionalServices
                .Where(ps => ps.ProfessionalId == professionalId)
                .Select(ps => new
                {
                    ps.Id,
                    ps.ServiceId,
                    ServiceName = ps.Service.Name,
                    ps.DurationMinutesOverride,
                    ps.PriceOverride
                })
                .OrderBy(ps => ps.ServiceName)
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("service/{serviceId:int}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProfessionalsByService([FromRoute] int serviceId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var exists = await _db.Services.AnyAsync(s => s.Id == serviceId && s.CompanyId == user.CompanyId);
            if (!exists) return NotFound();

            var data = await _db.ProfessionalServices
                .Where(ps => ps.ServiceId == serviceId)
                .Select(ps => new
                {
                    ps.Id,
                    ps.ProfessionalId,
                    ProfessionalName = ps.Professional.Name,
                    ps.DurationMinutesOverride,
                    ps.PriceOverride
                })
                .OrderBy(ps => ps.ProfessionalName)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost("professional/link")]
        public async Task<IActionResult> LinkServicesToProfessional([FromBody] LinkServicesToProfessionalRequest dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var professional = await _db.Professionals.FirstOrDefaultAsync(p => p.Id == dto.ProfessionalId && p.CompanyId == user.CompanyId);
            if (professional is null) return NotFound(new { error = "Profissional não encontrado." });

            var serviceIds = dto.Items.Select(i => i.ServiceId).Distinct().ToList();
            var services = await _db.Services.Where(s => serviceIds.Contains(s.Id) && s.CompanyId == user.CompanyId).ToListAsync();
            if (services.Count != serviceIds.Count) return BadRequest(new { error = "Um ou mais serviços não pertencem à empresa do usuário." });

            foreach (var item in dto.Items)
            {
                var exists = await _db.ProfessionalServices.AnyAsync(ps => ps.ProfessionalId == dto.ProfessionalId && ps.ServiceId == item.ServiceId);
                if (!exists)
                {
                    _db.ProfessionalServices.Add(new ProfessionalService
                    {
                        ProfessionalId = dto.ProfessionalId,
                        ServiceId = item.ServiceId,
                        DurationMinutesOverride = item.DurationMinutesOverride,
                        PriceOverride = item.PriceOverride
                    });
                }
                else
                {
                    var ps = await _db.ProfessionalServices.FirstAsync(x => x.ProfessionalId == dto.ProfessionalId && x.ServiceId == item.ServiceId);
                    ps.DurationMinutesOverride = item.DurationMinutesOverride;
                    ps.PriceOverride = item.PriceOverride;
                }
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("service/link")]
        public async Task<IActionResult> LinkProfessionalsToService([FromBody] LinkProfessionalsToServiceRequest dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var service = await _db.Services.FirstOrDefaultAsync(s => s.Id == dto.ServiceId && s.CompanyId == user.CompanyId);
            if (service is null) return NotFound(new { error = "Serviço não encontrado." });

            var professionalIds = dto.Items.Select(i => i.ProfessionalId).Distinct().ToList();
            var professionals = await _db.Professionals.Where(p => professionalIds.Contains(p.Id) && p.CompanyId == user.CompanyId).ToListAsync();
            if (professionals.Count != professionalIds.Count) return BadRequest(new { error = "Um ou mais profissionais não pertencem à empresa do usuário." });

            foreach (var item in dto.Items)
            {
                var exists = await _db.ProfessionalServices.AnyAsync(ps => ps.ProfessionalId == item.ProfessionalId && ps.ServiceId == dto.ServiceId);
                if (!exists)
                {
                    _db.ProfessionalServices.Add(new ProfessionalService
                    {
                        ProfessionalId = item.ProfessionalId,
                        ServiceId = dto.ServiceId,
                        DurationMinutesOverride = item.DurationMinutesOverride,
                        PriceOverride = item.PriceOverride
                    });
                }
                else
                {
                    var ps = await _db.ProfessionalServices.FirstAsync(x => x.ProfessionalId == item.ProfessionalId && x.ServiceId == dto.ServiceId);
                    ps.DurationMinutesOverride = item.DurationMinutesOverride;
                    ps.PriceOverride = item.PriceOverride;
                }
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteLink([FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var ps = await _db.ProfessionalServices
                .Include(x => x.Professional)
                .Include(x => x.Service)
                .FirstOrDefaultAsync(x => x.Id == id && x.Professional.CompanyId == user.CompanyId && x.Service.CompanyId == user.CompanyId);

            if (ps is null) return NotFound();

            _db.ProfessionalServices.Remove(ps);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
