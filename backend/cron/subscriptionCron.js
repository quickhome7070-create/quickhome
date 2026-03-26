const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("0 0 * * *", async () => {
  
  const users = await User.find({
    "subscription.isActive": true,
    "subscription.expiresAt": { $lt: new Date() },
  });

  for (const user of users) {
    user.subscription.isActive = false;
    await user.save();
  }

});
