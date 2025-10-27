using Kalenner.Entities.Auth;
using Kalenner.Entities.Services;
using Kalenner.Entities.Services.Requests;
using Kalenner.Infra;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Controllers.ServicesController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public ServicesController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> ListAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var data = await _db.Services
                .Where(s => s.CompanyId == user.CompanyId)
                .Select(s => new { s.Id, s.Name, s.Description, s.DurationMinutes, s.Price, s.IsActive, s.CreatedAt, s.UpdatedAt })
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateAsync([FromBody] ServiceCreateRequest dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { error = "Nome é obrigatório." });

            if (dto.DurationMinutes <= 0)
                return BadRequest(new { error = "Duração deve ser maior que zero." });

            var entity = new Service
            {
                CompanyId = user.CompanyId,
                Name = dto.Name.Trim(),
                Description = dto.Description?.Trim(),
                DurationMinutes = dto.DurationMinutes,
                Price = dto.Price,
                IsActive = dto.IsActive
            };

            _db.Services.Add(entity);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByIdAsync), new { id = entity.Id }, new { entity.Id, entity.Name });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<object>> GetByIdAsync([FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var s = await _db.Services
                .Where(x => x.CompanyId == user.CompanyId && x.Id == id)
                .Select(x => new { x.Id, x.Name, x.Description, x.DurationMinutes, x.Price, x.IsActive, x.CreatedAt, x.UpdatedAt })
                .FirstOrDefaultAsync();

            if (s is null) return NotFound();
            return Ok(s);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var entity = await _db.Services.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == user.CompanyId);
            if (entity is null) return NotFound();

            _db.Services.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
