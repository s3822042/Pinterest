import React, { useState } from "react";
import { client } from "../utils/client";
import Image from "next/image";
import { SanityAssetDocument } from "@sanity/client";
import { MdDelete } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { categories } from "../utils/constants";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "../utils";

const Upload = () => {
  const [title, setTitle] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false);
  const [category, setCategory] = useState<String>(categories[0].name);

  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });

  const [imageAsset, setImageAsset] = useState<
    SanityAssetDocument | undefined
  >();

  const [savingImage, setSavingImage] = useState<Boolean>(false);

  const { userProfile }: any = useAuthStore();
  const router = useRouter();

  const input = `
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`;

  const uploadImage = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileType = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/tiff",
      "image/svg",
    ];
    if (fileType.includes(selectedFile.type)) {
      setWrongFileType(false);
      setIsLoading(true);

      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setImageAsset(data);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  const handleSavePin = async () => {
    if (title && imageAsset?._id && category && about) {
      setSavingImage(true);
      const document = {
        _type: "pin",
        title,
        about,
        category,
        userId: userProfile._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
      };

      await axios.post(`${BASE_URL}/api/pin`, document);

      router.push("/");
    }
  };

  const handleDiscard = () => {
    setSavingImage(false);
    setImageAsset(undefined);
    setTitle("");
    setAbout("");
    setCategory("");
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dashed border-gray-300 p-3 w-full h-420 cursor-pointer hover:border-red-300 hover:bg-gray-100 outline-none">
            {isLoading ? (
              <p className="text-center text-3xl text-red-400 font-semibold">
                Uploading...
              </p>
            ) : (
              <div>
                {!imageAsset ? (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-2xl">
                          <AiOutlineCloudUpload className="text-gray-300 text-6xl" />
                        </p>
                        <p className="text-xl font-semibold">Upload image</p>
                      </div>

                      <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                        Recommendation: Use high-quality JPG, JPEG, SVG, PNG,
                        GIF or TIFF less than 20MB
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                ) : (
                  <div className="relative h-full">
                    <div className="w-full h-full relative">
                      <Image
                        src={imageAsset?.url}
                        alt="uploaded-pic"
                        objectFit="contain"
                        layout="responsive"
                        priority={true}
                        onLoadingComplete={(target) => {
                          setImageSize({
                            width: target.naturalWidth,
                            height: target.naturalHeight,
                          });
                        }}
                        width={imageSize.width}
                        height={imageSize.height}
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setImageAsset(undefined)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
            )}
            {wrongFileType && <p>It&apos;s wrong file type.</p>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-9 lg:pl-5 w-full">
          <label className="text-md font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className={`${input}`}
          />

          <label className="text-md font-medium">About</label>
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className={`${input}`}
          />
          <div className="flex flex-col gap-3">
            <label className="text-md font-medium">Category</label>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="outline-none lg:w-full border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
            >
              <option value="others" className="sm:text-bg bg-white">
                Select category
              </option>
              {categories.map((item) => (
                <option
                  className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                  value={item.name}
                  key={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <button
              onClick={handleDiscard}
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              Discard
            </button>
            <button
              disabled={imageAsset?.url ? false : true}
              onClick={() => handleSavePin()}
              type="button"
              className="bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              {savingImage ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
