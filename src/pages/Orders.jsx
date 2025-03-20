import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Orders = () => {
  const { backendURL, products, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const fetchOrders = async () => {
    try {
      if (!token) return;

      const res = await axios.get(backendURL + "/api/order/myorders", {
        headers: { token },
      });
      if (res.data.success) {
        let allOrdersItem = [];
        res.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            if (typeof item === "object" && item !== null) {
              // Add additional properties to the item
              item["status"] = order.status;
              item["payment"] = order.payment;
              item["paymentMethod"] = order.paymentMethod;
              item["date"] = order.date;
              allOrdersItem.push(item);
            } else {
              console.warn("Invalid item format:", item);
            }
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Function to format the current date
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Get the current date
  const currentDate = formatDate(new Date());

  return (
    <div className="pt-16 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orderData.length === 0 ? (
        <p className="text-gray-500">You have no orders.</p>
      ) : (
        <div>
          {orderData.map((order, index) => {
            const productData = products.find(
              (product) => product._id === order._id
            );

            if (!productData) {
              console.warn(
                `Product not found for productId: ${order.productId}`
              );
              return null; // Skip rendering if productData is undefined
            }

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between g4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productData.image[0]}
                    alt="image"
                    className="w-16 sm:w-20"
                  />

                  <div>
                    <p className="sm:text-base font-medium">
                      {productData.name}
                    </p>

                    <div className="flex items-center gap-5 mt-2 text-base text-gray-700">
                      <p>
                        {currency}
                        {productData.price}
                      </p>
                      <p>Quantity: {order.quantity}</p>
                      <p>Size: {order.size}</p>
                    </div>
                    <p className="mt-1">
                      Date:
                      <span className="text-gray-400">
                        {new Date(order.date).toDateString()}
                      </span>
                    </p>
                    <p className="mt-1 uppercase">
                      Payment :
                      <span className="text-gray-400">
                        {order.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-400"></p>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>
                  <button
                    onClick = {() => fetchOrders()} 
                    className="border px-4 py-2 text-sm font-medium rounded-sm text-gray-700"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
