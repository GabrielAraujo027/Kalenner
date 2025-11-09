using Kalenner.Entities.Appointments;
using Kalenner.Entities.Appointments.Enums;
using Kalenner.Entities.Appointments.Requests;
using Kalenner.Entities.Appointments.Responses;
using Kalenner.Entities.Auth;
using Kalenner.Infra;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Controllers.AppointmentsController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public AppointmentsController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentResponse>>> ListAsync(
            [FromQuery] DateTime? startFrom,
            [FromQuery] DateTime? startTo,
            [FromQuery] int? professionalId,
            [FromQuery] int? serviceId,
            [FromQuery] AppointmentStatus? status)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var isEmpresa = await _userManager.IsInRoleAsync(user, Roles.Empresa);

            var q = _db.Appointments
                .AsNoTracking()
                .Where(a => a.CompanyId == user.CompanyId);

            if (!isEmpresa)
                q = q.Where(a => a.ClientId == user.Id);

            if (startFrom.HasValue) q = q.Where(a => a.Start >= startFrom.Value);
            if (startTo.HasValue) q = q.Where(a => a.Start <= startTo.Value);
            if (professionalId.HasValue) q = q.Where(a => a.ProfessionalId == professionalId.Value);
            if (serviceId.HasValue) q = q.Where(a => a.ServiceId == serviceId.Value);
            if (status.HasValue) q = q.Where(a => a.Status == status.Value);

            var data = await q
                .OrderBy(a => a.Start)
                .Select(a => new AppointmentResponse
                {
                    Id = a.Id,
                    ServiceId = a.ServiceId,
                    ServiceName = a.Service.Name,
                    ProfessionalId = a.ProfessionalId,
                    ProfessionalName = a.Professional != null ? a.Professional.Name : null,
                    ClientId = a.ClientId,
                    Start = a.Start,
                    End = a.End,
                    Status = a.Status,
                    Notes = a.Notes,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("{id:int}", Name = "GetAppointmentById")]
        public async Task<ActionResult<AppointmentResponse>> GetByIdAsync([FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var isEmpresa = await _userManager.IsInRoleAsync(user, Roles.Empresa);

            var a = await _db.Appointments
                .AsNoTracking()
                .Where(x => x.CompanyId == user.CompanyId && x.Id == id)
                .Select(a => new AppointmentResponse
                {
                    Id = a.Id,
                    ServiceId = a.ServiceId,
                    ServiceName = a.Service.Name,
                    ProfessionalId = a.ProfessionalId,
                    ProfessionalName = a.Professional != null ? a.Professional.Name : null,
                    ClientId = a.ClientId,
                    Start = a.Start,
                    End = a.End,
                    Status = a.Status,
                    Notes = a.Notes,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (a is null) return NotFound();

            if (!isEmpresa && a.ClientId != user.Id)
                return Forbid();

            return Ok(a);
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentResponse>> CreateAsync([FromBody] AppointmentCreateRequest dto, [FromQuery] string? clientId = null)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var isEmpresa = await _userManager.IsInRoleAsync(user, Roles.Empresa);
            var targetClientId = isEmpresa ? clientId ?? user.Id : user.Id;

            var service = await _db.Services
                .FirstOrDefaultAsync(s => s.Id == dto.ServiceId && s.CompanyId == user.CompanyId && s.IsActive);
            if (service is null)
                return BadRequest(new { error = "Serviço inválido." });

            int? professionalId = dto.ProfessionalId;
            if (professionalId.HasValue)
            {
                var professional = await _db.Professionals
                    .FirstOrDefaultAsync(p => p.Id == professionalId.Value && p.CompanyId == user.CompanyId && p.IsActive);
                if (professional is null)
                    return BadRequest(new { error = "Profissional inválido." });

                var linkExists = await _db.ProfessionalServices
                    .AnyAsync(ps => ps.ProfessionalId == professionalId.Value && ps.ServiceId == service.Id);
                if (!linkExists)
                    return BadRequest(new { error = "O profissional não executa o serviço informado." });
            }

            int duration = service.DurationMinutes;
            if (professionalId.HasValue)
            {
                var ps = await _db.ProfessionalServices
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.ProfessionalId == professionalId.Value && x.ServiceId == service.Id);
                if (ps is not null && ps.DurationMinutesOverride.HasValue)
                    duration = ps.DurationMinutesOverride.Value;
            }

            if (duration <= 0)
                return BadRequest(new { error = "Duração do serviço inválida." });

            var start = dto.Start;
            var end = start.AddMinutes(duration);
            if (start >= end)
                return BadRequest(new { error = "Intervalo de tempo inválido." });

            if (professionalId.HasValue)
            {
                var overlaps = await _db.Appointments.AnyAsync(a =>
                    a.CompanyId == user.CompanyId &&
                    a.ProfessionalId == professionalId.Value &&
                    a.Status == AppointmentStatus.Scheduled &&
                    start < a.End &&
                    end > a.Start);
                if (overlaps)
                    return Conflict(new { error = "Conflito de horário para o profissional." });
            }

            var appointment = new Appointment
            {
                CompanyId = user.CompanyId,
                ServiceId = service.Id,
                ProfessionalId = professionalId,
                ClientId = targetClientId,
                Start = start,
                End = end,
                Status = AppointmentStatus.Scheduled,
                Notes = dto.Notes
            };

            _db.Appointments.Add(appointment);
            await _db.SaveChangesAsync();

            var resp = new AppointmentResponse
            {
                Id = appointment.Id,
                ServiceId = appointment.ServiceId,
                ProfessionalId = appointment.ProfessionalId,
                ClientId = appointment.ClientId,
                Start = appointment.Start,
                End = appointment.End,
                Status = appointment.Status,
                Notes = appointment.Notes,
                CreatedAt = appointment.CreatedAt,
                UpdatedAt = appointment.UpdatedAt
            };

            return CreatedAtRoute("GetAppointmentById", new { id = appointment.Id }, resp);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<AppointmentResponse>> UpdateAsync([FromRoute] int id, [FromBody] AppointmentUpdateRequest dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();
            var isEmpresa = await _userManager.IsInRoleAsync(user, Roles.Empresa);

            var appointment = await _db.Appointments
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.Id == id && a.CompanyId == user.CompanyId);

            if (appointment is null) return NotFound();

            if (!isEmpresa && appointment.ClientId != user.Id)
                return Forbid();

            if (appointment.Status is AppointmentStatus.Completed or AppointmentStatus.Cancelled or AppointmentStatus.Denied)
                return BadRequest(new { error = "Agendamento não pode ser editado no status atual." });

            bool recalcEnd = false;

            if (dto.ProfessionalId.HasValue && dto.ProfessionalId != appointment.ProfessionalId)
            {
                if (!isEmpresa)
                    return BadRequest(new { error = "Cliente não pode alterar o profissional." });

                var professional = await _db.Professionals
                    .FirstOrDefaultAsync(p => p.Id == dto.ProfessionalId.Value && p.CompanyId == user.CompanyId && p.IsActive);
                if (professional is null)
                    return BadRequest(new { error = "Profissional inválido." });

                var linkExists = await _db.ProfessionalServices
                    .AnyAsync(ps => ps.ProfessionalId == dto.ProfessionalId.Value && ps.ServiceId == appointment.ServiceId);
                if (!linkExists)
                    return BadRequest(new { error = "O profissional não executa o serviço." });

                appointment.ProfessionalId = dto.ProfessionalId;
                recalcEnd = true;
            }

            if (dto.Start.HasValue && dto.Start.Value != appointment.Start)
            {
                appointment.Start = dto.Start.Value;
                recalcEnd = true;
            }

            if (recalcEnd)
            {
                int duration = appointment.Service.DurationMinutes;
                if (appointment.ProfessionalId.HasValue)
                {
                    var ps = await _db.ProfessionalServices
                        .AsNoTracking()
                        .FirstOrDefaultAsync(x => x.ProfessionalId == appointment.ProfessionalId && x.ServiceId == appointment.ServiceId);
                    if (ps?.DurationMinutesOverride is int overrideMinutes && overrideMinutes > 0)
                        duration = overrideMinutes;
                }
                appointment.End = appointment.Start.AddMinutes(duration);

                if (appointment.ProfessionalId.HasValue)
                {
                    var conflict = await _db.Appointments.AnyAsync(a =>
                        a.Id != appointment.Id &&
                        a.CompanyId == user.CompanyId &&
                        a.ProfessionalId == appointment.ProfessionalId &&
                        a.Status == AppointmentStatus.Scheduled &&
                        appointment.Start < a.End &&
                        appointment.End > a.Start);
                    if (conflict)
                        return Conflict(new { error = "Conflito de horário após alteração." });
                }
            }

            if (dto.Notes != null)
                appointment.Notes = dto.Notes;

            if (dto.Status.HasValue)
            {
                var newStatus = dto.Status.Value;
                if (!isEmpresa)
                {
                    if (appointment.Status == AppointmentStatus.Scheduled && newStatus == AppointmentStatus.Cancelled)
                        appointment.Status = AppointmentStatus.Cancelled;
                    else
                        return BadRequest(new { error = "Status inválido para o cliente." });
                }
                else
                {
                    appointment.Status = newStatus;
                }
            }

            appointment.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            var resp = new AppointmentResponse
            {
                Id = appointment.Id,
                ServiceId = appointment.ServiceId,
                ProfessionalId = appointment.ProfessionalId,
                ClientId = appointment.ClientId,
                Start = appointment.Start,
                End = appointment.End,
                Status = appointment.Status,
                Notes = appointment.Notes,
                CreatedAt = appointment.CreatedAt,
                UpdatedAt = appointment.UpdatedAt
            };

            return Ok(resp);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatusAsync([FromRoute] int id, [FromBody] AppointmentStatus? status)
        {
            if (status is null)
                return BadRequest(new { error = "Status obrigatório." });

            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();
            var isEmpresa = await _userManager.IsInRoleAsync(user, Roles.Empresa);

            var appointment = await _db.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.CompanyId == user.CompanyId);

            if (appointment is null) return NotFound();

            if (!isEmpresa && appointment.ClientId != user.Id)
                return Forbid();

            if (!isEmpresa)
            {
                if (appointment.Status != AppointmentStatus.Scheduled)
                    return BadRequest(new { error = "Somente agendamentos em Scheduled podem ser cancelados." });
                if (status != AppointmentStatus.Cancelled)
                    return BadRequest(new { error = "Status inválido para o cliente." });
            }

            appointment.Status = status.Value;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
