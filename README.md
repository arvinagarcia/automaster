<h1 align="center">
  <img src="public/static/logo.svg" width="50px" align="center">
  <br>
  Automaster
</h1>

<h4 align="center">An AI-powered e-commerce platform for car accessories.</h4>

<div align="center">

  ![Express.js](https://img.shields.io/badge/Express.js-4.21.2-red)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.13.1-blue)
  ![EJS](https://img.shields.io/badge/EJS-3.1.10-yellow)
  ![Passport.js](https://img.shields.io/badge/Passport.js-0.7.0-green)
  ![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-0.21.0-purple)
  
</div>

## 🌟 Show Your Support

If you find **Automaster** useful, please consider **starring** ⭐ the repository on GitHub!  
Your support helps improve the project and lets others discover it.  

---

## 🚀 Features
✅ **User Authentication** – Secure login & registration with **Passport.js** and **bcrypt**.  
✅ **Product Management** – Browse & view detailed product descriptions.  
✅ **Cart System** – Add, update, and remove items from the cart.  
✅ **AI-Powered Recommendations** – Uses **Google Gemini API** to suggest related products.  
✅ **PostgreSQL Database** – Stores users, products, and cart data.  

---

## 📌 Prerequisites  
Ensure you have the following installed:  
- **[Node.js](https://nodejs.org/)** (LTS recommended)  
- **[PostgreSQL](https://www.postgresql.org/)** (Database setup)  
- **[Google Gemini API Key](https://ai.google.dev/)** (AI recommendation)  

---

## 📥 Installation  

Clone the repository and install dependencies:  
```sh
# 1️⃣ Clone the repository
git clone https://github.com/arvinagarcia/automaster.git

# 2️⃣ Navigate into the project directory
cd automaster

# 3️⃣ Install dependencies
npm install
```
## 🛠️ Setting Up the Database

Open PostgreSQL and create the database:
```sql
-- Create the database
CREATE DATABASE database_name;

-- Connect to the database
\c database_name

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_path TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Create carts table
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create cart_items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);
```

## 🔑 Setting Up Environment Variables
Create a ```.env``` file in the root directory:
```sh
touch .env
```
🔽 Inside ```.env```, add the following:
```ini
DB_USER=your_username_here
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=your_database_port_here
DB_DATABASE=your_database_name_here
GEMINI_API_KEY=your_api_key_here
```

## 🚀 Running the Application
```sh
# Start the server normally
npm start

# OR start in development mode (with automatic reload)
npm run dev
```
## 👤 User Authentication
✍ **Register** – Visit the register page to create an account.<br>
👉 **Login** – Go to the login page to access your dashboard.<br>
👈 **Logout** – Click log out in the profile side bar.<br>

## 🛒 Managing Your Cart
➕ **Add to Cart** – Click "Add To Cart" on a product page.<br>
✏️ **Modify Cart** – Increase, decrease, or remove items.<br>
💳 **Checkout** – Proceed to checkout when your cart is ready.<br>

## 🤖 AI Recommendations
The app analyzes your cart items and recommends a complementary product using Google Gemini AI.

## 📜 License
This project is licensed under the MIT License.<br>
See the [LICENSE](LICENSE) file for details.

## ✨ Credits
Made with ❤️ by **[Arvin Garcia](https://github.com/arvinagarcia)**.<br>
Images downloaded from **[PixelSquid](https://www.pixelsquid.com/)** 🦑.