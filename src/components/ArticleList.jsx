import { useState, useEffect } from "react";
import "./componentCss/articleList.css";
import { MdDeleteForever } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaTimes,
  FaSortAlphaDownAlt,
  FaSortAlphaDown,
} from "react-icons/fa";

const ArticleList = ({
  refreshTrigger,
  onShowCreateForm,
  onShowUpdateForm,
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchingLowStock, setWatchingLowStock] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [editingAmountId, setEditingAmountId] = useState(null);
  const [amountChange, setAmountChange] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const fetchAllArticles = async (
    page = pageNumber,
    watchingLow = watchingLowStock,
    fieldToSortBy = sortBy,
    direction = sortDir,
    filterByCategory = categoryFilter
  ) => {
    try {
      setLoading(true);
      console.log("nameSearch", nameSearch);
      console.log("pagenumber", page);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/articles?page=${page}&onlyLowStockArticles=${watchingLow}&search=${nameSearch}&categoryFilter=${filterByCategory}&sortBy=${fieldToSortBy}&sortDir=${direction}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
      toast.error("Error fetching articles!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchAllArticles();

      setEditingAmountId(null);

      toast.success("Article deleted successfully!");
    } catch (err) {
      console.error("Error deleting article", err);
      toast.error("Error deleting article!");
    }
  };

  const patchAmountAdd = async (id, amount) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${id}/changeAmount/add`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount }),
        }
      );

      if (!response.ok) {
        const patchError = await response.json();
        throw new Error(patchError.message || "Error increasing amount");
      }

      toast.success("Successfully increased the article amount!");
      fetchAllArticles();
      setEditingAmountId(null);
      setAmountChange(0);
    } catch (err) {
      console.error("Error increasing article amount:", err);
      toast.error("Error increasing the article amount!");
    } finally {
      setLoading(false);
    }
  };

  const patchAmountSubtract = async (id, amount) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${id}/changeAmount/subtract`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount }),
        }
      );

      if (!response.ok) {
        const patchError = await response.json();
        throw new Error(patchError.message || "Error subtracting amount");
      }

      toast.success("Successfully subtracted the article amount!");
      fetchAllArticles();
      setEditingAmountId(null);
      setAmountChange(0);
    } catch (err) {
      console.error("Error subtracting article amount:", err);
      toast.error("Error subtracting the article amount!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubtractSubmit = (e, articleId) => {
    e.preventDefault();
    if (amountChange !== 0) {
      patchAmountSubtract(articleId, amountChange);
    }
  };

  const handleAddSubmit = (e, articleId) => {
    e.preventDefault();
    if (amountChange !== 0) {
      patchAmountAdd(articleId, amountChange);
    }
  };

  const handleAmountClick = (id, e) => {
    if (editingAmountId === id) {
      setEditingAmountId(null);
    } else {
      const rect = e.target.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
      setEditingAmountId(id);
    }
    setAmountChange(0);
  };

  const handleUpdateClick = (article) => {
    onShowUpdateForm(article);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditingAmountId(null);
    fetchAllArticles(0);
  };

  const handlePageClick = (i) => {
    setEditingAmountId(null);
    setPageNumber(i);
    fetchAllArticles(i);
  };

  const handleSortBy = (fieldName) => {
    if (sortBy === fieldName) {
      if (sortDir === "asc") {
        setSortDir("desc");
        fetchAllArticles(pageNumber, watchingLowStock, fieldName, "desc");
      } else {
        setSortDir("asc");
        fetchAllArticles(pageNumber, watchingLowStock, fieldName, "asc");
      }
    } else {
      setSortBy(fieldName);
      setSortDir("asc");
      fetchAllArticles(pageNumber, watchingLowStock, fieldName, "asc");
    }
  };

  const handleFetchAll = () => {
    setEditingAmountId(null);
    setPageNumber(0);
    setWatchingLowStock(false);
    fetchAllArticles(0, false);
  };

  const handleFetchLowStock = () => {
    setEditingAmountId(null);
    setPageNumber(0);
    setWatchingLowStock(true);
    fetchAllArticles(0, true);
  };

  useEffect(() => {
    fetchAllArticles();
  }, [pageNumber, refreshTrigger]);

  const onChange = (e) => {
    setNameSearch(e.target.value);
  };

  const filterByCategory = (e) => {
    setCategoryFilter(e.target.value);
    fetchAllArticles(
      pageNumber,
      watchingLowStock,
      sortBy,
      sortDir,
      e.target.value
    );
  };

  if (loading) {
    return <div>Loading articles...</div>;
  }

  return (
    <div className="containerArticleList">
      <div className="inputSectionContainer">
        <h2>Inventory Management</h2>

        <button onClick={onShowCreateForm} className="createArticleButton">
          Create Article
        </button>

        <form className="formSearchArticle" onSubmit={handleSubmit}>
          <label className="searchInput">
            <input
              type="text"
              name="minimumAmount"
              placeholder={nameSearch}
              value={nameSearch}
              onChange={onChange}
            />
          </label>
          <div className="searchAndClearContainer">
            <button className="searchButton" type="submit">
              Search <FaSearch />
            </button>
            <button
              className="searchClearButton"
              onClick={() => setNameSearch("")}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="paginationContainer">
          {Array.from({ length: articles.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              className="pageButton"
              style={{
                backgroundColor: i === pageNumber ? "black" : "#1a1a1a",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleFetchAll()}
          className="refreshArticlesButton"
          style={{
            backgroundColor: watchingLowStock ? "#1a1a1a" : "black",
          }}
        >
          All Articles
        </button>
        <button
          onClick={() => handleFetchLowStock()}
          className="lowStockButton"
          style={{
            backgroundColor: watchingLowStock ? "black" : "#1a1a1a",
          }}
        >
          Low stock Articles
        </button>

        <div className="totalArticles">
          {watchingLowStock ? (
            <p>Total Low Stock articles: {articles.totalItems}</p>
          ) : (
            <p>Total articles: {articles.totalItems}</p>
          )}
        </div>
        <label>
          <p className="inputText">Filter by Category</p>
          <select
            className="inputField"
            name="category"
            value={categoryFilter}
            onChange={filterByCategory}
          >
            <option value="">All Categories</option>
            <option value="MEDICATION">Medication</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="CONSUMABLE">Consumable</option>
            <option value="CLEANING">Cleaning</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>
      <div>
        {articles.content.length === 0 ? (
          <p
            style={{
              backgroundColor: "black",
              minWidth: "400px",
              margin: "10px",
            }}
          >
            No articles found.
          </p>
        ) : (
          <div className="articleListContainer">
            <table className="articleList">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortBy("name")}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        sortBy === "name" ? "#2b642d" : "initial",
                    }}
                  >
                    Name{" "}
                    {sortDir === "asc" && sortBy === "name" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th>Amount</th>
                  <th>Min Stock</th>
                  <th
                    onClick={() => handleSortBy("unit")}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        sortBy === "unit" ? "#2b642d" : "initial",
                    }}
                  >
                    Unit{" "}
                    {sortDir === "asc" && sortBy === "unit" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th
                    onClick={() => handleSortBy("category")}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        sortBy === "category" ? "#2b642d" : "initial",
                    }}
                  >
                    Category{" "}
                    {sortDir === "asc" && sortBy === "category" ? (
                      <FaSortAlphaDownAlt />
                    ) : (
                      <FaSortAlphaDown />
                    )}
                  </th>
                  <th
                    onClick={() => handleSortBy("updatedAt")}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        sortBy === "updatedAt" ? "#2b642d" : "initial",
                    }}
                  >
                    Date{" "}
                    {sortDir === "asc" && sortBy === "updatedAt" ? (
                      <FaSortAlphaDownAlt />
                    ) : (
                      <FaSortAlphaDown />
                    )}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.content.map((article) => (
                  <tr key={article.id}>
                    <td>{article.name}</td>
                    <td
                      className="amountColumn"
                      style={{
                        color: article.lowStock ? "red" : "white",
                        fontWeight: article.lowStock ? "bold" : "normal",
                        cursor: "pointer",
                      }}
                      onClick={(e) => handleAmountClick(article.id, e)}
                    >
                      {article.amount}
                    </td>
                    <td>{article.minimumAmount}</td>
                    <td>{article.unit.toLowerCase()}</td>
                    <td>{article.category.toLowerCase()}</td>
                    <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                    <td
                      style={{
                        color: article.lowStock ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {article.lowStock ? "LOW STOCK" : "OK"}
                    </td>
                    <td>
                      <button
                        className="deleteArticleButton"
                        onClick={() => {
                          handleDeleteArticle(article.id);
                        }}
                        style={{ marginRight: "10px" }}
                      >
                        <MdDeleteForever />
                      </button>
                      <button
                        className="updateArticleButton"
                        onClick={() => handleUpdateClick(article)}
                      >
                        <GrDocumentUpdate />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editingAmountId && (
              <div
                style={{
                  position: "absolute",
                  top: popupPosition.top,
                  left: popupPosition.left,
                  backgroundColor: "#242424",
                  border: "2px solid white",
                  borderRadius: "8px",
                  padding: "15px",
                  zIndex: 100,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                  minWidth: "250px",
                }}
              >
                <form>
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="number"
                      value={amountChange}
                      onChange={(e) => setAmountChange(e.target.value)}
                      style={{
                        width: "80%",
                        padding: "8px",
                        border: "1px solid white",
                        borderRadius: "4px",
                        backgroundColor: "#1a1a1a",
                        color: "white",
                        fontSize: "14px",
                      }}
                      placeholder="Enter positive or negative number"
                      autoFocus
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={(e) => handleSubtractSubmit(e, editingAmountId)}
                      className="subtractButton"
                    >
                      Subtract
                    </button>
                    <button
                      onClick={(e) => handleAddSubmit(e, editingAmountId)}
                      className="addAmountButton"
                    >
                      Add
                    </button>
                    <FaTimes
                      className="closeFormButton"
                      type="button"
                      onClick={() => setEditingAmountId(null)}
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
