import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";

const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } else {
        setShoppingList(response.data);
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

  return (
    <div>
      <h2>Shopping List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : shoppingList.length === 0 ? (
        <p>
          Your shopping list is empty! No low stock, expired or finished items
        </p>
      ) : (
        <ul>
          {shoppingList.map((item) => (
            <li key={item.id}>
              {item.item_name} - {item.quantity} {item.unit} | Status:{" "}
              {item.status}
              <button onClick={() => deleteShoppingItem(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingListPage;
