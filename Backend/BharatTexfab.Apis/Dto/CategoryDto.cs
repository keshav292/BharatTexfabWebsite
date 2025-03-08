using BharatTexfab.Apis.Models;

namespace BharatTexfab.Apis.Dto
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<int> ProductIds { get; set; } = new();
        public string ImageUrl { get; set; } = string.Empty;
    }
}
