using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;
using BookstoreAPI.Models;
using System.Security.Cryptography.X509Certificates;

namespace BookstoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreDbContext _booksContext;

        public BooksController(BookstoreDbContext context)
        {
            _booksContext = context;
        }

        // GET: api/Books?page=1&limit=5
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks([FromQuery] int page = 1, [FromQuery] int limit = 5)
        {
            if (page < 1 || limit < 1)
            {
                return BadRequest("Page and limit must be greater than zero.");
            }

            var totalBooks = await _booksContext.Books.CountAsync(); // Get total count
            var books = await _booksContext.Books
                .Skip((page - 1) * limit) // Skip records based on page
                .Take(limit) // Limit the number of records
                .ToListAsync();

            var response = new
            {
                TotalBooks = totalBooks,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)totalBooks / limit),
                Books = books
            };

            return Ok(response);

          
        }

        [HttpGet("Categories")]
        public IActionResult GetBookCategories()
        {
            var categories = _booksContext.Books
                .Select(b => b.Classification) // Assuming there's a `Category` property
                .Distinct()
                .ToList();

            return Ok(categories);
        } 

        [HttpGet]
        public IActionResult GetBooks([FromQuery] int page, [FromQuery] int limit, [FromQuery] string categories)
        {
            var query = _booksContext.Books.AsQueryable();

            if (!string.IsNullOrEmpty(categories))
            {
                var categoryList = categories.Split(',').ToList();
                query = query.Where(b => categoryList.Contains(b.Classification));
            }

            var books = query.Skip((page - 1) * limit).Take(limit).ToList();
            var totalBooks = query.Count();

            return Ok(new { books, totalPages = (int)Math.Ceiling(totalBooks / (double)limit) });
        }


    }
}
