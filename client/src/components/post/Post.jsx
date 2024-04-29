import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { formatPostDate } from "../../utils/formatePostDate";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

// From Posts Component
function Post({ post, fetchPosts }) {
  const { authUser } = useAuthContext();

  const formattedDate = formatPostDate(post.createdAt);

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [text, setText] = useState("");

  // Like Func
  useEffect(() => {
    setIsLiked(post.likes.includes(authUser._id));
  }, [authUser._id, post.likes]);

  const likeHandler = () => {
    try {
      makeRequest.put(`post/like/${post._id}`);
      window.location.reload();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  // Delete Post
  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await makeRequest.delete(`post/delete/${post._id}`);
      if (!res.data) return toast.error("Error Delete Post 😥");
      toast.success("Post Deleted Successfully 😍");
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add Reply
  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!text) return toast.warning("Please Enter Your Text 😊");
    try {
      const res = await makeRequest.put(`/post/reply/${post._id}`, { text });
      if (!res.data) return toast.error("Error Add Comment 😥");
      fetchPosts();
      toast.success("Comment Added Successfully 😍");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete Reply
  const handleDeleteReply = async (replyId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this Comment ?"))
        return;
      const res = await makeRequest.delete(
        `post/${post._id}/replies/${replyId}`
      );
      if (!res.data) return toast.error("Error Delete Comment 😥");
      fetchPosts();
      toast.success("Comment Deleted Success 😍");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // console.log(post.postedBy.username);

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${post?.postedBy?.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img
              src={
                post?.postedBy?.profilePic ||
                "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
              }
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link
              to={`/profile/${post?.postedBy?.username}`}
              className="font-bold"
            >
              {post?.postedBy?.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${post?.postedBy?.username}`}>
                @{post?.postedBy?.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {post.postedBy._id === authUser._id && (
              <span className="flex justify-end flex-1">
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post?.replies?.length}
                </span>
              </div>
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post?.replies?.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post?.replies?.map((reply) => (
                      <div key={reply._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                reply.profilePic ||
                                "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-700 text-sm">
                              @{reply.username}
                            </span>
                          </div>
                          <div className="text-sm">{reply.text}</div>
                        </div>
                        <span className="flex justify-end flex-1">
                          {reply?.userId?._id === authUser._id && (
                            <FaTrash
                              className="cursor-pointer hover:text-red-500"
                              onClick={() => handleDeleteReply(reply._id)}
                            />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <form className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2">
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                    <button
                      className="btn btn-primary rounded-full btn-sm text-white px-4"
                      onClick={handleAddReply}
                    >
                      Post
                    </button>
                  </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={likeHandler}
              >
                {!isLiked ? (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500" />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2589/2589175.png"
                    className="w-4 h-4 cursor-pointer"
                  />
                )}

                <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : ""
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
