using Kalenner.Entities.Auth;
using Kalenner.Infra;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Controllers.CompaniesController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public CompaniesController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var c = await _db.Companies
                .Where(x => x.Id == user.CompanyId)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Slug,
                    x.LogoUrl,
                    x.PrimaryColor,
                    x.SecondaryColor,
                    x.TimeZone,
                    x.Address,
                    x.City,
                    x.State,
                    x.CorporateName,
                    x.CNPJ,
                    x.Phone,
                    x.Email,
                    x.CreatedAt,
                    x.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (c is null) return NotFound();
            return Ok(c);
        }

        [HttpGet("{slug}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetBySlugAsync([FromRoute] string slug)
        {
            if (string.IsNullOrWhiteSpace(slug)) return BadRequest(new { error = "Slug inválido." });

            var c = await _db.Companies
                .Where(x => x.Slug == slug)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Slug,
                    x.LogoUrl,
                    x.PrimaryColor,
                    x.SecondaryColor,
                    x.TimeZone,
                    x.Address,
                    x.City,
                    x.State,
                    x.CorporateName,
                    x.CNPJ,
                    x.Phone,
                    x.Email,
                    x.CreatedAt,
                    x.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (c is null) return NotFound();
            return Ok(c);
        }
    }
}
