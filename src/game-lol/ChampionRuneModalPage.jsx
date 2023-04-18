import React, { Component } from "react";
import { css, styled } from "goober";

import { appURLs } from "@/app/constants.mjs";
import { View } from "@/game-lol/CommonComponents.jsx";
import DraftRunePage from "@/game-lol/DraftRunePage.jsx";

const Container = styled("div")`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;

  .fit-width {
    width: 100%;
  }

  .fit-height {
    height: 100%;
  }

  .fit-parent {
    width: 100%;
    height: 100%;
  }

  .clearfix::after {
    clear: both;
    display: block;
    content: "";
  }

  .container {
    width: 1024px;
    margin: 0px auto;
  }

  .runes-backdrop-overlay {
    position: absolute;
    background: var(--shade10-75);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
  }

  .runes-content-big {
    padding-bottom: var(--sp-5);
    transform: scale(1);
    transform-origin: 0px 0px;
    z-index: 1;
    display: flex;
    flex-direction: row;
  }

  .runes-path {
    width: 330px;
    position: relative;
    float: left;
  }

  .runes-path-primary {
    margin-right: var(--sp-4);
  }

  .PathButton__Circles {
    margin: calc(var(--sp-8) * -1);
    position: absolute;
    top: 50%;
    left: 50%;
    width: 64px;
    height: 64px;
  }

  .runes-path-tree-icon {
    width: 107px;
    height: 100px;
    float: left;
    position: relative;
  }

  .path-icon--moon.moon-left {
    transform: rotate(120deg) translateY(6%);
  }

  .path-icon--moon.moon-right {
    transform: rotate(240deg) translateY(6%);
  }

  .path-icon--moon {
    cx: 50%;
    cy: 50%;
    r: 43%;
    fill: none;
    stroke-width: 2;
    -webkit-transform: translateY(6%);
    transform: translateY(6%);
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
  }

  .PathButton__Cup {
    width: 86px;
    height: 86px;
    position: absolute;
    left: 11px;
    bottom: 8px;
  }

  .rune-path--icon {
    margin: 0;
    width: var(--sp-9);
    height: var(--sp-9);
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .runes-path-tree-content {
    float: left;
    margin-top: var(--sp-8);
    width: 220px;
  }

  .runes-path-tree-title {
    font-size: var(--sp-4);
    font-weight: 700;
    margin-bottom: 8px;
  }

  .runes-path-domination .runes-path-tree-title {
    color: #ca3e3f;
  }
  .runes-path-precision .runes-path-tree-title {
    color: #c8aa6e;
  }
  .runes-path-sorcery .runes-path-tree-title {
    color: #9faafc;
  }
  .runes-path-resolve .runes-path-tree-title {
    color: #a1d586;
  }
  .runes-path-inspiration .runes-path-tree-title {
    color: #49aab9;
  }

  .runes-path-tree-grid {
    float: left;
    margin-top: var(--sp-9);
  }

  .runes-path-tree-grid-item {
    float: left;
    width: var(--sp-6);
    height: var(--sp-6);
    margin-right: 6px;
    opacity: 0.5;
    position: relative;
  }

  .runes-path-tree-grid-item-active {
    opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: var(--sp-9);
    height: var(--sp-9);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    margin-top: -8px;
  }

  .runes-path-grid-row-container {
    padding: 12px 0px;
    position: relative;
  }
  .runes-path-grid-row-container {
    padding: 5px 0px;
    position: relative;
  }

  .runes-path-grid-row {
    position: relative;
    left: 107px;
  }

  .runes-path-grid-row-shard {
    position: relative;
    left: 114px;
  }

  .runes-path-grid-item {
    float: left;
    margin-right: var(--sp-4);
    margin-right: 0.25rem;
    margin-left: 0.25rem;
  }

  .runes-path-grid-item-shard {
    float: left;
    margin-right: var(--sp-8);
  }

  .runes-path-domination .runes-path-grid-item-active .runes-path-rune-icon {
    border-color: #ca3e3f;
  }
  .runes-path-precision .runes-path-grid-item-active .runes-path-rune-icon {
    border-color: #c8aa6e;
  }
  .runes-path-sorcery .runes-path-grid-item-active .runes-path-rune-icon {
    border-color: #9faafc;
  }
  .runes-path-resolve .runes-path-grid-item-active .runes-path-rune-icon {
    border-color: #a1d586;
  }
  .runes-path-inspiration .runes-path-grid-item-active .runes-path-rune-icon {
    border-color: #49aab9;
  }

  /* Keystone */

  .runes-path-keystone {
    padding: 32px 0px;
    position: relative;
  }

  .Slot__KeystoneFlourish-Top {
    position: absolute;
    top: 0px;
  }

  .Slot__KeystoneFlourish-Bottom {
    transform: rotateY(180deg) rotateZ(180deg);
    position: absolute;
    bottom: 0px;
  }

  .runes-path-keystone::before {
    position: absolute;
    left: 107px;
    font-size: var(--sp-2_5);
    top: calc(var(--sp-3) * -1);
    font-weight: 700;
  }

  .runes-path-domination .runes-path-keystone::before {
    color: #ca3e3f;
  }
  .runes-path-precision .runes-path-keystone::before {
    color: #c8aa6e;
  }
  .runes-path-sorcery .runes-path-keystone::before {
    color: #9faafc;
  }
  .runes-path-resolve .runes-path-keystone::before {
    color: #a1d586;
  }
  .runes-path-inspiration .runes-path-keystone::before {
    color: #49aab9;
  }

  /* Dot */
  .runes-path-grid-row-dot {
    width: 8px;
    height: 8px;
    background: var(--white);
    border-radius: 50%;
    position: absolute;
    left: 49px;
    top: calc(50% - 8px);
  }

  .runes-path-grid-row-dot::before {
    content: "";
    display: block;
    position: absolute;
    width: var(--sp-4);
    height: var(--sp-4);
    background: none;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    left: -6px;
    top: -6px;
  }

  .runes-path-grid-row-dot-shard {
    width: 6px;
    height: 6px;
    background: var(--white);
    border-radius: 50%;
    position: absolute;
    left: 50px;
    top: calc(50% - 4px);
  }

  .runes-path-grid-row-dot-shard::before {
    content: "";
    display: block;
    position: absolute;
    width: var(--sp-3);
    height: var(--sp-3);
    background: none;
    border: var(--sp-px) solid rgba(189, 176, 106, 1);
    border-radius: 50%;
    left: -4px;
    top: -4px;
  }

  .runes-path-domination .runes-path-grid-row-dot::before {
    border-color: #ca3e3f;
  }
  .runes-path-precision .runes-path-grid-row-dot::before {
    border-color: #c8aa6e;
  }
  .runes-path-sorcery .runes-path-grid-row-dot::before {
    border-color: #9faafc;
  }
  .runes-path-resolve .runes-path-grid-row-dot::before {
    border-color: #a1d586;
  }
  .runes-path-inspiration .runes-path-grid-row-dot::before {
    border-color: #49aab9;
  }

  /* Spine */

  .runes-path-spine {
    height: 284px;
    position: absolute;
    top: 89px;
    left: 47px;
  }

  .runes-path-secondary .runes-path-spine {
    height: 180px;
  }

  .runes-path-secondary .runes-path-spine.shard {
    height: 68px;
    left: 48px;
    position: absolute;
    top: 302px;
  }
  .runes-path-spine-border.shard {
    width: 2px;
  }
  .runes-path-spine-bar.shard {
    width: 2px;
  }

  .runes-path-spine-border {
    width: 4px;
    height: 100%;
    padding: 0 2px 2px;
    border: 2px solid rgba(200, 170, 110, 0.2);
    border-top: none;
  }

  .runes-path-domination .runes-path-spine-border {
    border-color: rgba(202, 62, 63, 0.15);
  }
  .runes-path-precision .runes-path-spine-border {
    border-color: rgba(200, 170, 110, 0.15);
  }

  .runes-path-spine-bar {
    overflow: hidden;
    width: 4px;
    height: 100%;
    background: var(--white) 21;
    -webkit-box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.4);
  }

  .runes-path-domination .runes-path-spine-bar {
    background: rgba(202, 62, 63, 0.3);
  }
  .runes-path-precision .runes-path-spine-bar {
    background: rgba(200, 170, 110, 0.3);
  }

  /* Runes Most Common & Highest Win Rate */

  .runes-options-item {
    float: left;
    margin-top: 4px;
    margin-left: var(--sp-8);
    position: relative;
    margin-bottom: var(--sp-3);
    cursor: pointer;
  }

  .runes-options-rune {
    float: left;
    margin-top: 3px;
  }

  .runes-options-rune-primary {
    width: var(--sp-6);
    height: var(--sp-6);
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    float: left;
    margin-top: 2px;
  }

  .runes-options-rune-secondary {
    width: var(--sp-4);
    height: var(--sp-4);
    background: #1b2838;
    float: left;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    padding: 4px;
    margin-left: -8px;
    margin-top: 2px;
  }

  .runes-options-content {
    float: left;
    margin-left: 8px;
  }

  .runes-options-title {
    font-weight: 700;
    font-size: var(--sp-3);
  }

  .runes-options-stat-item {
    font-size: var(--sp-3);
    color: rgba(255, 255, 255, 0.5);
    float: left;
  }

  .runes-options-stat-item:first-child {
    margin-right: var(--sp-5);
    position: relative;
  }

  .prep-card-opponent {
    float: left;
  }

  .prep-card-opponent-item {
    width: var(--sp-8);
    height: var(--sp-8);
    position: relative;
    padding: 4px;
    border-radius: 50%;
    /* margin-left: 4px; */
    cursor: pointer;
  }
  .prep-card-opponent-item-small {
    width: var(--sp-7);
    height: var(--sp-7);
    border-radius: 50%;
    position: relative;
    padding: 2px;
    /* margin-left: 4px; */
    cursor: pointer;
  }

  .prep-card-opponent-item::after {
    content: "";
    border: 2px solid rgba(255, 255, 255, 0);
    width: var(--sp-9);
    height: var(--sp-9);
    border-radius: 50%;
    position: absolute;
    left: 0px;
    top: 0px;
    transition: var(--transition);
  }
  .prep-card-opponent-item-small::after {
    content: "";
    border: 2px solid rgba(255, 255, 255, 0);
    width: var(--sp-7);
    height: var(--sp-7);
    border-radius: 50%;
    position: absolute;
    left: 0px;
    top: 0px;
    transition: var(--transition);
  }

  .prep-card-opponent-all {
    background: #011118;
    text-align: center;
    line-height: var(--sp-8);
    text-transform: uppercase;
    font-size: var(--sp-3);
    color: rgba(255, 255, 255, 0.5);
    font-weight: 700;
    padding: 0px;
    /* top: 4px;
 left: 4px; */
  }

  .prep-card-opponent-item:hover::after,
  .prep-card-opponent-item-small:hover::after {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .prep-card-opponent-all::after {
    top: -4px;
    left: -4px;
  }

  .prep-card-opponent-active::after,
  .prep-card-opponent-active:hover::after {
    border-color: rgba(255, 255, 255, 0.25);
  }

  .prep-card-opponent-item:first-child {
    margin: 0px;
  }

  .cross {
    position: relative;
    height: var(--sp-8);
    width: var(--sp-8);
    border-radius: 50%;
    margin: 4px;
    filter: grayscale(100%);
  }
  .cross-small {
    width: var(--sp-7);
    height: var(--sp-7);
    position: relative;
    margin: 2px;
    border-radius: 50%;
    filter: grayscale(100%);
    overflow: hidden;
  }

  .cross:before,
  .cross-small:before {
    position: absolute;
    content: "";
    background: rgba(255, 255, 255, 0.5);
    display: block;
    width: 100%;
    height: 3px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .cross:after {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

class ChampionRuneModalPage extends Component {
  render() {
    const { runeTree, perks, selectedShards, setShow } = this.props;
    return (
      <Container onClick={() => setShow(false)}>
        <View
          row
          className={css`
            padding: var(--sp-6);
            overflow: hidden;
            background: var(--shade10);
            display: flex;
            flex-direction: column;
            position: fixed;
            right: 20%;
            z-index: 7;
            top: 25%;
          `}
        >
          {runeTree && runeTree.mainTreeKey && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <img
                style={{ width: "100%", opacity: 0.5 }}
                src={`${appURLs.CDN}/blitz/ui/img/backdrops/${runeTree.mainTreeKey}.jpg`}
              />
              <div className="runes-backdrop-overlay" />
            </div>
          )}
          <DraftRunePage
            big
            runeTree={runeTree}
            perks={perks}
            selectedShards={selectedShards}
          />
        </View>
      </Container>
    );
  }
}

export default ChampionRuneModalPage;
