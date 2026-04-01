import React from "react";

const UserRow = ({ name, country, score }) => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center">
        <span>{name}</span>
        <span>{country}</span>
        <span>{score}</span>
      </div>
    </>
  );
};

export default UserRow;
