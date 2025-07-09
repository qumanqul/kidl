import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [editingItem, setEditingItem] = useState(null); 
  const [addingItem, setAddingItem] = useState(false); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3001/api/admin/users"),
        axios.get("http://localhost:3001/api/admin/products"),
        axios.get("http://localhost:3001/api/admin/orders"),
      ]);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/${type}/${id}`);
      fetchData(); 
    } catch (err) {
      setError(`Failed to delete ${type.slice(0, -1)}`);
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
  };

  const handleUpdate = async (values) => {
    try {
      const { type, _id, ...rest } = values;
      await axios.put(`http://localhost:3001/api/admin/${type}/${_id}`, rest);
      setEditingItem(null);
      fetchData(); 
    } catch (err) {
      setError(`Failed to update`);
    }
  };

  const handleAdd = async (values, type) => {
    try {
      await axios.post(`http://localhost:3001/api/admin/${type}`, values);
      setAddingItem(false); 
      fetchData(); 
    } catch (err) {
      setError(`Failed to add ${type.slice(0, -1)}`);
    }
  };

  const UserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.number().required("Role is required"),
  });

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number().required("Price is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    stock: Yup.number().required("Stock is required"),
  });

  const OrderSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
  });

  const renderForm = (type, initialValues, validationSchema, onSubmit) => (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-2">
          {Object.keys(initialValues).map((field) => (
            field !== "type" && field !== "_id" && ( // Skip "type" and "_id" in the form
              <div key={field}>
                <label className="font-bold">{field}:</label>
                <Field name={field} className="border p-2 rounded" />
                {errors[field] && touched[field] && (
                  <div className="text-red-500 text-sm">{errors[field]}</div>
                )}
              </div>
            )
          ))}
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-2">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded ${activeTab === "products" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Orders
        </button>
      </div>

      {editingItem && (
        <div className="p-4 bg-gray-100 rounded shadow-md mb-4">
          <h3 className="font-bold text-lg mb-2">Edit {editingItem.type}</h3>
          {renderForm(
            editingItem.type,
            editingItem,
            editingItem.type === "users" ? UserSchema : editingItem.type === "products" ? ProductSchema : OrderSchema,
            handleUpdate
          )}
          <button onClick={() => setEditingItem(null)} className="mt-2 text-red-500 underline">
            Cancel
          </button>
        </div>
      )}

      {addingItem && (
        <div className="p-4 bg-gray-100 rounded shadow-md mb-4">
          <h3 className="font-bold text-lg mb-2">Add {activeTab}</h3>
          {renderForm(
            activeTab,
            activeTab === "users"
              ? { name: "", email: "",password:"", role: 0,phone:"" }
              : activeTab === "products"
              ? { name: "", price: "", description: "", category: "", stock: 0 }
              : { status: "" },
            activeTab === "users" ? UserSchema : activeTab === "products" ? ProductSchema : OrderSchema,
            (values) => handleAdd(values, activeTab)
          )}
          <button onClick={() => setAddingItem(false)} className="mt-2 text-red-500 underline">
            Cancel
          </button>
        </div>
      )}

      {!editingItem && !addingItem && (
        <button
          onClick={() => setAddingItem(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add {activeTab.slice(0, -1)}
        </button>
      )}

      {activeTab === "users" && (
        <>
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role === 0 ? "User" : "Admin"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user, "users")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("users", user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "products" && (
        <>
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product, "products")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("products", product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "orders" && (
        <>
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(order, "orders")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("orders", order._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminPage;