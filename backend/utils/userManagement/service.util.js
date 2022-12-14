const crypto = require("crypto");

/**
 * It removes the cookie from the client's browser.
 * @param res - the response object
 */
async function removeCookie(res) {
  try {
    res
      .status(201)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    res.status(500).send();
    throw new TypeError();
  }
}

module.exports = {
  removeCookie,
};
