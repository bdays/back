/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
function getAllFuncs(toCheck) {
  let props = [];
  let obj = toCheck;
  do {
    props = props.concat(Object.getOwnPropertyNames(obj));
    // eslint-disable-next-line no-cond-assign
  } while ((obj = Object.getPrototypeOf(obj)));

  return props.sort().filter((e, i, arr) => {
    if (e !== arr[i + 1] && typeof toCheck[e] === 'function') return true;
  });
}

function getAllMethodsClass(toCheck) {
  const excludeList = [
    '__defineGetter__',
    '__defineSetter__',
    '__lookupSetter__',
    '__lookupGetter__',
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'toLocaleString',
    'toString',
    'valueOf',
    'propertyIsEnumerable',

    'undefinedError',
  ];

  const list = [];

  getAllFuncs(toCheck).forEach((methodName) => {
    if (!excludeList.includes(methodName)) {
      list.push(methodName);
    }
  });

  return list;
}

module.exports = { getAllFuncs, getAllMethodsClass };
