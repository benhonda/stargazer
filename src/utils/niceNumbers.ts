/**
 * Create a nice number with a suffix
 * @param num
 * @returns
 */
export function createNiceNumber(num: number): string {
  const suffixes = ["", "k", "M", "B", "T"];
  const magnitude = Math.floor(Math.log10(num) / 3);
  const scaledNum = num / Math.pow(10, magnitude * 3);
  const roundedNum = Math.round(scaledNum * 10) / 10;
  return `${roundedNum}${suffixes[magnitude]}`;
}
