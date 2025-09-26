import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { logoutUser } from "../../api/auth";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
    dispatch(logout());
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to ERP System</h1>
      {user ? (
        <div className="mt-4">
          <p className="text-lg">Hello, {user.name || user.email} 👋</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="mt-4">Please login or signup to continue.</p>
      )}
    </div>
  );
};

export default Home;
