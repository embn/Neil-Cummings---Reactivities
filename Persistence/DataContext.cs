using System;
using System.Diagnostics.CodeAnalysis;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext([NotNullAttribute] DbContextOptions options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }

    }
}
