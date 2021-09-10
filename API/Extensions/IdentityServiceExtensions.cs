using System.Text;
using System.Threading.Tasks;
using Application.Users;
using Domain;
using Identity.Services;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            var pwSettings= config.GetSection("Password").Get<PasswordRequirements>();
            services.AddIdentityCore<AppUser>(opt => {
                opt.Password.RequiredLength = pwSettings.RequiredLength;
                opt.Password.RequiredUniqueChars = pwSettings.RequiredUniqueChars;
                opt.Password.RequireUppercase = pwSettings.RequireUppercase;
                opt.Password.RequireNonAlphanumeric = pwSettings.RequireNonAlphanumeric;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<Identity.SignInManager<AppUser>>()
            .AddUserManager<Identity.UserManager<AppUser>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["API:Key"]));



            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt => {
                    opt.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };

                    
                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            //Only for signalR endpoint, need to pass token as query-string
                            //becuase signalR hubs dont have httpheader
                            string token = context.Request.Query["authToken"];
                            string path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(token) && path.StartsWith("/chat"))
                            {
                                context.Token = token;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization(opt => {
                opt.AddPolicy("IsActivityHost", policy => {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.AddScoped<TokenService>();
            return services;
        }
    }
}