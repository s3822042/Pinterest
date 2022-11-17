import axios from "axios";
import PinCard from "../components/PinCard";
import { BASE_URL } from "../utils";
import Masonry from "react-masonry-css";
import { Pin } from "./../types";
import { breakpointColumnsObj } from "../utils/constants";

interface IProps {
  pins: Pin[];
}

const Home = ({ pins }: IProps) => {
  return (
    <>
      {pins && (
        <Masonry
          className="flex animate-slide-fwd"
          breakpointCols={breakpointColumnsObj}
        >
          {pins.length &&
            pins.map((pin: Pin) => <PinCard pin={pin} key={pin._id} />)}
        </Masonry>
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  let { data } = await axios.get(`${BASE_URL}/api/pin`);

  return {
    props: {
      pins: data,
    },
  };
};

export default Home;
