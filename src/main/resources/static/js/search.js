window.onload = function () {
    loadNavbar();
}

async function searchTeachers() {


    const subject = document.getElementById("subject").value;
    const standard = document.getElementById("standard").value;

    const res = await fetch(`/teachers/search?subject=${subject}&standard=${standard}`);
    const teachers = await res.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    teachers.forEach(t => {

        const div = document.createElement("div");
        div.className ="card";
        div.onclick= () => openTeacher(t.id);

        div.innerHTML = `
            <h3>${t.fullName}</h3>
            <p><b>Subjects:</b> ${t.subjects}</p>
            <p><b>Standards:</b> ${t.standards}</p>
            <p class="price">Price: ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(t.amount)}</p>
            <button onclick="openTeacher(${t.id})">View Profile</button>
        `;

        resultsDiv.appendChild(div);
    });
}

async function viewAvailability(teacherId) {

    const res = await fetch(`/availability/${teacherId}`);
    const slots = await res.json();

    const resultsDiv = document.getElementById("results");

    slots.forEach(slot => {

        if (!slot.available) return;

        const div = document.createElement("div");

        div.innerHTML = `
            <p>${slot.day} ${slot.startTime} - ${slot.endTime}</p>
            <button onclick="bookSlot(${teacherId}, ${slot.id})">Book</button>
        `;

        resultsDiv.appendChild(div);
    });
}

async function bookSlot(teacherId, availabilityId) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        showToast("Please login first");
        window.location.href = "login.html";
        return;
    }

    await fetch(`/hiring/request?studentId=${user.id}&teacherId=${teacherId}&availabilityId=${availabilityId}&subject=java&standard=10`, {
        method: "POST"
    });

    showToast("Request sent!");
}

function openTeacher(id) {
    window.location.href = `teacher.html?id=${id}`;
  }
