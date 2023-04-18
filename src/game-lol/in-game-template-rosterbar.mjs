import { css } from "goober";

import * as ChevronDown from "@/inline-assets/chevron-down.svg";
import * as Minion from "@/inline-assets/lol-minion.svg";
import html from "@/util/html-template.mjs";

const cssClass = css`
  --roster-bar-bg: var(--shade9);
  --timer-height: var(--sp-0_5);

  position: sticky;
  bottom: 0;
  left: var(--left-nav-width);
  right: 0;
  z-index: 1001;

  svg {
    fill: currentColor;
  }
  .live-game {
    display: none !important;
  }
  .container--outer {
    width: var(--sp-container-wrapper);
    margin-inline: auto;
    transform: translateX(-2px); /* render bug fix */
  }
  .container--outer > * {
    position: relative;
    z-index: 1;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: var(--sp-container);
    padding-top: var(--sp-1_5);
    padding-bottom: calc(var(--timer-height) * 3);
    /* background: var(--roster-bar-bg); */
  }
  .container::before {
    content: "";
    position: absolute;
    top: 0;
    left: -0.25rem;
    right: -0.25rem;
    height: calc(100% + 2rem);
    background: var(--roster-bar-bg);
    transition: transform var(--transition);
    z-index: -1;
  }
  &[data-show-bans="true"] .container::before {
    transform: translateY(-32%);
  }

  .team {
    display: flex;
    gap: var(--sp-4);
  }
  /* Player */
  .player {
    --action-primary: var(--shade6);
    --action-secondary: var(--shade6);
    --ban-primary: transparent;
    --ban-secondary: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Player ban */
  .ban-container {
    position: absolute;
    padding: 3px;
    opacity: 0;
    transform: translateY(-80%);
    transition: opacity var(--transition), transform var(--transition);
    transition-delay: calc(var(--index) * 0.05s);
  }
  .ban-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      var(--active-player-deg),
      var(--ban-primary),
      var(--ban-secondary)
    );
    background: conic-gradient(
      from var(--active-player-deg),
      var(--ban-secondary) 60deg,
      var(--ban-primary) 360deg
    );
    border-radius: var(--br);
    z-index: 1;
  }
  &[data-show-bans="true"] .ban-container {
    opacity: 1;
    transform: translateY(-120%);
    transition: opacity var(--transition), transform var(--transition);
    transition-delay: calc(var(--index) * 0.05s);
  }
  .player[data-in-progress="true"] .ban-container::before {
    animation: active-player 3s linear forwards infinite;
  }
  .player .ban-icon {
    position: absolute;
    bottom: -0.25rem;
    right: -0.375rem;
    padding: var(--sp-0_5);
    background: var(--roster-bar-bg);
    border-radius: var(--br-sm);
    z-index: 2;
  }
  .player .ban-icon svg {
    width: var(--sp-3);
    fill: var(--ban-color);
  }
  .player .champ-img.ban-img {
    width: 1.25rem;
    background: var(--shade5);
    box-shadow: 0 0 0 1px var(--roster-bar-bg);
  }

  /* Player champ */
  .player .champ-container {
    position: relative;
    padding: 3px;
    border-radius: var(--br);
  }
  .player .champ-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      var(--active-player-deg),
      var(--action-primary) 0%,
      var(--action-secondary) 80%
    );
    background: conic-gradient(
      from var(--active-player-deg),
      var(--action-secondary) 60deg,
      var(--action-primary) 360deg
    );
    border-radius: var(--br);
    z-index: 1;
  }

  @keyframes active-player {
    from {
      --active-player-deg: 0deg;
    }
    to {
      --active-player-deg: 360deg;
    }
  }
  .player .champ-img {
    width: 2rem;
    background: var(--shade5);
    border-radius: var(--br-sm);
    box-shadow: 0 0 0 1px var(--roster-bar-bg);
    z-index: 1;
  }
  .player[data-is-user="true"] .champ-img {
    background: hsl(39deg 38% 10%);
  }

  .player .player-role {
    position: absolute;
    bottom: -0.25rem;
    right: -0.375rem;
    padding: var(--sp-0_5);
    background: var(--roster-bar-bg);
    border-radius: var(--br-sm);
    z-index: 2;

    svg {
      display: none;
      height: var(--sp-4);
      width: var(--sp-4);
    }
  }
  .player[data-role="false"] .player-role {
    display: none;
  }
  .player[data-role] .player-role svg {
    display: block;
  }
  .player[data-is-user="true"] .player-role svg {
    fill: var(--yellow);
  }
  .player[data-missing="true"] .player-role {
    color: var(--shade5);
  }
  .enemyTeam .player[data-missing="true"] .player-role {
    opacity: 0;
    visibility: hidden;
  }

  /* highlight player when active */
  .player[data-in-progress="true"] {
    --ban-primary: hsl(360deg 74% 60%);
    --ban-secondary: transparent;
  }
  .player[data-in-progress="true"] .champ-container::before {
    animation: active-player 3s linear forwards infinite;
  }

  /* Declaring */
  [data-phase="DECLARING"] & .player[data-in-progress="true"] {
    --action-primary: var(--shade0);
    --action-secondary: var(--shade0-50);
  }

  /* Banning */
  [data-phase="BANNING"] & .player[data-in-progress="true"] {
    --action-primary: var(--red);
    --action-secondary: hsla(var(--red-hsl) / 0.35);
  }
  .player[data-in-progress="true"] .ban-container {
    --ban-primary: hsl(360deg 74% 80%);
    --ban-secondary: transparent;
  }
  .player[data-has-banned="true"] .ban-container {
    --ban-primary: transparent !important;
    --ban-secondary: transparent !important;
  }

  /* Picking */
  [data-phase="CHOOSING_RED"] & .player[data-in-progress="true"],
  [data-phase="CHOOSING_BLUE"] & .player[data-in-progress="true"] {
    --action-primary: var(--blue);
    --action-secondary: hsla(var(--blue-hsl) / 0.35);
  }

  /* User is always yellow */
  .player[data-is-user="true"] {
    --action-primary: var(--yellow) !important;
    --action-secondary: var(--yellow) !important;
  }
  .player[data-is-user="true"][data-in-progress="true"] {
    --action-primary: var(--yellow) !important;
    --action-secondary: hsla(var(--yellow-hsl) / 0.35) !important;
  }

  /* CTA buttons */
  .buttons {
    --bans-btn-width: var(--sp-14);
    --btn-gap: var(--sp-2);

    gap: var(--btn-gap);
    /* transform: translateX(calc(var(--bans-btn-width) + var(--btn-gap))); */
  }
  .cta-button {
    --height: var(--sp-11);
    --width: calc(var(--sp-1) * 68);
    --btn-color: transparent;
  }
  .cta-button button {
    height: var(--height);
    min-width: var(--width);
    color: var(--shade1);
    text-align: center;
    white-space: nowrap;
    padding: 0;
    background: hsla(var(--btn-color) / 1);
    border: none;
    border-radius: var(--br);
    cursor: pointer;
    pointer-events: none;
  }
  .cta-button .timeleft {
    margin-left: 0.5ch;
    opacity: 0.5;
  }
  .cta-button .timeleft::before {
    content: "(";
  }
  .cta-button .timeleft::after {
    content: ")";
  }
  @keyframes cta-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 hsla(var(--btn-color) / 0);
    }
    50% {
      box-shadow: 0 0 20px hsla(var(--btn-color) / 0.5);
    }
  }
  .cta-button[data-lockin-enabled="true"] button {
    --btn-color: var(--blue-hsl);

    color: var(--white);
    box-shadow: 0 0 24px hsla(var(--btn-color) / 0.75), var(--highlight);
    opacity: 1;
    pointer-events: all;
    animation: cta-pulse 3s ease-in-out infinite;
    transition: filter var(--transition);
  }
  .cta-button[data-lockin-enabled="true"] button:hover {
    filter: brightness(1.1);
  }
  [data-phase="BANNING"] .cta-button[data-lockin-enabled="true"] button {
    --btn-color: var(--red-hsl);
  }
  [data-phase="DECLARING"] .cta-button[data-lockin-enabled="true"] button,
  [data-phase="CHOOSING_RED"] .cta-button[data-lockin-enabled="true"] button,
  [data-phase="CHOOSING_BLUE"] .cta-button[data-lockin-enabled="true"] button {
    --btn-color: var(--blue-hsl);
  }
  .cta-button[data-lockin-enabled="false"] .timeleft {
    display: none;
  }

  .bans-button {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--sp-8);
    width: var(--bans-btn-width);
    padding: 0 0.5rem 0 0.5rem;
    background: var(--shade6);
    color: var(--shade1);
    border-radius: var(--br);
    cursor: pointer;
  }
  .bans-button svg.minion {
    width: 1.125rem;
    height: 1.125rem;
  }
  .bans-button svg.caret {
    width: 1rem;
    height: 1rem;
  }
  &[data-show-bans="true"] .bans-button svg.caret {
    transform: rotate(0.5turn);
  }
  &[data-bans-disabled="true"] .bans-button {
    pointer-events: none;
    opacity: 0.38;
  }

  /* Phase timer bar */
  .phase-timer {
    --timer-color: var(--phase-color);

    position: absolute;
    bottom: 0;
    height: var(--timer-height);
    width: 100%;
    background: hsla(var(--timer-color) / 0.25);
    overflow: hidden;
  }
  .phase-timer::after {
    content: "";
    position: absolute;
    inset: 0;
    background: hsla(var(--timer-color) / 1);
    transform: translateX(0%);
  }
  .phase-timer[data-counting-down="true"]::after {
    animation: phaseProgress var(--total-phase-time) linear forwards 1;
  }
  .phase-timer[data-counting-down="false"] {
    --timer-color: var(--shade7-hsl);
  }
  &[data-user-lockedin="true"] .phase-timer {
    --timer-color: transparent;
    display: none;
  }

  @keyframes phaseProgress {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

const player = html`
  <div
    class="player"
    data-is-user="{{isUser}}"
    data-role="{{role}}"
    data-in-progress="{{isInProgress}}"
    data-missing="{{missing}}"
    data-has-banned="{{hasBanned}}"
    data-lockedin="{{lockedIn}}"
    style="{{style}}"
  >
    <div class="ban-container">
      <div class="champ-img ban-img">
        <img width="22" height="22" src="{{championBanImage}}" />
      </div>
      <div class="ban-icon">
        <svg viewBox="0 0 24 24"><use href="#ban" /></svg>
      </div>
    </div>
    <div class="champ-container">
      <div class="champ-img">
        <img width="34" height="34" src="{{championImage}}" />
      </div>
      <div class="player-role">{{{roleIcon}}}</div>
    </div>
  </div>
`;

const template = html`
  <div
    class="${cssClass}"
    data-show-bans="{{showBans}}"
    data-bans-disabled="{{bansDisabled}}"
    data-user-lockedin="{{userLockedIn}}"
  >
    <div class="container--outer">
      <div class="container">
        <!-- My team -->
        <div class="team myTeam">{{#myTeam}}${player}{{/myTeam}}</div>
        <div class="flex align-center buttons">
          {{#ctaButton}}
          <div class="cta-button" data-lockin-enabled="{{enabled}}">
            <button class="type-form--button" onclick="{{lockInClick}}">
              <span>{{text}}</span>
              <span class="timeleft">{{timeLeft}}</span>
            </button>
          </div>
          {{/ctaButton}}
          <button class="bans-button" onclick="{{toggleShowBans}}">
            ${Minion.svg} ${ChevronDown.svg}
          </button>
        </div>
        <!-- Enemy team -->
        <div class="team enemyTeam">{{#enemyTeam}}${player}{{/enemyTeam}}</div>
        {{#phaseTimer}}
        <div
          class="phase-timer"
          data-counting-down="{{countdownIsActive}}"
          style="{{style}}"
        ></div>
        {{/phaseTimer}}
      </div>
    </div>
  </div>
`;

export default template;
