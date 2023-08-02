export const getCurrentDateInformation = () => {
  const dateInstance = new Date();

  const CURRENT_YEAR = dateInstance.getFullYear();
  const CURRENT_MONTH = dateInstance.getMonth();
  const CURRENT_MONTH_LONG = monthNameLookup(CURRENT_MONTH);
  const CURRENT_DATE = dateInstance.getDate();
  const CURRENT_WEEK_DAY = dateInstance.getDay();
  const CURRENT_WEEK_DAY_LONG = weekDayNameLookup(CURRENT_WEEK_DAY);
  const CURRENT_MONTH_NUMBER_OF_DAYS = new Date(
    CURRENT_YEAR,
    CURRENT_MONTH + 1,
    0
  ).getDate();
  const CURRENT_MONTH_FIRST_DAY = new Date(
    CURRENT_YEAR,
    CURRENT_MONTH,
    0
  ).getDay();
  const CURRENT_MONTH_LAST_DAY = new Date(
    CURRENT_YEAR,
    CURRENT_MONTH,
    CURRENT_MONTH_NUMBER_OF_DAYS - 1
  ).getDay();

  return {
    CURRENT_YEAR,
    CURRENT_MONTH,
    CURRENT_MONTH_LONG,
    CURRENT_DATE,
    CURRENT_WEEK_DAY,
    CURRENT_WEEK_DAY_LONG,
    CURRENT_MONTH_NUMBER_OF_DAYS,
    CURRENT_MONTH_FIRST_DAY,
    CURRENT_MONTH_LAST_DAY,
  };
};

export const getMonthInformation = (year: number, month: number) => {
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 0).getDay();
  const lastDay = new Date(year, month, numberOfDays - 1).getDay();

  return {
    numberOfDays,
    firstDayIndex: firstDay,
    lastDayIndex: lastDay,
  };
};

export const monthNameLookup = (monthNumber: number) => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthNumber];
};

export const weekDayNameLookup = (dayNumber: number) => {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dayNumber];
};
