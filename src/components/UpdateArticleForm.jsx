import { useState, useEffect } from "react";
import "./componentCss/articleForm.css";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const UpdateArticleForm = ({
  article,
  onArticleUpdated,
  onShowUpdateForm,
  isVisible,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [updateValues, setUpdateValues] = useState({
    name: "",
    amount: "",
    minimumAmount: "",
    unit: "",
    category: "",
  });

  useEffect(() => {
    if (article) {
      setUpdateValues({
        name: article.name,
        amount: article.amount,
        minimumAmount: article.minimumAmount,
        unit: article.unit,
        category: article.category,
      });
    }
  }, [isVisible, article]);

  const updateArticle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${article.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateValues),
        }
      );

      if (!response.ok) {
        const updateError = await response.json();
        setError(updateError.details);
        console.log("error", error);
      }

      toast.success("Successfully updated the article!");
      onArticleUpdated?.();
    } catch (err) {
      console.error("Error updating article:", err);
      toast.error(`error updating the article! ${error[0]}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = (article) => {
    onShowUpdateForm(article);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setUpdateValues({
      ...updateValues,
      [name]: value,
    });
  };

  if (loading) {
    return <div>Updating article...</div>;
  }

  return (
    <div
      className="articleFormContainer"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <FaTimes
        className="closeFormButton"
        onClick={() => handleCloseForm(article)}
      />
      <h2>Update Article Form</h2>
      <form className="formArticleCreation" onSubmit={updateArticle}>
        <div className="fields">
          <label>
            <p className="inputText">Name</p>
            <input
              className="inputField"
              type="text"
              name="name"
              placeholder="Enter name of article"
              value={updateValues.name}
              onChange={onChange}
            />
          </label>
          <label>
            <p className="inputText">Amount</p>
            <input
              className="inputField"
              type="number"
              name="amount"
              placeholder="Enter positive integer"
              value={updateValues.amount}
              onChange={onChange}
            />
          </label>
          <label>
            <p className="inputText">Minimum Stock</p>
            <input
              className="inputField"
              type="number"
              name="minimumAmount"
              placeholder="Enter positive integer"
              value={updateValues.minimumAmount}
              onChange={onChange}
            />
          </label>
          <label>
            <p className="inputText">Unit</p>
            <select
              className="inputField"
              name="unit"
              value={updateValues.unit}
              onChange={onChange}
            >
              <option value="">Unit</option>
              <option value="PIECES">Pieces</option>
              <option value="MILLILITERS">Milliliters</option>
              <option value="GRAMS">Grams</option>
            </select>
          </label>
          <label>
            <p className="inputText">Category</p>
            <select
              className="inputField"
              name="category"
              value={updateValues.category}
              onChange={onChange}
            >
              <option value="">Category</option>
              <option value="MEDICATION">Medication</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="CONSUMABLE">Consumable</option>
              <option value="CLEANING">Cleaning</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
        </div>
        <button type="submit" className="submitButton">
          Update Article
        </button>
      </form>
    </div>
  );
};

export default UpdateArticleForm;
