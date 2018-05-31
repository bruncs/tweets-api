const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(400).json({ error: "User doesn't exist." });
      }

      if (user.followers.indexOf(req.userId) !== -1) {
        res.status(400).json({ error: 'You are already following this user.' });
      }

      user.followers.push(req.userId);
      await user.save();

      const me = await User.findById(req.userId);
      me.following.push(user.id);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(400).json({ error: "User doesn't exist." });
      }

      const following = user.followers.indexOf(req.userId);

      if (following === -1) {
        res.status(400).json({ error: `You are not following ${user.username}.` });
      }

      user.followers.splice(following, 1);
      await user.save();

      const me = await User.findById(req.userId);
      me.following.splice(me.following.indexOf(user.id), 1);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },
};
