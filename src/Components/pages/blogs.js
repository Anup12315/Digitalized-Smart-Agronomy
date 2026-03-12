
import React, { useState, useEffect } from "react";
import Header from "../dashboard/header";
import Footer from "../dashboard/footer";
import axios from "axios";
import UserCards from "./getusers";

function Blogs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]); // Default to an empty array to prevent `undefined` errors
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    amount: "",
  });

  // Fetch products from the database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/getproduct");
        setProducts(response.data); // Ensure `products` is an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/addNewProduct", form);
      setProducts([...products, response.data]);
      setForm({
        productName: "",
        productDescription: "",
        amount: "",
      });
      closeModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Send DELETE request to the backend to delete the product
      const response = await axios.delete(`http://localhost:8080/api/DeleteProduct/${productId}`);

      // If successful, remove the product from the state
      if (response.status === 200) {
        setProducts(products.filter((product) => product._id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting the product. Please try again.");
    }
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
    border: "none",
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "20px", marginTop: "200px", marginBottom: "60px" }}>
        <h1>Product Management</h1>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#4CAF50",
            marginBottom: "20px",
          }}
          onClick={openModal}
        >
          Add Product
        </button>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                  width: "200px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ margin: "10px 0" }}>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Amount: ${product.amount}</p>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#f44336",
                    marginTop: "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No products available. Please add a product.</p>
          )}
        </div>

        {isModalOpen && (
          <>
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                zIndex: 1001,
                width: "300px",
              }}
            >
              <h2>Add Product</h2>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Name:
                <input
                  type="text"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: "5px",
                    padding: "5px",
                  }}
                />
              </label>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Description:
                <textarea
                  name="productDescription"
                  value={form.productDescription}
                  onChange={handleChange}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "60px",
                    marginTop: "5px",
                    padding: "5px",
                  }}
                />
              </label>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: "5px",
                    padding: "5px",
                  }}
                />
              </label>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={handleAddProduct}
                  style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
                >
                  Add
                </button>
                <button
                  onClick={closeModal}
                  style={{ ...buttonStyle, backgroundColor: "gray" }}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              }}
              onClick={closeModal}
            />
          </>
        )}
      </div>
      <UserCards />
      <Footer />
    </div>
  );
}

export default Blogs;
