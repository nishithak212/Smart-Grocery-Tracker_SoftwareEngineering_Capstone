import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import SearchBar from "../../components/SearchBar/SearchBar";
import Sort from "../../components/Sort/Sort";
import DeleteIcon from "../../assets/icons/trash-solid.svg";
import "../ShoppingListPage/ShoppingListPage.scss";

const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [emptyMessage, setEmptyMessage] = useState("");

  //get user_id from sessionStorage
  const user_id = sessionStorage.getItem("user_id");

  //Fetch Shopping List Items
  const fetchShoppingList = async () => {
    try {
      if (!user_id) {
        setError("User not logeed in");
        return;
      }

      const response = await axios.get(`${API_URL}/shopping-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_id}`,
        },
      });

      if (response.data.message) {
        setShoppingList([]);
        setError(response.data.message);
        setEmptyMessage(response.data.message);
      } else {
        setShoppingList(response.data);
        setEmptyMessage("");
      }
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      setError("Failed to  load shopping list.");
    } finally {
      setLoading(false);
    }
  };

  //Delete single item from shopping list
  const deleteShoppingItem = async (id) => {
    try {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        setError("User not logged in");
        return;
      }

      await axios.delete(`${API_URL}/shopping-list/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_id}`,
        }, //send user_id in headers
      });

      //Refresh shopping list after deletion
      setShoppingList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting shopping list item:", error);
      setError("Failed to delete item");
    }
  };

  //Fetch shopping list on component mount
  useEffect(() => {
    fetchShoppingList();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSortClick = (key) => () => handleSort(key);

  const filteredList = shoppingList.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedList = [...filteredList].sort((a, b) => {
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
    <div className="shoppingList-page">
      <div className="user-actions__search">
        <SearchBar onSearch={(term) => setSearchTerm(term)} />
      </div>
      <div className="shoppingList-page__white-space"></div>
      {loading ? (
        <p className="shoppingList-page__loading">Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : shoppingList.length === 0 ? (
        <p className="shoppingList-page__empty">
          {emptyMessage
            ? emptyMessage
            : "Your shopping list is empty! No low stock, expired or out-of-stock items"}
        </p>
      ) : (
        <div className="shoppingList-wrapper">
          <table className="shoppingList-table">
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
                    Qty{" "}
                    <Sort
                      sortKey={sortKey}
                      columnKey="quantity"
                      sortOrder={sortOrder}
                    />
                  </span>
                </th>
                <th onClick={() => handleSort("unit")}>
                  <span className="header-cell">
                    Unit{" "}
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
                <th onClick={handleSortClick("status")}>
                  <span className="header-cell">
                    Status
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
              {sortedList.map((item) => (
                <tr key={item.id}>
                  <td data-label="Item Name">{item.item_name}</td>
                  <td data-label="Qty">{item.quantity}</td>
                  <td data-label="Unit">{item.unit}</td>
                  <td data-label="Category">{item.category}</td>
                  <td data-label="Status">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteShoppingItem(item.id)}
                      className="action-icon"
                    >
                      <img
                        src={DeleteIcon}
                        alt="Delete-icon"
                        width="16px"
                        height="16px"
                      ></img>
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

export default ShoppingListPage;
