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
    if (selectedArticle === article) {
      setShowUpdateForm(!showUpdateForm);
    } else {
      setShowUpdateForm(true);
    }
    setSelectedArticle(article);
    setShowCreateForm(false);
  };

  const isFormActive = showCreateForm || showUpdateForm;

  return (
    <div className={`container ${isFormActive ? "form-active" : ""}`}>
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
