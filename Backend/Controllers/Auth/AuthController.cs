using Kalenner.Entities.Auth;
using Kalenner.Entities.Auth.Requests;
using Kalenner.Entities.Auth.Responses;
using Kalenner.Entities.Companies;
using Kalenner.Infra;
using Kalenner.Services.TokenService.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _cfg;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService,
            IConfiguration cfg,
            AppDbContext db)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _cfg = cfg;
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CadastroRequest dto)
        {
            var exists = await _db.Users
                .AsNoTracking()
                .AnyAsync(u => u.Email == dto.Email && u.Company.Id == dto.CompanyId);

            if (exists)
                return BadRequest(new { error = "Já existe um usuário com este email para a empresa informada." });

            Company company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == dto.CompanyId);

            if (company == null)
                return BadRequest(new { error = "Empresa inválida." });

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Company = company
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { error = string.Join("; ", result.Errors.Select(e => e.Description)) });

            if (!await _roleManager.RoleExistsAsync("Cliente"))
                await _roleManager.CreateAsync(new IdentityRole("Cliente"));

            await _userManager.AddToRoleAsync(user, "Cliente");

            return Ok(new { message = "Usuário registrado com sucesso." });
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest dto)
        {
            var user = await _db.Users
                .AsNoTracking()
                .Include(u => u.Company)
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Company.Id == dto.CompanyId);

            if (user is null)
                return Unauthorized(new { error = "Credenciais inválidas." });

            var passOk = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passOk)
                return Unauthorized(new { error = "Credenciais inválidas." });

            if (user.Company == null)
                return Unauthorized(new { error = "Empresa inválida." });

            var roles = await _userManager.GetRolesAsync(user);

            var expMinutes = _cfg.GetValue<int>("Jwt:ExpiresMinutes", 120);
            var expiresAt = DateTime.UtcNow.AddMinutes(expMinutes);
            var token = await _tokenService.GenerateAsync(user, roles, expiresAt, dto.CompanyId);

            Response.Headers.Append("X-Auth-Token", token);

            return Ok(new LoginResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                Email = user.Email!,
                Roles = roles,
                CompanyId = dto.CompanyId
            });
        }
    }
}
