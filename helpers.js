export const formatDate = date => {
  if (!date) return null;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year.slice(-2)}`;
};

export const parseDate = dateString => {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
};
