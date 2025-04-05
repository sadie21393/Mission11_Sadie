import React, { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from "./Pagination";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          currentPage,
          booksPerPage,
          selectedCategories
        );
        console.log("Fetched data:", data); // Add this line here

        let sortedBooks = data.books.sort((a: Book, b: Book) => {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });

        setBooks(sortedBooks);
        setTotalPages(Math.ceil(data.totalBooks / booksPerPage));
        console.log("Books per page:", booksPerPage);
        console.log("Total books:", data.totalBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [currentPage, booksPerPage, sortOrder, selectedCategories]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  function toggleSortOrder() {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Book List</h2>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-secondary" onClick={toggleSortOrder}>
            Sort by Title {sortOrder === "asc" ? "▲" : "▼"}
          </button>
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
                    <strong>Category:</strong>
                    {book.category}
                    <br />
                    <strong>Classification:</strong> {book.classification}{" "}
                    <br />
                    <strong>Number of Pages:</strong> {book.pageCount} <br />
                    <strong>Price:</strong>{" "}
                    <span>${book.price.toFixed(2)}</span>
                    <br />
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
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        booksPerPage={booksPerPage}
        setCurrentPage={setCurrentPage}
        setBooksPerPage={(newSize) => {
          setBooksPerPage(newSize);
          setCurrentPage(1);
        }}
      />
    </>
  );
}

export default BookList;
