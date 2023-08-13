import { getMoreMonthData, getWeekData } from "./dates";

describe("getWeekData", () => {
  it("returns the correct week information", () => {
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
});

describe("getMoreMonthInformation", () => {
  it("returns the correct data for August, 2023", () => {
    const res = getMoreMonthData(2023, 8);

    console.log(res);

    // expect(res).toEqual(`s`);
  });
});
