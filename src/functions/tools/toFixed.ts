export const toFixedNumber = (num: number, places: number = 2) => {
  const offset = Number(`1e${places}`);
  return Math.floor(num * offset) / offset;
};
