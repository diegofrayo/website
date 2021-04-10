import React, { useRef, createContext, useEffect } from "react";

import { T_Object, T_ReactFCReturn } from "~/types";

function Modal({ children, visible, onCloseHandler }: T_Object): T_ReactFCReturn {
  function closeModal() {
    onCloseHandler(false);
  }

  useEffect(
    function toggleBodyClasses() {
      if (visible) {
        document.body.classList.add("modal-opened");
      } else {
        document.body.classList.remove("modal-opened");
      }
    },
    [visible],
  );

  if (!visible) {
    return null;
  }

  return (
    <Context.Provider value={{ onCloseModalHandler: closeModal }}>
      <Backdrop closeModalHandler={closeModal}>{children}</Backdrop>
    </Context.Provider>
  );
}

export default Modal;

// --- Context ---

const Context = createContext({
  onCloseModalHandler: (): void => undefined,
});

Modal.Context = Context;

// --- Components ---

function Backdrop({ children, closeModalHandler }): T_ReactFCReturn {
  const backdropRef = useRef(null);

  function handleBackdropClick(event) {
    if (backdropRef && backdropRef.current === event.target) {
      closeModalHandler();
    }
  }

  return (
    <div className="root tw-p-3 sm:tw-p-6" ref={backdropRef} onClick={handleBackdropClick}>
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
            z-index: 1000;
          }
        `}
      </style>
    </div>
  );
}
