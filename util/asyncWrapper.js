const asyncWrapper = async (fn, error, isDebug = false) => {
  try {
    return await fn;
  } catch (e) {
    if (isDebug) console.error(e);
    throw error;
  }
};

module.exports = asyncWrapper;
