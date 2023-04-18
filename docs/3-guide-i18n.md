## i18n

First of all, [read the docs](https://www.i18next.com/). This guide contains absolutely no new information, just pointing out common mistakes.

## Always interpolate values in i18n fallbacks

Example:

```js
t("common:greeting", "Hi {{name}}!", { name });
```

**NEVER DO THIS:**

```js
t("common:greeting", `Hi ${name}!`);
```

## Always use i18n for anything that is displayed to the user

Good example:

```js
function MyComponent() {
  const { t } = useTranslation();
  const text = t("common:label", "Label");

  return <p>{text}</p>;
}
```

**BAD** example, don't do this:

```js
function MyComponent() {
  const text = "Noob dev do this";

  return <p>{text}</p>;
}
```
