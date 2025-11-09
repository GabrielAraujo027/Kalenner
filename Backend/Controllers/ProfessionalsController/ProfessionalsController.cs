using Kalenner.Entities.Auth;
using Kalenner.Entities.Professionals;
using Kalenner.Entities.Professionals.Requests;
using Kalenner.Infra;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Controllers.ProfessionalsController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfessionalsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfessionalsController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> ListAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var data = await _db.Professionals
                .Where(p => p.CompanyId == user.CompanyId)
                .Select(p => new { p.Id, p.Name, p.IsActive, p.CreatedAt, p.UpdatedAt })
                .OrderBy(p => p.Name)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = Roles.Empresa)]
        public async Task<ActionResult<object>> CreateAsync([FromBody] ProfessionalCreateRequest dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { error = "Nome é obrigatório." });

            var entity = new Professional
            {
                CompanyId = user.CompanyId,
                Name = dto.Name.Trim(),
                IsActive = dto.IsActive
            };

            _db.Professionals.Add(entity);
            await _db.SaveChangesAsync();

            return CreatedAtRoute("GetProfessionalById", new { id = entity.Id }, new { entity.Id, entity.Name, entity.IsActive });
        }

        [HttpGet("{id:int}", Name = "GetProfessionalById")]
        public async Task<ActionResult<object>> GetByIdAsync([FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var p = await _db.Professionals
                .Where(x => x.CompanyId == user.CompanyId && x.Id == id)
                .Select(x => new { x.Id, x.Name, x.IsActive, x.CreatedAt, x.UpdatedAt })
                .FirstOrDefaultAsync();

            if (p is null) return NotFound();
            return Ok(p);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = Roles.Empresa)]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var entity = await _db.Professionals.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == user.CompanyId);
            if (entity is null) return NotFound();

            _db.Professionals.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
