import React, { useState } from "react";
import axios from "axios";

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchUsers = async () => {
    if (!visible) {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/getNewUser");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    setVisible(!visible);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User List</h2>
      <button
        onClick={fetchUsers}
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "20px",
          backgroundColor: "green",
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
        }}
      >
        {visible ? "Hide Users" : "Display Users"}
      </button>

      {loading && <p>Loading users...</p>}

      {visible && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                width: "300px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>
                {user.fname} {user.lname}
              </h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>State:</strong> {user.state}</p>
              <p><strong>Role:</strong> {user.role === 0 ? "User" : "Admin"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCards;
