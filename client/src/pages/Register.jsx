import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/register",
        formData
      );

      alert(res.data.message);

      navigate("/");

    } catch (error) {

      alert(error.response.data.message);

    }

  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-8
          rounded-xl
          shadow-lg
          w-96
        "
      >

        <h1 className="
          text-3xl
          font-bold
          mb-6
          text-center
        ">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
        />

        <select
          name="role"
          onChange={handleChange}
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
        >

          <option value="member">
            Member
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        <button
          type="submit"
          className="
            w-full
            bg-black
            text-white
            p-3
            rounded-lg
          "
        >
          Register
        </button>

        <p className="
          mt-4
          text-center
        ">

          Already have account?

          <Link
            to="/"
            className="
              text-blue-500
              ml-2
            "
          >
            Login
          </Link>

        </p>

      </form>

    </div>

  );
}

export default Register;