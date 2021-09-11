using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendance> Attendances { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Rather than ussing EF conventions, which would generate a simple jointable with ids,
            // we use EF fluent API here in order to make our own jointable

            builder.Entity<ActivityAttendance>(x => x.HasKey(aa => new { aa.UserId, aa.ActivityId }));


            builder.Entity<ActivityAttendance>()
                .HasOne(aa => aa.User)
                .WithMany(u => u.Activities)
                .HasForeignKey(aa => aa.UserId);

            builder.Entity<ActivityAttendance>()
                .HasOne(aa => aa.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<AppUser>()
                .HasMany(u => u.Photos)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            builder.Entity<UserFollowing>(buildAction => 
            {
                buildAction.HasKey(x => new {x.ObserverId, x.TargetId});
                
                buildAction.HasOne(x => x.Observer)
                    .WithMany(o => o.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                buildAction.HasOne(x => x.Target)
                    .WithMany(o => o.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            //DeleteBehavior.Cascade means if Activity is deleted, all associated comments are deleted also
            builder.Entity<Comment>()
                .HasOne(x => x.Activity)
                .WithMany(x => x.Comments)
                .OnDelete(DeleteBehavior.ClientSetNull);

        }
    }
}
