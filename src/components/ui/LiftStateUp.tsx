import React, { useState } from "react";

const LiftStateUp = () => {
  const [text, setText] = useState<string>("");

  return (
    <>
      <Input text={text} setText={setText} />
      <Preview text={text} />
    </>
  );
};

export default LiftStateUp;

type InputProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

function Input({ text, setText }: InputProps) {
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

type PreviewProps = {
  text: string;
};

function Preview({ text }: PreviewProps) {
  return <p>{text}</p>;
}