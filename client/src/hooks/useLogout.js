import { useState } from "react";
import { makeRequest } from "../requestMethod";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await makeRequest.post("auth/logout");
      localStorage.removeItem("userInfo");
      setAuthUser(null);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
}

export default useLogout;
