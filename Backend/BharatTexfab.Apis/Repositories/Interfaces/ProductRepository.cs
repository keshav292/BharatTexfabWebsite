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
        Task<List<ProductDto>> GetByCategoryIdAsync(int categoryId);
        Task<ProductDto> AddAsync(Product product);
        Task<bool> DeleteAsync(int id);
        Task<ProductDto> UpdateAsync(int id, Product updatedProduct);
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

        public async Task<ProductDto> UpdateAsync(int id, Product updatedProduct)
        {
            // 🔹 Find the existing product
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            // 🔹 Ensure the updated name is unique (excluding the current product)
            var nameExists = await _db.Products.AnyAsync(p => p.Name == updatedProduct.Name && p.Id != id);
            if (nameExists)
            {
                throw new InvalidOperationException("Product name must be unique.");
            }

            // 🔹 Check if the category exists
            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == updatedProduct.CategoryId);
            if (!categoryExists)
            {
                throw new InvalidOperationException("Category Id does not exist.");
            }

            // 🔹 Update product properties
            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.ImageUrl = updatedProduct.ImageUrl;
            product.CategoryId = updatedProduct.CategoryId;

            // 🔹 Update category association if it has changed
            if (product.CategoryId != updatedProduct.CategoryId)
            {
                var oldCategory = await _db.Categories.Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == product.CategoryId);
                var newCategory = await _db.Categories.Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == updatedProduct.CategoryId);

                // Remove product from old category
                oldCategory?.Products?.Remove(product);

                // Add product to new category
                newCategory?.Products?.Add(product);
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

            var category = await _db.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == product.CategoryId);

            if (category?.Products != null)
            {
                category.Products.RemoveAll(p => p.Id == id);
            }

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<ProductDto>> GetByCategoryIdAsync(int categoryId)
        {
            return await _db.Products
                .Where(p => p.CategoryId == categoryId)
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
    }
}
