import React, { memo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { Backdrop, BGImageContainer } from "@/app/PageBackdrop.style.jsx";

const PageBackdrop = () => {
  const state = useSnapshot(readState);
  const { pageImage /*, pageHeaderVisible*/ } = state.volatile;

  return (
    <>
      {pageImage ? (
        <BGImageContainer>
          <img src={pageImage} />
        </BGImageContainer>
      ) : (
        <Backdrop />
      )}
    </>
  );
};

export default memo(PageBackdrop);
