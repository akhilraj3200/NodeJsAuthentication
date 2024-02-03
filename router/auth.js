var express = require('express');

var router = express.Router();

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/signIn'
  }));

module.exports = router;