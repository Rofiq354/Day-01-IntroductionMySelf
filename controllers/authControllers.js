import bcrypt from "bcrypt";
import db from "../config/db.js";

export const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;

  // 1. cek email sudah ada atau belum
  const checkEmail = await db.query(
    "SELECT id FROM public.users WHERE email = $1",
    [email]
  );

  if (checkEmail.rows.length > 0) {
    req.flash("error", "Email sudah terdaftar");
    return res.redirect("/");
  }

  // 2. hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // 3. insert user
  await db.query(
    `INSERT INTO public.users (username, email, password)
       VALUES ($1, $2, $3)`,
    [username, email, hashPassword]
  );

  req.flash("success", "Registrasi berhasil, silakan login");
  res.redirect("/");
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // 1. cek user berdasarkan email
  const result = await db.query(
    "SELECT id, username, email, password FROM public.users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    req.flash("error", "Email atau password salah");
    return res.redirect("/");
  }

  const user = result.rows[0];

  // 2. compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.flash("error", "Email atau password salah");
    return res.redirect("/");
  }

  // 3. simpan user ke session
  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  req.flash("success", "Login berhasil");
  res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
