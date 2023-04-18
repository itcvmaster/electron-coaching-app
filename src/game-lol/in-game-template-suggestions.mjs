import { css } from "goober";

import html from "@/util/html-template.mjs";

const cssClass = css`
  --list-item-height: var(--sp-13);
  --list-items-visibile: 3;
  --group-bg: var(--shade7);
  --skeleton-color: var(--shade9);

  display: none;

  /* ~ Left column ~ */
  .suggestions-list {
  }

  /* ~ Right column ~ */
  .suggestions-right {
    position: relative;
    display: grid;
    padding: var(--sp-8);
  }
  .suggestions-left--header {
    gap: var(--sp-2);
    padding: 0 var(--sp-3) var(--sp-3);
  }
  .suggestions[data-loading="true"] .suggestions-left--header {
    opacity: 0.38;
    pointer-events: none;
  }
  .search-container {
    flex: 1;
    position: relative;
    background: var(--shade6);
    padding-left: var(--sp-9);
    width: 11ch;
    border-radius: var(--br);
    color: var(--shade1);
    box-shadow: var(--highlight);
  }
  .search-container:focus-within {
    background: var(--shade3);
    box-shadow: 0 0 0 3px var(--shade2-15);
  }
  .search-container,
  .search-container .search-input {
    height: var(--sp-9);
  }
  .search-container .search-input {
    background: transparent;
    border: none;
    padding: 0;
    width: 100%;
    color: var(--shade0);
    outline: none;
  }
  .search-container .search-input::-webkit-input-placeholder {
    color: var(--shade2);
    font-weight: 600;
    font-size: var(--sp-3_5);
    line-height: var(--sp-5);
    letter-spacing: -0.009em;
  }
  .search-container .search-icon,
  .search-container .cancel-icon {
    position: absolute;
    width: var(--sp-5);
    height: var(--sp-5);
    top: 50%;
    transform: translateY(-50%);
  }
  .search-container .search-icon {
    left: var(--sp-3);
  }
  .search-container .cancel-icon {
    display: none;
    right: var(--sp-3);
    fill: var(--shade1);
    pointer-events: all;
    cursor: pointer;
  }
  .search-container .cancel-icon:hover {
    fill: var(--shade0);
  }
  .search-container[data-search-active="true"] .cancel-icon {
    display: block;
  }

  .list-header {
    display: block;
    padding: var(--sp-4) var(--sp-4) 0;
    color: var(--shade3);
  }
  .suggestions-lists {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    height: calc(var(--sp-1) * 90);
    height: 25rem;
    padding-inline: var(--sp-3);
    padding-bottom: 4rem;
    overflow-y: scroll;
  }
  .suggestions-lists::-webkit-scrollbar {
    display: none;
  }
  .suggestions-lists::-webkit-scrollbar-thumb {
    border-color: var(--shade8);
  }
  .suggestions-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* ----------------------------------- */
  /* No Search Results */
  .suggestions-list--no-results {
    --q-mark-color: var(--shade10);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 var(--sp-8);
    height: 100%;
  }
  .suggestions-list--no-results .type-body1 {
    color: var(--shade2);
    margin-top: var(--sp-1);
  }
  .suggestions-list--no-results .question-mark {
    margin-bottom: var(--sp-6);
  }
  .suggestions-list--no-results .question-mark .inner {
    fill: var(--q-mark-color);
  }
  .suggestions-list--no-results .question-mark .outer {
    stroke: var(--q-mark-color);
  }
  .suggestions-list--no-results .question-mark .question {
    fill: var(--shade3);
  }

  /* ----------------------------------- */
  /* Suggestions Group */
  .suggestion-group {
    background: var(--group-bg);
    border-radius: var(--br);
  }
  .suggestion-group summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--sp-2);
    padding-right: var(--sp-1);
    height: var(--sp-10);
    cursor: pointer;
    user-select: none;
  }
  .suggestion-group summary h2 {
    display: flex;
    align-items: center;
  }
  .suggestion-group .group-title {
    display: flex;
    align-items: center;
    height: var(--sp-6);
    padding: 0 var(--sp-2);
    color: var(--shade1);
    background: var(--shade1-15);
    border-radius: var(--br-sm);
  }
  .suggestion-group[data-has-results="true"] .group-title {
    color: hsla(var(--phase-color) / 1);
    background: hsla(var(--phase-color) / 0.15);
  }
  .suggestion-group .group-title .champ-img {
    width: 1.25rem;
    margin-left: calc(var(--sp-1_5) * -1);
    background: var(--shade10-50);
    border-radius: var(--br-sm);
    margin-right: var(--sp-1_5);
  }
  .suggestion-group .champ-img .spinner {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 75%;
    height: 75%;
    fill: var(--shade2);
    transform: translate(-50%, -50%);
  }
  .suggestion-group[data-has-results="false"] .champ-img .spinner {
    display: block;
  }
  .suggestion-group .chevron {
    width: var(--sp-4_5);
    height: var(--sp-4_5);
    margin-right: var(--sp-2);
  }
  .suggestion-group .chevron {
    transform: rotate(0.5turn);
    transition: transform var(--transition);
  }
  .suggestion-group[data-has-results="false"] .chevron {
    opacity: 0.38;
  }
  .suggestion-group .show-more {
    padding: var(--sp-2);
  }
  .suggestion-group button {
    display: block;
    width: 100%;
    padding: var(--sp-0_5) 0;
    font-weight: 600;
    font-size: var(--sp-3);
    line-height: var(--sp-6);
    letter-spacing: -0.009em;
    text-align: center;
    color: var(--shade2);
    background: var(--shade3-25);
    border-radius: var(--br-sm);
  }
  .suggestion-group button:hover {
    color: var(--shade1);
    background: var(--shade2-15);
  }

  /* ----------------------------------- */
  /* Suggestion Group w/ no results */
  .suggestion-group[data-has-results="false"] {
    display: none;
  }
  .suggestion-group[data-has-results="false"] .group-title--waiting {
    opacity: 1;
    visibility: visible;
  }
  .suggestion-group[open] .chevron {
    transform: rotate(0turn);
  }
  .suggestion-group[data-has-results="false"] .chevron {
    display: none;
  }

  /* ----------------------------------- */
  /* Suggestion Group w/ a data fetch failure */
  .suggestion-group[data-missing-data="true"] {
    background: hsla(var(--red-hsl) / 0.15);
  }
  .suggestion-group[data-missing-data="true"] .group-title {
    color: var(--red);
    background: hsla(var(--red-hsl) / 0.15);
  }

  /* ----------------------------------- */
  /* Suggestion Item */
  .suggestion-list-item {
    --bg: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--list-item-height);
    padding: 0 var(--sp-2);
    background: var(--bg);
    cursor: pointer;
    user-select: none;
  }
  .suggestion-list-item:hover {
    --bg: var(--shade3-15);
  }
  .suggestion-list-item[data-selected="true"] {
    --bg: var(--shade1-15) !important;
  }
  .suggestion-list-item[data-selected="true"] .champ-portrait {
    box-shadow: 0 0 0 2px hsla(var(--phase-color) / 1);
  }
  .suggestion-list-item .champ-container {
    position: relative;
    margin-right: var(--sp-3);
  }
  .suggestion-list-item .champ-portrait {
    display: block;
    aspect-ratio: 1;
    width: var(--sp-10);
    background: var(--skeleton-color);
    border-radius: var(--br);
  }
  .suggestion-list-item .icon-container {
    position: absolute;
    bottom: -0.25rem;
    right: -0.25rem;
    padding: var(--sp-0_5);
    background: var(--group-bg);
    border-radius: var(--br);
    opacity: 0;
    visibility: hidden;
  }
  .suggestion-list-item .icon-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--bg);
    border-radius: var(--br);
  }
  .suggestion-list-item .icon-container svg {
    width: var(--sp-4);
    color: hsla(var(--phase-color) / 1);
  }
  .suggestion-list-item:hover .icon-container,
  .suggestion-list-item[data-selected="true"] .icon-container {
    opacity: 1;
    visibility: visible;
  }
  .suggestion-list-item .icon-container .checkmark,
  .suggestion-list-item .icon-container .ban {
    display: none;
  }
  [data-phase="banning"] .icon-container .ban {
    display: block;
  }
  [data-phase="finalizing"] .icon-container .checkmark,
  [data-phase="picking"] .icon-container .checkmark {
    display: block;
  }
  .suggestion-list-item .counters {
    --champ-size: var(--sp-4);
    margin: 0;
    padding: 0;
    display: flex;
    gap: -0.5rem;
  }
  .suggestion-list-item .counter.champ-img {
    width: var(--champ-size);
    border-radius: 50%;
  }
  .suggestion-list-item .champ-info {
    display: flex;
    flex-direction: column;
    gap: var(--sp-0_5);
  }
  .suggestion-list-item .champ-stats {
    display: flex;
    align-items: center;
    gap: var(--sp-1_5);
    color: var(--shade2);
    font-weight: 500;
    font-size: var(--sp-2_5);
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .suggestion-list-item .tier-icon {
    width: var(--sp-4);
    height: var(--sp-4);
    transform: translateY(1px);
  }
  .suggestion-list-item .score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--sp-0_5);
    color: var(--shade2);
  }
  .suggestion-list-item .score > * {
    display: flex;
    gap: 0.25rem;
    text-align: right;
  }
  .suggestion-list-item .score-val {
    --stat-color: var(--shade1-hsl);
    position: relative;
    width: var(--sp-11);
    color: var(--stat-color);
    text-align: center;
  }
  .suggestion-list-item[data-banned="true"] {
    pointer-events: none !important;
    filter: saturate(0);
    opacity: 0.38;
  }

  /* ----------------------------------- */
  /* Selected Suggestion */
  .selected-suggestion {
    flex-direction: column;
  }
  .selected-suggestion .suggestion-header {
    margin-bottom: var(--sp-4);
  }
  .selected-suggestion .champ-portrait {
    display: block;
    aspect-ratio: 1;
    width: var(--sp-14);
    margin-right: var(--sp-4);
    border-radius: var(--br);
  }

  .selected-suggestion .stats-blocks {
    gap: var(--sp-2);
  }

  /* synergy pills */
  .selected-suggestion .synergies {
    --pill-height: var(--sp-6);

    gap: var(--sp-1);
    height: var(--pill-height);
    margin-top: var(--sp-1);
    margin-left: calc(var(--sp-1) * -1);
  }
  .selected-suggestion .synergy {
    --wr: var(--shade5);

    height: var(--pill-height);
    padding: 0 var(--sp-2) 0 var(--sp-1_5);
    background: var(--shade8);
    color: var(--wr);
    border-radius: var(--sp-4);
  }
  .selected-suggestion .synergy .synergy-img,
  .selected-suggestion .synergy .synergy-img:is(.teammate) {
    position: relative;
    height: 1rem;
    width: 1rem;
  }
  .selected-suggestion .synergy .synergy-img::before,
  .selected-suggestion .synergy img {
    border-radius: 50%;
  }
  .selected-suggestion .synergy .synergy-img:is(.teammate)::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--shade5);
    box-shadow: 0 0 0 2px var(--shade8);
  }
  .selected-suggestion .synergy img {
    position: absolute;
    position: relative;
    height: 1rem;
    width: 1rem;
  }
  .selected-suggestion .synergy .synergy-img:is(.teammate) {
    margin-left: calc(var(--sp-1) * -1);
  }
  .selected-suggestion .synergy img:not([src]) {
    display: none;
  }
  .selected-suggestion .synergy span {
    margin-left: var(--sp-1);
  }
  .selected-suggestion .synergy[data-synergy-missing="true"] span {
    --wr: var(--shade5);
  }

  /* Blocks */
  .block {
    --radius: var(--br);
    --dark-bg: var(--shade10-25);
    --light-bg: var(--shade8);

    border-radius: var(--radius);
    background: var(--light-bg);
    overflow: hidden;
  }
  .block[data-no-stats="true"] {
    pointer-events: none;
    opacity: 0.38;
  }
  .block-title {
    padding: var(--sp-1) var(--sp-2);
    background: var(--dark-bg);
    color: var(--shade2);
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
  }
  .block-item {
    flex: 1;
    padding: var(--sp-3) var(--sp-4);
  }
  .block-item:first-child {
    border-bottom-left-radius: var(--radius);
  }
  .block-item:last-child {
    border-bottom-right-radius: var(--radius);
  }
  .block-item:not(:last-child) {
    border-right: 1px solid var(--dark-bg);
  }
  .stats-blocks .stat-block .stat-header {
    gap: var(--sp-1);
    height: var(--sp-5);
    margin-bottom: var(--sp-1_5);
    color: var(--shade3);
  }
  .stats-blocks .stat-header svg {
    width: var(--sp-5);
    height: var(--sp-5);
  }
  .stats-blocks .stat-block .stat-value {
    color: var(--stat-color);
  }
  .stats-blocks .stat-block .stat-footer {
    display: block;
    color: var(--shade1);
  }
  .stats-blocks .stat-block[data-placement="1"] .type-subtitle1 {
    color: var(--pro-solid);
  }
  .stats-blocks .stat-block[data-placement="2"] .type-subtitle1,
  .stats-blocks .stat-block[data-placement="3"] .type-subtitle1,
  .stats-blocks .stat-block[data-placement="4"] .type-subtitle1,
  .stats-blocks .stat-block[data-placement="5"] .type-subtitle1 {
    color: var(--turq);
  }
  .stats-blocks .block[data-no-stats="true"] h4,
  .stats-blocks .block[data-no-stats="true"] .stat-footer {
    color: var(--shade3);
  }

  /* Champion stats */
  .selected-suggestion .champ-stats,
  .selected-suggestion .champ-stat {
  }
  .selected-suggestion .champ-stat {
    flex-direction: column;
    gap: var(--sp-2);
    padding: var(--sp-2) var(--sp-3);
  }
  .selected-suggestion .champ-stat:is(:not(:first-child), :not(:last-child)) {
    border-radius: 0;
  }
  .selected-suggestion .champ-stat .champ-stat--bar {
    --bar-radius: var(--sp-1);
    --bar-height: var(--sp-1);

    position: relative;
    display: flex;
    height: var(--bar-height);
    width: 100%;
    background: var(--shade10);
    border-radius: var(--bar-radius);
  }
  .selected-suggestion .champ-stat .champ-stat--bar::before {
    content: "";
    width: var(--fill-percent);
    height: var(--bar-height);
    background: var(--shade0);
    border-radius: var(--bar-radius);
  }
  .selected-suggestion .champ-stat svg {
    width: var(--sp-5);
    margin-right: var(--sp-1);
  }

  /* ----------------------------------- */
  /* Empty Selected Suggestion */
  .empty-suggestions[data-hide="true"] {
    display: none;
  }
  .section-title {
    margin-bottom: var(--sp-1);
  }
  .section-subtitle {
    margin-bottom: var(--sp-4);
    color: var(--shade2);
  }
  .block-title {
    color: hsla(var(--phase-color) / 1);
    background: hsla(var(--phase-color) / 0.15);
  }
  .personal-suggestions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: auto;
    gap: 0.5rem;
  }
  .personal-suggestions .block-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--sp-4);
    padding-top: var(--sp-6);
    background: var(--shade8);
    border-radius: var(--br-lg);
    cursor: pointer;
    transition: background var(--transition), box-shadow var(--transition);
  }
  .personal-suggestions .block-item:hover {
    background: hsla(var(--phase-color) / 0.05);
  }
  .personal-suggestions .block-item:nth-child(1),
  .personal-suggestions .block-item:nth-child(2),
  .personal-suggestions .block-item:nth-child(3) {
    border-bottom: 1px solid var(--dark-bg);
  }
  .personal-suggestions .champ-img-container {
    position: relative;
    margin-bottom: 1rem;
  }
  .personal-suggestions .tier-icon {
    position: absolute;
    width: 1.75rem;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .personal-suggestions .champ-img {
    width: 3rem;
    border-radius: var(--br-lg);
    transition: box-shadow var(--transition);
    box-shadow: 0 0 0 2px var(--tier-color);
  }
  .personal-suggestions .index {
    color: var(--shade2);
  }
  .personal-suggestions .block-item:nth-child(1) .index {
    color: var(--yellow);
  }
  .personal-suggestions button {
    text-align: center;
    color: var(--shade1);
    margin-top: 0.5rem;
    padding: 0 var(--sp-3);
    height: var(--sp-7);
    width: 100%;
    background: hsla(var(--shade2-hsl) / 0.15);
    border-radius: var(--br);
    box-shadow: var(--highlight);
    cursor: pointer;
    transition: background var(--transition), color var(--transition);
  }
  .personal-suggestions .block-item[data-disabled="true"] {
    pointer-events: none;
  }

  .personal-suggestions .block-item[data-disabled="true"] button {
    opacity: 0.38;
  }
  .personal-suggestions .block-item:hover button {
    color: hsla(var(--phase-color) / 1);
    background: hsla(var(--phase-color) / 0.15);
  }

  .empty-loading,
  .empty-error {
    display: none;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0;
      transform: scale(0.9);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .empty-loading .dot {
    background: var(--shade3);
    height: var(--sp-2_5);
    width: var(--sp-2_5);
    border-radius: 50%;
  }
  .empty-icon {
    position: relative;
    padding: var(--sp-3_5);
    margin-bottom: var(--sp-8);
    background: var(--shade10);
    border-radius: 50%;
  }
  .empty-icon::after {
    content: "";
    position: absolute;
    inset: -0.5rem;
    box-shadow: inset 0 0 0 2px var(--shade10);
    border-radius: 50%;
  }
  .empty-icon svg {
    fill: var(--shade3);
  }
  .empty-suggestions[data-loading="true"] .empty-icon,
  .empty-suggestions[data-loading="true"] .empty-text,
  .empty-suggestions[data-error="true"] .empty-icon,
  .empty-suggestions[data-error="true"] .empty-text {
    display: none;
  }
  .empty-suggestions[data-loading="true"] .empty-loading {
    display: flex;
    gap: var(--sp-2);
  }
  .empty-suggestions[data-loading="true"] .empty-loading .dot {
    animation: pulse 1s calc(var(--i) * 0.15s) ease-in-out infinite;
  }
  .empty-suggestions[data-error="true"] .empty-error {
    display: block;
    color: var(--red);
  }

  .suggestions-loading {
    position: absolute;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    inset: 0;
    background: var(--shade9-75);
    z-index: 3;
  }
  .suggestions-loading .circle-loader,
  .suggestions-loading .suggestions-broken {
    width: 10rem;
  }
  .suggestions-loading .suggestions-broken {
    display: none;
    fill: var(--shade5);
  }
  .suggestions-loading p {
    color: var(--shade2);
  }
  .suggestions-loading[data-is-loading="true"] {
    display: flex;
  }
  .suggestions-loading[data-did-error="true"] .circle-loader {
    display: none;
  }
  .suggestions-loading[data-did-error="true"] .suggestions-broken {
    display: block;
  }
  .suggestions-loading .error-message {
    text-decoration: underline;
    margin-top: 1rem;
  }
`;

