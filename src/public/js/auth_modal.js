function openRegister() {
  const form = document.getElementById("authForm");
  const title = document.getElementById("authModalTitle");
  const usernameField = document.getElementById("usernameField");
  const submitBtn = document.getElementById("authSubmitBtn");

  form.action = "/register";
  title.textContent = "Form Register";
  submitBtn.textContent = "Register";

  usernameField.style.display = "block";
}

function openLogin() {
  const form = document.getElementById("authForm");
  const title = document.getElementById("authModalTitle");
  const usernameField = document.getElementById("usernameField");
  const submitBtn = document.getElementById("authSubmitBtn");

  form.action = "/login";
  title.textContent = "Form Login";
  submitBtn.textContent = "Login";

  usernameField.style.display = "none";
}

document.getElementById("authModal").addEventListener("hidden.bs.modal", () => {
  openLogin(); // default
});

function deleteData(project, el) {
  const data = confirm(`apakah yakin project ${project} dihapus?`);
  if (data) {
    return (el.type = "submit");
  }

  return;
}

setTimeout(() => {
  const toast = document.getElementById("toastMessage");
  toast.classList.add("hide");

  // Setelah animasi selesai, baru hilangkan dari layout
  setTimeout(() => {
    toast.style.display = "none";
  }, 500); // harus sama dengan duration transition
}, 3000);
