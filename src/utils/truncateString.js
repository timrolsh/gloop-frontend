export function truncateString(str, n = 4) {
  if (str?.length <= 2 * n) {
    return str; // If the string is short enough, return it as is
  }
  return str?.slice(0, n) + "..." + str?.slice(-n);
}
