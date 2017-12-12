// global variables
let rows = [],
  slopes = {},
  startingElevation;

// reading the txt file
require("fs").readFile("map.txt", "utf8", (err, data) => {
  if (err) throw err;

  // width & height of the map
  let lines = data.split("\n"),
    dimensions = lines.shift().split(" "),
    width = dimensions[0],
    height = dimensions[1];

  // putting the map in an array
  let rowArray;
  lines.forEach(element => {
    if (element.length) {
      // each element in the array is a number for future calculation
      rowArray = element.split(" ").map(number => Number(number));
      rows.push(rowArray);
    }
  });

  // routes at all the possible starting point
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      startingElevation = getElevation(x, y);
      theSlope(x, y, 0, startingElevation);
    }
  }

  // object with key-value pairs of length of the slope & array of objects
  let longestSlopeLength = Math.max.apply(this, Object.keys(slopes)),
    highestSlope = slopes[longestSlopeLength].pop();

  // logging out the result
  console.log(`The best slope has a length of: ${highestSlope.length}
    and with a drop of: ${highestSlope.drop}.`);
});

function isDefined(data) {
  return typeof data !== "undefined";
}

/**
 * find the elevation at any given point
 *
 * @param {Number} x: Horizontal coordinate of the map.
 * @param {Number} y: Vertical coordinate of the map.
 * @return {Number|Boolean}: The elevation of the given point, or false if doesn't exist.
 */
function getElevation(x, y) {
  if (isDefined(rows[y])) {
    if (isDefined(rows[y][x])) {
      return rows[y][x];
    }
  }
  return false;
}

/**
 * calculate the current elevation, then compare it with the elevation of surrounding points.
 *
 * @param {Number} currentX: The x-coordinate to investigate.
 * @param {Number} currentY: The y-coordinate to investigate.
 * @param {Number} currentSlopeLength: The length of the current slope being tracked.
 * @param {Number} currentElevation: The elevation of the current point.
 */
function theSlope(currentX, currentY, currentSlopeLength, currentElevation) {
  currentSlopeLength++;
  const directions = ["north", "east", "south", "west"];
  let nextX,
    nextY,
    validPoints = 0;

  for (let i = 0; i < directions.length; i++) {
    switch (directions[i]) {
      case "north":
        nextX = currentX;
        nextY = currentY - 1;
        break;

      case "east":
        nextX = currentX + 1;
        nextY = currentY;
        break;

      case "south":
        nextX = currentX;
        nextY = currentY + 1;
        break;

      case "west":
        nextX = currentX - 1;
        nextY = currentY;
        break;
    }

    const nextElevation = getElevation(nextX, nextY);
    if (nextElevation !== false) {
      if (nextElevation < currentElevation) {
        theSlope(nextX, nextY, currentSlopeLength, nextElevation);
      }
    }
  }

  if (!validPoints) {
    if (!isDefined(slopes[currentSlopeLength])) slopes[currentSlopeLength] = [];
    slopes[currentSlopeLength].push({
      start: startingElevation,
      end: currentElevation,
      drop: startingElevation - currentElevation,
      length: currentSlopeLength
    });
  }
}
