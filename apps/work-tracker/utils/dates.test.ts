import { getFinancialYear, getMoreMonthData, getWeekData } from "./dates";

describe("getWeekData", () => {
  it("returns the correct week information for 2023-08-13", () => {
    const date = new Date("2023-08-13");

    const weekData = getWeekData(date);

    expect(weekData).toEqual({
      daysOfTheWeek: [
        "7-August-2023",
        "8-August-2023",
        "9-August-2023",
        "10-August-2023",
        "11-August-2023",
        "12-August-2023",
        "13-August-2023",
      ],
      weekOfYear: 33,
    });
  });

  it("returns the correct week information for 2024-01-01", () => {
    const date = new Date("2024-01-10");

    const weekData = getWeekData(date);

    expect(weekData).toEqual({
      daysOfTheWeek: [
        "8-January-2024",
        "9-January-2024",
        "10-January-2024",
        "11-January-2024",
        "12-January-2024",
        "13-January-2024",
        "14-January-2024",
      ],
      weekOfYear: 2,
    });
  });
});

describe("getMoreMonthInformation", () => {
  it("returns the correct data for August, 2023", () => {
    const res = getMoreMonthData(2023, 8);

    expect(res.monthDaysArray.length).toEqual(31);
    expect(res.weekNumbers).toEqual(["32", "33", "34", "35", "36"]);
  });
});

// Financial Year
describe("getFinancialYear", () => {
  it("returns the correct financial year for August, 2023", () => {
    const res = getFinancialYear("August", 2023);

    expect(res).toEqual("2023-2024");
  });

  it("returns the correct financial year for June, 2023", () => {
    const res = getFinancialYear("June", 2023);

    expect(res).toEqual("2022-2023");
  });

  it("returns the correct financial year for January, 2024", () => {
    const res = getFinancialYear("January", 2024);

    expect(res).toEqual("2023-2024");
  });
});
