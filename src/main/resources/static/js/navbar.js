function loadNavbar() {
  const role = localStorage.getItem("role");

  let navHTML = `
        <div class="navbar">
          <div class="logo" style="user-select: none;" >
            <h2>TutHire</h2>
          </div>
            <div>
    `;

  if (role === "students") {
    navHTML += `
            <button onclick="goTo('dashboard.html')">Dashboard</button>
            <button onclick="goTo('search.html')">Search</button>
            <button onclick="goTo('completed.html')">Completed</button>
            <button onclick="goTo('paymentHistory.html')">Payment History</button>
        `;
  }

  if (role === "teachers") {
    navHTML += `
    <button onclick="goTo('dashboard.html')">Dashboard</button>
    <button onclick="goTo('addAvailability.html')">Availability</button>
    <button onclick="goTo('completed.html')">Completed</button>
    `;
    }

  if (role === "admin") {
    navHTML += `
    <button onclick="goTo('admin.html')">dashboard</button>
    `;
    }
    

    
    navHTML += `
            <button onclick="goTo('profile.html')">Profile</button>
            <button onclick="logout()">Logout</button>
        </div>
    </div>
    `;
  

  document.body.insertAdjacentHTML("afterbegin", navHTML);
}

function goTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

