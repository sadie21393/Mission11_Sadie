import React, { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
        .join("&");
      try {
        const response = await fetch(
          `http://localhost:5181/api/Books?page=${currentPage}&limit=${booksPerPage}${selectedCategories.length ? `&${categoryParams}` : ""}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let sortedBooks = data.books.sort((a: Book, b: Book) => {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });

        setBooks(sortedBooks);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [currentPage, booksPerPage, sortOrder, selectedCategories]);

  // Toggle sorting order
  function toggleSortOrder() {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  // Handle books per page change
  function handleBooksPerPageChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setBooksPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1
  }

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Book List</h2>
        <div className="d-flex justify-content-between mb-3">
          {/* Sorting Button */}
          <button className="btn btn-secondary" onClick={toggleSortOrder}>
            Sort by Title {sortOrder === "asc" ? "▲" : "▼"}
          </button>

          {/* Dropdown to select books per page */}
          <div>
            <label className="me-2">Books per page:</label>
            <select
              className="form-select d-inline w-auto"
              value={booksPerPage}
              onChange={handleBooksPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <div>
          <ul className="list-group">
            {books.length === 0 ? (
              <li className="list-group-item text-center">
                No books available.
              </li>
            ) : (
              books.map((book) => (
                <li key={book.bookId} className="list-group-item">
                  <h4 className="mb-1">{book.title}</h4>
                  <p className="mb-1">
                    <strong>Author:</strong> {book.author} <br />
                    <strong>Publisher:</strong> {book.publisher} <br />
                    <strong>ISBN:</strong> {book.isbn} <br />
                    <strong>Classification:</strong> {book.classification}{" "}
                    <br />
                    <strong>Number of Pages:</strong> {book.pageCount} <br />
                    <strong>Price:</strong>{" "}
                    <span>${book.price.toFixed(2)}</span>
                    <br></br>
                    {/* THIS IS AN ADDED BOOTSTRAP FEATURE : ICONS  */}
                    {/* BOOKLIST.TSX LINE 104-113 */}
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        navigate(
                          `/buy/${book.title}/${book.bookId}/${book.price}`
                        )
                      }
                    >
                      <i className="bi bi-cart"></i> BUY
                    </button>
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="mt-4 d-flex justify-content-center">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                className={`btn ${currentPage === number + 1 ? "btn-primary" : "btn-outline-primary"} mx-1`}
                onClick={() => setCurrentPage(number + 1)}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default BookList;
