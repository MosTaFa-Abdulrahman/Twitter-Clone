import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { makeRequest } from "../requestMethod";

function useGetSuggestedUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const fetchSuggestedUsers = async () => {
    setIsLoading(true);

    try {
      const res = await makeRequest.get("user/suggested/get");
      if (!res.data) toast.error("Failed Fetch Suggested Users 😥");
      setSuggestedUsers(res.data);
    } catch (error) {
      toast.error(`Error Get Suggested Users 😥`);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  return { isLoading, suggestedUsers, fetchSuggestedUsers };
}

export default useGetSuggestedUsers;