const suggestionItem = html`
  <li
    class="suggestion-list-item"
    data-loading="{{loading}}"
    data-selected="{{selected}}"
    data-banned="{{banned}}"
    onmouseover="{{mouseOver}}"
    onmouseleave="{{mouseOut}}"
    onclick="{{declareClick}}"
  >
    <div class="flex align-center">
      <div class="champ-container">
        <div class="champ-img champ-portrait">
          <img
            src="{{image}}"
            alt="{{key}}"
            width="40"
            height="40"
            loading="lazy"
          />
        </div>
        <div class="icon-container">
          <svg viewBox="0 0 24 24" class="checkmark">
            <use href="#checkmark" />
          </svg>
          <svg viewBox="0 0 24 24" class="ban">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 18.6667C8.3181 18.6667 5.33333 15.682 5.33333 12.0001C5.33333 10.6413 5.7398 9.37755 6.43779 8.32366L15.6764 17.5623C14.6225 18.2603 13.3587 18.6667 12 18.6667ZM8.32338 6.43801L17.5621 15.6767C18.2601 14.6228 18.6667 13.3589 18.6667 12.0001C18.6667 8.31818 15.6819 5.33341 12 5.33341C10.6412 5.33341 9.37731 5.73994 8.32338 6.43801ZM12 21.3334C6.84534 21.3334 2.66666 17.1547 2.66666 12.0001C2.66666 6.84542 6.84534 2.66675 12 2.66675C17.1547 2.66675 21.3333 6.84542 21.3333 12.0001C21.3333 17.1547 17.1547 21.3334 12 21.3334Z"
              fill="#E44C4D"
            />
          </svg>
        </div>
      </div>
      <div class="champ-info">
        <p class="champ-name type-caption--bold">{{name}}</p>
        <div class="champ-stats">
          {{#metaTier}}
          <svg viewBox="0 0 24 24" class="tier-icon">
            <use href="{{tierIcon}}" />
          </svg>
          {{/metaTier}}
          <span>{{subtext1}}</span>
        </div>
      </div>
    </div>
    <div class="score">
      {{#stat1}}
      <span class="type-caption">
        <span>{{text}}</span>
        <span class="type-caption--bold score-val" style="{{style}}"
          >{{value}}</span
        >
      </span>
      {{/stat1}} {{#stat2}}
      <span class="type-caption">
        <span>{{text}}</span>
        <span class="type-caption--bold score-val" style="{{style}}"
          >{{value}}</span
        >
      </span>
      {{/stat2}}
    </div>
  </li>
`;

