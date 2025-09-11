import { useState, useEffect } from "react";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllArticles = async () => {
    try {
      setLoading(true);
      //fetches all articles via the GET ALL endpoint in the backend.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //converts the data type
      const data = await response.json();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllArticles();
  }, []);

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Inventory Management</h2>
      <button onClick={fetchAllArticles} style={{ marginBottom: "20px" }}>
        Refresh Articles
      </button>

      <div>Total articles: {articles.length}</div>
    </div>
  );
};

export default ArticleList;
