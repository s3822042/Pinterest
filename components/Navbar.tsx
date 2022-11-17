import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../utils/pinterest.png";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { GoogleLogin } from "@react-oauth/google";
import { BASE_URL, createOrGetUser } from "../utils";
import useAuthStore from "../store/authStore";

import { IUser } from "../types";
import { useRouter } from "next/router";

const Navbar = () => {
  const [user, setUser] = useState<IUser | null>();

  const { userProfile, addUser } = useAuthStore();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const router = useRouter();

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      router.push(`/search/${searchValue}`);
    }
  };

  return (
    <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
      <Link href="/">
        <div className="w-[100px] md:w-[129px] md:h-[30px] h-[38px]">
          <Image
            className="cursor-pointer"
            src={Logo}
            alt="logo"
            layout="responsive"
          />
        </div>
      </Link>
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-2 border-gray-400 mx-5 outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
          value={searchValue}
          onKeyDown={handleKeyDown}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div>
        {user ? (
          <div className="flex gap-5 md:gap-10 items-center">
            {user.image && (
              <Link href={`/profile/${user._id}`}>
                <>
                  <Image
                    width={700}
                    height={475}
                    sizes="100vw"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="rounded-lg cursor-pointer"
                    src={user.image}
                    alt="user-avatar"
                  />
                </>
              </Link>
            )}
            <Link href="/upload">
              <button className="bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center">
                <IoMdAdd className="text-xl" />
              </button>
            </Link>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => createOrGetUser(response, addUser)}
            onError={() => console.log("Login Failed")}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
