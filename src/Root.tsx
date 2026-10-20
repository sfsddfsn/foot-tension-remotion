import React from "react";
import { Composition } from "remotion";
import { FootTension } from "./FootTension";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FootTension"
        component={FootTension}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
