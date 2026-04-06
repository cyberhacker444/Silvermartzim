const supabase = window.supabase.createClient(
  "https://ldzvaxawdtstwovvvfbv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenZheGF3ZHRzdHdvdnZ2ZmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Nzg4MTEsImV4cCI6MjA5MTA1NDgxMX0.SfS1eNoQtgW2Pb_keC3wTSXGHbvoLn8WwD-MudNGzHc"
);

// ---------------- REGISTER ----------------
async function register() {
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (!email || !phone || !password) {
    document.getElementById("msg").innerText = "Fill all fields";
    return;
  }

  if (!phone.startsWith("+263")) {
    document.getElementById("msg").innerText = "Phone must start with +263";
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

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("msg").innerText = error.message;
    return;
  }

  const user = data.user;

  let { data: profile, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (fetchError || !profile) {
    document.getElementById("msg").innerText = "User profile not found";
    return;
  }

  if (profile.status !== "approved") {
    document.getElementById("msg").innerText =
      "Account pending admin approval";
    return;
  }

  document.getElementById("msg").innerText = "Login successful!";
}
