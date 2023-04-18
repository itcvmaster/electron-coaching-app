import { css } from "goober";

import { buildOrder } from "@/game-lol/in-game-template-build-order.mjs";
import { tagContainerClass } from "@/game-lol/in-game-template-common.mjs";
import { runeTree } from "@/game-lol/in-game-template-runes.mjs";
import { skillOrder } from "@/game-lol/in-game-template-skill-order.mjs";
import html from "@/util/html-template.mjs";

const cssClass = css`
  display: none;

  .section-title {
    text-align: center;
    margin-bottom: var(--sp-3);
  }

  /* ~Left column list of builds~ */
  .builds-list {
    overflow: auto;

    .group-title {
      display: flex;
      align-items: center;
      color: var(--shade3);
      padding: var(--sp-6) var(--sp-4) var(--sp-1) var(--sp-5);
    }

    .build-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--sp-2) var(--sp-6);

      &[data-selected="true"] {
        background: var(--shade7);
        box-shadow: inset 2px 0 var(--turq);
      }
    }
  }

  /* ~Right column rendered selected/imported build~ */
  .selected-build {
    min-height: 600px;
    display: flex;
    flex-direction: column;

    .title {
      display: flex;
      align-items: center;
      height: 72px;
      padding: 0 var(--sp-6);
      column-gap: var(--sp-2);
    }
    .build-name {
      & > span {
        color: var(--shade2);
      }
    }
    .winrate {
      color: var(--blue);
    }
    .imported {
      color: var(--turq);
    }
    .build-body {
      height: 100%;
      display: flex;
    }
    .build-left {
      display: flex;
      flex-direction: column;
      flex: 2;
    }
    .runes {
      flex: 1;
    }
    .skill-order {
      height: 200px;
      padding: 0 var(--sp-6);
    }
    .build-right {
      min-width: 236px;
      flex: 1;
    }
    .build-order {
      height: 100%;
    }
  }

  details {
    color: #0ff !important;
    z-index: 1000;
    background: black;
    position: absolute;
    top: 0;
    left: 0;

    summary {
      width: 120px;
      border: 1px solid #0ff !important;
    }
  }
`;

const template = html`
  <div class="cols builds ${cssClass}">
    <div class="builds-list">
      {{#playstyleBuilds}}
      <div class="group-title">
        <p class="type-caption--bold">{{title}}</p>
      </div>
      {{#buildsList}}
      <div
        class="build-item"
        data-selected="{{isSelected}}"
        onclick="{{initiateImport}}"
      >
        <div>
          <p class="type-caption--bold">{{{title}}}</p>
          <span class="type-caption">{{{games}}}</span>
        </div>
        <div class="flex align-center gap-sp-2">
          <img src="{{keystone}}" width="28" height="28" />
          <img src="{{secondaryTree}}" width="12" height="12" />
          <img src="{{mainItem}}" width="28" height="28" />
        </div>
      </div>
      {{/buildsList}} {{/playstyleBuilds}} {{#proBuilds}}
      <div class="group-title">
        <p class="type-caption--bold">{{title}}</p>
      </div>
      {{#buildsList}}
      <div
        class="build-item"
        data-selected="{{isSelected}}"
        onclick="{{initiateImport}}"
      >
        <div>
          <p class="type-caption--bold">{{{title}}}</p>
          <span class="type-caption">{{{games}}}</span>
        </div>
        <div class="flex align-center gap-sp-2">
          <img src="{{keystone}}" width="28" height="28" />
          <img src="{{secondaryTree}}" width="12" height="12" />
          <img src="{{mainItem}}" width="28" height="28" />
        </div>
      </div>
      {{/buildsList}} {{/proBuilds}}
    </div>
    <div class="selected-build">
      {{#selectedBuild}}
      <header class="title">
        <p class="build-name">{{{title}}}</p>
        <span class="type-caption winrate sm ${tagContainerClass}">
          {{winrate}}
        </span>
        <span class="imported">{{tImportStatus}}</span>
      </header>
      <section class="build-body">
        <article class="build-left">
          <section class="runes">{{#runes}} ${runeTree} {{/runes}}</section>
          <section class="skill-order">
            {{#skillOrder}} ${skillOrder} {{/skillOrder}}
          </section>
        </article>
        <article class="build-right">
          <section class="build-order">
            {{#buildOrder}} ${buildOrder} {{/buildOrder}}
          </section>
        </article>
      </section>
      <details>
        <summary>Build State</summary>
        <pre>{{buildString}}</pre>
      </details>
      {{/selectedBuild}}
    </div>
  </div>
`;

export default template;
