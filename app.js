import dotenv from "dotenv";

import express from "express";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import { engine } from "express-handlebars";
const app = express();
dotenv.config();
import projectRouter from "./routes/projectRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import authRouter from "./routes/authRoutes.js";

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    helpers: {
      isActive: (current, expected) => (current === expected ? "active" : ""),
    },
    defaultLayout: "index",
    layoutsDir: "src/views",
    partialsDir: ["src/views/layouts", "src/views/partials"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(methodOverride("_method"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set("view engine", "hbs");
app.set("views", "src/views/pages");
app.use("/public", express.static("src/public"));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  res.locals.isLogin = !!req.session.user;
  next();
});

// Router Auth
app.use("/", authRouter);

// Router Page
app.use("/", dashboardRouter);
app.use("/projects", projectRouter);
app.use("/contact", contactRouter);

export default app;
