# Standalone app

**USE CASE: run blitz-app features in blitz-web.**

We can run specific features independently of blitz-app by wrapping them in a separate entry point, and dynamically importing them. This new entry point will live in blitz-app, and can be consumed from external code, notably blitz-web.

The entry point will export APIs to toggle feature flags, and for mounting its containing element, but should be as much plug-and-play as possible.

A proof of concept will exist in blitz-app, which will basically be a blank page demonstrating that a feature flagged module can run independently: `standalone.html`.
