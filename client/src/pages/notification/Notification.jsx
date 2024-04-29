import { Link } from "react-router-dom";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";
import useGetNotifictions from "../../hooks/useGetNotifictions";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuthContext } from "../../context/AuthContext";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

// notifications
function Notification() {
  const { authUser } = useAuthContext();
  const { isLoading, notifications, fetchNotifications } = useGetNotifictions();

  // Delete All Notifictions
  const deleteNotifications = async () => {
    if (!window.confirm("Are you sure you want to delete All Notifictions 🙄?"))
      return;

    try {
      const res = await makeRequest.delete(`notifiction/delete`);
      if (!res.data) return toast.error("Error Delete Notifictions 😥");
      toast.success("All Notifictions Deleted Successfully 😍");
      fetchNotifications();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete Single Notifiction
  const handleDeleteNotifiction = async (notId) => {
    if (!window.confirm("Are you sure you want to delete This Notifiction 🙄?"))
      return;

    try {
      const res = await makeRequest.delete(
        `notifiction/delete-notifiction/${notId}`
      );
      if (!res.data) return toast.error("Error Delete Notifiction 😥");
      toast.success("Notifiction Deleted Success 😍");
      fetchNotifications();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}

        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profilePic ||
                        "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
            {notification?.to === authUser._id && (
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleDeleteNotifiction(notification._id)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Notification;
