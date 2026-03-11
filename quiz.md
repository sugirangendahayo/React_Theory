# React Quiz

## Question 1

Where does React put all of the elements I create in JSX when I call `root.render()`?

**Answer:** React puts all the elements in the DOM (Document Object Model). When you call `root.render()`, React takes your JSX elements, converts them to real DOM elements, and injects them into the HTML element that your root is attached to (typically an element with id="root" in your HTML file).

## Question 2

What would show up in my console if I were to run this line of code:

```
console.log(<h1>Hello world!</h1>)
```

**Answer:** You would see a JavaScript object in your console, not the HTML string. JSX gets transpiled to React.createElement() calls, so `<h1>Hello world!</h1>` becomes `React.createElement('h1', null, 'Hello world!')`. The console would show an object with properties like `type: "h1"`, `props: { children: "Hello world!" }`, and other React-specific properties like `key`, `ref`, etc.

## Question 3

What's wrong with this code:

```
root.render(
    <h1>Hi there</h1>
    <p>This is my website!</p>
)
```

**Answer:** The problem is that you're trying to render multiple JSX elements without wrapping them in a single parent element or fragment. React's `render()` method expects a single React element as its argument. You need to wrap the elements in either a parent element like a `<div>` or a React fragment `<>...</>` or `<React.Fragment>...</React.Fragment>`.

Correct versions:

```jsx
// Using a div wrapper
root.render(
  <div>
    <h1>Hi there</h1>
    <p>This is my website!</p>
  </div>,
);

// Using React fragment
root.render(
  <>
    <h1>Hi there</h1>
    <p>This is my website!</p>
  </>,
);
```

## Question 4

What does it mean for something to be "declarative" instead of "imperative"?

**Answer:** **Declarative** programming means describing _what_ you want to achieve, while **imperative** programming means describing _how_ to achieve it step by step.

In React, declarative means you describe the desired UI state, and React figures out how to update the DOM to match that state. You don't manually manipulate the DOM elements.

**Imperative approach (vanilla JS):**

```javascript
// How to create and add an element
const h1 = document.createElement("h1");
h1.textContent = "Hello World";
h1.className = "title";
document.getElementById("root").appendChild(h1);
```

**Declarative approach (React):**

```jsx
// What the UI should look like
<h1 className="title">Hello World</h1>
```

React handles the "how" - it compares the current state with the desired state and efficiently updates only what needs to change.

## Question 5

What does it mean for something to be "composable"?

**Answer:** **Composable** means you can combine small, independent pieces to build larger, more complex functionality. In React, components are composable - you can use components inside other components, nesting and combining them like building blocks.

Composition allows you to:

- Reuse components in different contexts
- Build complex UIs from simple, focused pieces
- Maintain separation of concerns
- Create more readable and maintainable code

**Example of composition:**

```jsx
// Simple components
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Composing them together
function App() {
  return (
    <Card title="Welcome">
      <p>This is a composable card!</p>
      <Button text="Click me" onClick={() => alert("Hello!")} />
    </Card>
  );
}
```

The `App` component composes `Card` and `Button` components, and `Card` composes the `Button` component along with other elements. This is the essence of composition in React.
