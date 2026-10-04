import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);

      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: ""
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to add product"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>

        <div>
          <Link
            to="/admin/customers"
            className="btn btn-info me-2"
          >
            View Customers
          </Link>
          <Link
  to="/admin/orders"
  className="btn btn-warning me-2"
>
  View Orders
</Link>

          <button
            className="btn btn-outline-danger"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h4 className="mb-4">
            Add New Product
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Category
              </label>

              <input
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;