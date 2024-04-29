import { useState } from "react";
import { makeRequest } from "../requestMethod";
import { toast } from "react-toastify";

function useUpdateUserProfile() {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const updateProfile = async (userId, formData) => {
    setIsUpdatingProfile(true);
    try {
      const res = await makeRequest.put(`/user/update/${userId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.data) {
        return toast.error(res.data.error || "Something went wrong");
      }
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return { updateProfile, isUpdatingProfile };
}

export default useUpdateUserProfile;
