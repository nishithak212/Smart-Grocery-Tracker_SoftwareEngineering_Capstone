import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";

const GroceryItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Async function to fetch grocery items
  const fetchGroceryItems = async () => {
    try {

        const user_id= sessionStorage.getItem("user_id"); //Get user_id from sessionStorage
        if(!user_id){
            throw new Error("User is not logged in");
        }

      const response = await axios.get(`${API_URL}/grocery`, {
      //  withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user_id}`, //send user_id in request
        }, 
      });
      setItems(response.data);
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

  return (
    <div>
      <h2>Grocery Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : items.length === 0 ? (
        <p>No grocery items found. Please add your list here!</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.item_name} - {item.quantity} {item.unit} | {item.category} |
              Exp: {item.expiration_date || "N/A"} | Status: {item.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroceryItems;
