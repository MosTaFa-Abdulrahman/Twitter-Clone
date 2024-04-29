import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";
import useFollowUnFollow from "../../hooks/useFollowUnFollow";
import Posts from "../../components/post/Posts";
import EditProfileModal from "./EditProfileModal";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { POSTS } from "../../dummyData";
import { formatMemberSinceDate } from "../../utils/formatePostDate";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

function Profile() {
  const { authUser } = useAuthContext();
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});

  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverPicRef = useRef(null);
  const profilePicRef = useRef(null);

  // Get User Profile
  const fetchUserProfile = async () => {
    setIsLoading(true);

    try {
      const res = await makeRequest.get(`user/find/${username}`);
      if (!res.data) toast.error("Failed getUser 😥");
      setUser(res.data);
    } catch (error) {
      toast.error(`Error Get User 😥`);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // isMyProfile && Follow
  const isMyProfile = user.username === authUser.username;
  const { isFollowing, handleFollowUnFollow } = useFollowUnFollow(user);
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);

  // Update User
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverPic" && setCoverPic(reader.result);
        state === "profilePic" && setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {isLoading && <ProfileHeaderSkeleton />}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}

        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER Pic */}
              <div className="relative group/cover">
                <img
                  src={
                    coverPic ||
                    user?.coverPic ||
                    "https://media.istockphoto.com/id/1563121282/photo/black-vinyl-record-album-cover-wrapped-in-transparent-plastic.webp?b=1&s=170667a&w=0&k=20&c=tG99vn2kYw_xPFTV5TePjMTj-eoCx9V2GJUIssoEVrE="
                  }
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {user.username === authUser.username && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverPicRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverPicRef}
                  onChange={(e) => handleImgChange(e, "coverPic")}
                />
                <input
                  type="file"
                  hidden
                  ref={profilePicRef}
                  onChange={(e) => handleImgChange(e, "profilePic")}
                />

                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profilePic ||
                        user?.profilePic ||
                        "https://cdn-icons-png.flaticon.com/128/15315/15315520.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profilePicRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}

                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={handleFollowUnFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}

                {(coverPic || profilePic) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      await updateProfile(authUser._id, {
                        coverPic,
                        profilePic,
                      });
                      setProfilePic(null);
                      setCoverPic(null);
                    }}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user?.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followings?.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers?.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
}

export default Profile;
