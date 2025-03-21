﻿namespace BharatTexfab.Apis.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Product>? Products { get; set; } = new();
        public string ImageUrl { get; set; } = string.Empty ;
    }
}
