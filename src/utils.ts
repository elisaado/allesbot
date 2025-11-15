export function sortRecord(
  input: Record<string, number>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(input).sort((a, b) => b[1] - a[1]),
  );
}

export function biggestStringSize<T>(
  things: Record<string, T>,
): number {
  let biggest: number = 0;
  for (const thing of Object.entries(things)) {
    if (thing[0].length > biggest) biggest = thing[0].length;
  }

  return biggest;
}

function thing(): string {
  return "thing";
}
