import { useState, useEffect } from "react";
import "./componentCss/articleList.css";
import { MdDeleteForever } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { toast } from "react-toastify";

const ArticleList = ({
  refreshTrigger,
  onShowCreateForm,
  onShowUpdateForm,
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchingAllArticles, setWatchingAllArticles] = useState(true);
  const [name, setName] = useState({
    name: "",
  });

  const fetchAllArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data);
      setWatchingAllArticles(true);
      setError(null);
    } catch (err) {
      setError(err.message);
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
      setWatchingAllArticles(false);
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
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

  useEffect(() => {
    fetchAllArticles();
  }, [refreshTrigger]);

  const onChange = (e) => {
    const { value } = e.target;
    setName({
      value,
    });
  };

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div className="containerArticleList">
      <h2>Inventory Management</h2>

      <button onClick={onShowCreateForm} className="createArticleButton">
        Create Article
      </button>

      <form className="formSearchArticle">
        <label className="searchInput">
          <input
            type="text"
            name="minimumAmount"
            placeholder="Search articles by name"
            onChange={onChange}
          />
        </label>
        <button className="searchButton" type="submit">
          Search Articles
        </button>
      </form>

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
              {articles.map((article) => (
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
      <button onClick={fetchAllArticles} className="refreshArticlesButton">
        Refresh All Articles
      </button>
      <button onClick={fetchArticlesWithLowAmount} className="lowStockButton">
        Get Articles With Low stock
      </button>

      <div className="totalArticles">
        Total articles: {articles.length} | Articles with low stock:{" "}
        {
          articles.filter((article) => {
            return article.lowStock;
          }).length
        }
      </div>
    </div>
  );
};

export default ArticleList;
