export * from "./nav";

export * from "./store";

export type TableData = {
  dayId: string;
  weekId: string;
  monthId: string;
  hoursWorked: string;
  hourlyRate: string;
  starTime?: string;
  endTime?: string;
  comment: string;
};
