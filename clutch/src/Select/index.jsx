import React, { Fragment } from "react";
import { styled } from "goober";
import { Listbox, Transition } from "@headlessui/react";

export const Select = ({ options, onChange, selected, className }) => {
  const selectedContent =
    options.find((option) => selected === option.value) || selected;

  return (
    <Container className={className}>
      <Listbox value={selected} onChange={onChange}>
        <Listbox.Button className="selectButton">
          <>
            {selectedContent?.icon && (
              <div className="icon">{selectedContent.icon}</div>
            )}
            {selectedContent?.image && (
              <div className="image">
                <img src={selectedContent.image} />
              </div>
            )}
            <span className="type-form--button text">
              {selectedContent.text}
            </span>
            <svg viewBox="0 0 16 16" className="caret">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6L8 10L12 6H4Z"
              />
            </svg>
          </>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition"
          leaveFrom="showing"
          leaveTo="hidden"
        >
          <Listbox.Options static className="options-container">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }) =>
                  `${
                    active
                      ? "active-option option"
                      : selected
                      ? "selected-option option"
                      : "option"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <div className="option--left">
                      {option?.icon ? (
                        <div className="option--icon">{option.icon}</div>
                      ) : option?.image ? (
                        <div className="option--image">
                          <img src={option.image} />
                        </div>
                      ) : null}
                      <span className="option--text type-form--button">
                        {option.text}
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 32 32"
                      className={`option--check ${selected ? "selected" : ""}`}
                    >
                      <path d="M11.151 21.821l-6.363-6.269-2.121 2.090 8.485 8.358 18.182-17.911-2.121-2.089z" />
                    </svg>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </Container>
  );
};

const Container = styled("div")`
  --radii: var(--br, 5px);
  --max-chars: 14ch;
  position: relative;
  display: inline-block;

  img {
    display: block;
  }

  .transition {
    transition: opacity 0.15s ease-in, transform 0.15s ease-in;
  }
  .showing {
    opacity: 1;
    transform: scale(1);
  }
  .hidden {
    opacity: 0;
    transform: scale(0.95);
  }

  .selectButton {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 var(--sp-10) 0 var(--sp-3);
    background: var(--shade6);
    height: var(--btn-height, 2.25rem);
    color: var(--white);
    border-radius: var(--radii);
    border: none;
    cursor: pointer;
    transition: background var(--transition);

    &:hover {
      background: var(--shade5);
    }

    .icon,
    .image {
      margin-right: var(--sp-2, 0.5rem);
    }
    .icon {
      svg {
        height: var(--sp-5, 1.25rem);
        width: var(--sp-5, 1.25rem);
      }
    }
    .image {
      img {
        width: var(--sp-5, 1.25rem);
        height: auto;
      }
    }

    .text {
      max-width: var(--max-chars);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .caret {
      position: absolute;
      display: block;
      right: 0.75rem;
      top: 50%;
      height: 1rem;
      width: 1rem;
      fill: var(--shade0, white);
      transform: translateY(-50%);
    }
  }

  @keyframes enter {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  .options-container {
    position: absolute;
    max-height: 70vh;
    overflow-y: auto;
    padding: var(--sp-2);
    background: var(--shade10);
    border-radius: var(--radii);
    top: 0;
    z-index: 10;
    transform-origin: top left;
    animation: enter var(--transition);
    box-shadow: rgb(0 0 0 / 6%) 0px 3px 2px, rgb(0 0 0 / 10%) 0px 7px 5px,
      rgb(0 0 0 / 11%) 0px 12px 10px, rgb(0 0 0 / 13%) 0px 22px 18px,
      rgb(0 0 0 / 15%) 0px 42px 33px, rgb(0 0 0 / 21%) 0px 100px 80px;

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--sp-4);
      height: var(--sp-12);
      border-radius: var(--radii);
      transition: background var(--transition);
      cursor: pointer;

      &.selected-option {
        background: var(--shade8);
        box-shadow: vaR(--highlight);
      }
      &.active-option {
        background: var(--shade6-50);
      }
    }

    .option--icon,
    .option--image {
      display: grid;
      place-content: center;
      width: var(--sp-8);
      height: var(--sp-8);
      margin-right: var(--sp-4);
      margin-left: calc(var(--sp-2) * -1);
    }
    .option--icon {
      svg {
        width: var(--sp-6);
        height: auto;
      }
    }
    .option--image {
      img {
        max-width: 100%;
        height: auto;
      }
    }
    .option--left {
      display: flex;
      align-items: center;
    }
    .option--text {
      max-width: var(--max-chars);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .option--check {
      width: 1.5rem;
      height: 1.5rem;
      margin-left: var(--sp-16);
      opacity: 0;
      visibility: hidden;

      &.selected {
        opacity: 1;
        visibility: visible;
      }
    }
  }
`;
