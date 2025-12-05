const form = document.getElementById("addProject");
const cardListElement = document.getElementById("cardList");
const result = JSON.parse(localStorage.getItem("projects")) || [];

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
    dataProject.forEach((dp) => {
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
    <a href="#" class="btn btn-primary">Edit</a>
    <a href="#" class="btn btn-primary">Delete</a>
  `;

  // Masukkan element ke parent
  card.appendChild(imageEl);
  card.appendChild(cardBody);

  return card;
};

loadProjects();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputProjectName = this.querySelector("#projectName").value;
  const inputStartDate = this.querySelector("#startDate").value;
  const inputEndDate = this.querySelector("#endDate").value;
  const inputDescription = this.querySelector("#description").value;
  const inputImage = this.querySelector("#uploadImage");
  const checkBoxTeknologies = this.querySelectorAll(
    'input[name="technologies"]:checked'
  );
  const fileName = !inputImage.files[0] ? "-" : inputImage.files[0].name;

  const teknologies = [];
  checkBoxTeknologies.forEach((t) => teknologies.push(t.value));

  result.push(
    objProject({
      projectName: inputProjectName || "-",
      description: inputDescription || "-",
      teknologies: teknologies,
      image: fileName,
    })
  );
  setStorage();

  alert("data berhasil ditambah dengan nama: " + inputProjectName);

  form.reset();
});
