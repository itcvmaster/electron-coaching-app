import React, { useCallback, useEffect, useState } from "react";

import { Button } from "clutch";

import Mac from "@/inline-assets/mac.svg";
import Windows from "@/inline-assets/windows.svg";
import getOSType from "@/util/get-os-type.mjs";
import globals from "@/util/global-whitelist.mjs";

const DownloadButtonWrapper = ({
  children,
  noIcon,
  buttonOsType,
  useMobileButton = true,
  onClick,
  ...props
}) => {
  const [osType, setOsType] = useState(null);

  useEffect(() => {
    if (buttonOsType) setOsType(buttonOsType);
    else setOsType(getOSType());
  }, [buttonOsType, useMobileButton]);

  const url = !osType
    ? null
    : osType === "MacOS"
    ? "/download/mac"
    : "/download/win";

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      if (onClick) onClick(osType);
      globals.open(event.currentTarget.href);
    },
    [onClick, osType]
  );

  return (
    <Button
      type="link"
      text={children}
      bgColor="var(--primary)"
      textColor="var(--white)"
      bgColorHover="var(--primary)"
      textColorHover="var(--white)"
      external
      href={url}
      iconLeft={!noIcon && (osType === "MacOS" ? <Mac /> : <Windows />)}
      onClick={handleClick}
      {...props}
    />
  );
};

export default DownloadButtonWrapper;
