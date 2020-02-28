module.exports = {
  get_short_date: get_short_date,
  get_long_date: get_long_date
};

function get_short_date(date) {
  const opt = { year: "numeric", month: "numeric", day: "numeric" };
  return get_date(date, opt);
}

function get_long_date(date) {
  const opt = { year: "numeric", month: "long", day: "numeric" };
  return get_date(date, opt);
}

function get_date(date, opt) {
  const lang = $device.info.language;
  return date.toLocaleDateString(lang, opt);
}
