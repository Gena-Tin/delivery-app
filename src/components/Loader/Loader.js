import React from "react";
import { ThreeDots } from "react-loader-spinner";

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
};

const Loader = (props) => (
  <ThreeDots
    height="100"
    width="250"
    radius="9"
    color="green"
    ariaLabel="three-dots-loading"
    wrapperStyle={wrapperStyle}
    wrapperClassName=""
    visible={true}
  />
);

export default Loader;
