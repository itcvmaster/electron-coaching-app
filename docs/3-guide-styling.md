# Styling

Styling is basically using goober, which implements the same API as styled components.

## Passing props to goober styled components

You can pass custom props to goober styled components prefixed with `$` that are not valid DOM attributes. They will be removed before rendering.

```jsx
// usage
<Center $onlyVertically>...</Center>
```

```jsx
// style
export const Center = styled("div")`
  ...
  justify-content: ${({ $onlyVertically }) =>
    $onlyVertically ? "inherit" : "center"};
  ...
`;
```

## Stateful styling

One of the most common requirements for styling is reflecting values or some kind of state change in css (color changes, orientation changes, etc.). With Goober it's easy to reflect JS values as 'props' but that isn't necessary, css is already inherently stateful.

Take for instance a list of teams/players from a LoL match. What's nice about this approach is that setting the stateful value as a CSS variable on the parent container allows that value to casecade through the component. Every child-element can reference that value, so if you needed an image with the border color of that team, it would already have it available. Think of it like state context, but for styles (tip: css variables can be ANY value or even sub value). As a general rule of thumb if any value can change (be it based on state or props) should probably be a css variable.

```jsx
// markup
<>
  <Team>
    <li className="player">Rio</li>
    <li className="player">Rios Support</li>
  </Team>
  <Team className="enemy">
    <li className="player">Dali Wali</li>
    <li className="player">Dali Walis Support</li>
  </Team>
</>
```

```jsx
// style
const Team = styled("ul")`
  --player-color: blue;

  &.enemy {
    --player-color: red;
  }

  .player {
    color: var(--player-color);
  }
`;
```

Once you get the hang of this it becomes extremely powerful with a trivial amount of work and is highly expressive and easy to read.

### Stateful styling examples

If the value is boolean it can easily be represented by toggling a class. Take this demo for example, toggling a class on the parent that sets css variables allows us to easily make layout changes that cascade to the children:

### [🔲🔳 Layout demo](https://codesandbox.io/s/grid-rows-f4tx30)

[![Layout demo](https://user-images.githubusercontent.com/2053906/159094787-bb8bdab9-8ad3-43be-a1fe-d852e2830baa.png)](https://codesandbox.io/s/grid-rows-f4tx30)

With React this is simple enough for singluar state/classes (booleans), but once you have to start using multiple state values it gets annoying. String concatenation with big unwieldy ternaries is often hard to follow/read (this is why the class-names package exists, though we aren't using it). Also what if you need something that isnt boolean (user selects their favorite color from a dropdown)? For this you could use data attributes and style with a selector targeting the value `[data-victory="true"]` or `[data-favorite-color="red"]`.
Here is an example where several boolean states are represented on a parent node, along with a non-boolean dropdown select that is also represented in styling.

### [🍔 Hambuger demo](https://codesandbox.io/s/cheeseburger-76s876)

[![Hambuger demo](https://user-images.githubusercontent.com/2053906/159094676-baff2b8b-05b9-49c4-ab6e-0848032d627e.png)](https://codesandbox.io/s/cheeseburger-76s876)
