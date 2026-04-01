import React from "react";
import UserRow from "./UserRow";

const DataShapesObjects = () => {
  const users = [
    { id: 1, name: "Alice", country: "Rwanda", score: 92 },
    { id: 2, name: "Bob", country: "Kenya", score: 75 },
  ];
  console.log(users);
  

  return (
    <>
      {users.map((u) => (
        <UserRow key={u.id} {...{...u, age: 24}} />
      ))}
    </>
  );
};

export default DataShapesObjects;
