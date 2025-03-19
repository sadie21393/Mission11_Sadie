import "./App.css";
import BookList from "./components/BookList"; // Import the BookList component

function App() {
  return (
    <div className="App">
      <h1>Online Bookstore</h1>
      <BookList /> {/* Display the book list */}
    </div>
  );
}

export default App;
