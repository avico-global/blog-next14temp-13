import React from "react";
import Image from "next/image";
import Container from "../common/Container";
import FullContainer from "../common/FullContainer";

export default function AboutBanner({ image }) {
  return (
    <FullContainer className=" min-h-[50vh] mx-auto max-w-[1200px] mt-12 overflow-hidden  ext-center bg-black/20">
      <Image
        title="About"
        src={image}
        alt="Background Image"
        priority={true}
        fill={true}
        loading="eager"
        className=" w-full h-full object-cover"
      />
     
    </FullContainer>
  );
}
