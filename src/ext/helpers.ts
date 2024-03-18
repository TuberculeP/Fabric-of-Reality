export const deg2rad = (deg: number): number => {
  return (deg * 2 * Math.PI) / 360;
};

export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
