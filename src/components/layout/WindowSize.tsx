import React, { useState } from "react";

import { useOnWindowResize } from "~/hooks";
import { T_ReactElement } from "~/types";

function WindowSize(): T_ReactElement {
  const [size, setSize] = useState([0, 0]);

  useOnWindowResize(function onWindowResize() {
    setSize([window.innerWidth, window.innerHeight]);
  });

  return (
    <div className="root">
      <span>{size.join("x")} | </span>
      <span className="sm:tw-hidden tw-inline-block">mobile</span>
      <span className="sm:tw-inline-block md:tw-hidden tw-hidden">sm</span>
      <span className="md:tw-inline-block lg:tw-hidden tw-hidden">md</span>
      <span className="lg:tw-inline-block tw-hidden">lg</span>

      <style jsx>
        {`
          .root {
            background-color: rgba(0, 0, 0, 0.5);
            bottom: 0;
            color: white;
            font-weight: bold;
            left: 0;
            padding: 10px;
            position: fixed;
          }
        `}
      </style>
    </div>
  );
}

export default WindowSize;
