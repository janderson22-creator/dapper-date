export const organizeListByDate = (
  list: { date: string | number | Date }[]
) => {
  return list.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
