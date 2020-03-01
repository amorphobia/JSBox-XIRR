exports.nav_btn_tapped = () => {
  $ui.pop();
};

exports.select_license = (sender, indexPath, object) => {
  const urls = [
    "https://github.com/scijs/newton-raphson-method/blob/master/README.md",
    "https://github.com/RayDeCampo/nodejs-xirr/blob/master/LICENSE"
  ];
  const names = ["newton-raphson-method", "nodejs-xirr"];

  $ui.push({
    props: {
      title: names[indexPath.row],
      navButtons: [
        {
          symbol: "house",
          handler: sender => {
            $ui.popToRoot();
          }
        }
      ]
    },
    views: [
      {
        type: "web",
        props: {
          url: urls[indexPath.row]
        },
        layout: $layout.fill
      }
    ]
  });
};

exports.licenses_ready = sender => {
  $ui.title = $l10n("LICENSES");
  $("readme").content = $file.read("./README.md").string;
};
