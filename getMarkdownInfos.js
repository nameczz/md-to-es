const fs = require("fs");

const getMarkdownInfo = (path_abs) => {
  const res = {};
  const content = fs.readFileSync(path_abs).toString();
  const regex = /^\-\-\-[\s\S]*\-\-\-/gi;
  const arr = content.match(regex);
  if (arr) {
    const str_var = arr[0].split("---")[1];
    const isWindows = str_var.indexOf("\r\n") > -1;
    str_var.split(isWindows ? "\r\n" : "\n").forEach((str_key_value) => {
      if (str_key_value) {
        const [key, value] = str_key_value.split(":");
        res[key.trim()] = value.trim();
      }
    });
  }
  return {
    content,
    info: res,
  };
};

module.exports = getMarkdownInfo;
