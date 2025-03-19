using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Models;

namespace BookstoreAPI.Data
{
    public class BookstoreDbContext : DbContext
    {
        public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; }
    }
}
