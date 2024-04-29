import { useState } from "react";
import { makeRequest } from "../requestMethod";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function useLikeDisLikePost(post) {
  const [isLiking, setIsLiking] = useState(false);
  const { authUser } = useAuthContext();
  const [liked, setLiked] = useState(post?.likes?.includes(authUser?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);

  const handleLikeAndUnlike = async () => {
    if (!authUser) {
      return toast.error("You must be logged in to like a post 😎");
    }
    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await makeRequest.put(`post/like/${post._id}`);
      if (!res.data) return toast.error("Error Liked 😥");

      if (!liked) {
        // ADD ((ID)) of currentUser to post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, authUser._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        // Remove ((ID)) of currentUser to post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }

      setLiked(!liked);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  return { handleLikeAndUnlike, liked };
}

export default useLikeDisLikePost;
