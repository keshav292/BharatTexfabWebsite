using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;


namespace BharatTexfab.Apis.Endpoints
{
    public static class AuthEndpoints
    {
        public static WebApplication MapAuthEndpoints(this WebApplication app)
        {
            app.MapPost("/api/auth/login", (LoginRequest request, IConfiguration config) =>
            {
                if (request.Username == "admin" && request.Password == "password") // Replace with real validation
                {
                    var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                    var key = Encoding.UTF8.GetBytes(config.GetValue<string>("JwtSettings:Key") ?? throw new InvalidOperationException("JWT Key is missing."));
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "Admin") }),
                        Expires = DateTime.UtcNow.AddHours(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                        Issuer = config.GetValue<string>("JwtSettings:Issuer"),
                        Audience = config.GetValue<string>("JwtSettings:Audience")
                    };

                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var tokenString = tokenHandler.WriteToken(token);

                    return Results.Ok(new { Token = tokenString });
                }

                return Results.Unauthorized();
            });

            return app;
        }
    }

    public record LoginRequest(string Username, string Password);

}
