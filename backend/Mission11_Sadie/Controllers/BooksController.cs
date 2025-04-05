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
    [FromQuery] List<string>? bookTypes = null)
{
    try 
    {
        var query = _booksContext.Books.AsQueryable();

        // Get all unique classifications
        var allClassifications = await _booksContext.Books
            .Select(b => b.Classification)
            .Distinct()
            .ToListAsync();

        // If bookTypes is null or contains all classifications, skip filtering
        if (bookTypes != null && 
            bookTypes.Any() && 
            bookTypes.Count != allClassifications.Count)
        {
            query = query.Where(p => bookTypes.Contains(p.Classification));
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
    Console.WriteLine($"Error fetching books: {ex.Message}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
    }
    return StatusCode(500, $"Error fetching books: {ex.Message}");
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

[HttpPost("AddBook")]
public async Task<IActionResult> AddBook([FromBody] Book newBook)
{
    try
    {
        newBook.BookId = 0; // Ensure it’s reset to let the DB assign it

        _booksContext.Books.Add(newBook);
        await _booksContext.SaveChangesAsync();
        return Ok(newBook);
        

        
    }
    catch (Exception ex)
    {
        // Log the full exception details
        Console.WriteLine($"Error adding book: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
        return StatusCode(500, $"Error adding book: {ex.Message}. Inner exception: {ex.InnerException?.Message}");
    }
}
        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _booksContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Classification = updatedBook.Classification;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _booksContext.Books.Update(existingBook);
            _booksContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _booksContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new {message = "Book not found"});
            }

            _booksContext.Books.Remove(book);
            _booksContext.SaveChanges();

            return NoContent();
        }
    }
}
