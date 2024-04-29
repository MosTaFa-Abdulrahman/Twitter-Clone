import { useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

function useFollowUnFollow(user) {
  const { authUser: currentUser } = useAuthContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(user?.followers?.includes(currentUser?._id));
  }, [user, currentUser?._id]);

  const handleFollowUnFollow = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      return toast.error("Please login to follow this user 😍");
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await makeRequest.post(`user/follow/${user._id}`);
      if (!res.data) {
        return toast.error("You Can Not Follow this User 😥");
      }

      if (isFollowing) {
        // UnFollow
        toast.success(`Unfollowed ${user.username} 😍`);
        user?.followers?.pop();
      } else {
        // Follow
        toast.success(`Followed ${user.username} 😍`);
        user?.followers?.push(currentUser?._id);
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error(`${error.message} 😥`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, isLoading, handleFollowUnFollow };
}

export default useFollowUnFollow;
