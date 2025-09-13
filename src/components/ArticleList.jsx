import { useState, useEffect } from "react";
import "./componentCss/articleList.css";
import { MdDeleteForever } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const ArticleList = ({
  refreshTrigger,
  onShowCreateForm,
  onShowUpdateForm,
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchingAllArticles, setWatchingAllArticles] = useState(true);
  const [nameSearch, setNameSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const fetchAllArticles = async (page = pageNumber) => {
    try {
      setLoading(true);
      console.log("nameSearch", nameSearch);
      console.log("pagenumber", page);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/articles?page=${page}&search=${nameSearch}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data);
      setNameSearch("");
      setWatchingAllArticles(true);
    } catch (err) {
      console.error("Error fetching articles:", err);
      toast.error("Error fetching articles!");
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesWithLowAmount = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/lowAmount`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNameSearch("");
      setWatchingAllArticles(false);
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles with low amount:", err);
      toast.error("Error fetching low stock articles!");
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

      if (watchingAllArticles) {
        fetchAllArticles();
      } else {
        fetchArticlesWithLowAmount();
      }
      toast.success("Article deleted successfully!");
    } catch (err) {
      console.error("Error deleting article", err);
      toast.error("Error deleting article!");
    }
  };

  const handleUpdateClick = (article) => {
    onShowUpdateForm(article);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAllArticles(0);
  };

  const handlePageClick = (i) => {
    setPageNumber(i);
    fetchAllArticles(i);
  };

  useEffect(() => {
    fetchAllArticles();
  }, [pageNumber, refreshTrigger]);

  const onChange = (e) => {
    setNameSearch(e.target.value);
  };

  if (loading) {
    return <div>Loading articles...</div>;
  }

  return (
    <div className="containerArticleList">
      <div>
        <h2>Inventory Management</h2>

        <button onClick={onShowCreateForm} className="createArticleButton">
          Create Article
        </button>

        <form className="formSearchArticle" onSubmit={handleSubmit}>
          <label className="searchInput">
            <input
              type="text"
              name="minimumAmount"
              placeholder="Search articles by name"
              value={nameSearch}
              onChange={onChange}
            />
          </label>
          <button className="searchButton" type="submit">
            Search <FaSearch />
          </button>
        </form>

        {watchingAllArticles ? (
          <p className="currentDisplayText">showing all articles</p>
        ) : (
          <p className="currentDisplayText">showing articles with low stock</p>
        )}

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
          onClick={() => fetchAllArticles()}
          className="refreshArticlesButton"
        >
          Refresh All Articles
        </button>
        <button onClick={fetchArticlesWithLowAmount} className="lowStockButton">
          Get Articles With Low stock
        </button>

        <div className="totalArticles">
          Total articles: {articles.totalItems}
        </div>
      </div>
      <div>
        {articles.length === 0 ? (
          <p style={{ backgroundColor: "black" }}>No articles found.</p>
        ) : (
          <div className="articleListContainer">
            <table className="articleList">
              <thead>
                <tr style={{ backgroundColor: "black" }}>
                  <th style={{ border: "1px solid white", padding: "8px" }}>
                    Name
                  </th>
                  <th style={{ border: "1px solid white", padding: "8px" }}>
                    Amount
                  </th>
                  <th style={{ border: "1px solid white", padding: "8px" }}>
                    Min Amount
                  </th>
                  <th style={{ border: "1px solid white", padding: "8px" }}>
                    Unit
                  </th>
                  <th style={{ border: "1px solid white", padding: "8px" }}>
                    Status
                  </th>
                  <th style={{ border: "1px solid white", padding: "8px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.content.map((article) => (
                  <tr
                    key={article.id}
                    style={{
                      backgroundColor: "black",
                    }}
                  >
                    <td style={{ border: "1px solid white", padding: "8px" }}>
                      {article.name}
                    </td>
                    <td
                      style={{
                        border: "1px solid white",
                        padding: "8px",
                        color: article.lowStock ? "red" : "white",
                        fontWeight: article.lowStock ? "bold" : "normal",
                      }}
                    >
                      {article.amount}
                    </td>
                    <td style={{ border: "1px solid white", padding: "8px" }}>
                      {article.minimumAmount}
                    </td>
                    <td style={{ border: "1px solid white", padding: "8px" }}>
                      {article.unit.toLowerCase()}
                    </td>
                    <td
                      style={{
                        border: "1px solid white",
                        padding: "8px",
                        color: article.lowStock ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {article.lowStock ? "LOW STOCK" : "OK"}
                    </td>
                    <td style={{ border: "1px solid white", padding: "8px" }}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
