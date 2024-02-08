import { setHours, setMinutes, format, addMinutes, isToday } from "date-fns";

export function generateDayTimeList(
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
    let nextHour = currentHour;
    let nextMinute = currentMinute;

    // Calculating the next time slot
    if (currentMinute >= 45) {
      nextHour += 1;
      nextMinute = 30; // Next slot starts at 30 minutes past the hour
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
    startTime = setMinutes(setHours(date, startAt), 0); // Set end time to start time of establishment
  }

  const endTime = setMinutes(setHours(date, endAt), 0); // Set end time to end time of establishment
  const interval = 45; // interval in minutes
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}
