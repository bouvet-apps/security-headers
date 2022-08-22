/*
*   Simple utility function for forcing something to be an array
*
*   Call by using forceArray(object)
*   forceArray will always return an array.
*   If the object we are forcing is undefined,
*   the returned array will be empty
*/
const forceArray = (object) => {
  if (!object || (typeof object === "object" && !Object.keys(object).length)) {
    return [];
  // eslint-disable-next-line no-else-return
  } else if (object.constructor !== Array || typeof object === "string") {
    return [object];
  }
  return object;
};
exports.forceArray = forceArray;
