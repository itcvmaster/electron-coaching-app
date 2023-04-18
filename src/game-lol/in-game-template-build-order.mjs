import { css } from "goober";

import html from "@/util/html-template.mjs";

const container = css`
  --gap: var(--sp-1);
  --row-gap: var(--sp-3);
  --size: var(--sp-9);
  --size-inner: var(--sp-7);
  --radii: var(--br-sm);
  --background: var(--shade8);
  --image: initial;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  /* ~ BUILD ORDER ~ */
  h3 {
    margin-bottom: var(--row-gap);

    &:not(:first-of-type) {
      margin-top: var(--sp-5);
    }
  }

  .list {
    display: flex;
    background-color: var(--background);
    padding: var(--gap);
    box-sizing: content-box;
    border-radius: var(--radii);

    &.individual {
      background-color: initial;
      padding: initial;
      display: grid;
      grid-template-columns: repeat(4, var(--sp-8));
      row-gap: var(--sp-4);
      column-gap: var(--sp-4);

      figure {
        margin-right: initial;
        background-color: var(--background);
        padding: var(--gap);
        border-radius: var(--radii);
        position: relative;
        width: var(--size);
        height: var(--size);

        &[data-is-mythic="true"] {
          padding: var(--sp-0_5);

          &::before {
            content: "";
            position: absolute;
            top: -1px;
            left: -1px;
            width: calc(100% - var(--sp-0_5));
            height: calc(100% - var(--sp-0_5));
            border: var(--sp-0_5) solid var(--yellow);
            border-radius: var(--br);
          }

          &::after {
            content: "";
            height: var(--sp-2_5);
            width: var(--sp-2_5);
            border: 1px solid var(--shade10);
            background: linear-gradient(
              145deg,
              #ffc52f -2.94%,
              #ffe792 29.89%,
              #d68000 88.3%
            );
            transform: translate(-50%, -50%) rotate(45deg);
            position: absolute;
            top: 0;
            left: 50%;
          }
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: var(--sp-0_5);
          right: 0;
          height: var(--sp-4);
          width: var(--sp-4);
          transform: translate(100%, 50%);
          background-color: var(--background);
          color: var(--shade3);
          pointer-events: none;
        }

        &:nth-child(4n),
        &:last-child {
          span {
            display: none;
          }
        }
      }
    }
  }

  figure {
    width: var(--size-inner);
    height: var(--size-inner);
    position: relative;

    &:not(:last-child) {
      margin-right: var(--gap);
    }

    &[data-is-mythic="true"] {
      padding: var(--sp-0_5);

      &::before {
        content: "";
        position: absolute;
        top: calc(-1 * var(--sp-0_5));
        left: calc(-1 * var(--sp-0_5));
        width: 100%;
        height: 100%;
        border: var(--sp-0_5) solid var(--yellow);
        border-radius: var(--br);
        pointer-events: none;
        z-index: 1;
      }

      &::after {
        content: "";
        height: var(--sp-2);
        width: var(--sp-2);
        border: 1px solid var(--shade10);
        background: linear-gradient(
          145deg,
          #ffc52f -2.94%,
          #ffe792 29.89%,
          #d68000 88.3%
        );
        transform: translate(-50%, -50%) rotate(45deg);
        position: absolute;
        top: -1px;
        left: 50%;
        z-index: 2;
      }
    }
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: var(--radii);
  }
`;

export const buildOrder = html`
  <div class="${container}">
    <h3 class="type-body2-form--active">{{tSummoners}}</h3>
    <div class="list">
      {{#summonerSpells}}
      <figure data-is-mythic="{{isMythic}}">
        <img src="{{image}}" />
      </figure>
      {{/summonerSpells}}
    </div>
    <h3 class="type-body2-form--active">{{tStarting}}</h3>
    <div class="list">
      {{#startingItems}}
      <figure data-is-mythic="{{isMythic}}">
        <img src="{{image}}" />
      </figure>
      {{/startingItems}}
    </div>
    <h3 class="type-body2-form--active">{{tBuildOrder}}</h3>
    <div class="list individual">
      {{#buildOrderItems}}
      <figure data-is-mythic="{{isMythic}}">
        <img src="{{image}}" />
        <span>
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.61804 0L0.666626 0.94L3.75704 4L0.666626 7.06L1.61804 8L5.66663 4L1.61804 0Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </figure>
      {{/buildOrderItems}}
    </div>
    <h3 class="type-body2-form--active">{{tFinalBuild}}</h3>
    <div class="list">
      {{#finalBuildItems}}
      <figure data-is-mythic="{{isMythic}}">
        <img src="{{image}}" />
      </figure>
      {{/finalBuildItems}}
    </div>
    <h3 class="type-body2-form--active">{{tSituational}}</h3>
    <div class="list">
      {{#situationalItems}}
      <figure data-is-mythic="{{isMythic}}">
        <img src="{{image}}" />
      </figure>
      {{/situationalItems}}
    </div>
  </div>
`;
