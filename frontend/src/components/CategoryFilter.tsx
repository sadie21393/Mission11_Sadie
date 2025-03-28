import { useEffect, useState } from "react";
import "./categoryfilter.css";

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5181/api/Books/Categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <>
      <div className="container mt-4">
        <div className="category-filter">
          <h5>Filter</h5>
          <div className="category-list">
            {categories.map((category) => (
              <div className="category-item" key={category}>
                <input
                  type="checkbox"
                  id={category}
                  value={category}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryFilter;
