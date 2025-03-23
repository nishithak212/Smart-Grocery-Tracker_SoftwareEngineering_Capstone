import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";
import { formatDate, formatForInputDate } from "../../utils/formatDate.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Sort from "../../components/Sort/Sort.jsx";
import EditIcon from "../../assets/icons/pen-solid.svg";
import DeleteIcon from "../../assets/icons/trash-solid.svg";
import "../GroceryItemsPage/GroceryItemsPage.scss";

const GroceryItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    unit: "",
    category: "",
    expiration_date: "",
    threshold_qty: "",
    threshold_alert: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const selectedItems = [];
  const selectedCategories = [];
  const selectedStatuses = [];

  const user_id = sessionStorage.getItem("user_id");

  const fetchGroceryItems = async () => {
    try {
      if (!user_id) throw new Error("User is not logged in");

      const response = await axios.get(`${API_URL}/grocery`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_id}`,
        },
      });

      if (Array.isArray(response.data)) {
        setItems(response.data);
        setEmptyMessage(response.data.message || "No grocery items found.");
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching groceries:", error);
      setError("Failed to load grocery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceryItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user_id) return setError("User is not logged in");

      if (editingItem) {
        await axios.put(`${API_URL}/grocery/${editingItem.id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          },
        });
      } else {
        await axios.post(
          `${API_URL}/grocery/add`,
          { ...formData, user_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user_id}`,
            },
          }
        );
      }

      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchGroceryItems();
    } catch (error) {
      console.error("Error saving grocery item:", error);
      setError("Failed to save grocery item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      expiration_date: formatForInputDate(item.expiration_date),
      threshold_qty: item.threshold_qty,
      threshold_alert: formatForInputDate(item.threshold_alert),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/grocery/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_id}`,
        },
      });
      fetchGroceryItems();
    } catch (error) {
      console.error("Error deleting grocery item:", error);
      setError("Failed to delete item");
    }
  };

  const resetForm = () => {
    setFormData({
      item_name: "",
      quantity: "",
      unit: "",
      category: "",
      expiration_date: "",
      threshold_qty: "",
      threshold_alert: "",
    });
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredItems = items
    .filter((item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedItems.length ? selectedItems.includes(item.item_name) : true
    )
    .filter((item) =>
      selectedCategories.length
        ? selectedCategories.includes(item.category)
        : true
    )
    .filter((item) =>
      selectedStatuses.length ? selectedStatuses.includes(item.status) : true
    );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortKey) return 0;
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (sortKey === "expiration_date") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal?.toString().toLowerCase();
      bVal = bVal?.toString().toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="grocery-page">
      <div className="user-actions">
        <div className="user-actions__search">
          <SearchBar onSearch={(term) => setSearchTerm(term)} />
        </div>
      </div>

      <div className="add">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
            setEditingItem(null);
          }}
          className="add__button"
        >
          Add Item
        </button>
      </div>
      {showForm && (
        <div className="add-edit">
          <h3>{editingItem ? "Edit Item" : "Add New Item"}</h3>
          <form onSubmit={handleSubmit} className="add-edit__form">
            <div className="add-edit__form-group">
              <label htmlFor="item_name" className="add-edit__form--label">
                Item Name:{" "}
              </label>
              <input
                className="add-edit__form-group--input"
                type="text"
                name="item_name"
                placeholder="Item Name"
                value={formData.item_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="add-edit__form-group">
              <label htmlFor="quantity" className="add-edit__form--label">
                Quantity:{" "}
              </label>
              <input
                className="add-edit__form-group--input"
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="add-edit__form-group">
              <label htmlFor="unit" className="add-edit__form--label">
                Unit:{" "}
              </label>
              <select
                className="add-edit__form-group--input"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="ml">ml</option>
                <option value="ltr">ltr</option>
                <option value="gallon">gallon</option>
                <option value="ct">ct</option>
              </select>
            </div>
            <div className="add-edit__form-group">
              <label htmlFor="category" className="add-edit__form--label">
                Category:{" "}
              </label>
              <input
                className="add-edit__form-group--input"
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="add-edit__form-group">
              <label
                htmlFor="expiration_date"
                className="add-edit__form--label"
              >
                Expiry Date:{" "}
              </label>
              <input
                className="add-edit__form-group--input"
                type="date"
                name="expiration_date"
                placeholder="Expiration Date"
                value={formData.expiration_date}
                onChange={handleChange}
              />
            </div>
            <div className="add-edit__form-group">
              <label htmlFor="threshold_qty" className="add-edit__form--label">
                Set threshold for quantity:{" "}
              </label>
              <input
                className="add-edit__form-group--input"
                type="number"
                name="threshold_qty"
                placeholder="Threshold Quantity"
                value={formData.threshold_qty}
                onChange={handleChange}
                required
              />
            </div>
            <div className="add-edit__form-group">
              <label
                htmlFor="threshold_alert"
                className="add-edit__form--label"
              >
                Set threshold date for alert before expiry:{" "}
              </label>
              <input
                className="add-edit__form-group--input"
                type="date"
                name="threshold_alert"
                placeholder="Threshold Alert"
                value={formData.threshold_alert}
                onChange={handleChange}
              />
            </div>
            <div className="add-edit__form-actions">
              <button type="submit" className="add-edit__form--submit">
                {editingItem ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="add-edit__form--cancel"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredItems.length === 0 ? (
        <p className="grocery-page__empty">
          {emptyMessage || "No grocery items found. Please add your list here!"}
        </p>
      ) : (
        <div className="grocery-wrapper">
          <table className="grocery-list">
            <thead>
              <tr>
                <th onClick={() => handleSort("item_name")}>
                  <span className="header-cell">
                    Item Name{" "}
                    <Sort
                      sortKey={sortKey}
                      columnKey="item_name"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>
                <th onClick={() => handleSort("quantity")}>
                  <span className="header-cell">
                    Qty
                    <Sort
                      sortKey={sortKey}
                      columnKey="quantity"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>
                <th onClick={() => handleSort("unit")}>
                  <span className="header-cell">
                    Unit
                    <Sort
                      sortKey={sortKey}
                      columnKey="unit"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>
                <th onClick={() => handleSort("category")}>
                  <span className="header-cell">
                    Category{" "}
                    <Sort
                      sortKey={sortKey}
                      columnKey="category"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>
                <th onClick={() => handleSort("expiration_date")}>
                  <span className="header-cell">
                    Expiry Date{" "}
                    <Sort
                      sortKey={sortKey}
                      columnKey="expiration_date"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>
                <th onClick={() => handleSort("status")}>
                  <span className="header-cell">
                    Status{" "}
                    <Sort
                      sortKey={sortKey}
                      columnKey="status"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>

                <th>{""}</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.id}>
                  <td data-label="Item Name">{item.item_name}</td>
                  <td data-label="Qty">{item.quantity}</td>
                  <td data-label="Unit">{item.unit}</td>
                  <td data-label="Category">{item.category}</td>
                  <td data-label="Expiry Date">
                    {formatDate(item.expiration_date) || "N/A"}
                  </td>
                  <td data-label="Status">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      className="action-icon"
                    >
                      <img src={EditIcon} alt="Edit-icon" width="16px"></img>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="action-icon"
                    >
                      <img
                        src={DeleteIcon}
                        alt="Delete-icon"
                        width="16px"
                        height="16px"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GroceryItems;
