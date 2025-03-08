using BharatTexfab.Apis.Dto;
using BharatTexfab.Apis.Models;
using BharatTexfab.Apis.Repositories.Interfaces;

namespace BharatTexfab.Apis.Endpoints
{
    public static class ProductEndpoints
    {
        public static WebApplication MapProductEndpoints(this WebApplication app)
        {
            var root = app.MapGroup("/api/products")
                .WithTags("Products");

            // 🔹 GET: Get all products
            root.MapGet("/", async (IProductRepository repository) =>
            {
                var products = await repository.GetAllAsync();
                return Results.Ok(products);
            })
            .WithSummary("Retrieve all products")
            .WithDescription("Gets a list of all available products")
            .Produces<List<ProductDto>>();

            // 🔹 GET: Get product by ID
            root.MapGet("/{id}", async (int id, IProductRepository repository) =>
            {
                var product = await repository.GetByIdAsync(id);
                return product is not null ? Results.Ok(product) : Results.NotFound();
            })
            .WithSummary("Retrieve a product by ID")
            .WithDescription("Gets details of a specific product")
            .Produces<ProductDto>()
            .Produces(StatusCodes.Status404NotFound);

            // 🔹 GET: Get all products by category ID
            root.MapGet("/category/{categoryId}", async (int categoryId, IProductRepository repository) =>
            {
                var products = await repository.GetByCategoryIdAsync(categoryId);
                return Results.Ok(products.Any() ? products : new List<ProductDto>());
            })
            .WithSummary("Retrieve all products by category ID")
            .WithDescription("Gets all products belonging to a specific category")
            .Produces<List<ProductDto>>()
            .Produces(StatusCodes.Status404NotFound);

            // 🔹 POST: Create a new product
            root.MapPost("/", async (Product product, IProductRepository repository) =>
            {
                try
                {
                    var createdProduct = await repository.AddAsync(product);
                    return Results.Created($"/api/products/{createdProduct.Id}", createdProduct);
                }
                catch (InvalidOperationException ex)
                {
                    return Results.Conflict(new { message = ex.Message });
                }
            })
            .WithSummary("Create a new product")
            .WithDescription("Adds a new product to the system. Name must be unique.")
            .Produces<ProductDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status409Conflict)
            .RequireAuthorization("AdminOnly");

            root.MapPut("/{id}", async (int id, Product product, IProductRepository repository) =>
            {
                try
                {
                    var updatedProduct = await repository.UpdateAsync(id, product);
                    return Results.Ok(updatedProduct); // ✅ Return 200 OK with the updated product
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound(new { message = "Product not found." }); // ✅ 404 if product doesn't exist
                }
                catch (InvalidOperationException ex)
                {
                    return Results.Conflict(new { message = ex.Message }); // ✅ 409 for uniqueness/category validation
                }
            })
            .WithSummary("Update an existing product")
            .WithDescription("Updates a product in the system.")
            .Produces<ProductDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict)
            .RequireAuthorization("AdminOnly");


            // 🔹 DELETE: Remove a product by ID
            root.MapDelete("/{id}", async (int id, IProductRepository repository) =>
            {
                var success = await repository.DeleteAsync(id);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithSummary("Delete a product")
            .WithDescription("Removes a product from the system")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization("AdminOnly");

            return app;
        }
    }
}
