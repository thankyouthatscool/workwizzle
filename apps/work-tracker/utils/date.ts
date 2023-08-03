export const getCurrentDateInformation = () => {
  const dateInstance = new Date();

  const CURRENT_DATE = dateInstance.getDate();
  const CURRENT_MONTH = dateInstance.getMonth();
  const CURRENT_MONTH_LONG = monthNameLookup(CURRENT_MONTH);
  const CURRENT_YEAR = dateInstance.getFullYear();
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
    monthNameLong: monthNameLookup(month),
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

export const formatMilliseconds = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (!!hours && !!minutes && !!seconds) {
    return `: ${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s)`;
  }

  if (!!hours && !!minutes) {
    return `: ${hours} hour(s) and ${minutes} minute(s)`;
  }

  if (!!hours && !!seconds) {
    return `: ${hours} hour(s) and ${seconds} second(s)`;
  }

  if (!!minutes && !!seconds) {
    return `: ${minutes} minute(s) and ${seconds} second(s)`;
  }

  return `: ${seconds} second(s)`;
};

export const getDurationInHours = (duration: number) => {
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const formattedMinutesFraction = Math.round((minutes / 60) * 100) / 100;

  if (!!formattedMinutesFraction) {
    return [`${hours + formattedMinutesFraction}`];
  }

  return [`${hours}`];
};
