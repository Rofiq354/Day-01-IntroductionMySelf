const params = new URLSearchParams(window.location.search);
const urlId = params.get("id");

const form = document.getElementById("addProject");
const inputProjectName = form.querySelector("#projectName");
const inputStartDate = form.querySelector("#startDate");
const inputEndDate = form.querySelector("#endDate");
const inputDescription = form.querySelector("#description");
const inputImage = form.querySelector("#uploadImage");

const cardListElement = document.getElementById("cardList");
const result = JSON.parse(localStorage.getItem("projects")) || [];

const urlType = () => {
  // Jika url params yang ada query id-nya, maka menjalankan fungsi dari editProjectForm
  if (urlId) {
    editProjectForm(urlId);
  }

  // Jika tidak ada query id-nya dari url params, maka menjalankan fungsi dari addProjectForm
  if (!urlId) {
    // Add Project
    form.addEventListener("submit", addProject);
  }
};

const objProject = ({
  projectName,
  startDate = "masih dummy",
  endDate = "masih dummy",
  description = "-",
  teknologies = "-",
  image = "-",
}) => {
  return {
    id: Date.now(),
    projectName,
    startDate,
    endDate,
    description,
    teknologies,
    image,
  };
};

const setStorage = () => {
  const data = localStorage.setItem("projects", JSON.stringify(result));
  return data;
};

const getStorage = () => {
  const data = localStorage.getItem("projects");
  return JSON.parse(data);
};

const loadProjects = () => {
  const dataProject = getStorage();
  if (dataProject === null) {
    console.log("Data di local storage masih kosong!");
  } else {
    dataProject.map((dp) => {
      if (dp === 0) console.log("data masih kosong");
      cardListElement.appendChild(renderCard(dp));
    });
  }
};

const renderCard = ({ id, projectName, description, image }) => {
  // Create card element
  const card = document.createElement("div");
  card.setAttribute("class", "card");
  card.style.width = "18rem";

  // Create image element
  const imageEl = document.createElement("img");
  const imageAttribute = {
    src: "/src/img/code.jpg",
    class: "card-img-top",
    height: "150px",
    alt: image,
  };
  for (const key in imageAttribute) {
    imageEl.setAttribute(key, imageAttribute[key]);
  }

  // Create card-body element
  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  cardBody.innerHTML = "";

  cardBody.innerHTML += `
    <a href="/page/detailProject.html?id=${id}" class="card-title text-decoration-none">
      <h5>${projectName}</h5>
    </a>
    <h6 class="card-subtitle mb-2 text-body-secondary">
      <small> Durasi: 3 bulan </small>
    </h6>
    <p class="card-text">
      ${description}
    </p>
    <a href="/page/project.html?id=${id}" id="editProjectBtn" class="btn btn-primary">Edit</a>
    <button onclick="deleteProject(${id})" class="btn btn-primary">Delete</Delete>
  `;

  // Masukkan element ke parent
  card.appendChild(imageEl);
  card.appendChild(cardBody);

  return card;
};

loadProjects();

const addProject = (e) => {
  e.preventDefault();

  const checkBoxTeknologies = form.querySelectorAll(
    'input[name="technologies"]:checked'
  );
  const fileName = !inputImage.files[0] ? "-" : inputImage.files[0].name;

  const teknologies = [];
  checkBoxTeknologies.forEach((t) => teknologies.push(t.value));

  result.push(
    objProject({
      projectName: inputProjectName.value || "-",
      startDate: inputStartDate.value || "-",
      endDate: inputEndDate.value || "-",
      description: inputDescription.value || "-",
      teknologies: teknologies,
      image: fileName,
    })
  );
  setStorage();

  alert("data berhasil ditambah dengan nama: " + inputProjectName.value);

  window.location.reload();
};

const editProjectForm = (id) => {
  const findProject = result.find((project) => project.id === Number(id));
  if (!findProject) alert("data tidak ditemukan");

  form.setAttribute("data-editing-id", id);
  form.setAttribute("id", "editProject");

  const btnUpdate = form.querySelector("button");

  btnUpdate.textContent = "Update";

  const checkBoxTeknologies = document.querySelectorAll(
    'input[name="technologies"]'
  );

  const fileName = !inputImage.files[0] ? "-" : inputImage.files[0].name;

  inputProjectName.focus();

  inputProjectName.value = findProject.projectName;

  inputStartDate.value =
    findProject.startDate === "masih dummy" ? "" : findProject.startDate;

  // value end date mengambil dari data pada local storage, isi data end date nya 'masih dummy' maka inputendDate.value nya kosong
  inputEndDate.value =
    findProject.endDate === "masih dummy" ? "" : findProject.endDate;

  // value deskripsi mengambil dari data pada local storage
  inputDescription.value = findProject.description;

  // checkbox aktif berdasarkan project yang value sesuai teknologinya
  checkBoxTeknologies.forEach((cb) => {
    if (findProject.teknologies.includes(cb.value)) {
      cb.checked = true;
    }
  });

  // Update Project
  form.addEventListener("submit", updateProject);
};

const updateProject = (e) => {
  e.preventDefault();

  const formId = form.getAttribute("data-editing-id");

  if (!formId) {
    alert("Error: ID proyek tidak ditemukan di form.");
    return;
  }

  // Temukan indeks proyek yang sesuai
  const projectIndex = result.findIndex(
    (project) => project.id === Number(formId)
  );

  if (projectIndex === -1) {
    alert("Error: Proyek tidak ditemukan.");
    return;
  }

  const checkBoxTeknologies = form.querySelectorAll(
    'input[name="technologies"]:checked'
  );

  // Siapkan nama file gambar (pertahankan yang lama jika tidak ada upload baru)
  const fileName =
    !inputImage.files || inputImage.files.length === 0
      ? result[projectIndex].image
      : inputImage.files[0].name;

  const teknologies = [];
  checkBoxTeknologies.forEach((t) => teknologies.push(t.value));

  // Ambil referensi ke objek yang sudah ada di array
  const existingProject = result[projectIndex];

  // Mutasi (ubah) properti dari objek yang ada secara langsung
  existingProject.projectName = inputProjectName.value || "-";
  existingProject.startDate = inputStartDate.value || "-";
  existingProject.endDate = inputEndDate.value || "-";
  existingProject.description = inputDescription.value || "-";
  existingProject.teknologies = teknologies;
  existingProject.image = fileName;

  setStorage();

  alert("Data proyek berhasil diperbarui untuk: " + inputProjectName.value);

  window.location.href = "project.html";
};

const deleteProject = (id) => {
  // Temukan indeks proyek yang sesuai
  const projectIndex = result.findIndex((project) => project.id === id);

  // Jika id dari project itu tidak ada
  if (projectIndex === -1) {
    alert("Error: Proyek tidak ditemukan.");
    return;
  }

  // Konfirmasi pengguna sebelum menghapus
  const isConfirmed = confirm(
    `Apakah Anda yakin ingin menghapus proyek "${result[projectIndex].projectName}"?`
  );

  if (!isConfirmed) {
    return; // Batalkan jika pengguna menekan 'Cancel'
  }

  // Hapus elemen dari array
  result.splice(projectIndex, 1);

  // Simpan array yang sudah diperbarui ke localStorage
  setStorage();

  alert("Proyek berhasil dihapus.");

  window.location.reload();
};

urlType();
