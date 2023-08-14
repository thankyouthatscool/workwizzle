import { getWeek } from "date-fns";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { Card, Text } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

import { useAppSelector } from "@hooks";
import { DEFAULT_APP_PADDING } from "@theme";
import type { TableData } from "@types";
import { getMoreMonthData, getWeekData, monthNameLookup, pl } from "@utils";

import { MonthSection, PhysicalYearSection, WeekSection } from "./Styled";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const HoursWorkedSection = () => {
  // Global State
  const {
    databaseInstance: db,
    dbMonthData,
    touchedDateInformation,
  } = useAppSelector(({ app }) => app);

  // Local State
  const [allMonthsHours, setAllMonthsHours] = useState<number[]>([]);

  const [monthWeeks, setMonthWeeks] = useState<string[]>([]);
  const [monthWeekHours, setMonthWeekHours] = useState<number[]>([]);

  const [weekData, setWeekData] = useState<TableData[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    const touchedWeek = getWeek(
      new Date(
        `${touchedDateInformation?.TOUCHED_YEAR}-${
          touchedDateInformation?.TOUCHED_MONTH! + 1
        }-${touchedDateInformation?.TOUCHED_DATE}`
      ),
      { weekStartsOn: 1 }
    );

    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            SELECT * FROM dayTracker
            WHERE weekId = ?
        `,
          [`${touchedWeek}-${touchedDateInformation?.TOUCHED_YEAR}`],
          (_, { rows: { _array } }) => {
            setWeekData(() => _array);
          }
        );

        tx.executeSql(
          `
            SELECT * from dayTracker
            WHERE weekId LIKE ?
        `,
          [`%-${touchedDateInformation?.TOUCHED_YEAR}`],
          (_, { rows: { _array } }) => {
            const yearData = _array as TableData[];

            const yearDataObject = yearData
              .map((record) => {
                const { dayId, ...rest } = record;

                return { ...rest, month: dayId.split("-")[1] };
              })
              .reduce((acc, { hoursWorked, month }) => {
                if (!!acc[month]) {
                  return {
                    ...acc,
                    [month]: acc[month] + parseFloat(hoursWorked),
                  };
                } else {
                  return { ...acc, [month]: parseFloat(hoursWorked) };
                }
              }, {} as { [key: string]: number });

            const allMonthsMapped = [
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
            ].map((month) => {
              if (!!yearDataObject[month]) {
                return yearDataObject[month];
              } else {
                return 0;
              }
            });

            setAllMonthsHours(() => allMonthsMapped);
          }
        );
      },
      (err) => console.log(err),
      () => {
        setMonthWeeks(
          () =>
            getMoreMonthData(
              touchedDateInformation?.TOUCHED_YEAR!,
              touchedDateInformation?.TOUCHED_MONTH! + 1
            ).weekNumbers
        );

        setWeekDays(
          () =>
            getWeekData(
              new Date(
                `${touchedDateInformation?.TOUCHED_YEAR}-${
                  touchedDateInformation?.TOUCHED_MONTH! + 1
                }-${touchedDateInformation?.TOUCHED_DATE}`
              )
            ).daysOfTheWeek
        );
      }
    );
  }, [touchedDateInformation]);

  useEffect(() => {
    const weekHours = dbMonthData
      .map((record) => {
        const { weekId, ...rest } = record;

        return { ...rest, weekNumber: weekId.split("-")[0] };
      })
      .reduce((acc, { hoursWorked, weekNumber }) => {
        if (!!acc[weekNumber]) {
          return {
            ...acc,
            [weekNumber]: acc[weekNumber] + parseFloat(hoursWorked),
          };
        } else {
          return { ...acc, [weekNumber]: parseFloat(hoursWorked) };
        }
      }, {} as { [key: string]: number });

    const allWeeksHours = monthWeeks.map((weekNumber) => {
      if (!!weekHours[weekNumber]) {
        return weekHours[weekNumber];
      } else {
        return 0;
      }
    });

    setMonthWeekHours(() => allWeeksHours);
  }, [dbMonthData, monthWeeks]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      snapToInterval={WINDOW_WIDTH}
      decelerationRate="fast"
    >
      <WeekSection>
        <Card
          style={{
            marginHorizontal: DEFAULT_APP_PADDING,
            marginBottom: DEFAULT_APP_PADDING,
          }}
        >
          <Card.Content>
            <Text variant="titleMedium">
              For the week starting {weekDays[0]} (#
              {Array.from(new Set(weekData.map((d) => d.weekId.split("-")[0])))}
              )
            </Text>

            <Text>
              Total:{" "}
              {weekData.reduce((acc, val) => {
                return acc + parseFloat(val.hoursWorked);
              }, 0)}{" "}
              hour(s)
            </Text>
            <Text>
              Day average:{" "}
              {Math.round(
                (weekData.reduce((acc, val) => {
                  return acc + parseFloat(val.hoursWorked);
                }, 0) /
                  5) *
                  100
              ) / 100}{" "}
              hour(s)
            </Text>
          </Card.Content>
        </Card>
        {!!weekDays.length && (
          <LineChart
            bezier
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            data={{
              labels: ["M", "T", "W", "T", "F", "S", "S"],
              datasets: [
                {
                  data: weekDays.map((day) => {
                    const targetDay = weekData.find((rec) => rec.dayId === day);

                    if (!!targetDay) {
                      return parseFloat(targetDay.hoursWorked);
                    } else {
                      return 0;
                    }
                  }),
                },
              ],
            }}
            formatYLabel={(val) => parseInt(val).toString()}
            fromZero
            style={{
              borderRadius: 16,
              paddingHorizontal: DEFAULT_APP_PADDING,
            }}
            height={WINDOW_WIDTH - DEFAULT_APP_PADDING * 2}
            width={WINDOW_WIDTH - DEFAULT_APP_PADDING * 2}
          />
        )}
      </WeekSection>
      <MonthSection>
        <Card
          style={{
            marginHorizontal: DEFAULT_APP_PADDING,
            marginBottom: DEFAULT_APP_PADDING,
          }}
        >
          <Card.Content>
            <Text variant="titleMedium">
              For the month of{" "}
              {monthNameLookup(touchedDateInformation?.TOUCHED_MONTH!)},{" "}
              {touchedDateInformation?.TOUCHED_YEAR}
            </Text>
            <Text>
              Total:{" "}
              {dbMonthData.reduce((acc, { hoursWorked }) => {
                return acc + parseFloat(hoursWorked);
              }, 0)}{" "}
              hour(s)
            </Text>
            <Text>
              Day average:{" "}
              {Math.round(
                (dbMonthData.reduce((acc, { hoursWorked }) => {
                  return acc + parseFloat(hoursWorked);
                }, 0) /
                  dbMonthData.length) *
                  100
              ) / 100}{" "}
              hour(s)
            </Text>
          </Card.Content>
        </Card>
        {!!monthWeeks.length && !!monthWeekHours.length && (
          <LineChart
            bezier
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            data={{ labels: monthWeeks, datasets: [{ data: monthWeekHours }] }}
            fromZero
            style={{
              borderRadius: 16,
              paddingHorizontal: DEFAULT_APP_PADDING,
            }}
            height={WINDOW_WIDTH - DEFAULT_APP_PADDING * 2}
            width={WINDOW_WIDTH - DEFAULT_APP_PADDING * 2}
          />
        )}
      </MonthSection>
      {/* FIXME: Make wrapper for year - physical and tax. */}
      <PhysicalYearSection>
        <Card
          style={{
            marginHorizontal: DEFAULT_APP_PADDING,
            marginBottom: DEFAULT_APP_PADDING,
          }}
        >
          <Card.Content>
            <Text variant="titleMedium">
              For the year of {touchedDateInformation?.TOUCHED_YEAR}
            </Text>
            <Text>
              Total:{" "}
              {Math.round(
                allMonthsHours.reduce((acc, val) => acc + val, 0) * 100
              ) / 100}{" "}
              hour(s)
            </Text>
            <Text>
              Month average:{" "}
              {Math.round(
                (allMonthsHours.reduce((acc, val) => acc + val, 0) / 12) * 100
              ) / 100}{" "}
              hour(s){" "}
            </Text>
          </Card.Content>
        </Card>
        {!!allMonthsHours.length && (
          <LineChart
            bezier
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [{ data: allMonthsHours }],
            }}
            fromZero
            style={{
              borderRadius: 16,
              paddingHorizontal: DEFAULT_APP_PADDING,
            }}
            height={WINDOW_WIDTH - DEFAULT_APP_PADDING * 2}
            width={WINDOW_WIDTH - DEFAULT_APP_PADDING * 2}
          />
        )}
      </PhysicalYearSection>
      <MonthSection>
        <Text>Hours worked - This financial year</Text>
      </MonthSection>
    </ScrollView>
  );
};
