import React from "react";
import { Trans } from "react-i18next";
import { styled } from "goober";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import { Caption } from "@/game-lol/CommonComponents.jsx";
import ItemImg from "@/game-lol/ItemImg.jsx";
import HextechMatchInhibitor from "@/inline-assets/hextech-match-inhibitor.svg";
import HextechMatchTurret from "@/inline-assets/hextech-match-turret.svg";
import HextechMonsterBaron from "@/inline-assets/hextech-monster-baron.svg";
import HextechMonsterCloud from "@/inline-assets/hextech-monster-cloud.svg";
import HextechMonsterElder from "@/inline-assets/hextech-monster-elder.svg";
import HextechMonsterInfernal from "@/inline-assets/hextech-monster-infernal.svg";
import HextechMonsterMountain from "@/inline-assets/hextech-monster-mountain.svg";
import HextechMonsterOcean from "@/inline-assets/hextech-monster-ocean.svg";
import HextechMonsterRiftHerald from "@/inline-assets/hextech-monster-riftherald.svg";

const WardImg = styled(ItemImg)`
  width: var(--sp-5);
  height: auto;
  display: inline-block;
  margin: 0 4px;
  transform: translateY(5px);
  border-radius: var(--br-sm);
`;

export default function MatchTimeline({
  t,
  item,
  isKiller,
  isVictim,
  playerChampionID,
  playerChampionKey,
  participants,
  // textImg,
}) {
  const textImg = {
    display: "inline-block",
    marginTop: -4,
    marginLeft: 4,
  };

  if (!item.type) return null;

  switch (item.type) {
    case "CHAMPION_KILL": {
      const victim = participants.find(
        (p) => p && p.participantId === item.victimId
      );
      const killer = participants.find(
        (p) => p && p.participantId === item.killerId
      );
      if (isVictim) {
        return (
          <>
            {killer ? (
              <div className="flex wrap">
                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={18}
                  style={{
                    transfrom: "translateY(5px)",
                    marginRight: "var(--sp-1)",
                  }}
                  championId={killer.championId}
                  championKey={killer.championName}
                />

                <Caption>
                  <Trans
                    i18nKey="lol:killedYou"
                    style={{
                      marginLeft: "var(--sp-2)",
                      marginRight: "var(--sp-2)",
                      color: "var(--shade0)",
                    }}
                  >
                    {{ summonerName: killer.summonerName }}
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      killed
                    </span>
                    you
                  </Trans>
                </Caption>
              </div>
            ) : (
              <div className="flex wrap">
                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={18}
                  style={{
                    transfrom: "translateY(5px)",
                    marginRight: "var(--sp-1)",
                  }}
                  championId={playerChampionID}
                  championKey={playerChampionKey}
                />
                <Caption>
                  <Trans
                    i18nKey="lol:gotExecuted"
                    style={{
                      marginLeft: "var(--sp-2)",
                      marginRight: "var(--sp-2)",
                    }}
                  >
                    You got
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      executed
                    </span>
                  </Trans>
                </Caption>
              </div>
            )}
          </>
        );
      }
      return (
        <>
          <div className="flex wrap">
            <ChampionImg
              disabled
              displayInline
              disableDataTip
              size={18}
              style={{
                transfrom: "translateY(5px)",
                marginRight: "var(--sp-1)",
              }}
              championId={playerChampionID}
              championKey={playerChampionKey}
            />
            {!isVictim && isKiller ? (
              <>
                <Caption>
                  <Trans
                    i18nKey="lol:youKilled"
                    style={{
                      marginLeft: "var(--sp-2)",
                      marginRight: "var(--sp-2)",
                    }}
                  >
                    You
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      killed
                    </span>
                    {{ enemy: victim?.summonerName }}
                  </Trans>
                </Caption>
                <ChampionImg
                  disabled
                  disableDataTip
                  displayInline
                  size={18}
                  style={{
                    transfrom: "translateY(5px)",
                    marginLeft: "var(--sp-1)",
                  }}
                  championId={victim?.championId}
                  championKey={victim?.championName}
                />
              </>
            ) : (
              <>
                <Caption>
                  <Trans i18nKey="lol:youAssistedKilling">
                    Assisted with
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      killing
                    </span>
                    {{ enemy: victim?.summonerName }}
                  </Trans>
                </Caption>

                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={20}
                  style={{
                    transfrom: "translateY(5px)",
                    marginLeft: "var(--sp-1)",
                  }}
                  championId={victim?.championId}
                  championKey={victim?.championName}
                />
              </>
            )}
          </div>
        </>
      );
    }
    case "WARD_PLACED": {
      const creator = participants.find(
        (p) => p && p.participantId === item.creatorId
      );
      switch (item.wardType) {
        case "CONTROL_WARD":
          return (
            <>
              <div className="flex wrap">
                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={18}
                  style={{
                    transfrom: "translateY(5px)",
                    marginRight: "var(--sp-1)",
                  }}
                  championId={creator.championId}
                  championKey={creator.championName}
                />
                <Caption>
                  {t("lol:placedControlWard", "Placed a control ward")}
                </Caption>
                <WardImg itemId={2055} />
              </div>
            </>
          );
        default:
          return (
            <>
              <div className="flex wrap">
                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={20}
                  style={{
                    transfrom: "translateY(5px)",
                    marginRight: "var(--sp-1)",
                  }}
                  championId={creator.championId}
                  championKey={creator.championName}
                />
                <Caption>{t("lol:placedTrinket", "Placed a trinket")}</Caption>
                <WardImg itemId={3340} />
              </div>
            </>
          );
      }
    }
    case "BUILDING_KILL":
      switch (item.buildingType) {
        case "TOWER_BUILDING":
          return (
            <>
              <div className="flex wrap">
                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={20}
                  style={{
                    transfrom: "translateY(5px)",
                    marginRight: "var(--sp-1)",
                  }}
                  championId={playerChampionID}
                  championKey={playerChampionKey}
                />
                <Caption>
                  {(() => {
                    switch (isKiller) {
                      case true:
                        switch (item.towerType) {
                          case "INNER_TURRET":
                            return (
                              <Trans i18nKey="lol:youDestroyed.INNER_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          case "OUTER_TURRET":
                            return (
                              <Trans i18nKey="lol:youDestroyed.OUTER_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          case "BASE_TURRET":
                            return (
                              <Trans i18nKey="lol:youDestroyed.BASE_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          case "NEXUS_TURRET":
                            return (
                              <Trans i18nKey="lol:youDestroyed.NEXUS_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          default:
                            break;
                        }
                        break;
                      case false:
                        switch (item.towerType) {
                          case "INNER_TURRET":
                            return (
                              <Trans i18nKey="lol:youAssistedDestroying.INNER_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          case "OUTER_TURRET":
                            return (
                              <Trans i18nKey="lol:youAssistedDestroying.OUTER_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          case "BASE_TURRET":
                            return (
                              <Trans i18nKey="lol:youAssistedDestroying.BASE_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          case "NEXUS_TURRET":
                            return (
                              <Trans i18nKey="lol:youAssistedDestroying.NEXUS_TURRET">
                                You destroyed
                                <span
                                  style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontWeight: 700,
                                    color: "var(--shade0)",
                                  }}
                                >
                                  a turret
                                  <HextechMatchTurret style={textImg} />
                                </span>
                              </Trans>
                            );
                          default:
                            break;
                        }
                        break;
                      default:
                        break;
                    }
                  })()}
                </Caption>
              </div>
            </>
          );
        case "INHIBITOR_BUILDING":
          return (
            <>
              <div className="flex wrap">
                <ChampionImg
                  disabled
                  displayInline
                  disableDataTip
                  size={20}
                  style={{
                    transfrom: "translateY(5px)",
                    marginRight: "var(--sp-1)",
                  }}
                  championId={playerChampionID}
                  championKey={playerChampionKey}
                />
                <Caption>
                  {isKiller ? (
                    <Trans i18nKey="lol:youDestroyed.INHIBITOR">
                      You destroyed
                      <span
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          fontWeight: 700,
                          color: "var(--shade0)",
                        }}
                      >
                        an inhibitor
                        <HextechMatchInhibitor style={textImg} />
                      </span>
                    </Trans>
                  ) : (
                    <Trans i18nKey="lol:youAssistedDestroying.INHIBITOR">
                      You destroyed
                      <span
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          fontWeight: 700,
                          color: "var(--shade0)",
                        }}
                      >
                        an inhibitor
                        <HextechMatchInhibitor style={textImg} />
                      </span>
                    </Trans>
                  )}
                </Caption>
              </div>
            </>
          );
        default:
          break;
      }

      break;
    case "ELITE_MONSTER_KILL": {
      if (item.monsterType === "BARON_NASHOR") {
        return (
          <>
            <div className="flex wrap">
              <ChampionImg
                disabled
                displayInline
                disableDataTip
                size={20}
                style={{
                  transfrom: "translateY(5px)",
                  marginRight: "var(--sp-1)",
                }}
                championId={playerChampionID}
                championKey={playerChampionKey}
              />
              <Caption>
                {isKiller ? (
                  <Trans i18nKey="lol:youDestroyed.BARON">
                    You slayed
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontSize: "var(--sp-3)",
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      Baron Nashor
                      <HextechMonsterBaron style={textImg} />
                    </span>
                  </Trans>
                ) : (
                  <Trans i18nKey="lol:youAssistedDestroying.BARON">
                    You slayed
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontSize: "var(--sp-3)",
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      Baron Nashor
                      <HextechMonsterBaron style={textImg} />
                    </span>
                  </Trans>
                )}
              </Caption>
            </div>
          </>
        );
      } else if (item.monsterType === "RIFTHERALD") {
        return (
          <>
            <div className="flex wrap">
              <ChampionImg
                disabled
                displayInline
                disableDataTip
                size={20}
                style={{
                  transfrom: "translateY(5px)",
                  marginRight: "var(--sp-1)",
                }}
                championId={playerChampionID}
                championKey={playerChampionKey}
              />
              <Caption>
                {isKiller ? (
                  <Trans i18nKey="lol:youDestroyed.RIFT_HERALD">
                    You killed
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      Rift Herald
                      <HextechMonsterRiftHerald style={textImg} />
                    </span>
                  </Trans>
                ) : (
                  <Trans i18nKey="lol:youAssistedDestroying.RIFT_HERALD">
                    You assisted killing
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      Rift Herald
                      <HextechMonsterRiftHerald style={textImg} />
                    </span>
                  </Trans>
                )}
              </Caption>
            </div>
          </>
        );
      } else if (item.monsterType === "VILEMAW") {
        return (
          <>
            <div className="flex wrap">
              <ChampionImg
                disabled
                displayInline
                disableDataTip
                size={20}
                style={{
                  transfrom: "translateY(5px)",
                  marginRight: "var(--sp-1)",
                }}
                championId={playerChampionID}
                championKey={playerChampionKey}
              />
              <Caption>
                {isKiller ? (
                  <Trans i18nKey="lol:youDestroyed.VILEMAW">
                    You killed
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      Vilemaw
                    </span>
                  </Trans>
                ) : (
                  <Trans i18nKey="lol:youAssistedDestroying.VILEMAW">
                    You killed
                    <span
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontWeight: 700,
                        color: "var(--shade2)",
                      }}
                    >
                      Vilemaw
                    </span>
                  </Trans>
                )}
              </Caption>
            </div>
          </>
        );
      } else if (item.monsterType === "DRAGON") {
        switch (item.monsterSubType) {
          case "AIR_DRAGON":
            return (
              <>
                <div className="flex wrap">
                  <ChampionImg
                    disabled
                    displayInline
                    disableDataTip
                    size={20}
                    style={{
                      transfrom: "translateY(5px)",
                      marginRight: "var(--sp-1)",
                    }}
                    championId={playerChampionID}
                    championKey={playerChampionKey}
                  />
                  <Caption>
                    {isKiller ? (
                      <Trans i18nKey="lol:youDestroyed.CLOUD">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Cloud Drake
                          <HextechMonsterCloud style={textImg} />
                        </span>
                      </Trans>
                    ) : (
                      <Trans i18nKey="lol:youAssistedDestroying.CLOUD">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Cloud Drake
                          <HextechMonsterCloud style={textImg} />
                        </span>
                      </Trans>
                    )}
                  </Caption>
                </div>
              </>
            );
          case "FIRE_DRAGON":
            return (
              <>
                <div className="flex wrap">
                  <ChampionImg
                    disabled
                    displayInline
                    disableDataTip
                    size={20}
                    style={{
                      transfrom: "translateY(5px)",
                      marginRight: "var(--sp-1)",
                    }}
                    championId={playerChampionID}
                    championKey={playerChampionKey}
                  />
                  <Caption>
                    {isKiller ? (
                      <Trans i18nKey="lol:youDestroyed.INFERNAL">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Infernal Drake
                          <HextechMonsterInfernal style={textImg} />
                        </span>
                      </Trans>
                    ) : (
                      <Trans i18nKey="lol:youAssistedDestroying.INFERNAL">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontSize: "var(--sp-3)",
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Infernal Drake
                          <HextechMonsterInfernal style={textImg} />
                        </span>
                      </Trans>
                    )}
                  </Caption>
                </div>
              </>
            );
          case "WATER_DRAGON":
            return (
              <>
                <div className="flex wrap">
                  <ChampionImg
                    disabled
                    displayInline
                    disableDataTip
                    size={20}
                    style={{
                      transfrom: "translateY(5px)",
                      marginRight: "var(--sp-1)",
                    }}
                    championId={playerChampionID}
                    championKey={playerChampionKey}
                  />
                  <Caption>
                    {isKiller ? (
                      <Trans i18nKey="lol:youDestroyed.OCEAN">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Ocean Drake
                          <HextechMonsterOcean style={textImg} />
                        </span>
                      </Trans>
                    ) : (
                      <Trans i18nKey="lol:youAssistedDestroying.OCEAN">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Ocean Drake
                          <HextechMonsterOcean style={textImg} />
                        </span>
                      </Trans>
                    )}
                  </Caption>
                </div>
              </>
            );
          case "EARTH_DRAGON":
            return (
              <>
                <div className="flex wrap">
                  <ChampionImg
                    disabled
                    displayInline
                    disableDataTip
                    size={20}
                    style={{
                      transfrom: "translateY(5px)",
                      marginRight: "var(--sp-1)",
                    }}
                    championId={playerChampionID}
                    championKey={playerChampionKey}
                  />
                  <Caption>
                    {isKiller ? (
                      <Trans i18nKey="lol:youDestroyed.MOUNTAIN">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Mountain Drake
                          <HextechMonsterMountain style={textImg} />
                        </span>
                      </Trans>
                    ) : (
                      <Trans i18nKey="lol:youAssistedDestroying.MOUNTAIN">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Mountain Drake
                          <HextechMonsterMountain style={textImg} />
                        </span>
                      </Trans>
                    )}
                  </Caption>
                </div>
              </>
            );
          case "ELDER_DRAGON":
            return (
              <>
                <div className="flex wrap">
                  <ChampionImg
                    disabled
                    displayInline
                    disableDataTip
                    size={20}
                    style={{
                      transfrom: "translateY(5px)",
                      marginRight: "var(--sp-1)",
                    }}
                    championId={playerChampionID}
                    championKey={playerChampionKey}
                  />
                  <Caption>
                    {isKiller ? (
                      <Trans i18nKey="lol:youDestroyed.ELDER">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Elder Dragon
                          <HextechMonsterElder style={textImg} />
                        </span>
                      </Trans>
                    ) : (
                      <Trans i18nKey="lol:youAssistedDestroying.ELDER">
                        You killed
                        <span
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: 700,
                            color: "var(--shade2)",
                          }}
                        >
                          Elder Dragon
                          <HextechMonsterElder style={textImg} />
                        </span>
                      </Trans>
                    )}
                  </Caption>
                </div>
              </>
            );
          default:
            break;
        }
      }
      break;
    }
    default:
      return null;
  }
}
