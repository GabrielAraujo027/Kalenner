using Kalenner.Entities.Appointments;
using Kalenner.Entities.Auth;
using Kalenner.Entities.Companies;
using Kalenner.Entities.Professionals;
using Kalenner.Entities.ProfessionalsServices;
using Kalenner.Entities.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Kalenner.Infra
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Company> Companies => Set<Company>();
        public DbSet<Service> Services => Set<Service>();
        public DbSet<Professional> Professionals => Set<Professional>();
        public DbSet<ProfessionalService> ProfessionalServices => Set<ProfessionalService>();
        public DbSet<Appointment> Appointments => Set<Appointment>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasOne(u => u.Company)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProfessionalService>()
                .HasKey(ps => ps.Id);

            builder.Entity<ProfessionalService>()
                .HasOne(ps => ps.Professional)
                .WithMany(p => p.ProfessionalServices)
                .HasForeignKey(ps => ps.ProfessionalId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProfessionalService>()
                .HasOne(ps => ps.Service)
                .WithMany(s => s.ProfessionalServices)
                .HasForeignKey(ps => ps.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProfessionalService>()
                .HasIndex(ps => new { ps.ProfessionalId, ps.ServiceId })
                .IsUnique();

            builder.Entity<Appointment>()
                .HasOne(a => a.Company)
                .WithMany(c => c.Appointments)
                .HasForeignKey(a => a.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany(s => s.Appointments)
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Appointment>()
                .HasOne(a => a.Professional)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.ProfessionalId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Appointment>()
                .HasOne(a => a.Client)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.ClientId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Appointment>()
                .Property(a => a.Status)
                .HasConversion<string>()
                .HasMaxLength(32);


            builder.Entity<Service>()
                .Property(s => s.Price)
                .HasPrecision(18, 2);

            builder.Entity<ProfessionalService>()
                .Property(ps => ps.PriceOverride)
                .HasPrecision(18, 2);

            builder.Entity<Company>()
                .HasIndex(c => c.Slug).IsUnique();
            builder.Entity<Company>()
                .HasIndex(c => c.CNPJ).IsUnique();

            builder.Entity<Professional>()
                .HasOne(p => p.Company)
                .WithMany(c => c.Professionals)
                .HasForeignKey(p => p.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Service>()
                .HasOne(s => s.Company)
                .WithMany(c => c.Services)
                .HasForeignKey(s => s.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
