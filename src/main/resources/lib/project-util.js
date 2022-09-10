const contentLib = require('/lib/xp/content');

exports.getRootSiteConfig = function () {
  const rootNode = contentLib.query({
    count: 1,
    contentTypes: ['portal:site'],
    query: '_parentPath = "/content"'
  }).hits[0];

  const siteConfig = [].concat(rootNode.data.siteConfig);

  for (let i = 0; i < siteConfig.length; i++) {
    if (siteConfig[i].applicationKey === app.name) {
      return siteConfig[i].config;
    }
  }
  return {};
}

/*
*   Simple utility function for forcing something to be an array
*
*   Call by using forceArray(object)
*   forceArray will always return an array.
*   If the object we are forcing is undefined,
*   the returned array will be empty
*/
exports.forceArray = function (object) {
  if (!object || (typeof object === 'object' && !Object.keys(object).length)) {
    return [];
  } else if (object.constructor !== Array || typeof object === 'string') {
    return [object];
  }
  return object;
};
