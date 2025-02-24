using BharatTexfab.Apis.Dto;
using BharatTexfab.Apis.Models;
using BharatTexfab.Apis.Repositories.Interfaces;

namespace BharatTexfab.Apis.Endpoints
{
    public static class CategoriesEndpoints
    {
        public static WebApplication MapCategoriesEndpoints(this WebApplication app)
        {
            var root = app.MapGroup("/api/categories")
                .WithTags("Categories"); 

            // GET: Get all categories
            root.MapGet("/", async (ICategoryRepository repository) =>
            {
                var categories = await repository.GetAllAsync();
                return Results.Ok(categories);
            })
            .WithSummary("Retrieve all categories")
            .WithDescription("Gets a list of all available product categories")
            .Produces<List<CategoryDto>>();

            // GET: Get category by ID
            root.MapGet("/{id}", async (int id, ICategoryRepository repository) =>
            {
                var category = await repository.GetByIdAsync(id);
                return category is not null ? Results.Ok(category) : Results.NotFound();
            })
            .WithSummary("Retrieve a category by ID")
            .WithDescription("Gets details of a specific category, including its products")
            .Produces<CategoryDto>()
            .Produces(StatusCodes.Status404NotFound);

            // POST: Create a new category
            root.MapPost("/", async (Category category, ICategoryRepository repository) =>
            {
                try {
                    var createdCategory = await repository.AddAsync(category);
                    return Results.Created($"/api/categories/{createdCategory.Id}", createdCategory);
                }
                catch (InvalidOperationException ex)
                {
                    return Results.Conflict(new { message = ex.Message });
                }
            })
            .WithSummary("Create a new category")
            .WithDescription("Adds a new category to the system")
            .Produces<CategoryDto>(StatusCodes.Status201Created)
            .RequireAuthorization("AdminOnly");

            // DELETE: Remove a category by ID
            root.MapDelete("/{id}", async (int id, ICategoryRepository repository) =>
            {
                var success = await repository.DeleteAsync(id);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithSummary("Delete a category")
            .WithDescription("Removes a category from the system")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization("AdminOnly");

            return app;
        }
    }

}
