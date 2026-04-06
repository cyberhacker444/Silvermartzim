<!DOCTYPE html>
<html>
<head>
  <title>Silvermartzim App</title>
  <style>
    body {
      font-family: Arial;
      background: linear-gradient(to right, #ff0000, #0000ff);
      color: white;
      text-align: center;
    }

    .box {
      margin-top: 100px;
    }

    input {
      display: block;
      margin: 10px auto;
      padding: 10px;
      width: 250px;
      border-radius: 5px;
      border: none;
    }

    button {
      padding: 10px;
      width: 120px;
      margin: 5px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
    }

    #msg {
      margin-top: 10px;
      font-weight: bold;
    }
  </style>
</head>

<body>

<div class="box">
  <h1>Silvermartzim</h1>

  <input type="email" id="email" placeholder="Email">
  <input type="text" id="phone" placeholder="+263 Phone">
  <input type="password" id="password" placeholder="Password">

  <button onclick="register()">Register</button>
  <button onclick="login()">Login</button>

  <p id="msg"></p>
</div>

<!-- Supabase JS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
const supabase = window.supabase.createClient(
  "https://ldzvaxawdtstwovvvfbv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenZheGF3ZHRzdHdvdnZ2ZmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Nzg4MTEsImV4cCI6MjA5MTA1NDgxMX0.SfS1eNoQtgW2Pb_keC3wTSXGHbvoLn8WwD-MudNGzHc"
);

// REGISTER USER
async function register() {
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let password = document.getElementById("password").value;

  if (!phone.startsWith("+263")) {
    document.getElementById("msg").innerText = "Use +263 number format";
    return;
  }

  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("msg").innerText = error.message;
    return;
  }

  await supabase.from("users").insert([
    {
      email: email,
      phone: phone,
      role: "user",
      status: "pending"
    }
  ]);

  document.getElementById("msg").innerText =
    "Registered! Wait for admin approval.";
}

// LOGIN USER
async function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("msg").innerText = error.message;
    return;
  }

  let user = data.user;

  let { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!profile || profile.status !== "approved") {
    document.getElementById("msg").innerText =
      "Account pending admin approval.";
    return;
  }

  document.getElementById("msg").innerText = "Login successful!";
}
</script>

</body>
</html>
