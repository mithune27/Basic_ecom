import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      setProducts(response.data);
    } catch (error) {
      setMessage("Unable to load products");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>

        <div>
          <Link
            to="/cart"
            className="btn btn-success me-2"
          >
            🛒 Cart
          </Link>

          <button
            className="btn btn-outline-danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      <div className="row">
        {products.map((product) => (
          <div
            className="col-md-4 mb-4"
            key={product.id}
          >
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{
                  height: "220px",
                  objectFit: "cover"
                }}
              />

              <div className="card-body">
                <h5 className="card-title">
                  {product.name}
                </h5>

                <p className="card-text">
                  {product.description}
                </p>

                <h5>₹{product.price}</h5>

                <p className="text-muted">
                  Stock: {product.stock}
                </p>

                <Link
                  to={`/products/${product.id}`}
                  className="btn btn-primary"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;