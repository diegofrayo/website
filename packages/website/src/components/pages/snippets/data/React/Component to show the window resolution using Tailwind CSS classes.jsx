import React, { useState, useLayoutEffect } from "react";

function WindowSize() {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

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
