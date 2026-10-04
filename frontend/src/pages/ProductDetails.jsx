import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      setProduct(response.data);
    } catch (error) {
      setMessage("Unable to load product");
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          productId: product.id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to add product to cart"
      );
    }
  };

  if (message === "Unable to load product") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {message}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <Link
        to="/dashboard"
        className="btn btn-secondary mb-4"
      >
        ← Back to Products
      </Link>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
            style={{
              width: "100%",
              maxHeight: "450px",
              objectFit: "cover"
            }}
          />
        </div>

        <div className="col-md-6">
          <h1>{product.name}</h1>

          <p className="text-muted">
            Category: {product.category}
          </p>

          <h3 className="mt-3">
            ₹{product.price}
          </h3>

          <p className="mt-3">
            {product.description}
          </p>

          <p>
            <strong>Available Stock:</strong>{" "}
            {product.stock}
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={addToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;