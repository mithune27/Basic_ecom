import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCartItems(response.data);
    } catch (error) {
      setMessage("Unable to load cart");
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Cart</h2>

        <Link
          to="/dashboard"
          className="btn btn-secondary"
        >
          Continue Shopping
        </Link>
      </div>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center mt-5">
          <h4>Your cart is empty</h4>

          <Link
            to="/dashboard"
            className="btn btn-primary mt-3"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              className="card mb-3"
              key={item.id}
            >
              <div className="card-body">
                <div className="row align-items-center">

                  <div className="col-md-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded"
                    />
                  </div>

                  <div className="col-md-4">
                    <h5>{item.name}</h5>

                    <p className="text-muted mb-0">
                      ₹{item.price} each
                    </p>
                  </div>

                  <div className="col-md-2">
                    <strong>
                      Quantity: {item.quantity}
                    </strong>
                  </div>

                  <div className="col-md-2">
                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>

                </div>
              </div>
            </div>
          ))}

          <div className="card mt-4">
            <div className="card-body text-end">
              <h4>
                Total: ₹{totalAmount}
              </h4>

              <Link
                to="/checkout"
                className="btn btn-success mt-2"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;