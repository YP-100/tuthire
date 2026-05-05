document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const errorText = document.getElementById("error");

  errorText.textContent = "";

  try {
    if (!["students", "teachers", "admin"].includes(role)) {
      errorText.textContent = "Invalid role selected";
      return;
    }
    const res = await fetch(`/${role}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Save user data
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("role", role);

    showToast("Login successful!");

    // Redirect (next step later)
    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    errorText.textContent = err.message;
  }
});
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const errorText = document.getElementById("error");

  errorText.textContent = "";

  try {
    const res = await fetch(`/${role}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Save user data
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("role", role);

    showToast("Login successful!");

    // Redirect (next step later)
    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    errorText.textContent = err.message;
  }
});
