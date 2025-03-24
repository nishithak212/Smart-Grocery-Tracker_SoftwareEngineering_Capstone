# Project Title
GroceryGenie - Smart Grocery Tracker

## Overview
GroceryGenie is a web application designed to help users efficiently track their grocery invetory.
Unlike traditional grocery list apps, this system automates inventory tracking by notifying users when items
are running low or have run out, and it automatically generates shopping lists based on real-time stock levels.

By reducing food waste and imporving shopping efficiency, this app provides a smarter alternative to manual tracking
methods, helping busy individuals and families stay organized effortlessly.

### Problem Space
Many people struggle with keeping track of their groceries, leading to food waste and missed essentials.

According to a study conducted by Second Harvest, over 46% of all food in Canada is wasted every year.
41% of this is avoidable with a value of $58 billion.
Source:https://www.secondharvest.ca/post/new-report-from-second-harvest-reveals-canadas-58-billion-food-waste-problem

Existing solutions rely on manual list-making or lack of automation, making grocery tracking inefficient.
GroceryGenie solves this by providing real-time inventory management, automated in-app alerts, and automatic shopping list generation-- helping users save time, money and reduce waste.

### User Profile

Targeted Users:
Busy individuals, families, and anyone who wants to manage their pantry efficiently

Usage:
--> Users cans add groceries upon purchase, track usage patterns, and recieve alerts when stock is out of stock, running low, expired, close to expiry. 
--> The system automatically generates a shopping list based on items that need restock based on status => out of stock , low, expired
--> Users can categorize, search and organize groceries efficiently.



### Features
1. Automated Grocery Tracking:
i. Add, updated, and remove groceries in a structured inventory.
ii. Categorize groceries (e.g., dairy., vegetables, snacks) for better organization.

2. Smart Low-Stock Alerts:
In-App alerts/notifications when items are out of stock, running low or have run out or expired.

3. Auto-Generated  Shopping Lists
i. Instantly generate a custom shoppong list based on out of stock, low and expired  items.
ii. Saves time by elimination manual list-making.

4. Search
i. Easily find specific items in your inventory using the search feature
ii. Sort grocery items table using sort feature enabled item name, quanity, unit, category, expiry date and status

5. Mutli-Device Access
Responsive design to work on  mobile, tablet and desktop devices.

6.Use of cron-job: 
Scans grcoery items list and generates shopping list and adds notifications. Cron job is currently set to run every minute for testing purposes

## Implementation

### Tech Stack
Frontend: React.js, JavaScript, HTML, CSS (Flexbox for layout)
Backend: Node.js, Express.js
Database: MySQL
Client Libraries/Tools: 
    -React Router
    -Axios
    -dotenv
    -sass
Server Libraries/Tools:
    -bcrypt
    -cors
    -dotenv
    -express
    -express-session
    -knex
    -mysql2
    -node-cron 

### APIs

No external APIs will be used. All APIs will be custom built.



### Sitemap

1. Login Page
2. Sign-up Page
3. Grocery Items Page : User can add, edit grocery item. 
4. Shopping List Page: Shopping tracker with list of items need to restock based on status.
5. Notifications Page: Displays alerts for items running low , out of stock , close to expiry and expired items


### Mockups
Please refer to mockups folder

### Data

Database: grocery_tracker : Please refer to SQL_diagram in mockups folder
Table 1: users
Table 2: grocery_items
Table 3: alerts
![alt text](image.png)

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

**Authentication API:**
i. POST api/users/register --> User registration

request body: 
{
    "first_name":"userfirst",
    "last_name":"userlast",
    "username":"tester",
    "password":"123"
}

response body:
HTTP 200 OK:
{
    "id": 7,
    "first_name": "userfirst",
    "last_name": "userlast",
    "username": "tester",
    "created_at": "2025-03-24T02:20:10.000Z"

}

HTTP 400 Bad Request: If the request does not meet requirements 
{
    "error": "All fields are required"
}

ii. POST api/users/login --> User login

request body:
{
    "username":"test",
    "password":"123"
}

response body:

HTTP 200 OK:
{
    "message": "User logged in successfully",
    "user_id": 3,
    "username": "Test"
}

HTTP 401 Unauthorized: 
{
    "error": "Denied: Credentials do not match"
}

iii. Logout is handled in frontend in NavBar component

**Grocery Tracker API:**
i. POST api/grocery/add --> Add new grocery items
request headers:
headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
request body:
{
    id:1,
    item_name: Apples,
    qty: 6,
    unit: ct,
    category: fruits,
    status: available,
    expiration_date: 2025-03-31,
    threshold_qty: 2,
    threshold_alert: 2025-03-29
}

response body:

HTTP 200 OK
{
     id:1,
     user_id:1,
    item_name: Apples,
    qty: 6 ct,
    category: Fruits,
    status: Available,
    expiration_date: N/A
    threshold_qty:2,
    threshold_alert: date/timestamp,
    added_at: timestamp
}

HTTP 400: Bad request

ii. GET api/grocery --> Get all grocery items

Request headers:
headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
response body: HTTP 200 OK
[
    {
        id:1,
        user_id:1,
        item_name:Apples,
        quanity: 6ct,
        category: fruits, 
        expiration_date:N/A,
        status: available,
        threshold_qty:1,
        threshold_alert: date/timestamp,
        added_at:timestamp
    },

    {
        id:2,
        user_id:1,
        item_name:Eggs,
        quantity: 5 ct,
        expiration_date: 15 Mar 2025,
        status: low,
        threshold_qty:1,
        threshold_alert: date/timestamp,
        added_at: timestamp
    },

    {
    ...,
    },

]


