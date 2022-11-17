import React, { useState } from "react";
import Image from "next/image";

import { Pin } from "./../types";
import { MdDownloadForOffline } from "react-icons/md";
import Link from "next/link";
import useAuthStore from "../store/authStore";
import { client } from "../utils/client";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useRouter } from "next/router";

interface IProps {
  pin: Pin;
}

const PinCard = ({ pin }: IProps) => {
  const [isHover, setIsHover] = useState(false);
  const [savePin, setSavePin] = useState(false);

  const { userProfile }: any = useAuthStore();
  const router = useRouter();

  let alreadySaved = pin?.save?.filter(
    (item) => item?.userId === userProfile?._id
  );

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const handleSavePin = async (id: any) => {
    if (userProfile) {
      if (alreadySaved?.length === 0) {
        setSavePin(true);
        await axios.put(`${BASE_URL}/api/save`, {
          userId: userProfile._id,
          pinId: id,
        });

        router.reload();
        setSavePin(false);
      }
    }
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {pin.image && (
          <>
            <a href={`/detail/${pin._id}`}>
              <Image
                width={60}
                height={60}
                src={pin.image.asset.url}
                alt="image"
                className="rounded-lg w-full"
                layout="responsive"
                loading="lazy"
                unoptimized
              />
            </a>
          </>
        )}

        {isHover && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${pin.image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved?.length !== 0 ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSavePin(pin._id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} {savePin ? "Saving" : "Save"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {pin.postedBy?.image && (
        <Link href={`/profile/${pin.postedBy._id}`}>
          <div className="flex gap-2 mt-2 items-center">
            <Image
              width={700}
              height={475}
              sizes="100vw"
              style={{
                width: "40px",
                height: "40px",
              }}
              className="rounded-full cursor-pointer"
              src={pin.postedBy?.image}
              alt="user avatar"
            />
            <p className="font-semibold capitalize">{pin.postedBy?.userName}</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default PinCard;
