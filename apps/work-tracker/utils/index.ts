export * from "./database";
export * from "./dates";

export * from "./storage";

export const pl = (data: any) => {
  console.log(JSON.stringify(data, null, 2));
};
