import { css } from "goober";

import { svg as loadingSvg } from "@/inline-assets/loading-ellipsis.svg";
import html from "@/util/html-template.mjs";

const cssClass = css`
  .surface {
    &__mid {
      border-radius: 3px;
      padding: var(--sp-2) var(--sp-4);
      flex-direction: row;
      background-color: var(--shade8);
      margin-bottom: var(--sp-2_5);
    }
  }
  .avatar {
    &__outer {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: var(--sp-12);
      height: var(--sp-12);
      border-radius: 50%;
      background-color: var(--shade5);
      transition: background-color 0.2s ease-in-out;
    }
    &__progress {
      opacity: 0;
      position: absolute;
      border-width: 2px;
      border-radius: 50%;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      animation: rotate 1s linear infinite;
      background-image: linear-gradient(45deg, var(--team) 0%, transparent 30%);
      transition: opacity 0.2s ease-in-out;
    }
    &__inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--sp-11);
      height: var(--sp-11);
      border-radius: 50%;
      border: 2px solid var(--shade8);
      background-color: var(--shade5);
    }
    &__role-img {
      height: var(--sp-5);
      width: var(--sp-5);

      svg {
        height: 100%;
        width: 100%;
      }
    }
    &__champion {
      opacity: 0;
      position: absolute;
      top: -2px;
      left: -2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--sp-11);
      height: var(--sp-11);
      border-radius: 50%;
      border: 2px solid var(--shade8);
      transition: opacity 0s ease-in-out 0s;

      &[data-show] {
        opacity: 1;
        transition: opacity 0.2s ease-in-out 0.2s;
      }
    }
    &__champion-overflow {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
    &__champion-img {
      width: 120%;
      height: 120%;
      object-fit: cover;
      position: relative;
      top: -10%;
      left: -10%;
    }
    &__champion-role-img {
      display: flex;
      opacity: 0;
      align-items: center;
      justify-content: center;
      position: absolute;
      opacity: 0;
      right: 0;
      bottom: 0;
      width: var(--sp-6);
      height: var(--sp-6);
      border-radius: 50%;
      background-color: var(--shade8);
      transform: translate(25%, 25%);

      svg {
        height: var(--sp-3_5);
        width: var(--sp-3_5);
      }

      transition: opacity 0s ease-in-out 0s;

      &[data-show] {
        opacity: 1;
        transition: opacity 0.6s ease-in-out 0.2s;
      }
    }
    &__champion-badge {
      display: flex;
      opacity: 0;
      align-items: center;
      justify-content: center;
      position: absolute;
      opacity: 0;
      right: 0;
      top: 0;
      transform: translate(25%, -25%);
      height: var(--sp-4_5);
      width: var(--sp-4_5);

      svg {
        height: var(--sp-4_5);
        width: var(--sp-4_5);
      }

      transition: opacity 0s ease-in-out 0s;

      &[data-show] {
        opacity: 1;
        transition: opacity 0.6s ease-in-out 0.2s;
      }
    }
  }
  .summoner {
    background-size: 500px;
    background-position: -100px 25%;
    background-repeat: no-repeat;

    &__outer {
      display: flex;
      flex: 1;
      position: relative;
      width: 100%;
    }
    &__local {
      display: none;
      position: absolute;
      width: var(--sp-1);
      background-color: var(--yellow);
      height: 100%;
      left: 0;
      top: 0;
      border-radius: 3px 0px 0px 3px;
    }
    &__spells {
      display: grid;
      position: relative;
      min-width: var(--sp-4);
      grid-template-columns: 1fr;
      grid-template-rows: var(--sp-4) var(--sp-4);
      grid-row-gap: var(--sp-1);
    }
    &__spell {
      display: flex;
      background-color: var(--shade6);
      background-size: cover;
      background-position: center center;
      border-radius: 3px;
    }
    &__details {
      display: flex;
      position: relative;
      height: 100%;
      flex-direction: column;
      padding-left: var(--sp-4);
      width: 0;
      flex: 1;

      &::after {
        content: "";
        position: absolute;
        pointer-events: none;
        top: 0;
        right: 0;
        width: var(--sp-5);
        height: 100%;
        background-image: linear-gradient(
          to left,
          var(--shade8) 0%,
          transparent 100%
        );
      }
    }
    &__name {
      display: flex;
      align-items: center;
      font-size: var(--sp-3_5);
      height: var(--sp-5);
      margin-bottom: var(--sp-1);
    }
    &__mvp {
      display: none;
      margin-left: var(--sp-1);
      font-size: var(--sp-3);
      font-weight: 900;

      &[data-show="true"] {
        display: inline-block;
        padding-left: var(--sp-1);
        background: linear-gradient(86.59deg, #d69c3c 5.62%, #f5c776 94.38%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    &__premade {
      --premade-color: var(--shade8);
      color: var(--premade-color);
      margin-left: var(--sp-1);

      svg {
        height: var(--sp-5);
      }
    }
    &__tags {
      display: flex;
      height: var(--sp-5);
      overflow: auto;
      width: 100%;
      padding-right: var(--sp-5);

      &::-webkit-scrollbar {
        display: none;
      }
    }
    &__tag {
      display: flex;
      pointer-events: none;
      align-items: center;
      justify-content: center;
      background-color: var(--shade6);
      color: var(--shade1);
      border-radius: 2px;
      font-size: var(--sp-3);
      height: 100%;
      padding: 0 var(--sp-0_5);
      white-space: nowrap;

      svg {
        height: var(--sp-5);
        margin: 0 var(--sp-0_5);
      }

      &.positive {
        color: var(--ap);
        background-color: hsla(var(--ap-hsl) / 0.1);
      }
      &.negative {
        color: var(--ad);
        background-color: hsla(var(--ad-hsl) / 0.1);
      }
      &.hot {
        color: var(--tier2);
        background-color: hsla(var(--tier2-hsl) / 0.1);
      }
      &.cold {
        color: var(--blue);
        background-color: hsla(var(--blue-hsl) / 0.1);
      }
      &.hot,
      &.cold {
        svg {
          height: var(--sp-3);
        }
      }

      span:last-child:not(:empty) {
        margin: 0 var(--sp-0_5);
      }

      &:not(:last-child) {
        margin-right: var(--sp-1);
      }
    }
    &[data-progress="in-progress"] {
      .avatar__progress {
        opacity: 1;
      }
    }
    &[data-progress="picked"] {
      .avatar {
        &__champion {
          animation: pop 0.4s ease-in-out;
        }
        &__outer {
          background-color: var(--team);
        }
      }
    }
    &[data-local="true"] {
      .summoner {
        &__local {
          display: block;
        }
        &__name {
          color: var(--yellow);
        }
      }
      .avatar {
        &__role-img {
          color: var(--yellow);
        }
        &__progress {
          background-image: linear-gradient(
            45deg,
            var(--yellow) 0%,
            transparent 30%
          );
        }
      }
      &[data-progress="picked"] {
        .avatar {
          &__outer {
            background-color: var(--yellow);
          }
        }
      }
    }
    &[data-position="false"] {
      .avatar {
        &__champion-role-img,
        &__role-img {
          opacity: 0 !important;
        }
      }
    }

    &::before {
      content: "";
      max-width: 1200px;
      z-index: 0;
      background-image: linear-gradient(
        to right,
        var(--shade8-75) 0%,
        var(--shade8) 30%,
        var(--shade8) 100%
      );
      backdrop-filter: blur(2px);
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      border-radius: 0px 3px 3px 0px;
    }
  }
  .win-rate {
    display: none;
  }
  .ranked-stats,
  .champion-proficiency {
    color: var(--shade3);
    position: relative;
    text-align: center;

    &__grid {
      display: grid;
      opacity: 0;
      place-items: center;
      grid-template-areas:
        "tl tr"
        "bl br";
      transition: opacity 0s ease-in-out 0s;

      &[data-show="true"] {
        transition: opacity 0.2s ease-in-out 0.2s;
        opacity: 1;
      }
      &--fetching {
        position: absolute;
        opacity: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        color: var(--shade0);
        justify-content: center;
        align-items: center;
        transition: opacity 0.2s ease-in-out 0s;

        svg {
          circle {
            animation: pulse 1s linear infinite;
            animation-direction: alternate;
            animation-fill-mode: both;
            animation-play-state: running;
            &:nth-child(1) {
              animation-delay: 0.25s;
            }
            &:nth-child(2) {
              animation-delay: 0.5s;
            }
            &:nth-child(3) {
              animation-delay: 0.75s;
            }
          }
        }

        &[data-hide="true"] {
          opacity: 0;
          svg circle {
            animation-play-state: paused;
          }
        }
      }
    }
    &__champ-win-rate {
      grid-area: tl;
      color: var(--shade0);
      width: var(--sp-11);
      font-size: var(--sp-3_5);
    }
    &__champ-games-played {
      grid-area: bl;
      width: var(--sp-15);
    }
    &__kda {
      grid-area: tr;
      font-size: var(--sp-3_5);
      color: var(--shade3);
    }
    &__kda-breakdown {
      grid-area: br;
      text-align: center;
      width: var(--sp-25);
    }
    &__rank-img {
      display: flex;
      grid-area: tl;
      width: var(--sp-8);
      justify-content: center;
      align-items: center;

      svg {
        height: var(--sp-5);
        width: var(--sp-5);
      }
    }
    &__rank-text {
      grid-area: bl;
    }
    &__win-rate {
      grid-area: tr;
      width: var(--sp-17);
      color: var(--shade0);
      font-size: var(--sp-3_5);
    }
    &__played {
      grid-area: br;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 0.25;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const template = html` <div class="${cssClass} ">
  <div
    class="summoner layout__summoner surface surface__mid"
    style="{{championSplashBackgroundImg}}"
    data-local="{{isLocalPlayer}}"
    data-progress="{{isInProgress}}"
    data-position="{{hasAssignedPosition}}"
    data-champion-splash="{{championImgUrl}}"
  >
    <div class="summoner__spells">
      <div class="summoner__spell" style="{{spell1}}"></div>
      <div class="summoner__spell" style="{{spell2}}"></div>
    </div>
    <div class="summoner__outer">
      <div class="avatar__outer">
        <div class="avatar__progress"></div>
        <div class="avatar__inner">
          <div class="avatar__role-img">{{{roleSvg}}}</div>
          <div class="avatar__champion" data-show="{{championImgUrl}}">
            <div class="avatar__champion-overflow">
              <img class="avatar__champion-img" src="{{championImgUrl}}" />
            </div>
            <div
              class="avatar__champion-role-img"
              data-show="{{championImgUrl}}"
            >
              {{{roleSvg}}}
            </div>
            {{#badge}}
            <div class="avatar__champion-badge" data-show="{{show}}">
              {{{svg}}}
            </div>
            {{/badge}}
          </div>
        </div>
      </div>
      <div class="summoner__details">
        <div class="summoner__name">
          {{name}} <span class="summoner__mvp" data-show="{{isMVP}}">MVP</span>
          {{#premade}}
          <span class="summoner__premade" style="{{premadeStyle}}">
            {{{premadeSvg}}}
          </span>
          {{/premade}}
        </div>
        <div
          onmouseover="{{onMouseOver}}"
          onmouseout="{{onMouseOut}}"
          class="summoner__tags"
        >
          {{#tags}}
          <div class="{{tagClass}}">
            <span>{{{tagIcon}}}</span>
            <span>{{tagText}}</span>
          </div>
          {{/tags}}
        </div>
        <div class="summoner__win-rate">{{enemyWinRate}}</div>
      </div>
    </div>
    {{#rankedStats}}
    <div class="ranked-stats">
      <div class="ranked-stats__grid" data-show="{{hasLeagueProfile}}">
        <div class="ranked-stats__rank-img">{{{svg}}}</div>
        <div class="ranked-stats__rank-text" style="{{rankColor}}">
          {{tier}}
        </div>
        <div class="ranked-stats__win-rate">{{percent}}</div>
        <div class="ranked-stats__played">{{gamesPlayed}}</div>
      </div>
      <div
        class="ranked-stats__grid--fetching"
        data-hide="{{hasLeagueProfile}}"
      >
        ${loadingSvg}
      </div>
    </div>
    <div class="champion-proficiency">
      <div class="champion-proficiency__grid" data-show="{{champSelected}}">
        <div
          class="champion-proficiency__champ-win-rate"
          style="{{champWinRateColor}}"
        >
          {{champWinRate}}
        </div>
        <div class="champion-proficiency__champ-games-played">
          {{champGames}}
        </div>
        <div class="champion-proficiency__kda">
          <span style="{{champKDAColor}}">{{champKDA}}</span
          ><span>&nbsp;{{t_stats_kda}}</span>
        </div>
        <div class="champion-proficiency__kda-breakdown">
          {{champKDAString}}
        </div>
      </div>
      <div
        class="champion-proficiency__grid--fetching"
        data-hide="{{champSelected}}"
      >
        ${loadingSvg}
      </div>
    </div>
    {{/rankedStats}}
  </div>
</div>`;

export default template;
