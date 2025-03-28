import React, { useEffect, useState } from "react";
import { Book } from "../types/Book";
import CategoryFilter from "./CategoryFilter";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting state

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setSelectedCategories((prevSelectedCategories) => {
      if (checked) {
        return [...prevSelectedCategories, value]; // Add category if checked
      } else {
        return prevSelectedCategories.filter((category) => category !== value); // Remove category if unchecked
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", booksPerPage.toString());

    // Add selected categories if any
    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }

    fetch(`http://localhost:5181/api/Books?${params}`)
      .then((response) => response.json())
      .then((data) => {
        let sortedBooks = data.books.sort((a: Book, b: Book) => {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });
        setBooks(sortedBooks);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [currentPage, booksPerPage, sortOrder, selectedCategories]); // Now it also depends on selectedCategories

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle books per page change
  const handleBooksPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBooksPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1
  };

  return (
    <div className="container mt-4">
      <CategoryFilter
        setSelectedCategories={setSelectedCategories}
        handleCheckboxChange={handleCheckboxChange}
      />
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
            onChange={handleBooksPerPageChange} // ✅ Fixed this!
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <ul className="list-group">
        {books.length === 0 ? (
          <li className="list-group-item text-center">No books available.</li>
        ) : (
          books.map((book) => (
            <li key={book.bookId} className="list-group-item">
              <h4 className="mb-1">{book.title}</h4>
              <p className="mb-1">
                <strong>Author:</strong> {book.author} <br />
                <strong>Publisher:</strong> {book.publisher} <br />
                <strong>ISBN:</strong> {book.isbn} <br />
                <strong>Classification:</strong> {book.classification} <br />
                <strong>Number of Pages:</strong> {book.pageCount} <br />
                <strong>Price:</strong>{" "}
                <span className="badge bg-success">
                  ${book.price.toFixed(2)}
                </span>
              </p>
            </li>
          ))
        )}
      </ul>

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
  );
};

export default BookList;
