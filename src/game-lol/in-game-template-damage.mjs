import { css } from "goober";

import html from "@/util/html-template.mjs";

const templateClass = css`
  padding: var(--sp-3) var(--sp-2) var(--sp-8) 0;

  .title {
    font-size: var(--sp-3);
    color: var(--shade2);
  }
  .flex {
    display: flex;
    column-gap: var(--sp-1);
    background-color: var(--shade6);
    border-radius: var(--sp-1);
    width: 100%;
    height: var(--sp-1);
    margin-top: var(--sp-1_5);

    span {
      font-size: var(--sp-3);
      white-space: nowrap;
    }
  }
  .flex-item {
    position: relative;
    border-radius: var(--sp-1);
    height: var(--sp-1);
    width: 0%;
    transition: width 1s ease;
    will-change: width layout;

    span {
      position: absolute;
      left: 0;
      bottom: 0;
      color: inherit;
      transform: translateY(calc(100% + var(--sp-2)));
    }
  }
  .flex-ap {
    color: var(--ap);
    background-color: var(--ap);
  }
  .flex-ad {
    color: var(--ad);
    background-color: var(--ad);
  }
  .flex-true {
    color: var(--white);
    background-color: var(--white);
  }
`;

const template = html`
  <div class="${templateClass}">
    <div class="title">{{t_teamDamageBreakdown}}</div>
    <div class="flex">
      <div class="flex-item flex-ap" style="{{apStyles}}">
        <span>{{apPercentText}}</span>
      </div>
      <div class="flex-item flex-ad" style="{{adStyles}}">
        <span>{{adPercentText}}</span>
      </div>
      <div class="flex-item flex-true" style="{{trueStyles}}">
        <span>{{truePercentText}}</span>
      </div>
    </div>
  </div>
`;

export default template;
