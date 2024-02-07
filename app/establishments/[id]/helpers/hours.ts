import { setHours, setMinutes, format, addMinutes, isToday } from "date-fns";

export function generateDayTimeList(date: Date): string[] {
  const today = new Date();
  const isCurrentDay = isToday(date);

  let startTime;
  if (isCurrentDay) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    let nextHour = currentHour;
    let nextMinute = currentMinute;

    // Calculating the next time slot
    if (currentMinute >= 45) {
      nextHour += 1;
      nextMinute = 45; // Next slot starts at 30 minutes past the hour
    } else if (currentMinute >= 30) {
      nextHour += 1;
      nextMinute = 15;
    } else if (currentMinute >= 15) {
      nextMinute = 30;
    } else {
      nextMinute = 15;
    }

    startTime = setMinutes(setHours(today, nextHour), nextMinute);
  } else {
    startTime = setMinutes(setHours(date, 9), 0);
  }

  const endTime = setMinutes(setHours(date, 21), 0); // Set end time to 21:00
  const interval = 45; // interval in minutes
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}
