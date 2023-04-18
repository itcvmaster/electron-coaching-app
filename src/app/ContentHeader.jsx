import React from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { Header, HistoryBtns, Outer } from "@/app/ContentHeader.style.jsx";
import ChevronLeft from "@/inline-assets/chevron-left.svg";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import Reload from "@/inline-assets/reload.svg";
import { useShouldShowAppNavigation } from "@/util/app-route.mjs";
import { IS_APP } from "@/util/dev.mjs";

const ContentHeader = () => {
  const state = useSnapshot(readState);
  const shouldRender = useShouldShowAppNavigation();

  if (!shouldRender) return null;

  const { pageTitle, pageImage, pageHeaderVisible = true } = state.volatile;

  return (
    <Outer className={!pageHeaderVisible ? "page-header--hidden" : ""}>
      <Header className="header-middle">
        <div className="left-contents flex align-center gap-sp-4">
          {IS_APP && (
            <HistoryBtns>
              <button onClick={() => history.back()}>
                <ChevronLeft />
              </button>
              <button onClick={() => history.forward()}>
                <ChevronRight />
              </button>
              <button onClick={() => history.go()}>
                <Reload />
              </button>
            </HistoryBtns>
          )}
          {(pageImage || pageTitle) && (
            <div className="page-info">
              {pageImage ? (
                <div className="image hidden">
                  <img src={pageImage} width="24" height="24" />
                </div>
              ) : null}
              {pageTitle ? (
                <h1 className="type-h6 title hidden">{pageTitle}</h1>
              ) : null}
            </div>
          )}
        </div>
      </Header>
    </Outer>
  );
};

export default ContentHeader;
