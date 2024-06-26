using eCommerceServer.Models;
using Microsoft.EntityFrameworkCore;

namespace eCommerceServer.Context;

public sealed class ApplicationDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=FURKAN\\SQLEXPRESS;Initial Catalog=eCommerceDb;Integrated Security=True;Connect Timeout=30;Encrypt=True;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False");
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ShoppingCart> ShoppingCarts { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>().HasIndex(x => x.Email).IsUnique(true);

        modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("money");
        modelBuilder.Entity<Product>().HasIndex(x => x.Name).IsUnique();

        modelBuilder.Entity<OrderDetail>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        List<Product> products = new();
        Product product1 = new()
        {
            Id = 1,
            Name = "Apple",
            Price = 100,
            CoverImageUrl = "apple.jpg"
        };
        products.Add(product1);

        Product product2 = new()
        {
            Id = 2,
            Name = "Pear",
            Price = 120,
            CoverImageUrl = "pear.jpg"
        };
        products.Add(product2);

        Product product3 = new()
        {
            Id = 3,
            Name = "Cherry",
            Price = 300,
            CoverImageUrl = "cherry.jpg"
        };
        products.Add(product3);

        Product product4 = new()
        {
            Id = 4,
            Name = "Grape",
            Price = 100,
            CoverImageUrl = "grape.jpg"
        };
        products.Add(product4);

        modelBuilder.Entity<Product>().HasData(products);
    }
}
