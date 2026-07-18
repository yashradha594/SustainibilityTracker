import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);
const login = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true } // ✅ important for cookies/JWT
    );

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Login failed",
    };
  }
};
  const register = async (name, email, password) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      { name, email, password },
      { withCredentials: true } // ✅ important
    );

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Registration failed",
    };
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
