const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    console.log(req.io, req.connectUsers);

    const { devId } = req.params;
    const { user } = req.headers;

    const loggerDev = await Dev.findById(user);
    const targerDev = await Dev.findById(devId);

    if (!targerDev) {
      return res.status(400).json({ erro: "Dev not exists" });
    }

    if (targerDev.likes.includes(loggerDev._id)) {
      const loggedSocket = req.connectUsers[user];
      const targetSocket = req.connectUsers[devId];

      if (loggedSocket) {
        req.io.to(loggedSocket).emit("match", targerDev);
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit("match", loggerDev);
      }
    }

    loggerDev.likes.push(targerDev._id);

    await loggerDev.save();

    return res.json(loggerDev);
  }
};
