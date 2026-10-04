import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);
    } catch (error) {
      setMessage("Unable to load orders");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>

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

      {orders.length === 0 ? (
        <div className="alert alert-info">
          You have not placed any orders yet.
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
              <p>
                <strong>Name:</strong>{" "}
                {order.customer_name}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {order.address}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {order.phone}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {order.payment_method}
              </p>

              <hr />

              <h5>Products</h5>

              {order.items.map((item) => (
                <div
                  className="d-flex align-items-center mb-3"
                  key={item.product_id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover"
                    }}
                    className="rounded me-3"
                  />

                  <div>
                    <strong>{item.name}</strong>

                    <p className="mb-0 text-muted">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mb-0">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>
              ))}

              <hr />

              <div className="text-end">
                <h5>
                  Total: ₹{order.total_amount}
                </h5>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;