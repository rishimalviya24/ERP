import axiosInstance from "../utils/axiosInstance";

export const createUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", formData);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};

export const logoutUser = async (formData) => {
  const { data } = await axiosInstance.get("/auth/logout", formData);
  return data;
};

export const updateUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/update", formData);
  return data;
};

// Reset Password
export const ResetPassword = async (token, formData) => {
  const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, formData);
  return data;
};


export const ForgotPassword = async (formData) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", formData);
  return data;
};
