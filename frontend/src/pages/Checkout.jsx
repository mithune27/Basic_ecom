import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    phone: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const placeOrder = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        `Order placed successfully!\nOrder ID: ${response.data.orderId}`
      );

      navigate("/orders");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          Your cart is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Checkout</h2>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">
                Customer Details
              </h4>

              <form onSubmit={placeOrder}>
                <div className="mb-3">
                  <label className="form-label">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    className="form-control"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Address
                  </label>

                  <textarea
                    name="address"
                    className="form-control"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Payment Method
                  </label>

                  <div className="form-control bg-light">
                    Cash on Delivery
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <h4>Order Summary</h4>

              <hr />

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-3"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total</strong>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;