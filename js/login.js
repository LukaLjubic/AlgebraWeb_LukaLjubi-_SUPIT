// ---------- helpers ----------
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function updateAuthUI() {
  const loggedIn = isLoggedIn();
  const username = localStorage.getItem("username");

  const loginLinks = document.querySelectorAll(".nav-login-link");
  const logoutLinks = document.querySelectorAll(".nav-logout-link");
  const usernameSpans = document.querySelectorAll(".nav-logout-username");

  loginLinks.forEach((link) => {
    link.style.display = loggedIn ? "none" : "inline-block";
  });

  logoutLinks.forEach((link) => {
    link.style.display = loggedIn ? "inline-block" : "none";
  });

  usernameSpans.forEach((span) => {
    span.textContent = loggedIn && username ? ` (${username})` : "";
  });
}


function logoutUser(redirectToIndex = true) {
  localStorage.removeItem("token");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");

  updateAuthUI();

  if (redirectToIndex) {
    window.location.href = "index.html";
  }
}

function setupLogoutHandlers() {
  const logoutLinks = document.querySelectorAll(".nav-logout-link");
  logoutLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      logoutUser(true);
    });
  });
}

updateAuthUI();
setupLogoutHandlers();

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!username || !password) {
      alert("Molim unesite korisničko ime i lozinku.");
      return;
    }

    fetch("https://www.fulek.com/data/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const msg = data && (data.message || data.error);
          throw new Error(msg || "Neuspješna prijava.");
        }

        if (!data || !data.isSuccess || !data.data || !data.data.token) {
          throw new Error("Prijava nije uspjela. Provjerite korisničko ime i lozinku.");
        }

        const token = data.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("username", username);

        updateAuthUI();

        alert("Uspješna prijava!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert(error.message || "Dogodila se greška pri prijavi.");
      });
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("regUsername");
    const passwordInput = document.getElementById("regPassword");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!username || !password) {
      alert("Molim unesite korisničko ime i lozinku za registraciju.");
      return;
    }

    fetch("https://www.fulek.com/data/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const msg = data && (data.message || data.error);
          throw new Error(msg || "Neuspješna registracija.");
        }

        if (data && data.isSuccess) {
          alert("Registracija uspješna! Sada se možete prijaviti s vašim podacima.");
          const loginUsernameInput = document.getElementById("loginUsername");
          if (loginUsernameInput) {
            loginUsernameInput.value = username;
          }
        } else {
          throw new Error("Registracija nije uspjela. Korisničko ime možda već postoji.");
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert(error.message || "Dogodila se greška pri registraciji.");
      });
  });
}
