namespace BharatTexfab.Apis.Models
{
    public class Order
    {
        public int Id { get; set; }
        public List<int> ProductIds { get; set; } = new();
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    }

}
