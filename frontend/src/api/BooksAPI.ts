import { Book } from "../types/Book";

interface FetchBooksResponse {
  totalBooks: number;
  books: Book[];
}

const API_URL = "http://localhost:5181/api";

export const fetchBooks = async (
  currentPage: number,
  booksPerPage: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  const categoryParams = selectedCategories
    .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
    .join("&");
  try {
    const response = await fetch(
      `${API_URL}/Books?page=${currentPage}&limit=${booksPerPage}${selectedCategories.length ? `&${categoryParams}` : ""}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("FetchBooks response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const AddBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/Books/AddBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add book: ${response.status} - ${errorText}`);
    }

    const addedBook = await response.json();
    console.log("Added book:", addedBook); // Debug log
    return addedBook;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/Books/UpdateBook/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/Books/DeleteBook/${bookId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete book");
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
