import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Masonry from "react-masonry-css";
import PinCard from "../../components/PinCard";
import { Pin } from "../../types";
import { BASE_URL } from "../../utils";
import { breakpointColumnsObj } from "../../utils/constants";

const Search = ({ pins }: { pins: Pin[] }) => {
  const router = useRouter();
  const { searchValue }: any = router.query;

  return (
    <div>
      {pins.length !== 0 && (
        <Masonry
          className="flex animate-slide-fwd"
          breakpointCols={breakpointColumnsObj}
        >
          {pins.map((pin: Pin) => (
            <PinCard pin={pin} key={pin._id} />
          ))}
        </Masonry>
      )}
      {pins?.length === 0 && searchValue !== "" && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  params: { searchValue },
}: {
  params: { searchValue: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/search/${searchValue}`);

  return {
    props: {
      pins: data,
    },
  };
};

export default Search;
