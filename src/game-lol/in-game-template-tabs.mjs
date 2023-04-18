import { css } from "goober";

import { ROLE_SYMBOL_TO_STR, ROLE_SYMBOLS } from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import buildsTemplate from "@/game-lol/in-game-template-builds.mjs";
import suggestionsTemplate from "@/game-lol/in-game-template-suggestions.mjs";
import html from "@/util/html-template.mjs";

const container = css`
  --left-col-bg: var(--shade8);

  .cols {
    grid-template-columns: 3.5fr 6.5fr;
    background-color: var(--shade7);
    border-bottom-left-radius: var(--br);
    border-bottom-right-radius: var(--br);

    > div:nth-child(1) {
      width: 21.5rem;
      padding-top: var(--sp-4);
      background: var(--left-col-bg);
    }
    > div:nth-child(2) {
      flex: 1;
    }
  }

  &[data-active-tab="builds"] .cols.builds {
    display: grid;
  }
  &[data-active-tab="suggestions"] .cols.suggestions {
    display: grid;
  }

  /* Select */
  .select-container {
    position: relative;
  }
  .select-container[data-disabled="true"] {
    opacity: 0.38;
    pointer-events: none;
  }
  .select-trigger {
    display: flex;
    align-items: center;
    height: var(--sp-9);
    padding: 0 var(--sp-3);
    background: var(--shade6);
    border-radius: var(--br);
    box-shadow: var(--highlight);
    cursor: pointer;
  }
  .select-trigger:hover {
    background: var(--shade5);
  }
  .select-trigger .selected-role-icon {
    flex-shrink: 0;
    width: var(--sp-4);
    height: var(--sp-4);
    margin-right: var(--sp-1_5);
  }
  .select-trigger .select-text {
    margin-right: var(--sp-2);
  }
  .select-trigger .caret {
    flex-shrink: 0;
    width: var(--sp-4);
    height: var(--sp-4);
    margin-left: var(--sp-2_5);
  }
  .select-options {
    opacity: 0;
    visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: absolute;
    top: 0;
    left: 0;
    padding: var(--sp-2) 0;
    background: var(--shade10);
    border-radius: var(--br);
    z-index: 3;
    transform: scale(0.95);
    transform-origin: top left;
    transition: opacity var(--transition), visibility var(--transition),
      transform var(--transition);
    box-shadow: rgb(0 0 0 / 6%) 0px 3px 2px, rgb(0 0 0 / 9%) 0px 7px 5px,
      rgb(0 0 0 / 11%) 0px 12px 10px, rgb(0 0 0 / 13%) 0px 22px 18px,
      rgb(0 0 0 / 15%) 0px 42px 33px, rgb(0 0 0 / 21%) 0px 100px 80px;
  }
  .select-options.open-left {
    left: unset;
    right: 0;
    transform-origin: top right;
  }
  .select-options[data-show-options="true"] {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
  .select-option {
    display: flex;
    align-items: center;
    height: var(--sp-12);
    padding: 0 var(--sp-12) 0 var(--sp-6);
    white-space: nowrap;
    background: transparent;
    cursor: pointer;
  }
  .select-option:hover {
    background: var(--shade6-50);
  }
  .select-option svg.checkmark {
    opacity: 0;
    visibility: hidden;
    width: var(--sp-6);
    height: var(--sp-6);
    margin-right: var(--sp-5);
  }
  .select-option[data-selected="true"] svg.checkmark {
    opacity: 1;
    visibility: visible;
  }

  /* Opponent select */
  .opponent-select .champ-img {
    margin-left: var(--sp-2);
    width: var(--sp-5);
    background: hsla(var(--shade4-hsl) / 0.5);
    border-radius: 50%;
  }
`;

const header = css`
  --header-height: var(--sp-14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--sp-4);
  height: var(--header-height);
  background: var(--shade7)
    linear-gradient(to top, var(--shade5-15) 0%, transparent 100%);
  border-top-left-radius: var(--br);
  border-top-right-radius: var(--br);
  box-shadow: inset 0 -1px var(--shade3-15);

  .tab-list {
    display: flex;

    .tab {
      --fill: var(--shade2);
      display: flex;
      align-items: center;
      gap: var(--sp-2);
      height: var(--header-height);
      padding: 0 var(--sp-4);
      background: transparent;
      color: var(--fill);
      cursor: pointer;

      svg {
        --size: var(--sp-5);
        fill: var(--fill);
        width: var(--size);
        height: var(--size);
      }

      &[data-active="true"] {
        --fill: var(--shade0);
        box-shadow: inset 0 -2px var(--primary);
      }
      &[data-disabled="true"] {
        pointer-events: none;
        opacity: 0.38;
      }
    }
  }

  .roles {
    display: flex;
    align-items: center;

    &[data-role="top"] .top svg,
    &[data-role="jungle"] .jungle svg,
    &[data-role="mid"] .mid svg,
    &[data-role="adc"] .adc svg,
    &[data-role="support"] .support svg {
      fill: var(--blue);
    }

    > div {
      padding: 0 var(--sp-3);
      margin: 0 1px;
      background: var(--shade6);

      &:first-of-type {
        border-top-left-radius: var(--br-lg);
        border-bottom-left-radius: var(--br-lg);
      }
      &:last-of-type {
        border-top-right-radius: var(--br-lg);
        border-bottom-right-radius: var(--br-lg);
      }

      svg {
        display: block;
        height: var(--sp-8);
        fill: var(--shade2);
      }
    }
  }
`;

const roles = [
  ROLE_SYMBOLS.top,
  ROLE_SYMBOLS.jungle,
  ROLE_SYMBOLS.mid,
  ROLE_SYMBOLS.adc,
  ROLE_SYMBOLS.support,
]
  .map((symbol) => {
    const icon = getRoleIcon(symbol, true);
    const key = ROLE_SYMBOL_TO_STR[symbol]?.key;

    return `<div class="${key}" onclick="{{selectRole}}">${icon}</div>`;
  })
  .join("");

const template = html`
  <section class="${container}" data-active-tab="{{activeTab}}">
    <header class="${header}">
      <ul class="tab-list">
        {{#tabslist}}
        <li>
          <button
            class="tab type-form--tab"
            data-active="{{isActive}}"
            data-disabled="{{disabled}}"
            onclick="{{onclick}}"
          >
            {{{icon}}}
            <span>{{label}}</span>
          </button>
        </li>
        {{/tabslist}}
      </ul>
      <div class="roles" data-role="{{primaryRoleKey}}">${roles}</div>
      {{#roleSelect}}
      <div class="select-container" data-disabled="{{disabled}}">
        <button
          onclick="{{toggleSelectOpen}}"
          class="select-trigger type-form--button"
        >
          <span class="selected-role-icon">{{{selectedRoleIcon}}}</span>
          <span>{{text}}</span>
          <svg viewBox="0 0 24 24" class="caret">
            <use href="#caret-down" />
          </svg>
        </button>
        <div
          class="select-options open-left"
          data-show-options="{{selectOpen}}"
        >
          {{#roleOptions}}
          <button
            onclick="{{selectRole}}"
            class="select-option type-form--button"
            data-selected="{{selected}}"
          >
            <svg viewBox="0 0 24 24" class="checkmark">
              <use href="#checkmark" />
            </svg>
            <span>{{text}}</span>
          </button>
          {{/roleOptions}}
        </div>
      </div>
      {{/roleSelect}}
    </header>
    {{#suggestions}} ${suggestionsTemplate} {{/suggestions}} {{#builds}}
    ${buildsTemplate} {{/builds}}
  </section>
`;

export default template;
