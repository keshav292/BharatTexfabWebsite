namespace BharatTexfab.Apis.Endpoints
{
    public static class ImageUploadEndpoint
    {
        public static WebApplication MapImageUploadEndpoint(this WebApplication app)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // Ensure directory exists
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var root = app.MapGroup("/api/productImage");

            root.MapPost("/", async (IFormFile file) =>
            {
                if (file == null || file.Length == 0)
                    return Results.BadRequest("No file uploaded.");

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/images/{fileName}";
                return Results.Ok(new { Url = fileUrl });

            })
            .DisableAntiforgery()
            .RequireAuthorization("AdminOnly"); // Require authentication & admin role

            root.MapDelete("/{fileName}", (string fileName) =>
             {
                var filePath = Path.Combine(uploadsFolder, fileName);

                if (!File.Exists(filePath))
                    return Results.NotFound("File not found.");

                File.Delete(filePath);
                return Results.Ok("File deleted successfully.");

             })
            .DisableAntiforgery()
            .RequireAuthorization("AdminOnly");

            return app;
        }
    }
}
