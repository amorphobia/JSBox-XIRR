module.exports = {
  set_item_data: set_item_data,
  get_item_data: get_item_data,
  reset_item_data: reset_item_data,
  set_update_callback: set_update_callback,
  get_update_callback: get_update_callback
};

let item_data = undefined;
let callback = () => {};

function set_item_data(data) {
  item_data = data;
}

function get_item_data() {
  return item_data;
}

function reset_item_data() {
  item_data = undefined;
}

function set_update_callback(handler) {
  callback = handler;
}

function get_update_callback() {
  return callback;
}
