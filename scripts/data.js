const utils = require("./utils");

// public functions

module.exports = {
  get_list: get_list,
  add_item: add_item,
  edit_item: edit_item,
  delete_item: delete_item
};

function get_list(is_short_date = false) {
  let db = get_db();
  let data = [];
  db.query("SELECT * FROM TransList ORDER BY time", (rs, err) => {
    while (rs.next()) {
      const item = rs.values;
      const date = new Date(parseInt(item.time));
      const date_text = is_short_date
        ? utils.get_short_date(date)
        : utils.get_long_date(date);

      const data_item = {
        id: item.id,
        time: item.time,
        amount: { text: `${item.amount}` },
        date_text: { text: date_text }
      };
      data.push(data_item);
    }
    rs.close();
  });

  $sqlite.close(db);
  return data;
}

function add_item(item) {
  let db = get_db();
  db.update({
    sql: "INSERT INTO TransList VALUES(?, ?, ?)",
    args: [item.id, item.time, item.amount]
  });
  $sqlite.close(db);
}

function edit_item(item) {
  let db = get_db();
  db.update({
    sql: "UPDATE TransList SET time = ?, amount = ? WHERE id = ?",
    args: [item.time, item.amount, item.id]
  });
  $sqlite.close(db);
}

function delete_item(row) {
  let db = get_db();
  db.update({
    sql:
      "DELETE FROM TransList WHERE id IN (SELECT id FROM TransList ORDER BY time LIMIT 1 OFFSET ?)",
    args: [row]
  });
  $sqlite.close(db);
}

// private functions

function get_db(forceInit = false) {
  const db_file = "shared://jsbox-xirr/trans_list.db";
  const db_path = "shared://jsbox-xirr/";
  if (!$file.exists(db_path)) {
    $file.mkdir(db_path);
  }
  if (forceInit == true) {
    if ($file.exists(db_file)) {
      $file.delete(db_file);
    }
  }

  if (!$file.exists(db_file)) {
    const db = $sqlite.open(db_file);
    db.update("CREATE TABLE TransList(id text, time text, amount real)");
    return db;
  } else {
    return $sqlite.open(db_file);
  }
}
