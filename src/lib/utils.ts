import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveName(item: any) {
  return item?.name ?? item?.medicineName ?? item?.productName ?? "Unknown"
}

export function resolveQuantity(item: any) {
  return item?.quantity ?? item?.qty ?? 0
}

export function resolveLowStockThreshold(item: any) {
  return item?.lowStockThreshold ?? item?.lowStock ?? 5
}

export function formatUTCDate(value: Date | string | number) {
  const date = value instanceof Date ? value : new Date(value)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatUTCDateTime(value: Date | string | number) {
  const date = value instanceof Date ? value : new Date(value)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}
