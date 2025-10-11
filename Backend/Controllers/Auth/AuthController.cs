using Kalenner.Entities.Auth;
using Kalenner.Entities.Auth.Requests;
using Kalenner.Entities.Auth.Responses;
using Kalenner.Services.TokenService.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Kalenner.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _cfg;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService,
            IConfiguration cfg)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _cfg = cfg;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] CadastroRequest dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!await _roleManager.RoleExistsAsync("Cliente"))
                await _roleManager.CreateAsync(new IdentityRole("Cliente"));

            await _userManager.AddToRoleAsync(user, "Cliente");

            if (!result.Succeeded)
                return BadRequest(new { error = string.Join("; ", result.Errors.Select(e => e.Description)) });

            return Ok(new { message = "Usuário registrado com sucesso." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null) return Unauthorized(new { error = "Credenciais inválidas." });

            var passOk = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passOk) return Unauthorized(new { error = "Credenciais inválidas." });

            var roles = await _userManager.GetRolesAsync(user);
            var expMinutes = _cfg.GetValue<int>("Jwt:ExpiresMinutes", 120);
            var expiresAt = DateTime.UtcNow.AddMinutes(expMinutes);

            var token = await _tokenService.GenerateAsync(user, roles, expiresAt);

            return Ok(new LoginResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                Email = user.Email!,
                Roles = roles
            });
        }
    }
}
