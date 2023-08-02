import { useCallback } from "react";

import { getCurrentDateInformation as getCurrentDateInformationUtil } from "@utils";

export const useDateInformation = () => {
  const currentDateInformation = getCurrentDateInformationUtil();

  const getCurrentDateInformation = () => getCurrentDateInformationUtil();
  return { ...currentDateInformation, getCurrentDateInformation };
};
