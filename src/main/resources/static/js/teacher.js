window.onload = async function () {
  loadNavbar();

  const params = new URLSearchParams(window.location.search);
  const teacherId = params.get("id");

  if (!teacherId) {
    showToast("No teacher selected");
    window.location.href = "dashboard.html";
    return;
  }

  // Fetch teacher info (reuse search)
  const res = await fetch(`/teachers/search?subject=&standard=`);
  const teachers = await res.json();

  const teacher = teachers.find((t) => t.id == teacherId);
  if (!teacher) {
    showToast("Teacher not found");
    window.location.href = "dashboard.html";
    return;
}

  const container = document.getElementById("teacherDetails");

  container.innerHTML = `
        <p><b>Name:</b> ${teacher.fullName}</p>
        <p><b>Email:</b> ${teacher.email}</p>
        <p><b>Subjects:</b> ${teacher.subjects}</p>
        <p><b>Standards:</b> ${teacher.standards}</p>
        <p class="price">Price: ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(teacher.amount)}</p>

    `;

  //  Load availability
  const availRes = await fetch(`/availability/${teacherId}`);
  const slots = await availRes.json();

  const availDiv = document.getElementById("availability");

  slots.forEach((slot) => {
    if (!slot.available) return;

    const div = document.createElement("div");

    div.style.border = "1px solid black";
    div.style.margin = "10px";
    div.style.padding = "10px";

    div.innerHTML = `
            <p>${slot.day} ${slot.startTime} - ${slot.endTime}</p>
            <button onclick="bookSlot(${teacherId}, ${slot.id})">Book</button>
        `;

    availDiv.appendChild(div);
  });
};

async function bookSlot(teacherId, availabilityId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    showToast("Please login first");
    window.location.href = "login.html";
    return;
  }

  await fetch(
    `/hiring/request?studentId=${user.id}&teacherId=${teacherId}&availabilityId=${availabilityId}&subject=java&standard=10`,
    {
      method: "POST",
    },
  );

  showToast("Request sent!");
}

function goToAvailability() {
  const params = new URLSearchParams(window.location.search);
  const teacherId = params.get("id");

  window.location.href = `availability.html?teacherId=${teacherId}`;
}
function goTODashboard() {

  window.location.href = `dashboard.html`;
}