const suggestionGroup = html`
  <details
    class="suggestion-group"
    open
    data-has-results="{{hasResults}}"
    data-missing-data="{{dataMissing}}"
  >
    <summary>
      <h2 class="type-form--button group-title">
        {{#titleImg}}
        <div class="champ-img champ-portrait">
          {{!
          <svg viewBox="0 0 24 24" class="spinner"><use href="#spinner" /></svg>
          }}
          <img src="{{src}}" width="20" height="20" />
        </div>
        {{/titleImg}}
        <span>{{title}}</span>
      </h2>
      <svg viewBox="0 0 24 24" class="chevron">
        <use href="#chevron-down" />
      </svg>
    </summary>
    <ol class="suggestions-list">
      {{#list}} ${suggestionItem} {{/list}}
    </ol>
    {{#showMore}}
    <div class="show-more">
      <button onclick="{{click}}">{{text}}</button>
    </div>
    {{/showMore}}
  </details>
`;

const suggestionsPlaceholder = html`
  <div
    class="empty-suggestions"
    data-loading="{{loading}}"
    data-hide="{{hide}}"
  >
    <h4 class="section-title type-h6">{{title}}</h4>
    <p class="type-caption">
      ::DEBUG (REMOVE):: Role: {{role}} Enemy Laner:
      <img
        src="{{enemyLaner}}"
        width="16"
        height="16"
        style="display: inline-block;"
      />
      Pair:
      <img
        src="{{pairTeammate}}"
        width="16"
        height="16"
        style="display: inline-block;"
      />
    </p>
    <p class="section-subtitle type-caption">{{subtitle}}</p>

    <ol class="block-items personal-suggestions">
      {{#list}}
      <li
        class="block-item stat-block"
        style="{{style}}"
        onclick="{{btnClick}}"
        data-disabled="{{btnDisabled}}"
      >
        <div class="champ-img-container">
          <div class="champ-img">
            <img width="60" height="60" src="{{image}}" />
          </div>
          {{#metaTier}}
          <svg viewBox="0 0 24 24" class="tier-icon">
            <use href="{{tierIcon}}" />
          </svg>
          {{/metaTier}}
        </div>
        <h4 class="title type-subtitle1">{{name}}</h4>
        <p class="index type-caption">{{subtitle}}</p>
        <button class="type-form--button">{{btnText}}</button>
      </li>
      {{/list}}
    </ol>
  </div>
`;

