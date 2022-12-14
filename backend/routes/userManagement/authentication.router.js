const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const service = require("../../utils/userManagement/service.util");
const validation = require("../../utils/userManagement/validation.util");
const User = require("../../models/userManagement/user.model");

/* The above code is a login route. It is checking if the user is verified or not. If the user is not. */
router.post("/login", async (req, res) => {
  try {
    /* Validating the request body. */
    const validated = await validation.loginSchema.validateAsync(req.body);

    /* Finding the user by email. */
    const user = await User.findOne({ email: validated.email });

    if (!user) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    }

    /* Comparing the password entered by the user with the password stored in the database. */
    const passwordCorrect = await bcrypt.compare(
      validated.password,
      user.passwordHash
    );

    /* This is checking if the password entered by the user is correct or not. If the password is not
correct, it is sending an error message to the user. */
    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    }
    /* This is creating a token for the user. */
    const token = jwt.sign(
      {
        user: user._id,
      },
      process.env.KEY
    );

    // send the token in a HTTP-only cookie
    var expiryTime = new Date(Number(new Date()) + 6 * 60 * 60 * 1000); //after 6 hours cookie will be expire
    return res
      .cookie("token", token, {
        expires: expiryTime,
        secure: true,
        sameSite: "none",
      })
      .send({ type: user.userType, userId: user._id });
  } catch (err) {
    if (err.isJoi === true) {
      console.error(err);
      return res.status(422).send({ errorMessage: err.details[0].message });
    } else {
      console.error(err);
      res.status(500).send(err);
    }
  }
});

/* This is a logout route. It is removing the cookie from the browser. */
router.get("/logout", async (req, res) => {
  /* Removing the cookie from the browser. */
  await service.removeCookie(res);
});

module.exports = router;
