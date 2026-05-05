window.onload = async function () {

    const params = new URLSearchParams(window.location.search);

    const teacherId = params.get("teacherId");

    const res = await fetch(`/teachers/${teacherId}`);
    const teacher = await res.json();

    document.getElementById("details").innerHTML = `
        <p><b>Teacher:</b> ${teacher.fullName}</p>
        <p><b>Amount:</b> \u20B9 ${teacher.amount}</p>
    `;
};


async function pay() {

    const params = new URLSearchParams(window.location.search);
    const user = JSON.parse(localStorage.getItem("user"));

    const teacherId = params.get("teacherId");
    const availabilityId = params.get("availabilityId");

    const txn = document.getElementById("txn").value;

    if (!txn) {
        showToast("Enter transaction ID");
        return;
    }

    //  Create hiring FIRST
    const hiringRes = await fetch(
        `/hiring/request?studentId=${user.id}&teacherId=${teacherId}&availabilityId=${availabilityId}&subject=java&standard=10`,
        { method: "POST" }
    );

    const hiring = await hiringRes.json();

    //  Make payment
    await fetch(`/payment/pay?hiringId=${hiring.id}&amount=${hiring.amount}&transactionId=${txn}`, {
        method: "POST"
    });

    showToast("Payment submitted. Waiting for admin approval.");

    window.location.href = "dashboard.html";
}

async function skip() {

    const params = new URLSearchParams(window.location.search);
    const user = JSON.parse(localStorage.getItem("user"));

    const teacherId = params.get("teacherId");
    const availabilityId = params.get("availabilityId");

    //  CREATE HIRING (PAYMENT_PENDING)
    await fetch(
        `/hiring/request?studentId=${user.id}&teacherId=${teacherId}&availabilityId=${availabilityId}&subject=java&standard=10`,
        {
            method: "POST"
        }
    );

    showToast("Request sent to admin for approval (demo payment)");

    window.location.href = "dashboard.html";
}