const template = html`
  <div
    class="cols suggestions ${cssClass}"
    data-loading="{{loading}}"
    data-suggestions-phase="{{suggestionsPhase}}"
  >
    <div class="suggestions-list">
      <div class="suggestions-left--header flex align-center between">
        <div class="search-container" data-search-active="{{searchActive}}">
          <svg viewBox="0 0 24 24" class="search-icon">
            <use href="#search" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            class="cancel-icon"
            onclick="{{clearSearch}}"
          >
            <use href="#cancel" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="search-input"
            value="{{searchText}}"
            oninput="{{handleSearch}}"
          />
        </div>
      </div>

      <div class="suggestions-lists">
        {{#declaredLaneCounters}} ${suggestionGroup} {{/declaredLaneCounters}}
        {{#declaredGameCounters}} ${suggestionGroup} {{/declaredGameCounters}}
        {{#metaBans}} ${suggestionGroup} {{/metaBans}} {{#teammatesCounters}}
        ${suggestionGroup} {{/teammatesCounters}} {{#laneCounters}}
        ${suggestionGroup} {{/laneCounters}} {{#gameCounters}}
        ${suggestionGroup} {{/gameCounters}} {{#career}} ${suggestionGroup}
        {{/career}} {{#metaPicks}} ${suggestionGroup} {{/metaPicks}}
        {{#teammatesSynergies}} ${suggestionGroup} {{/teammatesSynergies}}
        {{#searchResults}} ${suggestionGroup} {{/searchResults}}
        {{#noSearchResults}}
        <div class="suggestions-list--no-results">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            class="question-mark"
          >
            <path
              class="inner"
              opacity="0.5"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M40 72C57.6731 72 72 57.6731 72 40C72 22.3269 57.6731 8 40 8C22.3269 8 8 22.3269 8 40C8 57.6731 22.3269 72 40 72Z"
            />
            <path
              class="outer"
              opacity="0.5"
              fill="none"
              d="M79 40C79 61.5391 61.5391 79 40 79C18.4609 79 1 61.5391 1 40C1 18.4609 18.4609 1 40 1C61.5391 1 79 18.4609 79 40Z"
              stroke-width="2"
            />
            <path
              class="question"
              d="M37.8468 41.5444V40.8185C37.8468 40.3346 37.9093 39.9132 38.0341 39.5541C38.159 39.1795 38.3541 38.8517 38.6195 38.5707C38.9005 38.2741 39.1502 38.0478 39.3688 37.8917C39.5873 37.72 39.8839 37.5249 40.2585 37.3063C40.7424 37.0098 41.078 36.7912 41.2654 36.6507C41.4527 36.5102 41.6556 36.2761 41.8741 35.9483C42.1083 35.6049 42.2254 35.2146 42.2254 34.7776C42.2254 34.2312 41.999 33.7707 41.5463 33.3961C41.1093 33.0215 40.4693 32.8341 39.6263 32.8341C37.7688 32.8341 36.7776 33.9034 36.6527 36.042L33.4683 35.761C33.5151 33.9659 34.0615 32.5298 35.1073 31.4527C36.1688 30.3756 37.7063 29.8371 39.72 29.8371C41.3902 29.8371 42.7639 30.2898 43.841 31.1951C44.918 32.0849 45.4566 33.201 45.4566 34.5434C45.4566 35.1054 45.3863 35.6049 45.2459 36.042C45.121 36.479 44.918 36.8615 44.6371 37.1893C44.3717 37.5015 44.1141 37.759 43.8644 37.962C43.6146 38.1493 43.3024 38.3522 42.9278 38.5707C42.881 38.602 42.7639 38.68 42.5766 38.8049C42.3893 38.9141 42.2644 38.9844 42.202 39.0156C42.1551 39.0468 42.0459 39.1171 41.8741 39.2263C41.718 39.32 41.6088 39.398 41.5463 39.4605C41.4995 39.5073 41.4137 39.5854 41.2888 39.6946C41.1639 39.8039 41.078 39.8976 41.0312 39.9756C41 40.0537 40.9532 40.1473 40.8907 40.2566C40.8439 40.3659 40.8049 40.4829 40.7737 40.6078C40.758 40.7327 40.7502 40.8576 40.7502 40.9824V41.5444H37.8468ZM37.6595 47V43.5815H41.242V47H37.6595Z"
            />
          </svg>
          <h2 class="type-h6">{{title}}</h2>
          <p class="type-body1">{{subtitle}}</p>
        </div>
        {{/noSearchResults}}
      </div>
    </div>

    <div class="suggestions-right">
      {{#nothingSelected}} ${suggestionsPlaceholder} {{/nothingSelected}}
      {{#selectedSuggestion}}
      <h1>{{title}}</h1>
      {{/selectedSuggestion}}
    </div>
  </div>
`;

export default template;
