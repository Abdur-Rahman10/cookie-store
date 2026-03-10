# 🍪 R's Cookie Store

> A responsive, full-stack e-commerce storefront built with Node.js, Express, EJS, and Vanilla JavaScript.

## 🌐 Live Demo
[View Live Site Here](https://r-cookie-store.onrender.com/)

## 📖 About The Project
This project simulates a modern online bakery. Originally starting as a static front-end page, it has been completely architected into a full-stack application. It demonstrates strict separation of concerns, application state management via `localStorage`, and real-world backend business logic to prevent front-end manipulation.

### ✨ Key Features
* **🔒 Secure Server-Side Checkout:** The front-end never dictates the final price. Cart data is sent to the Express backend via a `fetch` POST request, where the server cross-references a secure database to recalculate subtotals, apply discounts, and issue a verified receipt.
* **📍 Geofenced Delivery Logic:** Features a dynamic delivery engine based on user PIN codes. Calculates local Bengaluru city delivery (PINs 560001-560111), out-of-station delivery, and automatically waives fees for orders over ₹500.
* **🎟️ Dynamic Discount Engine:** Evaluates percentage-based (`WELCOME10`) and flat-rate (`SWEET50`) coupons. Includes "ineligibility traps" that automatically revoke applied coupons if a user removes items and drops below the required minimum spend.
* **📱 Modern UI/UX:** Built with a fully responsive CSS Grid, featuring an off-canvas slide-out cart, temporary toast notifications, a dismissible promo banner (managed via `sessionStorage`), and a warm, color-theory-driven bakery theme.
* **🧠 State Management:** Utilizes browser `localStorage` to ensure the shopping cart persists across page reloads and browser sessions.

## 🛠️ Technologies Used
* **Backend:** Node.js, Express.js
* **Templating:** EJS (Embedded JavaScript)
* **Frontend:** HTML5, CSS3 (Flexbox/Grid, Animations)
* **Logic:** Vanilla JavaScript (ES6 Modules, Event Delegation, Async/Await Fetch API)

## 📂 Project Structure
* `server.js` - The Express application and secure `/checkout` API route.
* `data/cookies.js` - The backend ES module acting as the product database.
* `views/index.ejs` - The dynamic HTML template powered by EJS loops.
* `public/` - Static assets directory containing `script.js`, `styles.css`, and product images.

## 🚀 How to Run Locally
To view and interact with this project on your local machine:

1. Clone this repository:
   ```bash
   git clone [https://github.com/Abdur-Rahman10/cookie-store.git](https://github.com/Abdur-Rahman10/cookie-store.git)
Navigate to the project directory:

Bash```
cd cookie-store```

Install the required Node.js dependencies:
Bash```
npm install```

Start the Express server:
Bash```
node server.js```

Open your web browser and visit http://localhost:3000.

👨‍💻 Author: AbduR Rahman
🌐 GitHub: @Abdur-Rahman10
📧 Email: abdurrahman.2003.1030@gmail.com
