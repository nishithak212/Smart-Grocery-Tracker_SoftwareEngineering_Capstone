import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";
import CheckIcon from "../../assets/icons/check-solid.svg";
import "../NotificationsPage/NotificationsPage.scss"

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  
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

       // console.log("API Response:", response.data);

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
    useEffect(() => {
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
      fetchNotifications();
      //Update UI to remove the read notification
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    
    } catch (error) {
      console.error("Error marking notification as read: ", error);
      setError("Failed to mark notification as read.");
    }
  };

  //Mark all notifications as read
  const markAllAsRead = async() => {
    try{
      await axios.put(
        `${API_URL}/notifications/mark-all-read`,
        {},
        {
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user_id}`,
          },
        }
      );

      setNotifications([]);
    } catch(error){
      console.error("Error marking all as read:", error );
      setError("Failed to mark all notifications as read");
    }
  };

  return (
    <div className="notifications-list">
      {/* <h2>Notifications</h2> */}

      {error && <p className="notifications-list__error">{error}</p>}

{notifications.length > 0 && (
  <div className="notifications-list__actions">
    <button className="mark-all-btn" onClick={markAllAsRead}>
      Mark All Read
    </button>
    </div>
)}
      {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="notification-card" key={notification.id}>
            <p className="notification-card__message">{notification.message}</p>
              <button
              className="notification-card__button" onClick={() => markAsRead(notification.id)}>
                <img 
                src={CheckIcon} alt="Check-icon" width="16px">

                </img>

              </button>
              </div>
          ))
      ) : (
        <p className="notifications-list__empty">No new notifications</p>
      )}
    </div>
  );
};

export default Notifications;
