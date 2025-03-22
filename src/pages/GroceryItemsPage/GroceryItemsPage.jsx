import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";
import { formatDate, formatForInputDate } from "../../utils/formatDate.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Sort from "../../components/Sort/Sort.jsx";
import EditIcon from "../../assets/pen-solid.svg";
import DeleteIcon from "../../assets/trash-solid.svg";

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
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

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

  //   const getSortIcon = (key) => {
  //     if (sortKey === key) return <img src={sort} alt="sort" width="12" />;
  //     return sortOrder === "asc" ? (
  //       <img src={sortup} alt="Sort Ascending" width="12" />
  //     ) : (
  //       <img src={sortdown} alt="Sort Descending" width="12" />
  //     );
  //   };

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
    <div>
      <h2>Grocery Items</h2>

      <div className="user-actions">
        <div className="user-actions__search">
          <SearchBar onSearch={(term) => setSearchTerm(term)} />
        </div>
      </div>
      <div className="Add">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          Add Item
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredItems.length === 0 ? (
        <p>
          {emptyMessage || "No grocery items found. Please add your list here!"}
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("item_name")}>
                Item Name{" "}
                <Sort
                  sortKey={sortKey}
                  columnKey="item_name"
                  sortOrder={sortOrder}
                />
              </th>
              <th>Qty</th>
              <th>Unit</th>
              <th onClick={() => handleSort("category")}>
                Category{" "}
                <Sort
                  sortKey={sortKey}
                  columnKey="category"
                  sortOrder={sortOrder}
                />
              </th>
              <th onClick={() => handleSort("expiration_date")}>
                Expiry Date{" "}
                <Sort
                  sortKey={sortKey}
                  columnKey="expiration_date"
                  sortOrder={sortOrder}
                />
              </th>
              <th onClick={() => handleSort("status")}>
                Status{" "}
                <Sort
                  sortKey={sortKey}
                  columnKey="status"
                  sortOrder={sortOrder}
                />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.category}</td>
                <td>{formatDate(item.expiration_date) || "N/A"}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    <img src={EditIcon} alt="Edit-icon" width="16px"></img>
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <img src={DeleteIcon} alt="Delete-icon" width="16px"></img>
                  </button>
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
                resetForm();
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
