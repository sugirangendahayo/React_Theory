import React, { useState } from "react";

const LiftStateUp = () => {
  const [text, setText] = useState("");
  return (
    <>
      <Input text={text} setText={setText} />
      <Preview  text={text}/>
    </>
  );
};

export default LiftStateUp;

function Input({ text, setText }) {
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function Preview({ text }) {
  return <p>{text}</p>;
}
