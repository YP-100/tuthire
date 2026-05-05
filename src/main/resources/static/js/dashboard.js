window.onload = async function () {
  loadNavbar();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  
  if (!user) {
    showToast("Please login first");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("welcome").innerText = `Welcome, ${user.fullName}`;
  
  // LOAD TEACHERS

  const teacherRes = await fetch("/teachers/search?subject=&standard=");
  const teachers = await teacherRes.json();
  
  const teacherDiv = document.getElementById("teachers");
  
  teachers.slice(0, 9).forEach((t) => {
    const div = document.createElement("div");

    div.className = "card";

    div.addEventListener("click", () => {
  console.log("CLICK WORKING", t.id);
  window.location.href = `teacher.html?id=${t.id}`;
});

    div.innerHTML = `
      <h4>${t.fullName}</h4>
      <p>Subjects: ${t.subjects.split(",").map(s => `<span class="tag">${s}</span>`).join("")}</p>
      <p>Standards: ${t.standards}</p>
      <p class="price">Price: ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(t.amount)}</p>
  `;

    teacherDiv.appendChild(div);
  });

  function openTeacher(id) {
    window.location.href = `teacher.html?id=${id}`;
  }

  // LOAD REQUESTS
  let url = "";

  if (role === "students") {
    url = `/hiring/student/${user.id}`;
  } else {
    url = `/hiring/teacher/${user.id}`;
  }

  const res = await fetch(url);
  const requests = await res.json();

  const container = document.getElementById("requests");

  requests.forEach((r) => {
    const div = document.createElement("div");
    div.className = "card";

    div.style.border = "1px solid black";
    div.style.margin = "10px";
    div.style.padding = "10px";

    let buttons = "";

    // ONLY FOR TEACHER
    if (role === "teachers") {

    if (r.status === "PENDING") {
        buttons = `
            <button onclick="updateStatus(${r.id}, 'ACCEPTED')" style="margin-bottom: 10px;">Accept</button>
            <button onclick="updateStatus(${r.id}, 'REJECTED')">Reject</button>
        `;
    }

    else if (r.status === "ACCEPTED") {
        buttons = `
            <button onclick="updateStatus(${r.id}, 'COMPLETED')">Mark Completed</button>
        `;
    }
}

    div.innerHTML = `
        <p><b>Student:</b> ${r.student?.fullName || ""}</p>
        <p><b>teacher:</b> ${r.teacher?.fullName || ""}</p>
        <p><b>Subject:</b> ${r.subject}</p>
        <p><b>Status:</b> ${r.status}</p>
        ${buttons}
    `;

    container.appendChild(div);
  });
};
  
  async function updateStatus(hiringId, status) {
    await fetch(`/hiring/updateStatus?hiringId=${hiringId}&status=${status}`, {
      method: "PUT",
    });

    showToast(`Request ${status}`);

  
}
