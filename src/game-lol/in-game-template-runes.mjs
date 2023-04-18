import { css } from "goober";

import html from "@/util/html-template.mjs";

const container = css`
  --tree-color: var(--shade3);
  --keystone-size: var(--sp-13);
  --rune-size: var(--sp-10);
  --shard-size: var(--sp-6_5);
  --col-gap: var(--sp-2);
  --row-gap: var(--sp-4);
  --radii: 50%;

  display: flex;
  justify-content: center;
  gap: var(--sp-5);

  /* ~ RUNES ~ */
  .tree {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--row-gap);
  }
  .tree-row {
    display: flex;
    gap: var(--col-gap);

    &[data-keystones="true"] {
      --col-gap: 0;
    }
  }

  .rune-tree-img {
    width: var(--sp-7);
    height: var(--sp-7);
    padding: var(--sp-1);
    border-radius: 50%;
    border: 1px solid var(--tree-color);

    .rune-img {
      border: none;
    }

    &[data-active="false"] {
      --tree-color: transparent !important;
    }
  }

  .rune-img {
    --size: var(--sp-8);
    opacity: 0.5;
    width: var(--size);
    max-width: 100%;
    border: 2px solid var(--shade3);
    border-radius: var(--radii);
    filter: saturate(0);
    cursor: pointer;

    &[data-keystone="true"] {
      --size: var(--keystone-size);
      --radii: 0;
      border: none;
      box-shadow: none;
    }

    &[data-active="true"] {
      border-color: var(--tree-color);
      opacity: 1;
      filter: saturate(1);
    }

    &.shard {
      --size: var(--shard-size);

      &[data-active="true"] {
        border-color: var(--yellow);
      }
    }
  }
`;

export const runeTree = html`
  <h3 class="section-title type-body2-form--active">{{title}}</h3>
  <div class="${container}">
    <div class="tree tree-primary" style:--tree-color="{{primaryColor}}">
      <div class="flex align-center gap-sp-1">
        {{#runeTreesLeft}}
        <div class="rune-tree-img" data-active="{{active}}">
          <img
            src="{{image}}"
            class="rune-img"
            data-active="{{active}}"
            width="18"
            height="18"
          />
        </div>
        {{/runeTreesLeft}}
      </div>
      {{#primaryRows}}
      <div class="tree-row" data-keystones="{{keystoneRow}}">
        {{#row}}
        <img
          src="{{image}}"
          class="rune-img"
          data-keystone="{{isKeystone}}"
          data-active="{{active}}"
          width="32"
          height="32"
        />
        {{/row}}
      </div>
      {{/primaryRows}}
    </div>
    <div class="tree tree-secondary" style:--tree-color="{{secondaryColor}}">
      <div class="flex align-center gap-sp-1">
        {{#runeTreesRight}}
        <div class="rune-tree-img" data-active="{{active}}">
          <img
            src="{{image}}"
            class="rune-img"
            data-active="{{active}}"
            width="18"
            height="18"
          />
        </div>
        {{/runeTreesRight}}
      </div>
      <div class="flex column align-center gap-sp-4">
        {{#secondaryRows}}
        <div class="tree-row">
          {{#row}}
          <img
            src="{{image}}"
            class="rune-img"
            data-active="{{active}}"
            width="32"
            height="32"
          />
          {{/row}}
        </div>
        {{/secondaryRows}}
      </div>
      <div class="flex column align-center gap-sp-2">
        {{#shards}}
        <div class="tree-row">
          {{#row}}
          <img
            src="{{image}}"
            class="rune-img shard"
            data-active="{{active}}"
            width="32"
            height="32"
          />
          {{/row}}
          <div>{{/shards}}</div>
        </div>
      </div>
    </div>
  </div>
`;
