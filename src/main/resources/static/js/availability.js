const params = new URLSearchParams(window.location.search);
const teacherIdFromAdmin = params.get("teacherId");

const user = JSON.parse(localStorage.getItem("user"));

const teacherId = teacherIdFromAdmin || user.id;

window.onload = async function () {
  loadNavbar();

  const params = new URLSearchParams(window.location.search);
  const teacherId = params.get("teacherId");

  if (!teacherId) {
    showToast("No teacher selected");
    window.location.href = "dashboard.html";
    return;
  }

  const res = await fetch(`/availability/${teacherId}`);
  const slots = await res.json();

  const container = document.getElementById("slots");

  slots.forEach((slot) => {
    if (!slot.available) return;

    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
            <p><b>${slot.day}</b></p>
            <p>${slot.startTime} - ${slot.endTime}</p>
            <button onclick="bookSlot(${teacherId}, ${slot.id})">Book</button>
        `;

    container.appendChild(div);
  });
};

async function bookSlot(teacherId, availabilityId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    showToast("Please login first");
    window.location.href = "login.html";
    return;
}
    window.location.href = `payment.html?teacherId=${teacherId}&availabilityId=${availabilityId}`;
}
