import { css } from "goober";

import damageTemplate from "@/game-lol/in-game-template-damage.mjs";
import iconsTemplate from "@/game-lol/in-game-template-icons.mjs";
import phaseHeadingTemplate from "@/game-lol/in-game-template-phase-heading.mjs";
import rosterbarTemplate from "@/game-lol/in-game-template-rosterbar.mjs";
import summonerTemplate from "@/game-lol/in-game-template-summoner.mjs";
import tabsTemplate from "@/game-lol/in-game-template-tabs.mjs";
import html from "@/util/html-template.mjs";

const rootClass = css`
  --ban-color: var(--primary);
  --pick-color: var(--blue);
  --phase-color: var(--shade1-hsl);
  display: flex;
  position: relative;
  flex-direction: column;
  width: var(--sp-container);
  margin: auto;

  img:not([src]),
  img[src="0"] {
    opacity: 0;
    visibility: hidden;
  }

  [data-show="false"] {
    display: none;
  }

  &[data-phase="DECLARING"] {
    --phase-color: var(--shade1-hsl);
  }
  &[data-phase="BANNING"] {
    --phase-color: var(--red-hsl);
  }
  &[data-phase="PICKING"] {
    --phase-color: var(--blue-hsl);
  }

  .champ-img {
    position: relative;
    overflow: hidden;
    width: 1.5rem;
    aspect-ratio: 1 / 1;

    img {
      position: absolute;
      display: block;
      width: 116%;
      left: -8%;
      top: -8%;
    }
  }

  &[data-flow="GAME"] {
    .header {
      &__draft {
        display: none;
      }
      &__in-game {
        display: inline;
      }
    }
    .summoner {
      &__win-rate {
        display: none;
      }
    }
  }

  &[data-flow="PICK"] {
    .header {
      &__draft {
        display: inline;
      }
      &__in-game {
        display: none;
      }
    }
    .summoner {
      &__win-rate {
        display: none;
      }
    }
    .surface {
      display: flex;
      flex-direction: row;

      &__high {
        height: 100%;
        width: 100%;

        &:first-of-type {
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
          padding-right: var(--sp-1);
        }
        &:last-of-type {
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
          padding-left: var(--sp-1);
          min-width: unset;

          .header,
          .layout__summoner {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            width: 100%;
            background-image: none !important;
          }
          .summoner {
            &__outer {
              display: flex;
              flex-direction: row-reverse;
            }
            &__name {
              text-align: right;
              color: var(--red);
            }
            &__spells,
            &__tags {
              display: none;
            }
            &__details {
              padding-right: var(--sp-2);
              padding-left: 0;

              &::after {
                display: none;
              }
            }
            &__win-rate {
              text-align: right;
              display: block;
              color: var(--shade1);
            }
            .ranked-stats,
            .champion-proficiency {
              display: none;
            }
          }
          .surface {
            &__mid {
              padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-4);
            }
          }
        }
        &:not(:last-child) {
          margin-bottom: 0;
        }
      }
    }
  }

  .layout {
    &__summoner {
      position: relative;
      display: grid;
      align-items: center;
      grid-template-columns: var(--sp-4) 1fr 100px 160px;
      grid-column-gap: var(--sp-2);
      font-size: var(--sp-3);
    }
  }

  .surface {
    display: grid;
    flex-direction: column;

    &__high {
      display: none;
      flex-direction: column;
      border-radius: 5px;
      padding: var(--sp-6);
      background-color: var(--shade7);
      min-width: 668px;

      &:not(:last-child) {
        margin-bottom: var(--sp-4);
      }

      &[data-show="true"] {
        display: flex;
      }
    }
  }

  .header {
    grid-template-columns: 1fr 100px 160px;
    height: var(--sp-7);
    padding: 0 var(--sp-3) var(--sp-2);
    font-weight: 100;
    line-height: var(--sp-4_5);
    color: var(--shade2);
    text-align: center;

    span {
      &:first-child {
        text-align: left;
      }
    }

    &__ally {
      span {
        &:first-child {
          color: var(--blue);
        }
      }
    }
    &__enemy {
      span {
        &:first-child {
          color: var(--red);
        }
      }
    }
  }
`;

// TODO(artokun): Reorder tabs section to be after summoners section
// TODO: replace svg icons template with inline-assets
const template = html`
  ${iconsTemplate}
  <div class="${rootClass}" data-flow="{{flow}}" data-phase="{{currPhase}}">
    {{#phaseHeading}} ${phaseHeadingTemplate} {{/phaseHeading}} {{#tabs}}
    ${tabsTemplate} {{/tabs}}
    <details>
      <summary>Current State</summary>
      <pre>{{currentStateDisplay}}</pre>
    </details>
    <div class="surface">
      {{#summoners}}
      <div
        class="surface__high"
        data-show="{{hasMyTeam}}"
        style="--team: var(--blue)"
      >
        <div class="layout__summoner header header__ally">
          <span>{{t_teams_your}}</span>
          <span>{{t_rankedStats}}</span>
          <span>{{t_championProficiency}}</span>
        </div>
        {{#myTeam}} ${summonerTemplate} {{/myTeam}} {{#myTeamDamage}}
        ${damageTemplate} {{/myTeamDamage}}
      </div>
      <div
        class="surface__high"
        data-show="{{hasTheirTeam}}"
        style="--team: var(--red)"
      >
        <div class="layout__summoner header header__enemy">
          <span>{{t_teams_enemy}}</span>
          <span class="header__in-game">{{t_rankedStats}}</span>
          <span class="header__in-game">{{t_championProficiency}}</span>
          <span class="header__draft"></span>
        </div>
        {{#theirTeam}} ${summonerTemplate} {{/theirTeam}} {{#theirTeamDamage}}
        ${damageTemplate} {{/theirTeamDamage}}
      </div>
      {{/summoners}}
    </div>
    {{#rosterbar}} ${rosterbarTemplate} {{/rosterbar}}
  </div>
`;

export default template;
