import express from "express";
import { engine } from "express-handlebars";
const app = express();

import projectRouter from "./routes/projectRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import contactRouter from "./routes/contactRoutes.js";

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

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set("view engine", "hbs");
app.set("views", "src/views/pages");
app.use("/public", express.static("src/public"));

// Router
app.use("/", dashboardRouter);
app.use("/projects", projectRouter);
app.use("/contact", contactRouter);

export default app;
