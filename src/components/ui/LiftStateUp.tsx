import React, { useState } from "react";

const LiftStateUp = () => {
    type Text ={
        text: string,
        setText: string
    }
  const [text, setText] = useState<Text>();
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
