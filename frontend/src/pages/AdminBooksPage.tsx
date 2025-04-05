import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { deleteBook, fetchBooks } from "../api/BooksAPI";

import NewBookForm from "../components/NewBookForm";
import Pagination from "../components/Pagination";
import EditBookForm from "../components/EditBookForm";

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const loadBooks = async () => {
    try {
      const data = await fetchBooks(currentPage, booksPerPage, []);
      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalBooks / booksPerPage));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [booksPerPage, currentPage]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;
    try {
      await deleteBook(bookId);
      setBooks(books.filter((p) => p.bookId !== bookId));
    } catch (error) {
      alert("Failed to delete book");
    }
  };

  return (
    <div>
      <h1>Admin - Books</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            loadBooks(); // Refresh the list
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(booksPerPage, currentPage, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Classification</th>
            <th>Page Count</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((p) => (
            <tr key={p.bookId}>
              <td>{p.bookId}</td>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>{p.publisher}</td>
              <td>{p.isbn}</td>
              <td>{p.category}</td>
              <td>{p.classification}</td>
              <td>{p.pageCount}</td>
              <td>{p.price}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(p.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default AdminBooksPage;
