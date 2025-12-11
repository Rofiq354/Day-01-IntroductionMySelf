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

// helper: baca File jadi Data URL (base64)
const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

// validasi file: tipe & ukuran (< 100KB)
const validateImageFile = (file) => {
  if (!file) return { ok: true }; // tidak wajib
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return { ok: false, message: "Format file harus JPG, JPEG, atau PNG." };
  }
  const maxSize = 100 * 1024; // 100 KB
  if (file.size > maxSize) {
    return { ok: false, message: "Ukuran file harus kurang dari 100 KB." };
  }
  return { ok: true };
};

const calculateDuration = (startDate, endDate) => {
  // Jika salah satu tanggal kosong atau "-", return "-"
  if (!startDate || !endDate || startDate === "-" || endDate === "-") {
    return "-";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Hitung selisih dalam milliseconds
  const diffTime = Math.abs(end - start);

  // Konversi ke hari
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Konversi ke bulan (approximate)
  const diffMonths = Math.floor(diffDays / 30);

  // Return format yang lebih readable
  if (diffMonths > 0) {
    return `${diffMonths} bulan ${diffDays % 30} hari`;
  } else {
    return `${diffDays} hari`;
  }
};

const truncateWords = (text = "", maxWords = 30) => {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ") + "...";
};

const renderCard = ({
  id,
  projectName,
  startDate,
  endDate,
  description,
  image,
}) => {
  // Create card element
  const card = document.createElement("div");
  card.setAttribute("class", "card");
  card.style.width = "18rem";

  // Create image element - gunakan data URL jika ada, else fallback
  const imageEl = document.createElement("img");
  const imageAttribute = {
    src: image && image !== "-" ? image : "/src/img/code.jpg",
    class: "card-img-top",
    height: "150px",
    alt: projectName || "project image",
  };
  for (const key in imageAttribute) {
    imageEl.setAttribute(key, imageAttribute[key]);
  }

  imageEl.style.objectFit = "cover";

  // HITUNG DURASI dari startDate dan endDate
  const duration = calculateDuration(startDate, endDate);

  // potong title & deskripsi
  const shortTitle = truncateWords(
    projectName === undefined ? "-" : projectName,
    2
  );

  const shortDesc = truncateWords(
    description === undefined ? "-" : description,
    15
  );

  // Create card-body element
  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  cardBody.innerHTML = "";

  cardBody.innerHTML += `
    <a href="/page/detailProject.html?id=${id}" class="card-title text-decoration-none">
      <h5>${shortTitle}</h5>
    </a>
    <h6 class="card-subtitle mb-2 text-body-secondary">
      <small> Durasi: ${duration} </small>
    </h6>
    <p class="card-text">
      ${shortDesc}
    </p>
    <a href="/page/project.html?id=${id}" id="editProjectBtn" class="btn btn-primary">Edit</a>
    <button onclick="deleteProject(${id})" class="btn btn-primary">Delete</Delete>
  `;

  // Masukkan element ke parent
  card.appendChild(imageEl);
  card.appendChild(cardBody);

  return card;
};

const refreshCards = () => {
  // Kosongkan semua cards yang ada
  cardListElement.innerHTML = "";
  // Load ulang projects dari storage dan render
  loadProjects();
};

refreshCards();

// make addProject async to read file
const addProject = async (e) => {
  e.preventDefault();

  const checkBoxTeknologies = form.querySelectorAll(
    'input[name="technologies"]:checked'
  );

  const teknologies = [];
  checkBoxTeknologies.forEach((t) => teknologies.push(t.value));

  const file = inputImage.files && inputImage.files[0];

  // Validasi file
  const validation = validateImageFile(file);
  if (!validation.ok) {
    alert(validation.message);
    return;
  }

  // baca file jika ada, simpan sebagai DataURL, jika tidak maka "-"
  let fileData = "-";
  if (file) {
    try {
      fileData = await readFileAsDataURL(file);
    } catch (err) {
      console.warn("Gagal membaca file:", err);
      fileData = "-";
    }
  }

  result.push(
    objProject({
      projectName: inputProjectName.value || "-",
      startDate: inputStartDate.value || "-",
      endDate: inputEndDate.value || "-",
      description: inputDescription.value || "-",
      teknologies: teknologies,
      image: fileData,
    })
  );
  setStorage();

  alert("data berhasil ditambah dengan nama: " + inputProjectName.value);

  form.reset();
  refreshCards();
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

// updateProject jadi async untuk baca file baru jika ada
const updateProject = async (e) => {
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

  const teknologies = [];
  checkBoxTeknologies.forEach((t) => teknologies.push(t.value));

  // Siapkan file baru jika ada
  const file = inputImage.files && inputImage.files[0];

  // Validasi file baru jika dipilih
  const validation = validateImageFile(file);
  if (!validation.ok) {
    alert(validation.message);
    return;
  }

  // baca file baru jika ada, jika tidak pakai image lama
  let fileData = result[projectIndex].image; // default ke yg lama
  if (file) {
    try {
      fileData = await readFileAsDataURL(file);
    } catch (err) {
      console.warn("Gagal membaca file:", err);
      // tetap pakai yg lama
    }
  }

  // Ambil referensi ke objek yang sudah ada di array
  const existingProject = result[projectIndex];

  // Mutasi (ubah) properti dari objek yang ada secara langsung
  existingProject.projectName = inputProjectName.value || "-";
  existingProject.startDate = inputStartDate.value || "-";
  existingProject.endDate = inputEndDate.value || "-";
  existingProject.description = inputDescription.value || "-";
  existingProject.teknologies = teknologies;
  existingProject.image = fileData;

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

  refreshCards();
};

urlType();
