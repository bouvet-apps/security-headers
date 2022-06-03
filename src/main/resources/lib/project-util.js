/*
*   Simple utility function for forcing something to be an array
*
*   Call by using forceArray(object)
*   forceArray will always return an array.
*   If the object we are forcing is undefined,
*   the returned array will be empty
*/
exports.forceArray = function (object){
  if (!object || (typeof object === 'object' && !Object.keys(object).length)) {
    return [];
  } else if (object.constructor !== Array || typeof object === 'string') {
    return [object];
  }
  return object;
};
