import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "../../redux/authSlice";
import { updateUser, logoutUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(formData);
      dispatch(setUser(updatedUser.user || updatedUser));
      setMessage("✅ Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setMessage("❌ Update failed. Try again.");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) {
    return <p className="p-8">Please login first.</p>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </div>

      {/* Avatar + Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold">{user?.username}</p>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Success/Error message */}
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      {/* Edit/View toggle */}
      {!isEditing ? (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg font-medium">{user?.username}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
