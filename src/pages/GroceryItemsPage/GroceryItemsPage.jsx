import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";
import { formatDate, formatForInputDate } from "../../utils/formatDate.js";

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

  const user_id = sessionStorage.getItem("user_id");

  //  Async function to fetch grocery items
  const fetchGroceryItems = async () => {
    try {
      //const user_id = sessionStorage.getItem("user_id"); //Get user_id from sessionStorage
      if (!user_id) {
        throw new Error("User is not logged in");
      }

      const response = await axios.get(`${API_URL}/grocery`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_id}`, //send user_id in request
        },
      });

      if (Array.isArray(response.data)) {
        setItems(response.data);
        setEmptyMessage("");
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

  //Fetch groceries when component mounts
  useEffect(() => {
    fetchGroceryItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user_id) {
        setError("User is not logged in");
        return;
      }

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
      setFormData({
        item_name: "",
        quantity: "",
        unit: "",
        category: "",
        expiration_date: "",
        threshold_qty: "",
        threshold_alert: "",
      });
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
      }),
        fetchGroceryItems();
    } catch (error) {
      console.error("Error deleting grocery item:", error);
      setError("Failed to delete item");
    }
  };

  return (
    <div>
      <h2>Grocery Items</h2>
      <button onClick={() => setShowForm(true)}>Add Item</button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : items.length === 0 ? (
        <p>
          {emptyMessage || "No grocery items found. Please add your list here!"}
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Expiry Date</th>
              <th>Threshold Qty</th>
              <th>Threshold Alert</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.category}</td>
                <td>{formatDate(item.expiration_date) || "N/A"}</td>
                <td>{item.threshold_qty}</td>
                <td>{formatDate(item.threshold_alert) || "N/A"}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>✏️</button>
                  <button onClick={() => handleDelete(item.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div>
          <h3>{editingItem ? "Edit Item" : "Add New Item"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="item_name"
              placeholder="Item Name"
              value={formData.item_name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <select
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
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="expiration_date"
              placeholder="Expiration Date"
              value={formData.expiration_date}
              onChange={handleChange}
            />
            <input
              type="number"
              name="threshold_qty"
              placeholder="Threshold Quantity"
              value={formData.threshold_qty}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="threshold_alert"
              placeholder="Threshold Alert"
              value={formData.threshold_alert}
              onChange={handleChange}
            />
            <button type="submit">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroceryItems;
