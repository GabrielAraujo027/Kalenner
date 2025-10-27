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
                .HasForeignKey("CompanyId")
                .OnDelete(DeleteBehavior.Restrict); // evita cascades múltiplos

            builder.Entity<ProfessionalService>()
                .HasKey(ps => ps.Id);

            builder.Entity<ProfessionalService>()
                .HasOne(ps => ps.Professional)
                .WithMany(p => p.ProfessionalServices)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProfessionalService>()
                .HasOne(ps => ps.Service)
                .WithMany(s => s.ProfessionalServices)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Appointment>()
                .HasOne(a => a.Company)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany(s => s.Appointments)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Appointment>()
                .HasOne(a => a.Professional)
                .WithMany(p => p.Appointments)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Appointment>()
                .HasOne(a => a.Client)
                .WithMany(u => u.Appointments)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Appointment>()
                .Property(a => a.Status)
                .HasConversion<string>();


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
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Service>()
                .HasOne(s => s.Company)
                .WithMany(c => c.Services)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
