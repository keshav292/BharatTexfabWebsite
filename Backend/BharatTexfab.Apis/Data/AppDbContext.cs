using BharatTexfab.Apis.Models;
using Microsoft.EntityFrameworkCore;

namespace BharatTexfab.Apis.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Inquiry> Inquiries { get; set; }
    }
}
