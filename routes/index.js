const router = require("express").Router();

const isLoggedin= require("../middleware/isLoggedIn");

router.get("/user-profile", isLoggedin, (req, res) => res.render("auth/user-profile", {user: req.session.currentUser}));
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});



module.exports = router;
