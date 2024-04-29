import { useState } from "react";
import { toast } from "react-toastify";
import { makeRequest } from "../requestMethod";
import { useAuthContext } from "../context/AuthContext";

function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const handleLogin = async (formData) => {
    if (!formData.username || !formData.password) {
      return toast.warning("Please fill all the fields 😍");
    }
    if (formData.password.length < 6)
      return toast.warning("Password must be >6");

    setIsLoading(true);

    try {
      const res = await makeRequest.post("auth/login", formData);
      if (!res.data) toast.error("Failed Login 😥");
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setAuthUser(res.data);
      toast.success("User Logged Success 🥰");
    } catch (error) {
      toast.error(`Error Login 😥`);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogin };
}

export default useLogin;
