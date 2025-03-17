import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const {
    navigate,
    backendURL,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(token);

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      if (paymentMethod == "cod") {
        const res = await axios.post(
          backendURL + "/api/order/placeorder/cod",
          orderData,
          { headers: { token } }
        );

        console.log("Response " + res.data);

        if (res.data.success) {
          setCartItems({});
          navigate("/orders");
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* --------------- Left Side ----------------------- */}

      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 ">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex flex-col sm:flex-row  gap-3">
          <input
            required
            name="fname"
            value={formData.fname}
            onChange={onChangeHandler}
            type="text"
            placeholder="First Name"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            type="text"
            name="lname"
            value={formData.lname}
            onChange={onChangeHandler}
            placeholder="Last Name"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="Email Address"
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          required
          type="text"
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          placeholder="Street"
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex flex-col sm:flex-row  gap-3">
          <input
            required
            type="text"
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            placeholder="City"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            type="text"
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            placeholder="State"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row  gap-3">
          <input
            required
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            placeholder="Zipcode"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            type="text"
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            placeholder="Country"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          type="number"
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          placeholder="Phone "
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* --------------- Right Side ----------------------- */}

      <div className="mt-8">
        <div className="mt8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* -------------- Payment method selection -------------- */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div
              onClick={() => {
                setPaymentMethod("stripe");
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setPaymentMethod("razorpay");
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setPaymentMethod("cod");
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVARY
              </p>
            </div>
          </div>

          {/* -------------- Payment method selection -------------- */}

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
