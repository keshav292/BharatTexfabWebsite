using BharatTexfab.Apis.Data;
using BharatTexfab.Apis.Dto;
using BharatTexfab.Apis.Models;
using Microsoft.EntityFrameworkCore;

namespace BharatTexfab.Apis.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> AddAsync(Product product);
        Task<bool> DeleteAsync(int id);
    }

    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;

        public ProductRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<ProductDto>> GetAllAsync()
        {
            return await _db.Products
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId
                })
                .ToListAsync();
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            return await _db.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ProductDto> AddAsync(Product product)
        {
            // 🔹 Check if product name already exists
            var exists = await _db.Products.AnyAsync(p => p.Name == product.Name);
            if (exists)
            {
                throw new InvalidOperationException("Product name must be unique.");
            }

            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == product.CategoryId);
            if (!categoryExists)
            {
                throw new InvalidOperationException("Category Id does not exist.");
            }

            _db.Products.Add(product);

            var category = await _db.Categories
            .FirstOrDefaultAsync(c => c.Id == product.CategoryId);

            if (category != null && category.Products != null)
            {
                category.Products.Add(product); // Add the product to category's product list
            }

            await _db.SaveChangesAsync();

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return false;

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
