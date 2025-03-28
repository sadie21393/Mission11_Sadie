using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;
using BookstoreAPI.Models;

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

[HttpGet]
public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
    [FromQuery] int page = 1, 
    [FromQuery] int limit = 5, 
    [FromQuery] List<string>? projectTypes = null)
{
    try 
    {
        var query = _booksContext.Books.AsQueryable();

        // Get all unique classifications
        var allClassifications = await _booksContext.Books
            .Select(b => b.Classification)
            .Distinct()
            .ToListAsync();

        // If projectTypes is null or contains all classifications, skip filtering
        if (projectTypes != null && 
            projectTypes.Any() && 
            projectTypes.Count != allClassifications.Count)
        {
            query = query.Where(p => projectTypes.Contains(p.Classification));
        }

        // Validate page and limit parameters
        if (page < 1)
        {
            return BadRequest("Page must be greater than zero.");
        }

        if (limit < 1)
        {
            return BadRequest("Limit must be greater than zero.");
        }

        // Calculate total count before pagination
        var totalBooks = await query.CountAsync();

        // Calculate total pages
        var totalPages = (int)Math.Ceiling((double)totalBooks / limit);

        // Apply pagination
        var books = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var response = new
        {
            TotalBooks = totalBooks,
            Page = page,
            Limit = limit,
            TotalPages = totalPages,
            Books = books,
            AvailableClassifications = allClassifications
        };

        return Ok(response);
    }
    catch (Exception ex)
    {
        // Log the exception (you should implement proper logging)
        return StatusCode(500, "An error occurred while fetching books.");
    }
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
    }
}
