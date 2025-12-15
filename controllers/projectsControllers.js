import db from "../config/db.js";

export const getProjects = async (req, res) => {
  const result = await db.query("SELECT * FROM public.projects");

  const projects = result.rows.map((data) => {
    return {
      id: data.id,
      projectName: data.name,
      description: data.description,
      image: data.image,
      start_date: data.start_date,
      end_date: data.end_date,
    };
  });

  res.render("projects", { title: "Projects", projects });
};

export const getDetailProject = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId)) {
    return res.status(400).send("Invalid project ID");
  }

  const result = await db.query(
    "SELECT * FROM public.projects WHERE id = $1 LIMIT 1",
    [projectId]
  );

  if (result.rows.length === 0) {
    return res.status(404).send("Project not found");
  }

  const { name, description, image, start_date, end_date, technologies } =
    result.rows[0];

  // const techStack = Array(technologies.toLowerCase());

  // console.log(techStack);

  const project = {
    projectName: name,
    description,
    image,
    technologies,
    start_date,
    end_date,
  };

  // const project = data.find((d) => d.id === Number(id));
  res.render("projects/detail", { title: "Projects", project });
};

export const addProject = async (req, res) => {
  const {
    projectName,
    start_date,
    end_date,
    technologies,
    description,
    image,
  } = req.body;

  let techArray;

  // Cek apakah technologies sudah berupa array
  if (Array.isArray(technologies)) {
    techArray = technologies;
  } else if (typeof technologies === "string" && technologies.length > 0) {
    // Jika berupa string tunggal, buat jadi array 1 elemen
    techArray = [technologies];
  } else {
    // Handle kasus jika datanya kosong atau tipe lainnya yang tidak valid
    techArray = [];
  }

  "['data1', 'data2']"

  const quotedElements = techArray.map((t) => `'${t.toLowerCase()}'`); // 1. Bungkus setiap elemen dengan tanda kutip tunggal
  const joinedElements = quotedElements.join(", "); // 2. Gabungkan elemen dengan koma dan spasi
  const finalStringTechStack = `[${joinedElements}]`; // 3. Bungkus seluruh string dengan tanda kurung siku []

  const newProject = await db.query(
    `INSERT INTO public.projects(
      name, description, image, technologies, start_date, end_date
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `,
    [
      projectName,
      description,
      image,
      finalStringTechStack,
      start_date,
      end_date,
    ]
  );

  // console.log(newProject);
  // res.send(data);
  res.redirect("/projects");
};
