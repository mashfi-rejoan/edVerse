export const padNumber = (value: number) => String(value).padStart(2, '0');

export const formatDateInput = (date: Date) => {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
};

export const toDateKey = (date: Date) => formatDateInput(date);

export const addDays = (date: Date, days: number) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
};

export const getCalendarDays = (viewDate: Date) => {
  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startOfGrid = addDays(startOfMonth, -startOfMonth.getDay());
  const days: Date[] = [];

  for (let i = 0; i < 42; i += 1) {
    days.push(addDays(startOfGrid, i));
  }

  return days;
};

export const isSameDay = (left: Date, right: Date) => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

export const isDateInRange = (date: Date, startDate: string, endDate?: string | null) => {
  const dateKey = toDateKey(date);
  const startKey = toDateKey(new Date(startDate));
  const endKey = endDate ? toDateKey(new Date(endDate)) : startKey;
  return dateKey >= startKey && dateKey <= endKey;
};

export const formatMonthLabel = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const formatDisplayDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};
