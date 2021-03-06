var express = require('express');
var app = express();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
  clientID: "1777fdc22ae5d606316f",
  clientSecret: "1e7c82b4292016cf7cb8d625e599481e2f5c4db9",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

var session = require('express-session');
app.use(session({secret: "helloworld"}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/', function (req, res) {
  var html = "<ul>\
    <li><a href='/auth/github'>GitHub</a></li>\
    <li><a href='/logout'>logout</a></li>\
  </ul>";

  if (req.isAuthenticated()) {
    html += "<h3>Authenticated as user:</h3>"
    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
  }
  res.send(html);
});

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("access granted");
});


app.listen(3000, function () {
  console.log('Listening at 3000');
});
