import stringHash from 'string-hash';

const colors = [
  'pink',
  'violet',
  'purple',
  'orange',
  'yellow',
  'black',
  'blue',
  'brown',
  'green',
  'teal',
  'grey',
  'olive',
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
