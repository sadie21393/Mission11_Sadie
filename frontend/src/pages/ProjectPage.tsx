import { useEffect, useState } from "react";
import BookList from "../components/BookList";
import CategoryFilter from "../components/CategoryFilter";
import WelcomeBand from "../components/WelcomeBand";
import CartSummary from "../components/CartSummary";

function ProjectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  //   THIS IS MY OTHER ADDED BOOTSTRAP THING (DARK AND LIGHT THEME)
  //  CODE IS FOUND ON MY PROJECT PAGE LINES 11, 13-18, 32-34
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3"></div>
      <CartSummary />
      <WelcomeBand />
      <div className="row">
        <div className="col-md-4">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <button className="btn btn-outline-secondary" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
        <div className="col-md-8">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
