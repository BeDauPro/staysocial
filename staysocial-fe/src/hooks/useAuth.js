import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 

const useAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return { isAuthenticated: false };

  try {
    const decoded = jwtDecode(token);
    const username = decoded.name;
    const role = decoded.role;

    return {
      isAuthenticated: true,
      role: role,
      username: username,
    };
  } catch (error) {
    console.error("Invalid token", error);
    return { isAuthenticated: false };
  }
};

export default useAuth;
