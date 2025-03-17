import React, { useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendURL, navigate } = useContext(ShopContext);

  const [name, setName] = useState("Testing");
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("123456");

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const onSubmmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState == "Sign Up") {
        if (name == "") {
          throw new Error("Name is required");
        } else if (email == "") {
          throw new Error("Email is required");
        } else if (password == "") {
          throw new Error("Password is required");
        }

        const res = await axios.post(backendURL + "/api/user/register", {
          name,
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);

        setToken(res.data.token);
        toast.success("Sign Up Successful");
        navigate("/");
      } else {
        if (email == "") {
          throw new Error("Email is required");
        } else if (password == "") {
          throw new Error("Password is required");
        }

        const res = await axios.post(backendURL + "/api/user/login", {
          email,
          password,
        });

        console.log(res.data);

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Login Successful");
          navigate("/");
        } else {
          console.log("ERROR", res.data.message);

          toast.error(res.data.message);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <form
      onSubmit={onSubmmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="font-serif text-3xl"> {currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800 " />
      </div>

      <div className="w-full px-3 py-2 flex flex-col gap-4 ">
        {currentState === "Sign Up" ? (
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="w-Full px-3 py-2 border border-gray-880"
            placeholder="Name"
            required
          />
        ) : null}

        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-Full px-3 py-2 border border-gray-880"
          placeholder="Email"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-Full px-3 py-2 border border-gray-880"
          placeholder="Password"
          required
        />

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className=" cursor-pointer">Forgot your password?</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer"
            >
              Create Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>
        <button className="w-1/2 m-auto bg-black text-white px-8 py-2 mt-4 ">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default Login;
