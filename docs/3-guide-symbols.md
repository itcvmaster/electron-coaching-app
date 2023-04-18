# Symbols

There is a good chance that you have probably never seen symbols used in JavaScript before. This is a primer on how we use them.

## Why symbols?

There are sometimes multiple string representations of the same thing, for example, the ADC role in League of Legends is spelled as `ADC`, `BOT`, `BOTTOM`, and lowercase variants, depending on where it's used.

This makes doing checks like this insane:

```js
role === "ADC"; // might never match if it's not the string we expect
```

**Solution: cast ambiguous strings that mean the same thing to a symbol.**

```js
role === ROLE_SYMBOLS.ADC; // 😎
```

Always use symbols or constants in application code, rather than hardcoding.

## Coerce to symbol in data model

The preferred way of getting symbols is by defining them in the data model:

```js
{
  role: RoleSymbol,
  rank: RankSymbol,
  region: RegionSymbol,
  queue: QueueSymbol,
}
```

This replaces whatever value was there before, with a symbol, to prevent application code from using string comparisons.

## `symbol-name.mjs`

Rather than using the global symbol registry, we use a custom prefix so we can avoid namespace pollution. To guarantee that this custom prefix is used, there's the `symbolName` helper function.

This is also used for serializing/deserializing symbols in IndexedDB.
