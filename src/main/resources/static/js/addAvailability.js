// ================= GLOBAL =================
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get("admin") === "true";
const teacherIdFromAdmin = urlParams.get("teacherId");

let slotsData = [];

// ================= ON LOAD =================
window.onload = function () {

  loadNavbar();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  if (!user || (role !== "teachers" && role !== "admin")) {
    showToast("Access denied");
    window.location.href = "login.html";
    return;
  }

  loadSlots();
};

// ================= LOAD SLOTS =================
async function loadSlots() {

  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const teacherId = isAdmin ? teacherIdFromAdmin : user.id;

    const url = isAdmin
      ? `/availability/admin/${teacherId}`
      : `/availability/${teacherId}`;

    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      showToast("Failed to load slots");
      return;
    }

    const data = await res.json();

    console.log("DATA:", data);

    // ✅ FIX: Ensure array
    if (!Array.isArray(data)) {
      console.error("Expected array, got:", data);
      showToast("Invalid data received");
      return;
    }

    slotsData = data;

    const container = document.getElementById("slots");
    container.innerHTML = "";

    data.forEach((slot) => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <p><b>${slot.day}</b></p>
        <p>${slot.startTime} - ${slot.endTime}</p>
        <p>${slot.date || ""}</p>

        <p style="color:${slot.available ? 'green' : 'red'}">
          ${slot.available ? 'Active' : 'Inactive'}
        </p>

        <button onclick="editSlot(${slot.id})" style="margin-bottom: 10px">Edit</button>
        <button onclick="deleteSlot(${slot.id})">Delete</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    showToast("Failed to load slots");
  }
}

// ================= ADD SLOT =================
function openAddModal() {
  openModal(
    "Add Availability",
    `
      <input id="day" placeholder="Day/s (Mon,Tue)" />
      <input id="start" placeholder="Start Time (10:00)" />
      <input id="end" placeholder="End Time (11:00)" />
      <input id="date" placeholder="Date (optional)" />
      <button onclick="saveSlot()" style="margin-bottom: 10px">Save</button>
    `
  );
}

async function saveSlot() {

  const user = JSON.parse(localStorage.getItem("user"));

  const slot = {
    day: document.getElementById("day").value,
    startTime: document.getElementById("start").value,
    endTime: document.getElementById("end").value,
    date: document.getElementById("date").value
  };

  try {
    const teacherId = isAdmin ? teacherIdFromAdmin : user.id;

    const res = await fetch(`/availability/add?teacherId=${teacherId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slot)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Add error:", text);
      showToast("Add failed");
      return;
    }

    closeModal();
    showToast("Added");
    loadSlots();

  } catch (err) {
    console.error(err);
    showToast("Error adding slot");
  }
}

// ================= EDIT SLOT =================
function editSlot(id) {

  const slot = slotsData.find(s => s.id === id);

  if (!slot) {
    showToast("Slot not found");
    return;
  }

  openModal(
    "Edit Availability",
    `
      <input id="day" value="${slot.day}" />
      <input id="start" value="${slot.startTime}" />
      <input id="end" value="${slot.endTime}" />
      <input id="date" value="${slot.date || ""}" />
      <button onclick="updateSlot(${slot.id})" style="margin-bottom: 10px">Update</button>
    `
  );
}

async function updateSlot(id) {

  const updated = {
    day: document.getElementById("day").value,
    startTime: document.getElementById("start").value,
    endTime: document.getElementById("end").value,
    date: document.getElementById("date").value
  };

  try {
    const url = isAdmin
      ? `/availability/admin/update/${id}`
      : `/availability/update/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Update error:", text);
      showToast("Update failed");
      return;
    }

    closeModal();
    showToast("Updated");
    loadSlots();

  } catch (err) {
    console.error(err);
    showToast("Error updating slot");
  }
}

// ================= DELETE SLOT =================
async function deleteSlot(id) {

  try {
    const url = isAdmin
      ? `/availability/admin/delete/${id}`
      : `/availability/delete/${id}`;

    const res = await fetch(url, {
      method: "DELETE"
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Delete error:", text);
      showToast("Delete failed");
      return;
    }

    showToast("Deleted");
    loadSlots();

  } catch (err) {
    console.error(err);
    showToast("Error deleting slot");
  }
}