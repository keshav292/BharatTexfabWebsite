using BharatTexfab.Apis.Data;
using BharatTexfab.Apis.Endpoints;
using BharatTexfab.Apis.Extensions;
using BharatTexfab.Apis.Models;
using BharatTexfab.Apis.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddRoleBasedAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=shop.db"));

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>(); 
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddEndpointsApiExplorer(); // Register repository


var app = builder.Build();
//app.UseAntiforgery();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}   

app.MapGet("/", () => "Hello World!");

//app.UseSwagger();
//app.UseSwaggerUI();

app.MapCategoriesEndpoints();
app.MapProductEndpoints();
app.MapAuthEndpoints();
app.MapImageUploadEndpoint();

app.UseStaticFiles();

app.Run();
