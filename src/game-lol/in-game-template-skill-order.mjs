import { css } from "goober";

import html from "@/util/html-template.mjs";

const container = css`
  --gap: var(--sp-1);
  --size: var(--sp-4);
  --radii: var(--br-sm);
  --color: var(--shade7);
  --image: initial;

  /* ~ SKILL ORDER ~ */
  display: grid;
  margin-top: var(--sp-4);
  grid-template-columns: repeat(19, var(--size));
  grid-column-gap: var(--gap);

  .col {
    display: grid;
    grid-template-rows: repeat(5, var(--size));
    grid-row-gap: var(--gap);
    grid-gap: var(--gap);
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color);
    font-size: var(--sp-2_5);
    font-weight: 700;
    position: relative;

    span {
      position: relative;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    &:before {
      content: "";
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background-color: var(--shade7);
      background-image: var(--image);
      background-position: center;
      background-size: cover;
      border-radius: var(--radii);
      overflow: hidden;
      z-index: 0;
      transition: background-color 0.2s ease-in-out;
    }

    &:first-child {
      color: var(--shade3);
    }

    &:not(:first-child) {
      &::before {
        background-color: var(--shade8);
      }
    }

    &[data-active="true"] {
      span {
        opacity: 1;
      }
      &:not(:first-child):before {
        background-color: var(--shade10);
      }
    }
  }
`;

const skillOrderCSS = css`
  display: inline-grid;
  grid-template-columns: repeat(3, var(--sp-8));
  margin-left: 20px;
  grid-column-gap: var(--sp-4);

  &__skill {
    display: flex;
    color: var(--color);
    justify-content: center;
    align-items: center;
    background-color: var(--shade10);
    height: var(--sp-6);
    width: var(--sp-6);
    border-radius: var(--br);
    position: relative;

    svg {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: var(--sp-0_5);
      right: calc(-1 * var(--sp-2));
      height: var(--sp-2_5);
      width: var(--sp-2_5);
      transform: translate(100%, 50%);
      color: var(--shade0);
      pointer-events: none;
    }

    &:last-child {
      svg {
        display: none;
      }
    }
  }
`;

export const skillOrder = html`
  <h3 class="type-body2-form--active">
    {{title}}<span class="${skillOrderCSS}"
      >{{#skillOrder}}
      <span class="${skillOrderCSS}__skill" style="{{style}}"
        >{{content}}
        <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.61804 0L0.666626 0.94L3.75704 4L0.666626 7.06L1.61804 8L5.66663 4L1.61804 0Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {{/skillOrder}}</span
    >
  </h3>
  <div class="${container}">
    {{#col}}
    <div class="col">
      {{#row}}
      <div class="row" style="{{style}}" data-active="{{isActive}}">
        <span>{{content}}</span>
      </div>
      {{/row}}
    </div>
    {{/col}}
  </div>
`;
