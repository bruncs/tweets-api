const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();

const controllers = requireDir('./controllers');
const authMiddleware = require('./middlewares/auth');

/**
 * Auth
 */
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

routes.use(authMiddleware);

/**
 * Authenticated routes
 */
routes.get('/tweets', (req, res) => {
  res.send('You reached tweets.');
});

routes.post('/tweets', controllers.tweetController.create);
routes.delete('/tweets:id', controllers.tweetController.destroy);

module.exports = routes;
