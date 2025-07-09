import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("No token provided. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setUpdatedProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setUpdatedProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setSuccess("");
    setError("");
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put("http://localhost:3001/api/auth/profile", updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setUpdatedProfile(response.data);
      setEditMode(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log(refreshToken);
      if (refreshToken) {
        await axios.post("http://localhost:3001/api/auth/logout", { refreshToken });
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  if (!profile) {
    return <p>Loading your profile...</p>;
  }

  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      <div>
        <label>
          Name:{" "}
          {editMode ? (
            <input
              type="text"
              name="name"
              value={updatedProfile.name}
              onChange={handleInputChange}
            />
          ) : (
            profile.name
          )}
        </label>
      </div>
      <div>
        <label>
          Email:{" "}
          {editMode ? (
            <input
              type="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
            />
          ) : (
            profile.email
          )}
        </label>
      </div>
      <div>
        <label>
          Phone:{" "}
          {editMode ? (
            <input
              type="text"
              name="phone"
              value={updatedProfile.phone || ""}
              onChange={handleInputChange}
            />
          ) : (
            profile.phone || "Not provided"
          )}
        </label>
      </div>
      <div>
        <h3>Address:</h3>
        <label>
          Street:{" "}
          {editMode ? (
            <input
              type="text"
              name="address.street"
              value={updatedProfile.address?.street || ""}
              onChange={handleInputChange}
            />
          ) : (
            profile.address?.street || "Not provided"
          )}
        </label>
        <br />
        <label>
          City:{" "}
          {editMode ? (
            <input
              type="text"
              name="address.city"
              value={updatedProfile.address?.city || ""}
              onChange={handleInputChange}
            />
          ) : (
            profile.address?.city || "Not provided"
          )}
        </label>
        <br />
        <label>
          Zip Code:{" "}
          {editMode ? (
            <input
              type="text"
              name="address.zipCode"
              value={updatedProfile.address?.zipCode || ""}
              onChange={handleInputChange}
            />
          ) : (
            profile.address?.zipCode || "Not provided"
          )}
        </label>
        <br />
        <label>
          Country:{" "}
          {editMode ? (
            <input
              type="text"
              name="address.country"
              value={updatedProfile.address?.country || ""}
              onChange={handleInputChange}
            />
          ) : (
            profile.address?.country || "Not provided"
          )}
        </label>
      </div>
      {editMode ? (
        <button onClick={handleSaveChanges} style={{ margin: "10px" }}>
          Save Changes
        </button>
      ) : (
        <button onClick={handleEditToggle} style={{ margin: "10px" }}>
          Edit Profile
        </button>
      )}
      <br></br>
      <Link to="/order-history">
      <button
        style={{ marginTop: "20px", padding: "10px 20px", margin:"20px" }}
      >
        Orded History
      </button>
      <br></br>
      </Link>
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 20px", margin:"20px" }}
      >
        Logout
      </button>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Profile;
