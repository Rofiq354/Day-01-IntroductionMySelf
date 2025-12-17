import db from "../config/db.js";
import { formatDate, getDuration } from "../helper/getDuration.js";

export const getProjects = async (req, res) => {
  const projectResult = await db.query(
    "SELECT * FROM public.projects order by id"
  );
  const techResult = await db.query("SELECT * FROM public.tech_stacks");

  const projects = projectResult.rows.map((data) => {
    return {
      id: data.id,
      projectName: data.name,
      description: data.description,
      image: data.image,
      duration: getDuration(data.start_date, data.end_date),
    };
  });

  const techs = techResult.rows;

  res.render("projects", {
    title: "Projects",
    typeTitleForm: "add",
    btnName: "create",
    projects,
    formUrl: `/projects`,
    project: "",
    techs,
  });
};

export const getDetailProject = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId)) {
    return res.status(400).send("Invalid project ID");
  }

  const result = await db.query(
    `
    SELECT
      p.name,
      p.description,
      p.image,
      p.start_date,
      p.end_date,
      ts.name AS tech_name,
      ts.fa_icon,
      ts.icons8_url,
      ts.color_icon
    FROM projects p
    LEFT JOIN project_tech_stacks pts ON pts.project_id = p.id
    LEFT JOIN tech_stacks ts ON ts.id = pts.tech_stack_id
    WHERE p.id = $1
    `,
    [projectId]
  );

  if (result.rows.length === 0) {
    return res.status(404).send("Project not found");
  }

  // Ambil data project dari baris pertama
  const { name, description, image, start_date, end_date } = result.rows[0];

  // Ambil tech stack (filter null jika project belum punya tech)
  const techStack = result.rows
    .filter((row) => row.tech_name !== null)
    .map((row) => ({
      name: row.tech_name,
      icon: row.fa_icon,
      url:
        row.icons8_url ||
        "https://img.icons8.com/?size=100&id=QMzLJhP7maxG&format=png&color=000000",
      color: row.color_icon,
    }));

  const project = {
    projectName: name,
    description,
    image,
    technologies: techStack,
    start_date: formatDate(start_date),
    end_date: formatDate(end_date),
    duration: getDuration(start_date, end_date),
  };

  res.render("projects/detail", {
    title: "Projects",
    project,
  });
};

export const addProject = async (req, res) => {
  const { projectName, start_date, end_date, technologies, description } =
    req.body;

  const image = req.file?.filename;

  const projectResult = await db.query(
    `INSERT INTO public.projects(
      name, description, image, start_date, end_date
    ) VALUES ($1, $2, $3, $4, $5) RETURNING id
  `,
    [projectName, description, image, start_date, end_date]
  );

  const projectId = projectResult.rows[0].id;

  // Insert ke pivot table
  if (technologies) {
    const techArray = Array.isArray(technologies)
      ? technologies
      : [technologies];

    for (const techId of techArray) {
      await db.query(
        `
          INSERT INTO project_tech_stacks (project_id, tech_stack_id)
          VALUES ($1, $2)
          `,
        [projectId, techId]
      );
    }
  }

  res.redirect("/projects");
};

export const editProject = async (req, res) => {
  const projectId = req.params.id;
  const projectResult = await db.query("SELECT * FROM public.projects order by id");
  const techResult = await db.query("SELECT * FROM public.tech_stacks");

  const projects = projectResult.rows.map((data) => {
    return {
      id: data.id,
      projectName: data.name,
      description: data.description,
      image: data.image,
      start_date: data.start_date,
      end_date: data.end_date,
    };
  });

  const project = projects.find((p) => p.id === Number(projectId));
  const techs = techResult.rows;

  const projectTechResult = await db.query(
    "SELECT tech_stack_id FROM project_tech_stacks WHERE project_id = $1",
    [projectId]
  );

  const projectTechIds = projectTechResult.rows.map((row) => row.tech_stack_id);

  const techsWithChecked = techs.map((tech) => ({
    ...tech,
    checked: projectTechIds.includes(tech.id),
  }));

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  project.start_date = formatDate(project.start_date);
  project.end_date = formatDate(project.end_date);

  res.render("projects", {
    title: "Projects",
    typeTitleForm: "edit",
    btnName: "update",
    projects,
    formUrl: `/projects/${project.id}?_method=PUT`,
    project,
    techs: techsWithChecked,
  });
};

export const updateProject = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId)) {
    return res.status(400).send("Invalid project ID");
  }

  const { projectName, start_date, end_date, technologies, description } =
    req.body;

  const image = req.file?.filename;

  const projectImageResult = await db.query(
    "SELECT image FROM public.projects where id = $1",
    [projectId]
  );
  const projectImage = image || projectImageResult.rows[0].image;

  // 1️⃣ Update tabel projects
  await db.query(
    `
    UPDATE public.projects
    SET
      name = $1,
      description = $2,
      image = $3,
      start_date = $4,
      end_date = $5
    WHERE id = $6
    `,
    [projectName, description, projectImage, start_date, end_date, projectId]
  );

  // 2️⃣ Reset pivot table
  await db.query(`DELETE FROM project_tech_stacks WHERE project_id = $1`, [
    projectId,
  ]);

  // 3️⃣ Insert ulang technologies
  if (technologies) {
    const techArray = Array.isArray(technologies)
      ? technologies
      : [technologies];

    for (const techId of techArray) {
      await db.query(
        `
        INSERT INTO project_tech_stacks (project_id, tech_stack_id)
        VALUES ($1, $2)
        `,
        [projectId, techId]
      );
    }
  }

  res.redirect(`/projects`);
};

export const deleteProject = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId)) {
    return res.status(400).send("Invalid project ID");
  }

  db.query("DELETE FROM public.projects WHERE id = $1", [projectId]);

  res.redirect("/projects");
};
