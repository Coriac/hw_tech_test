function ftDateFormat(date) {
  return date.toISOString().split('.')[0] + 'Z';
}

module.exports = {
  ftDateFormat,
};
