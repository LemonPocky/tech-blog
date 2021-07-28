const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const routes = require("./controllers");
const sequelize = require("./config/connection");
// Uncomment if we need helpers later
// const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions with cookies. (docs: https://www.npmjs.com/package/express-session)
const sess = {
  secret: "Don't forget to put a random hash here haha jk",
  cookie: {
    // times are in milliseconds (86400 === 1 day)
    maxAge: 8640000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
// Uncomment if we need helpers later
// const hbs = exphbs.create({ helpers });
const hbs = exphbs.create();

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`\nServer running on port ${PORT}.`));
});
