// import React, { createContext, useState } from "react";
// import axios from "axios";
// import API_URL from "../api/api_urls";
// import * as SecureStore from 'expo-secure-store';
// const API = API_URL + "/api/v1/Login%20Buyer/buyer_login"
// console.log(API);


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
  
//   const [userToken, setUserToken] = useState(null); 

// const login = async (username, password, loginToken, navigation) => {
//   try {
//     const res = await axios.post(`${API}`, { username, password, loginToken });
//     const userInfo = res.data;

//     if (userInfo.error) {
//       return false;
//     }

//     setUserToken(userInfo.access_token);
//     await SecureStore.setItemAsync("buyer_token", userInfo.access_token);
//     await SecureStore.setItemAsync("refresh_token", userInfo.refresh_token); 
//     axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.access_token}`;

//     navigation.navigate("Home");

//     return true;
//   } catch (e) {
//     console.log("Login error:", e.response?.data || e.message);
//     return false;
//   }
// };


// const refreshAccessToken = async () => {
//   try {
//     const refreshToken = await SecureStore.getItemAsync("refresh_token");
//     if (!refreshToken) throw new Error("No refresh token");

//     const response = await axios.post(`${API_URL}/api/v1/Login Buyer/buyer_refresh`, null, {
//       headers: {
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     });

//     const newAccessToken = response.data.access_token;
//     setUserToken(newAccessToken);
//     await SecureStore.setItemAsync("buyer_token", newAccessToken);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
//     return newAccessToken;
//   } catch (error) {
//     console.log("Refresh failed:", error.response?.data || error.message);
//     logout();
//     return null;
//   }
// };



//   const customerRegister=(fName,lName,email,password,rePassword,RegisterToken)=>{
    
//     axios.post(`${API_URL}/api/v1/Register%20Buyer/buyer_register`,{
//       fName,lName ,email,password,rePassword,RegisterToken
//     }).then(res=>{
//       let registerInfo=res.data
//       return registerInfo
//     }).catch(e=>{
      
//       if (e.response) {
//         console.log("Server Response:", e.response.data); 
//       } else {
//         console.log("error find", e.message);
//       }

//     })
//   };

//  const pageload = async () => {
//       let token = await SecureStore.getItemAsync("buyer_token") ?? null;

//       if (!token || token === "null" || token === "undefined") {
//         setUserToken(null);
//         axios.defaults.headers.common["Authorization"] = "";
//         console.log("No token found, user is not logged in.");
//       } else {
//         setUserToken(token);
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         console.log("Token set, user logged in.");

//         if (!interceptorAttached) {
//           axios.interceptors.response.use(
//             res => res,
//             async err => {
//               const originalRequest = err.config;

//               if (err.response?.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;

//                 const newToken = await refreshAccessToken();

//                 if (newToken) {
//                   await SecureStore.setItemAsync("buyer_token", newToken);
//                   axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//                   originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//                   console.log("Token refreshed.");

//                   return axios(originalRequest);
//                 } else {
//                   // Refresh token failed, log out user
//                   setUserToken(null);
//                   await SecureStore.deleteItemAsync("buyer_token");
//                 }
//               }

//               return Promise.reject(err);
//             }
//           );
//           interceptorAttached = true; // Ensure interceptor only attaches once
//         }
//       }
//     };

//  const logout = () => {
//   SecureStore.deleteItemAsync("buyer_token");
//   SecureStore.deleteItemAsync("refresh_token");
//   axios.defaults.headers.common["Authorization"] = "";
//   setUserToken(null);

// };

//   const ProtectedNavigation = (screenName,navigation) => {
//   if (!userToken) {
//     navigation.navigate("CustomerLogin");
//   } else {
//     navigation.navigate(screenName);
//   }
//   };


//   const protectedAction = (navigation) => {
//     if (!userToken) {
//       navigation.navigate("CustomerLogin");
//     return false;
//     }
//     return true;
//   };

//   return (
//     <AuthContext.Provider value={{ customerRegister,login, logout,pageload,ProtectedNavigation,protectedAction, userToken }}> 
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import * as SecureStore from 'expo-secure-store';
import { Alert, ActivityIndicator, View } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await loadToken();
    };
    initializeAuth();

    const ejectInterceptor = attachInterceptor();
    return () => ejectInterceptor(); // Cleanup interceptor on unmount
  }, []);

  const loadToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("buyer_token");
      console.log('[Auth] Loaded token:', token);
      if (token) {
        setUserToken(token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('[Auth] Failed to load token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const attachInterceptor = () => {
    const interceptorId = axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('[Interceptor] Token expired. Attempting refresh...');
          originalRequest._retry = true;

          const refreshToken = await SecureStore.getItemAsync("refresh_token");
          if (!refreshToken) {
            console.log('[Interceptor] No refresh token found. Logging out.');
            await logout();
            Alert.alert("Session expired", "Please log in again.");
            return Promise.reject(error);
          }

          try {
            const refreshRes = await axiosInstance.post(`/api/v1/Login Buyer/buyer_refresh`, null, {
              headers: { Authorization: `Bearer ${refreshToken}` },
            });

            const newAccessToken = refreshRes.data.access_token;
            console.log('[Interceptor] Token refreshed:', newAccessToken);

            await SecureStore.setItemAsync("buyer_token", newAccessToken);
            setUserToken(newAccessToken);

            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest); // Retry original request
          } catch (refreshError) {
            console.log('[Interceptor] Refresh token failed:', refreshError.response?.data || refreshError.message);
            await logout();
            Alert.alert("Session expired", "Please log in again.");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptorId);
  };

  const login = async (username, password, loginToken, navigation) => {
    try {
      const res = await axiosInstance.post(`/api/v1/Login Buyer/buyer_login`, { username, password, loginToken });
      const info = res.data;

      await SecureStore.setItemAsync("buyer_token", info.access_token);
      await SecureStore.setItemAsync("refresh_token", info.refresh_token);

      setUserToken(info.access_token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${info.access_token}`;

      console.log('[Auth] Login success');
      navigation.navigate("Home");
    } catch (err) {
      console.log('[Auth] Login failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("buyer_token");
    await SecureStore.deleteItemAsync("refresh_token");
    setUserToken(null);
    delete axiosInstance.defaults.headers.common["Authorization"];
    console.log('[Auth] User logged out');
  };

  const ProtectedNavigation = (screenName, navigation) => {
    if (!userToken) {
      console.log("[Auth] No token, redirecting to Login");
      navigation.navigate("CustomerLogin");
    } else {
      console.log(`[Auth] Navigating to ${screenName}`);
      navigation.navigate(screenName);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ userToken, login, logout, ProtectedNavigation }}>
      {children}
    </AuthContext.Provider>
  );
};
