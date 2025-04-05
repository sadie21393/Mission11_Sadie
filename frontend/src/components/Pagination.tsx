interface PaginationProps {
  currentPage: number;
  totalPages: number;
  booksPerPage: number;
  setCurrentPage: (newPage: number) => void;
  setBooksPerPage: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  booksPerPage,
  setBooksPerPage,
  setCurrentPage,
}: PaginationProps) => {
  // Handle books per page change
  function handleBooksPerPageChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setBooksPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1
  }

  return (
    <div>
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
  );
};

export default Pagination;
