using BharatTexfab.Apis.Data;
using BharatTexfab.Apis.Dto;
using BharatTexfab.Apis.Models;
using Microsoft.EntityFrameworkCore;

namespace BharatTexfab.Apis.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto?> GetByIdAsync(int id);
        Task<CategoryDto> AddAsync(Category category);
        Task<string> DeleteAsync(int id);
    }



    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _db;

        public CategoryRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            return await _db.Categories
                .Include(c => c.Products)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ImageUrl = c.ImageUrl,
                    ProductIds = c.Products != null ? c.Products.Select(p => p.Id).ToList() : new List<int>()
                })
                .ToListAsync();
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            return await _db.Categories
                .Where(c => c.Id == id)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ImageUrl = c.ImageUrl,
                    ProductIds = c.Products != null ? c.Products.Select(p => p.Id).ToList() : new List<int>()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CategoryDto> AddAsync(Category category)
        {
            var exists = await _db.Categories.AnyAsync(c => c.Name == category.Name);
            if (exists)
            {
                throw new InvalidOperationException("Category name must be unique.");
            }

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ImageUrl = category.ImageUrl,
                ProductIds = new List<int>()
            };
        }


        public async Task<string> DeleteAsync(int id)
        {
            var category = await _db.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id); 
            if (category == null) return "NotFound";
            if (category.Products?.Count > 0) return "HasProducts";

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();
            return "Deleted";
        }
    }

}
