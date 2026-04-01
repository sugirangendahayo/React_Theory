function Immutability() {
  const [numbers, setNumbers] = React.useState([1, 2, 3]);
  const updatedNumbers = [...numbers, 4];
  setNumbers(updatedNumbers)

  return (
    <>
      {updatedNumbers.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </>
  );
}

export default Immutability;