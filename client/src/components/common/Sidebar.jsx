import { NavLink } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../context/AuthContext";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

function Sidebar() {
  const { authUser } = useAuthContext();

  const { handleLogout } = useLogout();

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <NavLink to="/" className="flex justify-center md:justify-start">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3670/3670151.png"
            className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900"
            alt=""
          />
        </NavLink>

        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <NavLink
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </NavLink>
          </li>
          <li className="flex justify-center md:justify-start">
            <NavLink
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </NavLink>
          </li>

          <li className="flex justify-center md:justify-start">
            <NavLink
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </NavLink>
          </li>
        </ul>

        {authUser && (
          <NavLink
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={
                    authUser?.profilePic ||
                    "https://cdn-icons-png.flaticon.com/128/456/456212.png"
                  }
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={() => handleLogout()}
              />
            </div>
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Sidebar;