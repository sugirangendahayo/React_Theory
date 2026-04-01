import { useState } from "react";
import "./Calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    // Decimal point operation implemented
    console.log("Adding decimal point!");
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    // Clear operation implemented
    console.log("Clearing calculator");
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        // Addition operation implemented
        console.log(`Adding: ${firstValue} + ${secondValue}`);
        return firstValue + secondValue;
      case "-":
        // Subtraction operation implemented
        console.log(`Subtracting: ${firstValue} - ${secondValue}`);
        return firstValue - secondValue;
      case "*":
        // Multiplication operation implemented
        console.log(`Multiplying: ${firstValue} * ${secondValue}`);
        return firstValue * secondValue;
      case "/":
        // Division operation implemented with zero check
        console.log(`Dividing: ${firstValue} / ${secondValue}`);
        if (secondValue === 0) {
          console.log("Error: Division by zero");
          return "Error";
        }
        return firstValue / secondValue;
      case "=":
        // Equals operation - return the calculated result
        console.log(`Equals operation: returning result`);
        return secondValue;
      default:
        return secondValue;
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-display">{display}</div>
      <div className="calculator-keypad">
        <div className="keypad-row">
          <button className="key key-clear" onClick={clear}>
            C
          </button>
          <button
            className="key key-operator"
            onClick={() => performOperation("/")}
          >
            /
          </button>
          <button
            className="key key-operator"
            onClick={() => performOperation("*")}
          >
            *
          </button>
          <button
            className="key key-operator"
            onClick={() => performOperation("-")}
          >
            -
          </button>
        </div>
        <div className="keypad-row">
          <button className="key key-number" onClick={() => inputNumber(7)}>
            7
          </button>
          <button className="key key-number" onClick={() => inputNumber(8)}>
            8
          </button>
          <button className="key key-number" onClick={() => inputNumber(9)}>
            9
          </button>
          <button
            className="key key-operator"
            onClick={() => performOperation("+")}
          >
            +
          </button>
        </div>
        <div className="keypad-row">
          <button className="key key-number" onClick={() => inputNumber(4)}>
            4
          </button>
          <button className="key key-number" onClick={() => inputNumber(5)}>
            5
          </button>
          <button className="key key-number" onClick={() => inputNumber(6)}>
            6
          </button>
          <button
            className="key key-equals"
            onClick={() => performOperation("=")}
          >
            =
          </button>
        </div>
        <div className="keypad-row">
          <button className="key key-number" onClick={() => inputNumber(1)}>
            1
          </button>
          <button className="key key-number" onClick={() => inputNumber(2)}>
            2
          </button>
          <button className="key key-number" onClick={() => inputNumber(3)}>
            3
          </button>
          <button className="key key-number" onClick={() => inputNumber(0)}>
            0
          </button>
        </div>
        <div className="keypad-row">
          <button
            className="key key-number key-zero"
            onClick={() => inputNumber(0)}
          >
            0
          </button>
          <button className="key key-decimal" onClick={inputDecimal}>
            .
          </button>
        </div>
      </div>
    </div>
  );
}
