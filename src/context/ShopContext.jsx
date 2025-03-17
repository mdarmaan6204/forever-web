import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    try {
      const res = await axios.post(
        backendURL + "/api/cart/add",
        { itemId, size },
        { headers: { token: token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setCartItems(cartData);
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const getCartItems = async (token) => {
    try {
      const res = await axios.get(backendURL + "/api/cart/get", {
        headers: { token: token },
      });
      if (res.data.success) {
        setCartItems(res.data.cartData);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(backendURL + "/api/product/list");
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getCartItems(localStorage.getItem("token"));
    }
  }, []);

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      }
    }
    return totalCount;
  };
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    try {
      const res = await axios.put(
        backendURL + "/api/cart/update",
        { itemId, size, quantity },
        { headers: { token: token } }
      );
      if (res.data.success) {
        // toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const productInfo = products.find((product) => product._id === item);
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalAmount += productInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
    return totalAmount ;
  };

  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
    //setCartItems({}); // Clear cart after placing the order
  };

  const value = {
    products: products,
    currency: currency,
    delivery_fee: delivery_fee,
    search: search,
    setSearch: setSearch,
    showSearch: showSearch,
    setShowSearch: setShowSearch,
    cartItems: cartItems,
    setCartItems: setCartItems,
    addToCart: addToCart,
    getCartCount: getCartCount,
    getCartAmount: getCartAmount,
    updateQuantity: updateQuantity,
    addOrder: addOrder,
    orders: orders,
    navigate: navigate,
    backendURL: backendURL,
    token: token,
    setToken: setToken,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
