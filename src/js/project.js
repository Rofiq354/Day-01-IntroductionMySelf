const form = document.getElementById("addProject");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const inputProjectName = document.getElementById("projectName");
  const inputStartDate = document.getElementById("startDate");
  const inputEndDate = document.getElementById("endDate");
  const inputDescription = document.getElementById("description");

  console.log(
    `Nama Project: ${inputProjectName.value} \nProject Dimulai: ${inputStartDate.value} \nProject Selesai: ${inputEndDate.value} \nDeskripsi Project: ${inputDescription.value}`
  );
});
