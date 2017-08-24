import stringHash from 'string-hash';

const colors = [
  'blue',
  'grey',
  'brown',
  'yellow',
  'violet',
  'olive',
  'orange',
  'pink',
  'purple',
  'teal',
  'black',
  'green',
];

const cache = {};

export const stringToSemanticColor = (str) => {
  let color = cache[str];
  if (!color) {
    color = colors[stringHash(str) % colors.length];
    cache[str] = color;
  }
  return color;
}
