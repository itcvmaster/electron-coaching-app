import { css } from "goober";

import html from "@/util/html-template.mjs";

const cssClass = css`
  display: flex;
  flex-direction: column;
  min-height: var(--sp-17_5);
  justify-content: space-between;

  .title {
    color: var(--shade0);
    font-size: var(--sp-6);
  }
  .timer {
    font-size: var(--sp-4);
    color: var(--shade1);
  }
  .loading-outer {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    margin-top: var(--sp-1_5);
  }
  .loading-inner {
    height: 3px;
    border-radius: 4px;
    background-color: var(--ad);
    width: 100%;
    transition: transform 0.1s ease-in-out;
    will-change: transform;
  }
`;

const template = html`
  <div class="${cssClass} sidebar-align">
    <div class="title">{{t_phaseTitle}}</div>
    <div class="timer">{{t_phaseTimer}}</div>
    <div class="loading-outer">
      <div class="loading-inner" style="{{phaseProgress}}"></div>
    </div>
  </div>
`;

export default template;
