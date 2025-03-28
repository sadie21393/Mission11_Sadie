import { useState, useEffect } from "react";

function CategoryFilter({
  setSelectedCategories,
}: {
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  // Function to handle checkbox changes
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setSelectedCategories((prevSelectedCategories) => {
      if (checked) {
        // Add category to selected categories
        return [...prevSelectedCategories, value];
      } else {
        // Remove category from selected categories
        return prevSelectedCategories.filter((category) => category !== value);
      }
    });
  };

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

  return (
    <div>
      <h5>Filter by Category</h5>
      <div>
        {categories.map((category) => (
          <div key={category}>
            <input
              type="checkbox"
              id={category}
              value={category}
              onChange={handleCheckboxChange} // Use the function here
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
