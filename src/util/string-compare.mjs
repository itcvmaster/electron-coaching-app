import distance from "jaro-winkler";

export default function stringCompare(input, target) {
  if (!input) input = "";
  if (!target) target = "";
  input = input.toLowerCase();
  target = target.toLowerCase();
  const minLength = Math.min(input.length, target.length);
  let index = target.indexOf(input);
  if (index === -1) index = 0;
  if (input.length < target.length)
    target = target.slice(index, index + minLength);
  return distance(input, target);
}
