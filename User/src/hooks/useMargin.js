import { useState, useEffect } from "react";
import { marginService } from "../services/marginService";

export const useMargin = (positions, balance) => {
  const [usedMargin, setUsedMargin] = useState(0);
  const [availableMargin, setAvailableMargin] = useState(balance);

  useEffect(() => {
    const totalMargin = marginService.calculateTotalMargin(positions);
    setUsedMargin(totalMargin);
    setAvailableMargin(balance - totalMargin);
  }, [positions, balance]);

  const validateNewPosition = (position) => {
    const requiredMargin = marginService.calculateMargin(position);
    return marginService.validateMarginRequirement(
      balance,
      usedMargin,
      requiredMargin
    );
  };

  return {
    usedMargin,
    availableMargin,
    validateNewPosition,
  };
};
