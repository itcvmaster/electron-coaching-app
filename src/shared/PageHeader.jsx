import React, { useEffect, useRef, useState } from "react";

import {
  clearPageHeaderVisibility,
  clearPageImage,
  clearPageTitle,
  setPageHeaderVisibility,
  setPageImage,
  setPageTitle,
} from "@/app/actions.mjs";
import Container from "@/shared/ContentContainer.jsx";
import { Header, Links, LinksContainer } from "@/shared/PageHeader.style.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const PageHeader = ({
  image,
  icon,
  borderColor,
  accentText,
  accentIcon,
  title,
  underTitle,
  links,
  aside,
  children,
  style,
  className = "",
}) => {
  const route = useRoute();
  const headerRef = useRef();
  const [headerVisible, setHeaderVisible] = useState(true);
  const currentPath = route.currentPath;

  useEffect(() => {
    if (title) setPageTitle(title);
    else clearPageTitle();

    if (image) setPageImage(image);
    else clearPageImage();

    return () => {
      clearPageTitle();
      clearPageImage();
    };
  }, [currentPath, title, image]);

  useEffect(() => {
    const options = { threshold: 0 };
    const observer = new IntersectionObserver(([entry]) => {
      setHeaderVisible(entry.isIntersecting);
    }, options);

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [headerRef]);

  useEffect(() => {
    if (!headerVisible) setPageHeaderVisibility(false);
    else setPageHeaderVisibility(true);

    return () => {
      clearPageHeaderVisibility();
    };
  }, [headerVisible]);

  // 🚨 PageHeader component title is required 🚨
  if (!title) return null;

  const alignmentClass = !links ? "sidebar-align" : "";

  return (
    <>
      <Header
        style={style}
        ref={headerRef}
        className={
          !headerVisible
            ? `scrolled-away ${className} ${alignmentClass}`
            : `${className} ${alignmentClass}`
        }
      >
        <Container>
          <div className="flex align-center between gap-sp-4">
            <div className="flex align-center gap-sp-4 left">
              {image ? (
                <div className="header-image--outer">
                  <div className="header-image--inner" style={{ borderColor }}>
                    <img
                      src={image}
                      width={72}
                      height={72}
                      className="header-image--img"
                    />
                  </div>
                  {accentIcon ? (
                    <span className="accent-icon">{accentIcon}</span>
                  ) : accentText ? (
                    <span className="type-caption--bold accent-pill">
                      {accentText}
                    </span>
                  ) : null}
                </div>
              ) : icon ? (
                <div className="header-image--outer">
                  <div className="header-icon--inner">{icon}</div>
                </div>
              ) : null}
              <div className="flex column gap-sp-1">
                <h1 className="type-h5">{title}</h1>
                {underTitle && (
                  <div className="flex align-center gap-sp-2">{underTitle}</div>
                )}
              </div>
            </div>
            {aside && <div className="right">{aside}</div>}
          </div>
        </Container>
      </Header>
      {children}
      {links?.length && (
        <LinksContainer
          className={!headerVisible ? "stuck sidebar-align" : "sidebar-align"}
        >
          <Links className="links-container">
            {links.map((link, idx) => (
              <a
                key={link.text}
                href={link.url}
                className={
                  currentPath === link.url ||
                  (links.every((i) => i.url !== currentPath) && idx === 0)
                    ? "type-form--tab current"
                    : "type-form--tab"
                }
              >
                {link.text}
              </a>
            ))}
          </Links>
        </LinksContainer>
      )}
    </>
  );
};

export default PageHeader;
