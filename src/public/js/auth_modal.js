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
