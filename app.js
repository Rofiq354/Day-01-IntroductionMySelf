import fs from "fs";
import express from "express";
import { engine } from "express-handlebars";
const app = express();
const port = 3005;

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

app.set("view engine", "hbs");
app.set("views", "src/views/pages");
app.use("/public", express.static("src/public"));

// Dashboard
app.get("/", (req, res) => res.render("home", { title: "Dashboard" }));

// Projects
app.get("/projects", getProjects);
app.get("/project/:id", getDetailProject);

// Contact
app.get("/contact", (req, res) => res.render("contact", { title: "Contact" }));

function getProjects(req, res) {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  res.render("projects", { title: "Projects", projects: data });
}

function getDetailProject(req, res) {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  const id = req.params.id;

  const project = data.find((d) => d.id === Number(id));
  res.render("projects/detail", { title: "Projects", project });
}

app.listen(port, () =>
  console.log("local server running in http://127.0.0.1:" + port)
);
