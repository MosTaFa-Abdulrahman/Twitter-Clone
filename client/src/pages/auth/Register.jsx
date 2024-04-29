import { useState } from "react";
import { NavLink } from "react-router-dom";
import useRegister from "../../hooks/useRegister";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { handleRegister, isLoading } = useRegister();

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/733/733579.png"
          className=" lg:w-2/3 fill-white"
          alt=""
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col">
          <img
            src="https://cdn-icons-png.flaticon.com/128/733/733579.png"
            className="w-24 lg:hidden fill-white"
            alt=""
          />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>
          <button
            className="btn rounded-full btn-primary text-white"
            onClick={(e) => {
              e.preventDefault();
              handleRegister(formData);
            }}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
          {/* {isError && <p className="text-red-500">{isError}</p>} */}
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <NavLink to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Register;
