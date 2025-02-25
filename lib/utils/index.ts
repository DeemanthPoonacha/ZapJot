import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format the date
export const formatDateTitle = (
  dateString: string = new Date().toISOString()
) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // Example: "Fri, 3rd Nov 2025"
};

export function GetDateTime() {
  return new Date().toString().split(" GMT", 1);
}

export function getDates(month: number = 0, year: number = 2020) {
  const daysInMonth = dayjs()
    .set("month", month)
    .set("year", year)
    .daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}
