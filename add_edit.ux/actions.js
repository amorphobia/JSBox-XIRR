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

  set_num_pad_color($color("tint"), $color("tint"));

  if ($app.env != $env.keyboard) {
    exports.toggle_keypad(undefined);
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
  selectedDate.setMilliseconds(0);
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

exports.num_pad_tapped = sender => {
  $device.taptic(0);
  const id = sender.id;
  let t = $("amount_input").text;

  switch (id) {
    case "num0": // fallthrough
    case "num1": // fallthrough
    case "num2": // fallthrough
    case "num3": // fallthrough
    case "num4": // fallthrough
    case "num5": // fallthrough
    case "num6": // fallthrough
    case "num7": // fallthrough
    case "num8": // fallthrough
    case "num9": {
      if (t == "0" || t == "-0") {
        t = t.substring(0, t.length - 1);
      }
      t += id.charAt(id.length - 1);
      break;
    }
    case "dot": {
      if (t.indexOf(".") == -1) {
        t += ".";
      }
      break;
    }
    case "neg": {
      if (t.indexOf("-") == -1) {
        t = "-" + t;
      } else {
        t = t.substring(1);
      }
      break;
    }
    case "bak": {
      if (t.length > 0) {
        t = t.substring(0, t.length - 1);
      }
      break;
    }
    case "clr": {
      t = "";
      break;
    }
    default: {
      $console.error("Unknown number pad tapped.");
    }
  }

  $("amount_input").text = t;
};

function set_num_pad_color(titleColor, borderColor) {
  const ids = [
    "num0",
    "num1",
    "num2",
    "num3",
    "num4",
    "num5",
    "num6",
    "num7",
    "num8",
    "num9",
    "dot",
    "neg",
    "bak",
    "clr"
  ];
  ids.forEach(id => {
    $(id).titleColor = titleColor;
    $(id).borderColor = borderColor;
  });
}

exports.toggle_keypad = sender => {
  const btn_tapped = sender != undefined;
  if ($("num_pad").hidden == true) {
    show_numpad(btn_tapped);
  } else {
    hide_numpad(btn_tapped);
  }
  if (btn_tapped) {
    $device.taptic(0);
  }
};

function hide_numpad(use_animate) {
  $("tips").updateLayout(make => {
    make.top.equalTo($("amount_input").bottom).offset(20);
  });
  $("num_pad").updateLayout(make => {
    make.width.equalTo(0);
  });
  if (use_animate) {
    $ui.animate({
      duration: 0.2,
      animation: () => {
        $("num_pad").alpha = 0;
        $("num_pad").relayout();
        $("tips").relayout();
      },
      completion: () => {
        $("num_pad").hidden = true;
      }
    });
  } else {
    $("tips").relayout();
    $("num_pad").alpha = 0;
    $("num_pad").relayout();
    $("num_pad").hidden = true;
  }
}

function show_numpad(use_animate) {
  $("tips").updateLayout(make => {
    make.top.equalTo($("amount_input").bottom).offset(116);
  });
  $("num_pad").updateLayout(make => {
    make.width.equalTo(335);
  });
  $("num_pad").hidden = false;
  if (use_animate) {
    $ui.animate({
      duration: 0.2,
      animation: () => {
        $("num_pad").alpha = 1;
        $("num_pad").relayout();
        $("tips").relayout();
      }
    });
  } else {
    $("tips").relayout();
    $("num_pad").hidden = false;
    $("num_pad").alpha = 1;
    $("num_pad").relayout();
  }
}
