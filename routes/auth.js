const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const { SECRET_KEY } = require('../config');

const User = require('./models/user');
const Message = require('./models/message');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/register', async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // create user in the database
    const user = await User.get(username);

    // log in user and return token
    if (user) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        // update timestamp
        await User.updateLoginTimestamp(user.username);
        // sign token
        let token = jwt.sign(
          {
            username,
            password,
          },
          SECRET_KEY
        );
        return res.json({ token });
      }
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async function (req, res, next) {
  try {
    const { username, password, firstName, lastName, phone } = req.body;

    // create user in the database
    const user = await User.register(
      username,
      password,
      firstName,
      lastName,
      phone
    );

    // log in user and return token
    if (user) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        // update timestamp
        await User.updateLoginTimestamp(user.username);
        // sign token
        let token = jwt.sign(
          {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            phone,
          },
          SECRET_KEY
        );
        return res.json({ token });
      }
    }
  } catch (err) {
    return next(err);
  }
});
