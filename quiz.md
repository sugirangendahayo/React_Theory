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
