import React, { Component } from "react";
import { withTranslation } from "react-i18next";

import { shardInfo, shardMap } from "@/game-lol/constants.mjs";
import RuneImg from "@/game-lol/RuneImg.jsx";
import TreeImg from "@/game-lol/TreeImg.jsx";

function getTreeColor(treeKey) {
  switch (treeKey) {
    case "domination":
      return "#ca3e3f";
    case "precision":
      return "#c8aa6e";
    case "sorcery":
      return "#6c75f5";
    case "resolve":
      return "#739068";
    case "inspiration":
      return "#4c818e";
    default:
      return "white";
  }
}

function getTreeSecondaryColor(treeKey) {
  switch (treeKey) {
    case "domination":
      return "#dc4747";
    case "precision":
      return "#aea789";
    case "sorcery":
      return "#9faafc";
    case "resolve":
      return "#a1d586";
    case "inspiration":
      return "#49aab9";
    default:
      return "white";
  }
}

class DraftRunePage extends Component {
  render() {
    //
    const { perks, currStats, runeTree, big, selectedShards, t } = this.props;

    if (!perks || (!currStats && !runeTree)) {
      return null;
    }

    let runes = null;
    if (runeTree) {
      runes = runeTree.runes;
    } else {
      runes = currStats.stats.runes.build;
    }
    if (!runes) return null;
    const mainTree = perks.find((tree) => tree.id === runes[0]);
    const mainTreeKey = mainTree.key.toLowerCase();
    const secondTree = perks.find((tree) => tree.id === runes[5]);
    const secondTreeKey = secondTree.key.toLowerCase();

    return (
      <div className={big ? "runes-content-big" : "runes-content"}>
        {/* <!-- Make sure to set class names: if Primary > runes-path-primary; if Secondary > runes-path-secondary; --> */}
        {/* <!-- Make sure to set class names: if Domination > runes-path-domination; if Precision > runes-path-precision; etc. --> */}
        <div
          className={`runes-path runes-path-primary runes-path-${mainTreeKey}`}
        >
          {/* <!-- RUNES TREE (Ex: Domination, Precision, etc.) --> */}
          {/* <!-- Use runes_tree component. Make sure to pass in path (Ex. Domination, Precision, etc.) --> */}
          {/* <!-- Start runes_tree component --> */}
          <div className="runes-path-tree clearfix">
            <div className="runes-path-tree-icon">
              <div className="runes-path-tree-icon-scale">
                <svg className="PathButton__Circles">
                  <defs>
                    <linearGradient
                      id={`circle-gradient-${mainTreeKey}`}
                      x1="1"
                      y1="0.6"
                      x2="0"
                      y2="0"
                    >
                      <stop
                        stopOpacity="1"
                        offset="0%"
                        stopColor={getTreeColor(mainTreeKey)}
                      />
                      <stop
                        stopOpacity="0"
                        offset="70%"
                        stopColor={getTreeColor(mainTreeKey)}
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    className="path-icon--moon moon-bottom"
                    cx="50%"
                    cy="50%"
                    r="43%"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#circle-gradient-${mainTreeKey})`}
                  />
                  <circle
                    className="path-icon--moon moon-left"
                    cx="50%"
                    cy="50%"
                    r="43%"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#circle-gradient-${mainTreeKey})`}
                  />
                  <circle
                    className="path-icon--moon moon-right"
                    cx="50%"
                    cy="50%"
                    r="43%"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#circle-gradient-${mainTreeKey})`}
                  />
                </svg>
                <svg className="PathButton__Cup">
                  <defs>
                    <linearGradient
                      id={`cup-gradient-${mainTreeKey}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        stopOpacity="0"
                        offset="80%"
                        stopColor={getTreeColor(mainTreeKey)}
                      />
                      <stop
                        stopOpacity="1"
                        offset="100%"
                        stopColor={getTreeColor(mainTreeKey)}
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="42"
                    cy="42"
                    r="42"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#cup-gradient-${mainTreeKey})`}
                  />
                </svg>

                <TreeImg
                  isActive
                  noBorder
                  tree={mainTree}
                  className="rune-path--icon"
                />
              </div>
            </div>
            {/* <!-- Add class "runes-path-tree-grid-item-active" to active tree --> */}
            {/* <!-- Use tree-[TREE NAME]-bw for black and white icon for inactive tree --> */}
            <div className="runes-path-tree-grid clearfix">
              <div
                className={`runes-path-tree-grid-item ${
                  mainTreeKey === "precision"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "precision",
                    name: t("lol:runes.precision", "Precision"),
                  }}
                  isActive={mainTreeKey === "precision"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  mainTreeKey === "domination"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "domination",
                    name: t("lol:runes.domination", "Domination"),
                  }}
                  isActive={mainTreeKey === "domination"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  mainTreeKey === "sorcery"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "sorcery",
                    name: t("lol:runes.sorcery", "Sorcery"),
                  }}
                  isActive={mainTreeKey === "sorcery"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  mainTreeKey === "resolve"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "resolve",
                    name: t("lol:runes.resolve", "Resolve"),
                  }}
                  isActive={mainTreeKey === "resolve"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  mainTreeKey === "inspiration"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "inspiration",
                    name: t("lol:runes.inspiration", "Inspiration"),
                  }}
                  isActive={mainTreeKey === "inspiration"}
                  className="fit-parent"
                />
              </div>
            </div>
          </div>
          {/* <!-- End runes_tree component --> */}
          <div className="runes-path-spine">
            <div className="runes-path-spine-border">
              <div className="runes-path-spine-bar" />
            </div>
          </div>

          {/* <!-- KEYSTONE RUNE --> */}
          {/* <!-- Use runes_keystone component. Make sure to pass in path (Ex. Domination, Precision, etc.) --> */}
          {/* <!-- Start runes_keystone component --> */}
          <div className="runes-path-grid-row-container runes-path-keystone">
            <div className="runes-path-grid-row-dot" />
            <svg className="Slot__KeystoneFlourish-Top" viewBox="0 0 286 9">
              <defs>
                <linearGradient
                  id={`rune-flourish-${mainTreeKey}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor={getTreeSecondaryColor(mainTreeKey)}
                    stopOpacity="0"
                  />
                  <stop
                    offset="50%"
                    stopColor={getTreeColor(mainTreeKey)}
                    stopOpacity="1"
                  />
                  <stop
                    offset="100%"
                    stopColor={getTreeSecondaryColor(mainTreeKey)}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                fill="none"
                stroke={`url('#rune-flourish-${mainTreeKey}')`}
                d="M0 4.5h193l4 4"
              />
              <path
                fill="none"
                stroke={`url('#rune-flourish-${mainTreeKey}')`}
                d="M286 8.5H62l-7-8H20l-4 4"
              />
            </svg>
            <svg className="Slot__KeystoneFlourish-Bottom" viewBox="0 0 286 9">
              <defs>
                <linearGradient
                  id={`rune-flourish-${mainTreeKey}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#dc4747" stopOpacity="0" />
                  <stop
                    offset="50%"
                    stopColor={getTreeColor(mainTreeKey)}
                    stopOpacity="1"
                  />
                  <stop offset="100%" stopColor="#dc4747" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                fill="none"
                stroke={`url('#rune-flourish-${mainTreeKey}')`}
                d="M0 4.5h193l4 4"
              />
              <path
                fill="none"
                stroke={`url('#rune-flourish-${mainTreeKey}')`}
                d="M286 8.5H62l-7-8H20l-4 4"
              />
            </svg>

            <div className="runes-path-grid-row clearfix">
              {[0, 1, 2, 3].map((index) => {
                if (mainTree.slots[0].runes.length <= index) return null;
                return (
                  <div key={index} className={"runes-path-grid-item"}>
                    <RuneImg
                      size={3}
                      treeKey={mainTreeKey}
                      currRune={mainTree.slots[0].runes[index]}
                      activeRunes={[runes[1], runes[2], runes[3], runes[4]]}
                      className="runes-path-rune-icon"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* <!-- End runes_keystone component --> */}
          {[1, 2, 3].map((firstIndex) => {
            return (
              <div key={firstIndex} className="runes-path-grid-row-container">
                <div className="runes-path-grid-row-dot" />
                <div className="runes-path-grid-row clearfix">
                  {[0, 1, 2, 3].map((secondIndex) => {
                    if (mainTree.slots[firstIndex].runes.length <= secondIndex)
                      return null;
                    return (
                      <div key={secondIndex} className={"runes-path-grid-item"}>
                        <RuneImg
                          size={2.5}
                          treeKey={mainTreeKey}
                          currRune={
                            mainTree.slots[firstIndex].runes[secondIndex]
                          }
                          activeRunes={[runes[1], runes[2], runes[3], runes[4]]}
                          className="runes-path-rune-icon"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* <!-- Secondary path: Same structure as primary; there's no keystone rune and the caption for the tree will be different. --> */}
        <div
          className={`runes-path runes-path-secondary runes-path-${secondTreeKey}`}
        >
          <div className="runes-path-tree clearfix">
            <div className="runes-path-tree-icon">
              <div className="runes-path-tree-icon-scale">
                <svg className="PathButton__Circles">
                  <defs>
                    <linearGradient
                      id={`circle-gradient-${secondTreeKey}`}
                      x1="1"
                      y1="0.6"
                      x2="0"
                      y2="0"
                    >
                      <stop
                        stopOpacity="1"
                        offset="0%"
                        stopColor={getTreeSecondaryColor(secondTreeKey)}
                      />
                      <stop
                        stopOpacity="0"
                        offset="70%"
                        stopColor={getTreeSecondaryColor(secondTreeKey)}
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    className="path-icon--moon moon-bottom"
                    cx="50%"
                    cy="50%"
                    r="43%"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#circle-gradient-${secondTreeKey})`}
                  />
                  <circle
                    className="path-icon--moon moon-left"
                    cx="50%"
                    cy="50%"
                    r="43%"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#circle-gradient-${secondTreeKey})`}
                  />
                  <circle
                    className="path-icon--moon moon-right"
                    cx="50%"
                    cy="50%"
                    r="43%"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#circle-gradient-${secondTreeKey})`}
                  />
                </svg>
                <svg className="PathButton__Cup">
                  <defs>
                    <linearGradient
                      id={`cup-gradient-${secondTreeKey}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        stopOpacity="0"
                        offset="80%"
                        stopColor={getTreeSecondaryColor(secondTreeKey)}
                      />
                      <stop
                        stopOpacity="1"
                        offset="100%"
                        stopColor={getTreeSecondaryColor(secondTreeKey)}
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="42"
                    cy="42"
                    r="42"
                    fill="none"
                    strokeWidth="2"
                    stroke={`url(#cup-gradient-${secondTreeKey})`}
                  />
                </svg>

                <TreeImg
                  isActive
                  noBorder
                  tree={secondTree}
                  className="rune-path--icon"
                />
              </div>
            </div>

            {/* <!-- Add class "runes-path-tree-grid-item-active" to active tree --> */}
            {/* <!-- Use tree-[TREE NAME]-bw for black and white icon for inactive tree --> */}
            <div className="runes-path-tree-grid clearfix">
              <div
                className={`runes-path-tree-grid-item ${
                  secondTreeKey === "precision"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "precision",
                    name: t("lol:runes.precision", "Precision"),
                  }}
                  isActive={secondTreeKey === "precision"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  secondTreeKey === "domination"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "domination",
                    name: t("lol:runes.domination", "Domination"),
                  }}
                  isActive={secondTreeKey === "domination"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  secondTreeKey === "sorcery"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "sorcery",
                    name: t("lol:runes.sorcery", "Sorcery"),
                  }}
                  isActive={secondTreeKey === "sorcery"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  secondTreeKey === "resolve"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "resolve",
                    name: t("lol:runes.resolve", "Resolve"),
                  }}
                  isActive={secondTreeKey === "resolve"}
                  className="fit-parent"
                />
              </div>
              <div
                className={`runes-path-tree-grid-item ${
                  secondTreeKey === "inspiration"
                    ? "runes-path-tree-grid-item-active"
                    : ""
                }`}
              >
                <TreeImg
                  tree={{
                    key: "inspiration",
                    name: t("lol:runes.inspiration", "Inspiration"),
                  }}
                  isActive={secondTreeKey === "inspiration"}
                  className="fit-parent"
                />
              </div>
            </div>
            {/* <!-- End runes_tree component --> */}
          </div>

          <div className="runes-path-spine">
            <div className="runes-path-spine-border">
              <div className="runes-path-spine-bar" />
            </div>
          </div>

          {[1, 2, 3].map((firstIndex) => {
            return (
              <div key={firstIndex} className="runes-path-grid-row-container">
                <div className="runes-path-grid-row-dot" />
                <div className="runes-path-grid-row clearfix">
                  {[0, 1, 2, 3].map((secondIndex) => {
                    if (
                      secondTree.slots[firstIndex].runes.length <= secondIndex
                    )
                      return null;
                    return (
                      <div key={secondIndex} className={"runes-path-grid-item"}>
                        <RuneImg
                          size={2.5}
                          activeRunes={[runes[6], runes[7]]}
                          treeKey={secondTreeKey}
                          currRune={
                            secondTree.slots[firstIndex].runes[secondIndex]
                          }
                          className="runes-path-rune-icon"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* Shards */}
          {selectedShards && selectedShards.length > 0 ? (
            <>
              <div className="runes-path-spine shard">
                <div className="runes-path-spine-border shard">
                  <div className="runes-path-spine-bar shard" />
                </div>
              </div>

              {shardMap.map((map1, index1) => {
                return (
                  <div
                    key={shardMap}
                    className="runes-path-grid-row-container shard"
                  >
                    <div className="runes-path-grid-row-dot-shard" />
                    <div className="runes-path-grid-row-shard clearfix">
                      {map1.map((map2, index2) => {
                        return (
                          <div
                            key={index1 + " " + index2}
                            className={"runes-path-grid-item-shard"}
                          >
                            <RuneImg
                              size={1.5}
                              activeRunes={[selectedShards[index1]]}
                              treeKey={"shards"}
                              currRune={shardInfo[map2].currRune}
                              className="runes-path-rune-icon"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      </div>
    );
  }
}

const TranslatedDraftRunePage = withTranslation(["lol"])(DraftRunePage);

export default TranslatedDraftRunePage;
