import React from "react";

const FilteringData = () => {
  const products = [
    { id: 1, name: "Phone", inStock: true },
    { id: 2, name: "Tablet", inStock: false },
    { id: 3, name: "Ipad", inStock: false },
    { id: 4, name: "Laptop", inStock: true },
  ];

  return (
    <>
      {products
        .filter((p) => p.inStock === false)
        .map((product) => (
          <p key={product.id}>{product.name}</p>
        ))}
    </>
  );
};

export default FilteringData;
