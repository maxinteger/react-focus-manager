export function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val
}

export function overflow(val: number, min: number, max: number): number {
  return val < min ? max : val > max ? min : val
}

export function range(from: number, to: number) {
  return Array.from({ length: to - from }, (x, i) => from + i)
}
