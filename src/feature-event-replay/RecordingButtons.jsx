import React from "react";
import { styled } from "goober";

import { sharedInput } from "@/feature-event-replay/RecordingToolbar.style.jsx";
import ClearIcon from "@/inline-assets/recording-clear.svg";
import CloseIcon from "@/inline-assets/recording-close.svg";
import DownloadIcon from "@/inline-assets/recording-download.svg";
import NextIcon from "@/inline-assets/recording-next.svg";
import PauseIcon from "@/inline-assets/recording-pause.svg";
import PlayIcon from "@/inline-assets/recording-play.svg";
import PrevIcon from "@/inline-assets/recording-prev.svg";
import RecordIcon from "@/inline-assets/recording-record.svg";
import ResetIcon from "@/inline-assets/recording-reset.svg";
import RestartIcon from "@/inline-assets/recording-restart.svg";
import SaveIcon from "@/inline-assets/recording-save.svg";
import StopIcon from "@/inline-assets/recording-stop.svg";
import UploadIcon from "@/inline-assets/recording-upload.svg";

const Button = styled("button")`
  ${sharedInput}
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--sp-8);
`;

const Buttons = {};

for (const [name, Icon] of [
  ["Record", RecordIcon],
  ["Play", PlayIcon],
  ["Pause", PauseIcon],
  ["Stop", StopIcon],
  ["Prev", PrevIcon],
  ["Next", NextIcon],
  ["Close", CloseIcon],
  ["Download", DownloadIcon],
  ["Upload", UploadIcon],
  ["Clear", ClearIcon],
  ["Restart", RestartIcon],
  ["Save", SaveIcon],
  ["Reset", ResetIcon],
]) {
  Buttons[name] = (props) => {
    return (
      <Button {...props}>
        <Icon />
      </Button>
    );
  };
}

export default Buttons;
