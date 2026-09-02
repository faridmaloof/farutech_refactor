import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases con resolución de conflictos de Tailwind (igual que el refactor). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
