function toggleTeacherFields() {
    const role = document.getElementById("role").value;
    const teacherFields = document.getElementById("teacherFields");

    teacherFields.style.display = role === "teachers" ? "block" : "none";
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const errorText = document.getElementById("error");

    errorText.textContent = "";

    const data = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        gender: document.getElementById("gender").value,
        loginName: document.getElementById("loginName").value,
        contact: document.getElementById("contact").value,
        address: document.getElementById("address").value
    };

    // Add teacher fields if selected
    if (role === "teachers") {
        data.subjects = document.getElementById("subjects").value;
        data.standards = document.getElementById("standards").value;
        data.amount = document.getElementById("amount").value;
    }

    try {
        const res = await fetch(`/${role}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await res.json();

        if (!res.ok) {
            // If validation errors (multiple)
            if (typeof responseData === "object") {
                errorText.textContent = Object.values(responseData).join(", ");
            } else {
                throw new Error(responseData.error || "Registration failed");
            }
            return;
        }

        showToast("Registration successful!");
        window.location.href = "login.html";

    } catch (err) {
        errorText.textContent = err.message;
    }
});