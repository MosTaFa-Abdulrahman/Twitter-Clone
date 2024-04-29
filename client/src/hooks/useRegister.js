import { useState } from "react";
import { toast } from "react-toastify";
import { makeRequest } from "../requestMethod";
import { useAuthContext } from "../context/AuthContext";

function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const handleRegister = async (inputs) => {
    if (
      !inputs.username ||
      !inputs.fullName ||
      !inputs.email ||
      !inputs.password
    ) {
      return toast.warning("Please fill all the fields 😍");
    }
    if (inputs.password.length < 6) return toast.warning("Password must be >6");

    setIsLoading(true);

    try {
      const res = await makeRequest.post("auth/register", inputs);
      if (!res.data) return toast.error("Failed Register 😥");
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setAuthUser(res.data);
      toast.success("User Created Successfully 🥰");
    } catch (error) {
      toast.error(`Error Register 😥`);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleRegister };
}

export default useRegister;
