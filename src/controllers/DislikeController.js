const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    const loggerDev = await Dev.findById(user);
    const targerDev = await Dev.findById(devId);

    if (!targerDev) {
      return res.status(400).json({ erro: "Dev not exists" });
    }

    loggerDev.dislikes.push(targerDev._id);

    await loggerDev.save();

    return res.json(loggerDev);
  }
};
