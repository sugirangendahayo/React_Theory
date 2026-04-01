import React from 'react'

const LiftStateUp = () => {
    const 
  return (
    
  )
}

export default LiftStateUp

function Input({ text, setText }) {
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

function Preview({ text }) {
  return <p>{text}</p>;
}
