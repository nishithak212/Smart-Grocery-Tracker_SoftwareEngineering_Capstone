import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";
import CheckIcon from "../../assets/check-solid.svg";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      setError("User not logged in");
      return;
    }

    const fetchNotifications = async () => {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        setError("User is not logged in");
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/notifications`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          },
        });

        console.log("API Response:", response.data);

        // Ensure notifications is an array
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, []);

  //Mark notifications as read
  const markAsRead = async (id) => {
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      setError("User is not logged in");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/notifications/mark-read/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          },
        }
      );

      //Update UI to remove the read notification
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error marking notification as read: ", error);
      setError("Failed to mark notification as read.");
    }
  };

  return (
    <div>
      <h2>Notifications</h2>

      {error && <p>{error}</p>}

      {Array.isArray(notifications) && notifications.length > 0 ? (
        <table>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              {notification.message}
              <button onClick={() => markAsRead(notification.id)}>
                <img src={CheckIcon} alt="Check-icon" width="16px"></img>
              </button>
            </tr>
          ))}
        </table>
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default Notifications;
