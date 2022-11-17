import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import useAuthStore from "../../store/authStore";
import { IUser, Pin } from "../../types";
import { BASE_URL } from "../../utils";

interface IProps {
  pinDetails: Pin;
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const PinDetails = ({ pinDetails }: IProps) => {
  const [pinDetail, setPinDetail] = useState(pinDetails);

  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const router = useRouter();
  const { userProfile, allUsers, fetchAllUsers }: any = useAuthStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers, allUsers]);

  const addComment = async (e: any) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(`${BASE_URL}/api/pin/${pinDetail._id}`, {
        userId: userProfile._id,
        comment,
      });
      setPinDetail({ ...pinDetail, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };

  if (!pinDetail) return null;

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <div className="absolute top-20 left-2 lg:left-6 flex gap-6 z-50">
              <p className="cursor-pointer" onClick={() => router.back()}>
                <BsArrowLeftCircleFill className="text-black text-[35px]" />
              </p>
            </div>
            <Image
              width={700}
              height={475}
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail?.image.asset.url}
              alt="user-pin"
              priority
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            <Link
              href={`/profile/${pinDetail?.postedBy._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <div>
                <Image
                  src={pinDetail?.postedBy.image}
                  width={700}
                  height={475}
                  sizes="100vw"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  className="rounded-full"
                  alt="user-profile"
                />
              </div>

              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.length > 0 &&
                pinDetail?.comments?.map((item: IComment, index: any) => (
                  <>
                    {allUsers.map(
                      (user: IUser) =>
                        user._id ===
                          (item.postedBy._id || item.postedBy._ref) && (
                          <div
                            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                            key={index}
                          >
                            <Link href={`/profile/${user._id}`}>
                              <>
                                <Image
                                  src={user.image}
                                  width={700}
                                  height={475}
                                  sizes="100vw"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  className="rounded-full cursor-pointer"
                                  alt="user-profile"
                                />
                              </>
                            </Link>

                            <div className="flex flex-col">
                              <p className="font-bold">{user.userName}</p>
                              <p>{item.comment}</p>
                            </div>
                          </div>
                        )
                    )}
                  </>
                ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link href={`/profile/${userProfile._id}`}>
                <Image
                  src={userProfile.image}
                  width={700}
                  height={475}
                  sizes="100vw"
                  className="rounded-full cursor-pointer"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  alt="user-profile"
                />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {isPostingComment ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/pin/${id}`);

  return {
    props: { pinDetails: data },
  };
};

export default PinDetails;
