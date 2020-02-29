const db = require("./scripts/data");
const utils = require("./scripts/utils");
const comm = require("./scripts/comm");

exports.done_handler = () => {
  const time = $("date_picker").date;
  const amount = parseFloat($("amount_input").text);
  if (isNaN(parseInt(time))) {
    $ui.toast($l10n("PLEASE_PICK_DATE"));
    return;
  }
  if (isNaN(amount)) {
    $ui.toast($l10n("PLEASE_INPUT_AMOUNT"));
    return;
  }
  const item = comm.get_item_data();
  let id = new Date().getTime();
  if (item != undefined) {
    id = item.id;
  }
  const db_item = {
    id: `${id}`,
    time: `${time}`,
    amount: amount
  };
  if (item != undefined) {
    db.edit_item(db_item);
  } else {
    db.add_item(db_item);
  }

  const update_list = comm.get_update_callback();
  update_list();

  comm.reset_item_data();
  $ui.pop();
};

exports.input_returned = sender => {
  sender.blur();
};

exports.scroll_ready = sender => {
  const item = comm.get_item_data();
  $("tips").text = $l10n("TIPS");
  if (item != undefined) {
    const trans_date = new Date(parseInt(item.time));
    const trans_amount = parseFloat(item.amount.text);
    const date_text = utils.get_long_date(trans_date);
    $("date_picker").date = item.time;
    $("date_picker").title = date_text;
    $("amount_input").text = trans_amount;
    $ui.title = $l10n("EDIT");
  } else {
    $("date_picker").title = $l10n("PICK_DATE");
    $("amount_input").placeholder = $l10n("AMOUNT");
    $ui.title = $l10n("ADD");
  }
};

exports.picker_tapped = sender => {
  let selectedDate = new Date();
  const item = comm.get_item_data();
  if (!isNaN(parseInt(sender.date))) {
    selectedDate = new Date(parseInt(sender.date));
  } else if (item != undefined) {
    selectedDate = new Date(parseInt(item.time));
  }
  selectedDate.setHours(0);
  selectedDate.setMinutes(0);
  selectedDate.setSeconds(0);
  selectedDate.setMinutes(0);
  $("amount_input").blur();
  $picker.date({
    props: {
      mode: 1,
      min: new Date("1700/1/1"),
      max: new Date("2199/12/31"),
      date: selectedDate
    },
    handler: date => {
      picker_handler(date, sender, item);
    }
  });
};

function picker_handler(date, picker, item) {
  picker.title = utils.get_long_date(date);
  picker.date = date.getTime();
  if (item != undefined) {
    item.time = date.getTime();
    item.date_text.text = utils.get_short_date(date);
    comm.set_item_data(item);
  }
}
