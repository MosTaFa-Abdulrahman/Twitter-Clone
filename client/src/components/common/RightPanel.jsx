import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";
import SuggestedUser from "./SuggestedUser";

function RightPanel() {
  const { isLoading, suggestedUsers, fetchSuggestedUsers } =
    useGetSuggestedUsers();

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {!isLoading &&
            suggestedUsers?.map((user) => (
              <SuggestedUser key={user._id} user={user} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default RightPanel;
