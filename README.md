# E-Commerce Platform

A futuristic, full-stack MERN e-commerce application built from the ground up. This platform features a complete shopping experience, from browsing products to secure checkout, along with a dedicated admin dashboard for managing the store.

---

## Key Features

### User Features:
- **Full Product Browsing:** View a list of all available products.
- **Detailed Product View:** Click on any product to see its full details, description, and price.
- **Shopping Cart:** Add products to a cart, adjust quantities, and remove items. The cart state is persisted in local storage.
- **Secure Checkout:** Fully integrated with the Stripe API for secure and seamless payment processing.
- **User Authentication:** Users can register for a new account or log in with existing credentials. Passwords are encrypted and sessions are managed with JSON Web Tokens (JWT).
- **Order History:** Logged-in users can view their past orders in their profile screen.

### Admin Features:
- **Protected Routes:** The admin dashboard is only accessible to users with admin privileges.
- **Product Management (CRUD):** Admins can create new products, update existing product details (name, price, stock, etc.), and delete products from the store.
- **Order Management:** Admins can view a list of all orders placed by all users.
- **Mark as Delivered:** Admins can update an order's status to "Delivered," which is reflected in the user's order history.

---

## Tech Stack

### Frontend
- **React.js:** For building the user interface.
- **Redux Toolkit:** For robust and predictable state management.
- **React Router:** For client-side routing.
- **Axios:** For making HTTP requests to the backend API.
- **Stripe.js / React Stripe.js:** For secure payment integration.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for building the RESTful API.
- **MongoDB:** NoSQL database for storing product, user, and order data.
- **Mongoose:** Object Data Modeling (ODM) library to interact with MongoDB.
- **Stripe API:** For processing payments on the server-side.
- **JSON Web Tokens (JWT):** For secure user authentication.
- **bcrypt.js:** For hashing user passwords.

### Deployment
- **Frontend:** Netlify
- **Backend:** (Not hosted yet !!)

---

## Getting Started (Local Setup)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js & npm (or yarn)
- MongoDB (A local instance or a free MongoDB Atlas cluster)
- Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/your-repository-name.git
    cd mern-ecommerce-platform
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend folder
    cd backend

    # Install dependencies
    npm install

    # Create a .env file in the /backend folder (see Environment Variables section below)

    # Run the database seeder to add sample products
    npm run data:import
    ```

3.  **Setup the Frontend:**
    ```bash
    # Navigate to the frontend folder from the root directory
    cd ../frontend

    # Install dependencies
    npm install

    # Create a .env file in the /frontend folder (see Environment Variables section below)
    ```

4.  **Run the Application:**
    - Run the backend server from the `/backend` directory: `npm run dev`
    - Run the frontend server from the `/frontend` directory: `npm start`

The application will be available at `http://localhost:3000`.

---

## Environment Variables

To run this project, you will need to create `.env` files in both the `backend` and `frontend` directories.

#### Backend (`/backend/.env`)
