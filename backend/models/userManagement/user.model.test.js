const User = require("./user.model");

test("add new incomplete(email) user to the database", async () => {
  const incompleteData = new User({
    id: "test",
    name: "test",
    mobile: "0111206597",
    address: "Panadura",
    userType: "Site Manager",
    passwordHash: "kkdb5d564#$#$wd6s5dfsd5csdcsdfs",
  });

  try {
    await incompleteData.save();
  } catch (error) {
    expect(error.errors.email).toBeDefined();
  }
});
