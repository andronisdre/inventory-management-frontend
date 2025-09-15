import { useState } from "react";
import "./componentCss/articleForm.css";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const CreateArticleForm = ({
  onArticleCreated,
  onShowCreateForm,
  isVisible,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [articlevalues, setArticleValues] = useState({
    name: "",
    amount: "",
    minimumAmount: "",
    unit: "",
  });

  const createArticle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articlevalues),
      });

      if (!response.ok) {
        const creationError = await response.json();
        setError(creationError.details);
        console.log("error", error);
      }

      const data = await response.json();
      setArticleValues({ name: "", amount: "", minimumAmount: "", unit: "" });
      toast.success("Successfully created the article!");
      onArticleCreated?.();
    } catch (err) {
      console.error("Error creating article:", err);
      toast.error(`error creating the article! ${error[0]}`);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name in articlevalues) {
      setArticleValues({
        ...articlevalues,
        [name]: value,
      });
    }
  };

  if (loading) {
    return <div>Creating article...</div>;
  }

  return (
    <div
      className="articleFormContainer"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <FaTimes className="closeFormButton" onClick={onShowCreateForm} />
      <h2>Article Creation Form</h2>
      <form className="formArticleCreation" onSubmit={createArticle}>
        <div className="fields">
          <label>
            <p className="inputText">Name</p>
            <input
              className="inputField"
              type="text"
              name="name"
              placeholder="Enter name of article"
              value={articlevalues.name}
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
              value={articlevalues.amount}
              onChange={onChange}
            />
          </label>
          <label>
            <p className="inputText">Minimum Amount</p>
            <input
              className="inputField"
              type="number"
              name="minimumAmount"
              placeholder="Enter positive integer"
              value={articlevalues.minimumAmount}
              onChange={onChange}
            />
          </label>
          <label>
            <p className="inputText">Unit</p>
            <select
              className="inputField"
              name="unit"
              value={articlevalues.unit}
              onChange={onChange}
            >
              <option value="">Unit</option>
              <option value="PIECES">Pieces</option>
              <option value="MILLILITERS">Milliliters</option>
              <option value="GRAMS">Grams</option>
            </select>
          </label>
        </div>
        <button type="submit" className="submitButton">
          Create Article
        </button>
      </form>
    </div>
  );
};

export default CreateArticleForm;
