import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load orders"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Orders</h2>

        <Link
          to="/admin"
          className="btn btn-secondary"
        >
          Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found.
        </div>
      ) : (
        orders.map((order) => (
          <div
            className="card mb-4"
            key={order.id}
          >
            <div className="card-header d-flex justify-content-between">
              <strong>
                Order #{order.id}
              </strong>

              <span className="badge bg-success">
                {order.status}
              </span>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customer_name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.email}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.address}
                  </p>
                </div>

                <div className="col-md-6">
                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.payment_method}
                  </p>

                  <p>
                    <strong>Order Date:</strong>{" "}
                    {order.created_at}
                  </p>

                  <p>
                    <strong>Total:</strong>{" "}
                    ₹{order.total_amount}
                  </p>
                </div>
              </div>

              <hr />

              <h5>Ordered Products</h5>

              {order.items.map((item) => (
                <div
                  className="d-flex justify-content-between mb-2"
                  key={item.product_id}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;