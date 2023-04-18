import React, { useEffect, useRef, useState } from "react";
import { styled } from "goober";

import { Container as Section } from "@/feature-china-web/common-styles.mjs";
import {
  Slider1,
  Slider2,
  Slider3,
  Slider4,
  Slider5,
} from "@/feature-china-web/media-assets.mjs";

const mockData = [
  {
    name: "自动导入符文和出装",
    description:
      "Blitz自动导入高胜率的符文，召唤师技能和装备配置到你的英雄联盟客户端。你也可以导入顶尖职业选手的配置",
  },
  {
    name: "进阶的表现分析",
    description:
      "无论你玩任何位置，使用任何英雄，我们的表现仪表盘将会展现一切你需要分析的数据，包括详细的伤害，补刀和其他细分数据。",
  },
  {
    name: "英雄选择分析",
    description:
      "当你在玩LoL时，Blitz会自动识别你的英雄，并告诉你如何对抗与你对线的英雄。",
  },
  {
    name: "实用的游戏内迷你窗",
    description:
      "Blitz实用的迷你窗功能可以指导你提升哪项技能，实时展示你与高段位玩家在进攻表现方面等的差异。",
  },
  {
    name: "深度赛后报告",
    description:
      "每一局游戏结束后，Blitz 从多个角度为你的表现评分并且给到个性化的提升建议。",
  },
];

const stringData = {
  ultimateCoaching: "英雄联盟终极桌面工具",
  advancedFeature: "卓越的功能",
};

const period = 10000;

const SplashSlider = () => {
  const [selected, setSelect] = useState(0);
  const interval = useRef();

  const menus = [
    {
      name: mockData[0].name,
      image: Slider1,
      description: mockData[0].description,
    },
    {
      name: mockData[1].name,
      image: Slider2,
      description: mockData[1].description,
    },
    {
      name: mockData[2].name,
      image: Slider3,
      description: mockData[2].description,
    },
    {
      name: mockData[3].name,
      image: Slider4,
      description: mockData[3].description,
    },
    {
      name: mockData[4].name,
      image: Slider5,
      description: mockData[4].name,
    },
  ];

  const doInterval = (newIndex) => {
    interval.current = setTimeout(() => {
      newIndex = newIndex < 4 ? newIndex + 1 : 0;
      setSelect(newIndex);
      doInterval(newIndex);
    }, period);
  };

  const onSelect = (index) => {
    setSelect(index);
    const newIndex = index;
    clearTimeout(interval.current);
    doInterval(newIndex);
  };

  const renderTitle = () => (
    <>
      <Caption className="type-subtitle1">
        {stringData.ultimateCoaching}
      </Caption>

      <div className="type-h3">{stringData.advancedFeature}</div>

      <Description className="type-subtitle1">
        {menus[selected].description}
      </Description>
    </>
  );

  useEffect(() => {
    const index = -1;
    doInterval(index);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Section>
        <OuterTop>{renderTitle()}</OuterTop>
        <FlexRow>
          <Content>
            <InnerTop>{renderTitle()}</InnerTop>
            {menus.map((menu, index) => (
              <Menu
                key={index}
                className="type-subtitle1 clickable"
                selected={index === selected}
                onClick={() => onSelect(index)}
              >
                {menu.name}
              </Menu>
            ))}
          </Content>
          <ImageContainer>
            <Snapshot src={menus[selected].image} />
            <DashContainer>
              {menus.map((menu, index) => (
                <Dash key={index} selected={index === selected} />
              ))}
            </DashContainer>
          </ImageContainer>
        </FlexRow>
      </Section>
    </Container>
  );
};

export default SplashSlider;

const screenWidth = {
  lg: 1440,
  md: 1024,
  sm: 768,
};

const Container = styled("div")`
  box-sizing: border-box;
  background-color: var(--primary);
  padding: 64px 0;
  width: 100%;
`;

const FlexRow = styled("div")`
  @media (min-width: ${screenWidth.lg}px) {
    flex-direction: row;
    display: flex;
    align-items: center;
  }
  @media (min-width: ${screenWidth.md}px) and (max-width: ${screenWidth.lg}px) {
    flex-direction: row;
    display: flex;
    align-items: center;
  }
  @media (min-width: ${screenWidth.sm}px) and (max-width: ${screenWidth.md}px) {
    flex-direction: row;
    display: flex;
    align-items: center;
  }
  @media (max-width: ${screenWidth.sm}px) {
  }
`;

const Content = styled("div")`
  @media (min-width: ${screenWidth.lg}px) {
    width: 308px;
    margin-right: 55px;
  }
  @media (min-width: ${screenWidth.md}px) and (max-width: ${screenWidth.lg}px) {
    width: 308px;
    margin-right: 48px;
  }
  @media (min-width: ${screenWidth.sm}px) and (max-width: ${screenWidth.md}px) {
    width: 308px;
    margin-right: 24px;
  }
  @media (max-width: ${screenWidth.sm}px) {
    width: 100%;
  }
`;

const ImageContainer = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: ${screenWidth.md}px) {
    width: 100%;
  }
`;

const Snapshot = styled("img")`
  object-fit: contain;
  width: 100%;
  max-height: 546px;
  margin: 24px 0;
  @media (max-width: ${screenWidth.sm}px) {
    margin: 16px 0 !important;
  }
`;

const Menu = styled("div")`
  height: 60px;
  border: 1px solid rgba(227, 229, 234, 0.25);
  box-sizing: border-box;
  border-radius: 5px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  cursor: pointer;
  background: ${(props) =>
    props.selected ? "rgba(227, 229, 234, 0.25)" : "transparent"};
  box-shadow: ${(props) =>
    props.selected ? "inset 0px 1px 0px rgba(227, 229, 234, 0.25)" : "none"};

  &:hover {
    background: rgba(227, 229, 234, 0.25);
  }
`;

const DashContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 402px;
  @media (max-width: ${screenWidth.sm}px) {
    width: 200px !important;
  }
`;

const Dash = styled("div")`
  background: ${(props) =>
    props.selected ? "#E3E5EA" : "rgba(227, 229, 234, 0.5)"};
  height: 4px;
  flex: 1;
  margin: 0px 8px;
`;

const Caption = styled("div")`
  margin: 10px 0;
  font-weight: 500;
`;

const Description = styled("div")`
  margin: 10px 0;
  font-weight: 500;
  @media (min-width: ${screenWidth.lg}px) {
    height: 112px;
  }
  @media (min-width: ${screenWidth.md}px) and (max-width: ${screenWidth.lg}px) {
    height: 112px;
  }
  @media (min-width: ${screenWidth.sm}px) and (max-width: ${screenWidth.md}px) {
    height: 56px;
  }
  @media (max-width: ${screenWidth.sm}px) {
    height: 112px;
  }
`;

const InnerTop = styled("div")`
  @media (max-width: ${screenWidth.md}px) {
    display: none;
  }
`;

const OuterTop = styled("div")`
  text-align: center;
  width: 80%;
  margin: 0 auto;
  @media (min-width: ${screenWidth.md}px) {
    display: none;
  }
`;
