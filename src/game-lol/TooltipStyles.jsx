import { styled } from "goober";

export const TooltipContent = styled("div")`
  padding: var(--sp-3);
  /* tier tooltip */
  &.tier-change {
    display: flex;
    align-items: center;
    padding: 1rem;

    .tier-icon {
      width: 2.5rem;
    }
    .arrow {
      width: 1rem;
      margin: 0 0.75rem;
      fill: var(--shade2);
    }
  }
  /* matchup tooltip */
  &.matchup {
    display: flex;
    align-items: center;

    .matchup-champ {
      display: flex;
      width: var(--sp-18);
      flex-direction: column;
      align-items: center;
      padding: var(--sp-2);

      img {
        height: var(--sp-12);
        width: var(--sp-12);
        border-radius: 50%;
        border: 2px solid var(--blue);
        margin-bottom: var(--sp-2);
      }

      .champ-name {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--blue);
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }

      .champ-winrate {
        font-size: var(--sp-3);
        text-align: center;
      }
    }

    .vs {
      height: var(--sp-7);
      width: var(--sp-7);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--shade8);
      border: 2px solid var(--shade5);
      margin: 0 var(--sp-4);
      transform: rotate(45deg);

      span {
        color: var(--shade0);
        text-transform: uppercase;
        transform: rotate(-45deg);
      }
    }
  }

  /* Spell Tooltip */
  .spell-description {
    word-wrap: break-word;
    max-width: 350px;
    display: block;
  }

  .item-data,
  .spell-data,
  .rune-data {
    word-wrap: break-word;
    max-width: 480px;
    line-height: 1.5;
    display: block;
    color: var(--shade1);
  }
  .spell-data,
  .rune-data {
    display: flex;
  }

  .spell-data {
    max-width: 320px;
  }
  .rune-data {
    max-width: 380px;
  }

  .item-left img,
  .spell-left img,
  .rune-left img {
    height: var(--sp-10);
    left: var(--sp-10);
    margin-right: var(--sp-4);
    border-radius: var(--br);
  }
  .item-right,
  .spell-right {
    flex: 1;
  }
  .item-name,
  .spell-name,
  .rune-name {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1;
    text-align: left;
    margin-bottom: 0.25rem;
    color: var(--shade0);
  }
  .rune-name {
    margin-bottom: var(--sp-2);
  }

  /* Item description */
  .item-data {
    --orange1: #feb131;
    --orange2: #915917;
    --mythic: hsl(39deg 55% 59%);

    --ap: #7b6dff;
    --ad: #af4f23;
    --as: #f9e18c;
    --health: #21975b;
    --mana: #49c8ff;
    --ms: #f0e5d2;
    --shield: var(--white);
    --immolate: #e63710;

    max-width: 425px;
  }

  .item-header {
    display: flex;
    align-items: center;
    margin-bottom: var(--sp-2);
    padding-bottom: 0.25rem;
    border-bottom: var(--sp-px) solid var(--shade8);
  }

  .item-name {
    font-weight: 700;
  }

  .item-description,
  .spell-description,
  .rune-short {
    display: block;
    font-size: var(--sp-3_5);
    text-align: left;
    margin-bottom: var(--sp-2);
  }

  .item-description a {
    color: var(--shade0);
    text-decoration: underline;
  }
  .item-description stats {
    color: var(--shade2);
  }
  .item-description hr,
  .rune-short hr {
    height: var(--sp-px);
    border: none;
    background: var(--shade7);
  }

  .item-description attention {
    font-weight: 700;
    color: var(--shade0);
  }
  .item-description li {
    list-style: none;
    margin: var(--sp-2) 0;
    padding: 0;
  }

  .item-plaintext {
    display: block;
    margin-bottom: 0.25rem;
    text-align: left;
  }

  .item-cost,
  .item-description {
    font-size: 0.875rem;
  }

  .item-cost {
    display: block;
    font-weight: 700;
    text-align: left;
    color: var(--yellow);
  }

  .item-cost span {
    text-align: left;
    color: var(--shade3);
  }
  passive,
  active,
  unique {
    display: inline-block;
    margin-top: var(--sp-2);
    color: var(--shade0);
    font-weight: 700;
  }
  rules {
    color: var(--shade3);
    font-size: var(--sp-3);
  }

  attention,
  active,
  passive,
  immolate,
  ornnBonus {
    font-weight: 700;
  }
  immolate {
    color: var(--immolate);
  }
  magicDamage,
  scaleMR {
    color: var(--ap);
  }
  scaleArmor,
  physicalDamage {
    color: var(--ad);
  }
  speed {
    color: var(--ms);
  }
  shield,
  truedamage {
    color: var(--shield);
  }
  attackSpeed {
    color: var(--as);
  }
  scaleMana {
    color: var(--mana);
  }
  healing {
    color: var(--health);
  }
  rarityMythic {
    font-weight: 700;
    color: var(--mythic);
  }

  /* Runes */
  .rune-data rules {
    margin-top: var(--sp-2);
    color: var(--shade0);
    display: block;
  }
  .rune-short,
  .rune-long {
    display: block;
    text-align: left;
  }
  .rune-treename {
    display: block;
    font-size: var(--sp-4);
    margin: 0;
  }
  .cta {
    margin-top: var(--sp-2);
    color: var(--primary);
    font-size: var(--sp-3);
  }

  /* Summoner spells */
  .spell-missing {
    display: block;
    font-size: var(--sp-3);
    line-height: 1.33;
    text-align: left;
    color: orange;
  }
`;
