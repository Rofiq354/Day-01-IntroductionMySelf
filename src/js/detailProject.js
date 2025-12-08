const sectionEl = document.querySelector("#detailProject");
const params = new URLSearchParams(window.location.search);
const urlId = params.get("id");
sectionEl.innerHTML = "";

const data = JSON.parse(localStorage.getItem("projects"));

const getData = data.filter((d) => d.id === Number(urlId));
console.log(getData);

// Mapping teknologi ke icon Font Awesome
const techIconMap = {
  "node-js": `<i class="fa-brands fa-node-js me-2 text-success"></i> Node Js`,
  "next-js": `<i class="fa-solid fa-n me-2 text-dark"></i> Next Js`,
  "react-js": `<i class="fa-brands fa-react me-2 text-info"></i> React Js`,
  typescript: `<i class="fa-brands fa-typescript me-2 text-primary"></i> TypeScript`,
};

function formatTanggalIndonesia(dateString) {
  const parts = dateString.split("-"); // ["1992", "11", "11"]
  // Parameter: tahun, bulan (0-indexed, jadi 11 November adalah bulan 10), hari
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);

  // 2. Gunakan Intl.DateTimeFormat untuk pemformatan lokal
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("id-ID", options);

  return formatter.format(dateObj);
}

getData.forEach((gd) => {
  sectionEl.innerHTML += `
        <div class="container">
            <h1 class="text-center mb-4 text-uppercase">${gd.projectName}</h1>
    
            <div class="row align-items-center g-4">
            <!-- Image -->
            <div class="col-12 col-md-6">
                <img
                src="/src/img/code.jpg"
                alt="${gd.image}"
                class="img-fluid rounded"
                style="height: 300px; width: 100%"
                />
            </div>
    
            <!-- Detail Info -->
            <div class="col-12 col-md-6">
                <div class="d-flex flex-column gap-4">
                <!-- Duration -->
                <div>
                    <h4>Duration</h4>
    
                    <p class="mb-1">
                    <i
                        class="fa-regular fa-calendar-days me-2 text-secondary"
                    ></i>
                    ${formatTanggalIndonesia(
                      gd.startDate
                    )} - ${formatTanggalIndonesia(gd.endDate)}
                    </p>
    
                    <p class="fw-semibold">
                    <i
                        class="fa-solid fa-hourglass-half me-2 text-secondary"
                    ></i>
                    1 Month
                    </p>
                </div>
    
                <!-- Technologies -->
                <div>
                    <h4>Technologies</h4>
    
                    <div class="row row-cols-2 g-2">
                        ${gd.teknologies
                          .map((tech) => {
                            return `
                                <div class="col">
                                    <p class="mb-0">
                                        ${
                                          techIconMap[tech] ??
                                          `<i class="fa-solid fa-code me-2"></i> ${tech}`
                                        }
                                    </p>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                </div>
                </div>
            </div>
            </div>
    
            <!-- Description -->
            <p class="mt-4">
            ${gd.description}
            </p>
        </div>
    `;
});
