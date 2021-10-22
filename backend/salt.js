const bcrypt = require("bcrypt")
bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash("$2b$10$F/ovWc559r3Q58RQorflwOvR7MOH/OS5wxyd", salt, function (err, hash) {
    // returns hash
    console.log(hash);
  });
});