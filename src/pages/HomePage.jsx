import { useState } from "react";
import ArticleList from "../components/ArticleList";
import CreateArticleForm from "../components/CreateArticleForm";
import UpdateArticleForm from "../components/UpdateArticleForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pageCss/homePage.css";

const HomePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleArticleCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowCreateForm(false);
  };

  const handleArticleUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowUpdateForm(false);
    setSelectedArticle(null);
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowUpdateForm(false);
  };

  const handleShowUpdateForm = (article) => {
    setSelectedArticle(article);
    setShowUpdateForm(!showUpdateForm);
    setShowCreateForm(false);
  };

  return (
    <div className="container">
      <ToastContainer />
      <CreateArticleForm
        onArticleCreated={handleArticleCreated}
        onShowCreateForm={handleShowCreateForm}
        isVisible={showCreateForm}
      />
      <UpdateArticleForm
        article={selectedArticle}
        onArticleUpdated={handleArticleUpdated}
        onShowUpdateForm={handleShowUpdateForm}
        isVisible={showUpdateForm}
      />
      <ArticleList
        refreshTrigger={refreshTrigger}
        onShowCreateForm={handleShowCreateForm}
        onShowUpdateForm={handleShowUpdateForm}
      />
    </div>
  );
};

export default HomePage;
