import { useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";
import { toast } from "react-toastify";

function useGetNotifictions() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    setIsLoading(true);

    try {
      const res = await makeRequest.get("notifiction/get");
      if (!res.data) toast.error("Failed Get Notifictions 😥");
      setNotifications(res.data);
    } catch (error) {
      toast.error(`Error Get Notifictions 😥`);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { isLoading, notifications, fetchNotifications };
}

export default useGetNotifictions;
