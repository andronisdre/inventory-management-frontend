import { useState, useEffect } from "react";
import "./componentCss/articleForm.css";
import { toast } from "react-toastify";

const UpdateArticleForm = ({ article, onArticleUpdated, isVisible }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [updateValues, setUpdateValues] = useState({
    name: "",
    amount: "",
    minimumAmount: "",
    unit: "",
  });

  useEffect(() => {
    if (article) {
      setUpdateValues({
        name: article.name,
        amount: article.amount.toString(),
        minimumAmount: article.minimumAmount.toString(),
        unit: article.unit,
      });
    }
  }, [article]);

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
      toast.error("error updating the article!", error);
    } finally {
      setLoading(false);
    }
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
      <h2>Update Article Form</h2>
      <form className="formArticleCreation" onSubmit={updateArticle}>
        <div className="Fields">
          <label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={updateValues.name}
              onChange={onChange}
            />
          </label>
          <label>
            <input
              type="text"
              name="amount"
              placeholder="Amount"
              value={updateValues.amount}
              onChange={onChange}
            />
          </label>
          <label>
            <input
              type="text"
              name="minimumAmount"
              placeholder="Minimum Amount"
              value={updateValues.minimumAmount}
              onChange={onChange}
            />
          </label>
          <label>
            <select
              className="selectUnit"
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
        </div>
        <button type="submit" className="Confirmed next">
          Update Article
        </button>
      </form>
    </div>
  );
};

export default UpdateArticleForm;
