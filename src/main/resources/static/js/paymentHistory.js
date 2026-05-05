window.onload = async function () {
    loadNavbar();
    await loadPayments();
}

async function loadPayments() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    showToast("Login required");
    return;
  }

  try {
    const res = await fetch(`/payment/student/${user.id}`);
    const data = await res.json();

    const container = document.getElementById("payments");
    container.innerHTML = "";

    data.forEach(p => {

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <p><b>Teacher:</b> ${p.teacher?.fullName || ""}</p>
        <p><b>Amount:</b> \u20B9 ${p.amount}</p>
        <p><b>Transaction:</b> ${p.transactionId}</p>

        <p style="color:green">
          Payment: ${p.status}
        </p>

        <p style="color:${
          p.refundStatus === "APPROVED" ? "green" :
          p.refundStatus === "REQUESTED" ? "orange" :
          p.refundStatus === "REJECTED" ? "red" : "gray"
        }">
          Refund: ${p.refundStatus}
        </p>

        ${
          p.refundStatus === "NONE"
            ? `<button onclick="requestRefund(${p.hiring.id})">Request Refund</button>`
            : ""
        }
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    showToast("Failed to load payments");
  }
}

function requestRefund(hiringId) {

  openModal(
    "Request Refund",
    `
      <textarea id="refundReason" placeholder="Enter reason..." style="width:100%; height:80px;"></textarea>
      <br><br>
      <button onclick="submitRefund(${hiringId})" style="margin-bottom: 10px">Submit</button>
    `
  );
}
async function submitRefund(hiringId) {

  const reason = document.getElementById("refundReason").value;

  if (!reason) {
    showToast("Enter reason");
    return;
  }

  try {
    const res = await fetch(`/payment/refund/request?hiringId=${hiringId}&reason=${reason}`, {
      method: "PUT"
    });

    if (!res.ok) {
      showToast("Refund failed");
      return;
    }

    closeModal();
    showToast("Refund requested");
    loadPayments();

  } catch (err) {
    console.error(err);
    showToast("Error");
  }
}