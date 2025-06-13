// Random function
export const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Random Int function - Exclusive max
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Distance between co-ordinates
export const getDistance = (x1, y1, x2, y2) => {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
};

// Convert seconds to minutes and seconds
export const secToClock = (sec) => {
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return { minutes, seconds };
};