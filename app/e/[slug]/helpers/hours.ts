import { setHours, setMinutes, format, addMinutes, isToday } from "date-fns";

export function generateDayTimeList(
  serviceDuration: number,
  date: Date,
  startAt: number,
  endAt: number
): string[] {
  const today = new Date();
  const isCurrentDay = isToday(date);

  let startTime;

  if (isCurrentDay) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    // Se o horário atual for maior ou igual ao startAt, então o próximo slot é 45 minutos após o horário atual.
    if (
      currentHour > startAt ||
      (currentHour === startAt && currentMinute >= 45)
    ) {
      startTime = setMinutes(setHours(today, currentHour), 45);
    } else if (currentHour === startAt && currentMinute >= 30) {
      startTime = setMinutes(setHours(today, currentHour), 30);
    } else if (currentHour === startAt && currentMinute >= 15) {
      startTime = setMinutes(setHours(today, currentHour), 15);
    } else {
      startTime = setMinutes(setHours(today, startAt), 0);
    }
  } else {
    startTime = setMinutes(setHours(date, startAt), 0);
  }

  const endTime = setMinutes(setHours(date, endAt), 0);
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, serviceDuration);
  }

  return timeList;
}
