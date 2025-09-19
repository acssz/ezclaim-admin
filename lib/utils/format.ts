import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDateTime(value?: string | null, dateFormat = "yyyy-MM-dd HH:mm") {
  if (!value) return "-";
  try {
    return format(new Date(value), dateFormat, { locale: zhCN });
  } catch {
    return value;
  }
}

export function formatRelative(value?: string | null) {
  if (!value) return "-";
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true, locale: zhCN });
  } catch {
    return value;
  }
}

export function formatCurrency(amount?: number | null, currency = "CNY") {
  if (amount === undefined || amount === null) return "-";
  try {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
