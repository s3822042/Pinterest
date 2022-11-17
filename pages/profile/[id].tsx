/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils";

import { IUser, Pin } from "../../types";
import { AiOutlineLogout } from "react-icons/ai";
import { googleLogout } from "@react-oauth/google";
import useAuthStore from "../../store/authStore";
import Masonry from "react-masonry-css";
import PinCard from "../../components/PinCard";
import { breakpointColumnsObj } from "../../utils/constants";
import { useRouter } from "next/router";

interface IProps {
  userData: {
    user: IUser;
    userPins: Pin[];
    userSavedPins: Pin[];
  };
}

const Profile = ({ userData }: IProps) => {
  const activeBtnStyles =
    "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
  const notActiveBtnStyles =
    "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

  const { user, userPins, userSavedPins } = userData;
  const router = useRouter();
  const { removeUser } = useAuthStore();

  const [pins, setPins] = useState<Pin[]>([]);
  const [activeBtn, setActiveBtn] = useState("created");

  const [text, setText] = useState("Created");

  useEffect(() => {
    const fetchPins = async () => {
      if (text === "Created") {
        setPins(userPins);
      } else {
        setPins(userSavedPins);
      }
    };
    fetchPins();
  }, [text, user, userPins, userSavedPins]);

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {user && (
              <button
                type="button"
                className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                onClick={() => {
                  googleLogout();
                  removeUser();
                  router.push("/");
                }}
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText("Created");
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={() => {
              setText("Saved");
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>
        <Masonry
          className="flex animate-slide-fwd"
          breakpointCols={breakpointColumnsObj}
        >
          {pins.length &&
            pins.map((pin: Pin) => <PinCard pin={pin} key={pin._id} />)}
        </Masonry>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/profile/${id}`);

  return {
    props: { userData: data },
  };
};
export default Profile;