iii. PUT api/grocery/:id --> Update grocery item quantity

request headers:
headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }

request body:
{
        "item_name": "Bread",
        "quantity": 4,
        "unit": "ct",
        "category": "Baked Goods",
        "expiration_date": "2025-04-11",
        "status": "available",
        "threshold_qty": 2,
        "threshold_alert": "2025-04-08"
 }

response body:

HTTP 201 Created
{
    "message": "Grocery item updated successfully"
}

HTTP 400: Bad request (If any of the mandatory fields are empty)

iv. DELETE api/grocery/:id --> 
request headers:
headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
request body:
 {
        "id": 9,
        "item_name": "Bread",
        "quantity": 0,
        "unit": "ct",
        "category": "Baked Goods",
        "expiration_date": "2025-10-04",
        "status": "out of stock",
        "threshold_qty": 1,
        "threshold_alert": "2025-10-02",
    }

response body: 204 No Content


**Shopping List API**
i. GET api/shopping-list --> Generate a shopping list for out of stock, low stock and expired items
request headers:
headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }

response body: 
HTTP 200 OK
[
    {
        "id": 10,
        "user_id": 3,
        "item_name": "Bread",
        "quantity": 1,
        "unit": "ct",
        "status": "low",
        "category": "Baked Goods",
        "created_at": "2025-03-24T02:40:02.876Z"
    },
    {
        "id": 11,
        "user_id": 3,
        "item_name": "Bread",
        "quantity": 1,
        "unit": "ct",
        "status": "low",
        "category": "Baked Goods",
        "created_at": "2025-03-24T02:40:02.877Z"
    },
    {
        "id": 13,
        "user_id": 3,
        "item_name": "Milk",
        "quantity": 1,
        "unit": "ct",
        "status": "low",
        "category": "Dairy",
        "created_at": "2025-03-24T02:40:02.877Z"
    },
    {
        "id": 12,
        "user_id": 3,
        "item_name": "Bread",
        "quantity": 0,
        "unit": "ct",
        "status": "out of stock",
        "category": "Baked Goods",
        "created_at": "2025-03-24T02:40:02.877Z"
    }
]



ii. Delete api/shopping-list/:id -single item from shopping list: 
request headers:
headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
Request body:

  {
        "item_name": "Bread",
        "quantity": 1,
        "unit": "ct",
        "status": "low",
        "category": "Baked Goods"
    
    }

Response: 204 No Content



**Notifications**
i. GET /api/notificaitons --> Get items that are running low or finished
request headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
response body: HTTP 200 OK
[
    {
        "id": 5,
        "user_id": 3,
        "status": "out of stock",
        "alert_date": "2025-03-23T21:24:00.000Z",
        "message": "Bread : Out-of-Stock",
        "is_read": 0,
        "item_name": "Bread"
    }
]

ii. PUT /api/notificaitons/mark-read/:id --> Mark a single notification as read
Request headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
Request body: 
 {
        "item_name": "Bread",
        "unit": "ct",
        "status": "low",
        "category": "Baked Goods",
        "is_read": 1
    
    }

Response body: 
{
    "message": "Notification marked as read"
}

iii. PUT /api/notifications/mark-all-read
Request headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_id}`,
          }
Request body:
[
  {
        "item_name": "Bread",
        "unit": "ct",
        "status": "low",
        "category": "Baked Goods",
        "is_read": 0
    
    }
{
    ...
    
}
    
]

Response Body: 
{
    "message": "All notifications marked as read"
}


Custom APIs (to be built):

Authentication API:
i. POST api/users/register --> User registration
ii.POST api/users/login --> User login

Grocery Tracker API
i. POST api/grocery/add --> Add new grocery items
ii. GET api/grocery --> Get all grocery items
iii. PUT api/grocery/update/:id --> Update grocery item quantity
iv. DELETE api/grocery/:id --> Delete a single item


Shopping List API
i. GET api/shopping-list --> Generate a shopping list for out of stock, low stock items or expired items
ii. DELETE api/shopping-list/:id --> Delete a single item from the list. This request also deletes item from the grocery list page

Notifications API
i. GET api/notifications --> Get items that are out of stock, running low, close to expiry or expired
ii. PUT api/notifications/mark-read/:id --> Mark a single notification as read 
iii. PUT api/notifications/mark-all-read --> Mark all notifications as read


## Roadmap

Sprint 1:
1. Setup Database
2. Build backed API (routes, controllers, index.js)
3. Gather assets (typography,images,icons, colors)
4. Setup basic routes in React

Sprint 2:
1. Setup Frontend - pages, components, app.jsx
2. Connect backend API to frontend
3. Styling and Visual Design

Testing and Bug fixes: 21 Mar 2025 - 22 Mar 2025
Capstone Project Submission: 23 Mar 2025

---

## Future Implementations
1. Integrate meal planning/recipie generation using external APIs.
2. Email notifications for low stock items (send list of low-stock items in a document at a time based on user preference).
3. Barcode snanner for adding groceries quickly.
4. Shared Family Accounts for collaborative grocery tracking.
5. Integration with online grocery delivery services.
6. Forgot Password functionality
7. Make password visible
8. User Preferences page to set up alerts time
9. Count of notifications to be displayed in notifications tab in navbar


Backend setup instructions:
1. Create a database called grocery_tracker in your local
2. Run npm install on the root directory of backend repo
3. Create .env file (instructions provided in .env-example file)
4. Run database migrations => npx knex migrate:latest
5. Run database seeds => npx knex seed:run
6. Start the server: npm run dev


Frontend setup instructions
1. Run npm install on the root directory of frontend repo
2. Create a .env file to add VITE_API_URL
3. Start the front end server



