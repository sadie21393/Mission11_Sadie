import "./App.css";
import BookList from "./components/BookList"; // Import the BookList component
import CategoryFilter from "./components/CategoryFilter";

function App() {
  return (
    <div className="App">
      <h1>Online Bookstore</h1>
      <CategoryFilter />
      <BookList /> {/* Display the book list */}
    </div>
  );
}

export default App;
