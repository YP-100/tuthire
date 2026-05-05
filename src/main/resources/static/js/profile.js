window.onload = function () {

    loadNavbar(); // navbar on top

    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");

    if (!user) {
        showToast("Please login first");
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById("profile");

    let extra = "";

    // Teacher specific fields
    if (role === "teachers") {
        extra = `
            <p><b>Subjects:</b> ${user.subjects.split(",").map(s => `<span class="tag" style="color: #775bb4; font-weight: bold; background-color: rgb(167 145 145 / 20%);">${s}</span>`).join("")}</p>
            <p><b>Standards:</b> ${user.standards}</p>
        `;
    }

    container.innerHTML = `
        <p><b>Full Name:</b> ${user.fullName}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Login Name:</b> ${user.loginName}</p>
        <p><b>Contact:</b> ${user.contact}</p>
        <p><b>Gender:</b> ${user.gender}</p>
        <p><b>Address:</b> ${user.address}</p>
        ${extra}
    `;
};

function editProfile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");

    let extraFields = "";

    if (role === "teachers") {
        extraFields = `
            <input id="subjects" value="${user.subjects}" placeholder="Subjects" />
            <input id="standards" value="${user.standards}" placeholder="Standards" />
        `;
    }

    openModal("Edit Profile", `
        <input id="email" value="${user.email}" placeholder="Email" />
        <input id="fullName" value="${user.fullName}" placeholder="Full Name" />
        <input id="loginName" value="${user.loginName}" placeholder="Login Name" />
        <input id="contact" value="${user.contact}" placeholder="Contact" />
        <input id="address" value="${user.address}" placeholder="Address" />
        ${extraFields}
        <button onclick="saveProfile()">Save</button>
    `);
}

async function saveProfile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");

    let updated = {
        ...user,
        email: document.getElementById("email").value,
        fullName: document.getElementById("fullName").value,
        loginName: document.getElementById("loginName").value,
        contact: document.getElementById("contact").value,
        address: document.getElementById("address").value
    };

    let url = "";

    if (role === "teachers") {
        updated.subjects = document.getElementById("subjects").value;
        updated.standards = document.getElementById("standards").value;
        url = "/teachers/admin/update";
    } else {
        url = "/students/admin/update";
    }

    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    });

    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data));

    closeModal();
    showToast("Profile updated");
    location.reload();
}