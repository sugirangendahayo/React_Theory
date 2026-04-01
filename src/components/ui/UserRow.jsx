import React from "react";

const UserRow = ({ name, country , score}) => {
  return (
    <>
      <div className="flex flex-row gap-4 justify-center items-center m-2 bg-gray-600 text-white">
        <div className="flex flex-col justify-center items-center">
          <span className="text-cyan-500 p-2">Name</span>
          <span>{name}</span>
        </div>
         <div className="flex flex-col justify-center items-center">
          <span className="text-cyan-500 p-2">Country</span>
          <span>{country}</span>
        </div>
         <div className="flex flex-col justify-center items-center">
          <span className="text-cyan-500 p-2">Score</span>

          <span>{score}</span>
        </div>
      </div>
    </>
  );
};

export default UserRow;
