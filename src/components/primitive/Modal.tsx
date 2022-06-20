import * as React from "react";

import { useToggleBodyScroll } from "~/hooks";
import { isEquals, isNull } from "~/utils/validations";
import type { T_ReactElement, T_ReactElementNullable, T_ReactOnClickEventObject } from "~/types";

type T_ModalProps = {
  children: T_ReactElement;
  visible: boolean;
  onCloseHandler: () => void;
};

function Modal({ children, visible, onCloseHandler }: T_ModalProps): T_ReactElementNullable {
  useToggleBodyScroll(visible);

  // render
  if (visible) {
    return <Backdrop onCloseHandler={onCloseHandler}>{children}</Backdrop>;
  }

  return null;
}

export default Modal;

// --- Components ---

type T_BackdropProps = { children: T_ReactElement; onCloseHandler: T_ModalProps["onCloseHandler"] };

function Backdrop({ children, onCloseHandler }: T_BackdropProps): T_ReactElement {
  // states & refs
  const backdropRef = React.useRef<HTMLButtonElement>(null);

  // handlers
  function handleBackdropClick(event: T_ReactOnClickEventObject<HTMLButtonElement>): void {
    if (!isNull(backdropRef.current) && isEquals(backdropRef.current, event.target)) {
      onCloseHandler();
    }
  }

  return (
    <button
      type="button"
      className="root tw-block tw-h-full tw-w-full tw-cursor-default tw-p-3 sm:tw-p-6"
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      {children}

      <style jsx>
        {`
          .root {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            bottom: 0;
            display: flex;
            justify-content: center;
            left: 0;
            overflow: hidden;
            position: fixed;
            right: 0;
            top: 0;
            z-index: 999;
          }
        `}
      </style>
    </button>
  );
}
