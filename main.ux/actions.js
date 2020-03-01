const db = require("./scripts/data");
const comm = require("./scripts/comm");
const xirr = require("./scripts/xirr");

function update_list() {
  $("trans_list").data = db.get_list(true);
}

exports.list_ready = sender => {
  comm.set_update_callback(update_list);
  update_list();
  $("cal_xirr_button").title = " " + $l10n("CAL_XIRR");
  $("rate").text = $l10n("RATE_FULL");
  $ui.title = $l10n("TRANS");
};

exports.list_row_didSelect = (sender, indexPath, object) => {
  comm.set_item_data(object);
  $ui.push("add_edit");
};

exports.add_btn_handler = () => {
  comm.set_item_data(undefined);
  $ui.push("add_edit");
};

exports.delete_handler = (sender, indexPath) => {
  db.delete_item(indexPath.row);
};

exports.cal_btn_tapped = sender => {
  $device.taptic(0);
  const data = db.get_list();
  let trans = [];
  data.forEach(item => {
    trans.push({
      amount: parseFloat(item.amount.text),
      when: new Date(parseInt(item.time))
    });
  });
  let rate;
  try {
    rate = (xirr(trans) * 100).toFixed(4);
  } catch (err) {
    $ui.error($l10n(err.message));
    $("rate").textColor = $color("#DDDDDD");
    $("rate").text = $l10n("RATE_FULL");
  }
  if (!isNaN(rate)) {
    $("rate").textColor = $color("black");
    $("rate").text = $l10n("RATE") + ": " + rate + "%";
  }
};

exports.info_btn_handler = () => {
  $ui.push("licenses.ux");
};
