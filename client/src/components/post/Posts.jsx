import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { makeRequest } from "../../requestMethod";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

// From (Home + Profile) Page
function Posts({ feedType, username, userId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/post/all";
      case "followings":
        return "/post/feed";
      case "posts":
        return `/post/profile/${username}`;
      case "likes":
        return `/post/liked-posts/${userId}`;
      default:
        return "/post/all";
    }
  };
  const POST_ENDPOINT = getPostEndpoint();

  const fetchPosts = async () => {
    setIsLoading(true);

    try {
      const res = await makeRequest.get(POST_ENDPOINT);
      if (!res.data) toast.error("Failed Fetch Posts 😥");
      setPosts(res.data);
    } catch (error) {
      toast.error(`Error Get Posts 😥`);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, username]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} fetchPosts={fetchPosts} />
          ))}
        </div>
      )}
    </>
  );
}

export default Posts;
