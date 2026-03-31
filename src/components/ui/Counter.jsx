
import React, { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };

    case "decrement":
      return {
        count: state.count > 0 ? state.count - 1 : 0,
      };

    default:
      return state;
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-6">
        <button
          className="bg-cyan-800 text-white p-4 rounded-xl cursor-pointer"
          onClick={() => dispatch({ type: "decrement" })}
        >
          -
        </button>

        <p>{state.count}</p>

        <button
          className="bg-cyan-800 text-white p-4 rounded-xl cursor-pointer"
          onClick={() => dispatch({ type: "increment" })}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;