export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatedMinutes = String(minutes).padStart(2, "0");
  const formatedSeconds = String(remainingSeconds).padStart(2, "0");

  return formatedMinutes + ":" + formatedSeconds;
};
