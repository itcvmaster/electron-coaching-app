import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import { ToggleSwitch } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SHORT_NAMES, GAME_SYMBOL_LOL } from "@/app/constants.mjs";
import * as lolActions from "@/feature-event-replay/lol-actions.mjs";
import Buttons from "@/feature-event-replay/RecordingButtons.jsx";
import {
  Form,
  Input,
  Modal,
  Select,
  Steps,
  TextContainer,
  Toolbar,
} from "@/feature-event-replay/RecordingToolbar.style.jsx";
import { IS_APP } from "@/util/dev.mjs";
import { useGameSymbol } from "@/util/game-route.mjs";

const actions = {
  [GAME_SYMBOL_LOL]: lolActions,
};

function SaveRecordingMenu() {
  const currentGame = useGameSymbol();
  const [name, setName] = useState("");
  const { saveCurrentRecording, clearCurrentRecording } = actions[currentGame];

  const handleNameInput = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const handleSaveRecording = useCallback(
    async (e) => {
      e.preventDefault();
      await saveCurrentRecording(name, currentGame);
    },
    [currentGame, name, saveCurrentRecording]
  );

  return (
    <Form onSubmit={handleSaveRecording}>
      <Input
        placeholder="enter recording name"
        value={name}
        onChange={handleNameInput}
      />
      <Buttons.Save disabled={!name} type="submit" />
      <Buttons.Reset
        role="button"
        type="button"
        onClick={clearCurrentRecording}
      />
    </Form>
  );
}

function DownloadModal({ onClose }) {
  const state = useSnapshot(readState);
  const currentGame = useGameSymbol();
  const { selectedRecording } = state.eventReplay;
  const { uploadRecording } = actions[currentGame];
  const textRef = useRef();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const rawText = textRef.current.value;
      const failed = uploadRecording(rawText);

      if (!failed) {
        onClose();
      }
    },
    [onClose, uploadRecording]
  );

  useLayoutEffect(() => {
    if (selectedRecording) {
      textRef.current.value = JSON.stringify({
        ...selectedRecording,
        game: GAME_SHORT_NAMES[currentGame],
      });
      textRef.current.select();
    }
  }, [currentGame, selectedRecording]);

  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <TextContainer>
          <input
            autoFocus
            readOnly={selectedRecording}
            ref={textRef}
            placeholder="JSON recording"
          />
        </TextContainer>
        <Buttons.Close role="button" type="button" onClick={onClose} />
        {!selectedRecording && <Buttons.Save type="submit" />}
      </Form>
    </Modal>
  );
}

function Menu() {
  const state = useSnapshot(readState);
  const currentGame = useGameSymbol();
  const initializedRef = useRef(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const {
    recordingIds,
    mode,
    currentRecording = [],
    currentStep,
    totalSteps,
    captureGql,
  } = state.eventReplay;
  const {
    MODE_IDLE,
    MODE_RECORDING,
    MODE_PAUSED,
    MODE_PLAYING,
    setSelectedRecordng,
    toggleRecording,
    getLatestRecording,
    step,
    rewind,
    play,
    pause,
    clear,
    toggleCaptureGqlRequests,
  } = actions[currentGame];

  const handleRecordingSelect = useCallback(
    async (e) => {
      const recordingId = e.target.value;
      await setSelectedRecordng(recordingId);
    },
    [setSelectedRecordng]
  );

  const recordingOptions = (recordingIds || [])
    .filter((r) => r.split(":")[0] === GAME_SHORT_NAMES[currentGame])
    .map((r, i) => (
      <option key={i} value={r}>
        {r.split(":")[1]}
      </option>
    ));

  useLayoutEffect(() => {
    if (initializedRef.current) return;
    getLatestRecording();
    initializedRef.current = true;
  }, [getLatestRecording, setSelectedRecordng]);

  return (
    <Toolbar>
      {mode === MODE_IDLE ? (
        currentRecording.length > 0 ? (
          <SaveRecordingMenu />
        ) : (
          <>
            {(captureGql || IS_APP) && (
              <Buttons.Record onClick={toggleRecording} />
            )}
            <Select onChange={handleRecordingSelect} defaultValue="">
              <option value="">{`Select Recording`}</option>
              {recordingOptions}
            </Select>
            <Buttons.Download onClick={() => setShowDownloadModal(true)} />
            <ToggleSwitch
              value={captureGql}
              onChange={toggleCaptureGqlRequests}
              labelText={"Capture GQL"}
            />
          </>
        )
      ) : mode === MODE_RECORDING ? (
        <>
          <Buttons.Stop onClick={toggleRecording} />
          <Steps>
            {currentRecording.length} {`events`}
          </Steps>
        </>
      ) : (
        <>
          {mode === MODE_PLAYING ? (
            <Buttons.Pause onClick={pause} />
          ) : mode === MODE_PAUSED ? (
            <Buttons.Play onClick={play} />
          ) : null}
          <Buttons.Prev onClick={() => step(-1)} />
          <Buttons.Next onClick={() => step()} />
          <Buttons.Restart onClick={rewind} />
          <Buttons.Clear onClick={clear} />
          <Buttons.Upload onClick={() => setShowDownloadModal(true)} />
          <Steps>
            {currentStep}
            <i />
            {totalSteps}
          </Steps>
        </>
      )}
      {showDownloadModal && (
        <DownloadModal onClose={() => setShowDownloadModal(false)} />
      )}
    </Toolbar>
  );
}

function RecordingToolbar() {
  const currentGame = useGameSymbol();
  const isActionsPresent =
    Object.getOwnPropertySymbols(actions).includes(currentGame);
  const result = !isActionsPresent ? null : <Menu />;
  return result;
}

export default RecordingToolbar;
