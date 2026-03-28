import React, { useRef } from "react";

function InputRef() {
  const inputRef = useRef(null);
  // inputRef.current is a real DOM element
  //     Where does .focus() come from?

  // From the browser DOM API, not React.

  // All HTML inputs have built-in methods like:

  // .focus() → puts cursor inside input
  // .blur() → removes focus
  // .click() → simulates click
  // inputRef.current === <input /> so now inputRef.current.focus() is the same as: document.querySelector("input").focus()

  return (
    <>
      <input ref={inputRef} />
    </>
  );
}

export default InputRef;
