import React from "react";

const UserRow = ({ name, country, score }) => {
  return (
    <>
      <span>{name}</span>
      <span>{country}</span>
      <span>{score}</span>
    </>
  );
};

export default UserRow;
