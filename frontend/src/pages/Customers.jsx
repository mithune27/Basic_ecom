import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCustomers(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load customers"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customers</h2>

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

      {customers.length === 0 ? (
        <div className="alert alert-info">
          No customers found.
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;