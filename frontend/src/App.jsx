import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Customers from "./pages/Customers";
import AdminOrders from "./pages/AdminOrders";
function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-dark bg-dark px-4">
        <Link
          to="/"
          className="navbar-brand"
        >
          ShopEasy
        </Link>

        <div>
          <Link
            to="/login"
            className="btn btn-outline-light me-2"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-primary"
          >
            Register
          </Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/dashboard"
  element={<Dashboard />}
/>
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
  path="/cart"
  element={<Cart />}
/>
<Route
  path="/checkout"
  element={<Checkout />}
/>
<Route
  path="/orders"
  element={<Orders />}
/>
<Route
  path="/admin"
  element={<AdminDashboard />}
/>
<Route
  path="/admin/customers"
  element={<Customers />}
/>
<Route
  path="/admin/orders"
  element={<AdminOrders />}
/>
        <Route
          path="/"
          element={
            <div className="container mt-5">
              <h1>Welcome to ShopEasy</h1>
              <p>Online shopping made simple.</p>
            </div>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;