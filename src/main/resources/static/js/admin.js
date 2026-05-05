function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.style.display = "none";
  });

  document.getElementById(id).style.display = "flex";
  document.getElementById(id).style.flexWrap = "wrap";
  document.getElementById(id).style.alignContent = "center";
  document.getElementById(id).style.justifyContent = "center";
}

window.onload = async function () {
  loadNavbar();
  loadFaq();

  const role = localStorage.getItem("role");

  if (role !== "admin") {
    showToast("Access denied");
    window.location.href = "login.html";
    return;
  }

  loadTeachers();
  loadStudents();
  loadFeedbacks();
  loadHirings();
  loadPayments();

  showSection("teachers");
};

// ================= APPROVE PAYMENT =================
async function approve(id) {
  try {
    const res = await fetch(`/hiring/approve?id=${id}&role=admin`, {
      method: "PUT",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Approve error:", text);
      showToast("Approve failed");
      return;
    }

    showToast("Payment Approved");
    loadPayments();
  } catch (err) {
    console.error(err);
    showToast("Error approving payment");
  }
}
// ================= TEACHERS =================
async function loadTeachers() {
  const res = await fetch("/teachers/all");
  const data = await res.json();

  const div = document.getElementById("teachers");
  div.innerHTML = "";

  data.forEach((t) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${t.fullName}</h4>
      <p>${t.email}</p>
      <p>Subjects: ${t.subjects
        .split(",")
        .map((s) => `<span class="tag">${s}</span>`)
        .join("")}</p>
      <p>Standards: ${t.standards}</p>
      <p>\u20B9 ${t.amount}</p>

      <button onclick='editTeacher(${JSON.stringify(t)})' style="margin-bottom: 10px;">Edit</button>
      <button onclick='deleteTeacher(${t.id})'>Delete</button>
    `;

    div.appendChild(card);
  });
}

function editTeacher(t) {
  openModal(
    "Edit Teacher",
    `
      <input id="email" value="${t.email}" />
      <input id="name" value="${t.fullName}" />
      <input id="login" value="${t.loginName}" />
      <input id="subjects" value="${t.subjects}" />
      <input id="standards" value="${t.standards}" />
      <input id="amount" value="${t.amount}" />

      <button onclick='saveTeacher(${JSON.stringify(t)})' style="margin-bottom: 10px;">Save</button>
      <button onclick='manageAvailability(${t.id})' style="margin-bottom: 10px;">Edit Availability</button>
    `,
  );
}

async function saveTeacher(t) {
  const updated = {
    ...t,
    email: document.getElementById("email").value,
    fullName: document.getElementById("name").value,
    loginName: document.getElementById("login").value,
    subjects: document.getElementById("subjects").value,
    standards: document.getElementById("standards").value,
    amount: document.getElementById("amount").value,
  };

  await fetch("/teachers/admin/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  closeModal();
  showToast("Teacher updated");
  loadTeachers();
}

async function deleteTeacher(id) {
  await fetch(`/teachers/admin/${id}`, { method: "DELETE" });
  showToast("Teacher deleted");
  loadTeachers();
}

// ================= STUDENTS =================
async function loadStudents() {
  const res = await fetch("/students/all");
  const data = await res.json();

  const div = document.getElementById("students");
  div.innerHTML = "";

  data.forEach((s) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${s.fullName}</h4>
      <p>${s.email}</p>
      <p>${s.contact}</p>
      <p>${s.address}</p>

      <button onclick='editStudent(${JSON.stringify(s)})' style="margin-bottom: 10px;">Edit</button>
      <button onclick='deleteStudent(${s.id})'>Delete</button>
    `;

    div.appendChild(card);
  });
}

function editStudent(s) {
  openModal(
    "Edit Student",
    `
      <input id="email" value="${s.email}" />
      <input id="name" value="${s.fullName}" />
      <input id="login" value="${s.loginName}" />
      <input id="contact" value="${s.contact}" />
      <input id="address" value="${s.address}" />

      <button onclick='saveStudent(${JSON.stringify(s)})' style="margin-bottom: 10px;">Save</button>
    `,
  );
}

async function saveStudent(s) {
  const updated = {
    ...s,
    email: document.getElementById("email").value,
    fullName: document.getElementById("name").value,
    loginName: document.getElementById("login").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value,
  };

  await fetch("/students/admin/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  closeModal();
  showToast("Student updated");
  loadStudents();
}

async function deleteStudent(id) {
  await fetch(`/students/admin/${id}`, { method: "DELETE" });
  showToast("Student deleted");
  loadStudents();
}

// ================= FEEDBACK =================
async function loadFeedbacks() {
  const res = await fetch("/feedback/all");
  const data = await res.json();

  const div = document.getElementById("feedbacks");
  div.innerHTML = "";

  data.forEach((f) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
  <p><b>Rating:</b> ${f.rating}</p>
  <p><b>Review:</b> ${f.review}</p>

  <p><b>Reply:</b> 
  ${f.reply 
    ? `<span class="reply-text">${f.reply}</span>` 
    : `<span style="color:gray">No reply</span>`}
</p>

  <button onclick='editFeedback(${JSON.stringify(f)})' style="margin-bottom: 10px;">Edit</button>
  <button onclick="deleteFeedback(${f.id})">Delete</button>
`;

    div.appendChild(card);
  });
}

function editFeedback(f) {
  openModal(
    "Edit Feedback",
    `
      <input id="rating" value="${f.rating}" />
      <input id="review" value="${f.review}" />
      <input id="reply" value="${f.reply || ""}" placeholder="Reply..." />


      <button onclick='saveFeedbackAdmin(${f.id})' style="margin-bottom: 10px;">Save</button>
    `,
  );
}

async function saveFeedbackAdmin(id) {
  const rating = document.getElementById("rating").value;
  const review = document.getElementById("review").value;
  
  const replyInput = document.getElementById("reply");
  const reply = replyInput ? replyInput.value : "";

  await fetch("/feedback/admin/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, rating, review, reply }),
  });

  closeModal();
  showToast("Feedback updated");
  loadFeedbacks();
}

async function deleteFeedback(id) {
  await fetch(`/feedback/${id}`, { method: "DELETE" });
  showToast("Feedback deleted");
  loadFeedbacks();
}

// ================= HIRINGS =================
async function loadHirings() {
  const res = await fetch("/hiring/all");
  const data = await res.json();

  const div = document.getElementById("hirings");
  div.innerHTML = "";

  data.forEach((h) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <p><b>Student:</b> ${h.student?.fullName || ""}</p>
      <p><b>Teacher:</b> ${h.teacher?.fullName || ""}</p>
      <p><b>Subject:</b> ${h.subject}</p>
      <p>Status: ${h.status}</p>

      <button onclick='editHiring(${JSON.stringify(h)})' style="margin-bottom: 10px;">Edit</button>
      <button onclick="deleteHiring(${h.id})">Delete</button>
    `;

    div.appendChild(card);
  });
}
function editHiring(h) {
  openModal(
    "Edit Hiring",
    `
      <input id="subject" value="${h.subject}" />
      <input id="standard" value="${h.standard}" />

      <select id="status">
        <option value="PAYMENT_PENDING" ${h.status === "PAYMENT_PENDING" ? "selected" : ""}>PAYMENT_PENDING</option>
        <option value="PENDING" ${h.status === "PENDING" ? "selected" : ""}>PENDING</option>
        <option value="ACCEPTED" ${h.status === "ACCEPTED" ? "selected" : ""}>ACCEPTED</option>
        <option value="REJECTED" ${h.status === "REJECTED" ? "selected" : ""}>REJECTED</option>
        <option value="COMPLETED" ${h.status === "COMPLETED" ? "selected" : ""}>COMPLETED</option>
      </select>

      <button onclick='saveHiring(${h.id})'>Save</button>
    `,
  );
}
async function saveHiring(id) {
  const updated = {
    id,
    subject: document.getElementById("subject").value,
    standard: document.getElementById("standard").value,
    status: document.getElementById("status").value,
  };

  await fetch("/hiring/admin/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  closeModal();
  showToast("Hiring updated");
  loadHirings();
}

async function deleteHiring(id) {
  if (!confirm("Are you sure you want to delete this hiring?")) return;

  try {
    const res = await fetch(`/hiring/admin/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast("Delete failed");
      return;
    }

    showToast("Hiring deleted");
    loadHirings();
    loadPayments();
  } catch (err) {
    console.error(err);
    showToast("Error deleting hiring");
  }
}

// ================= PAYMENTS + REFUNDS =================
async function loadPayments() {
  const res = await fetch("/hiring/all");
  const hirings = await res.json();

  const container = document.getElementById("payments");
  container.innerHTML = "";

  for (const h of hirings) {
    const paymentRes = await fetch(`/payment/byHiring/${h.id}`);
    let payment = null;

    if (paymentRes.ok) {
      const text = await paymentRes.text();

      if (text) {
        payment = JSON.parse(text);
      } else {
        payment = null;
      }
    }

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
    <p><b>Student:</b> ${h.student?.fullName || ""}</p>
    <p><b>Teacher:</b> ${h.teacher?.fullName || ""}</p>
    <p><b>Amount:</b> \u20B9${h.amount}</p>

    ${
      payment?.refundStatus !== "NONE"
        ? `
        <p><b>Payment:</b> ${h.paymentDone ? "Paid" : "Not Paid"}</p>
        <p><b>Refund:</b> ${payment?.refundStatus || "NONE"}</p>
        <p><b>Reason:</b> ${payment?.refundReason || "NONE"}</p>
        `
        : ""
    }


    ${
      h.status === "PAYMENT_PENDING"
        ? `
      <button onclick="approve(${h.id})">Approve Payment</button>
    `
        : ""
    }

    ${
      payment?.refundStatus === "REQUESTED"
        ? `
      <button onclick="approveRefund(${h.id})" style="margin-bottom: 10px;">Approve Refund</button>
      <button onclick="rejectRefund(${h.id})">Reject</button>
    `
        : ""
    }
  `;

    container.appendChild(div);
  }
}

// ================= REFUND ACTIONS =================
async function approveRefund(id) {
  await fetch(`/payment/refund/approve?hiringId=${id}`, {
    method: "PUT",
  });

  showToast("Refund Approved");
  loadPayments();
}

async function rejectRefund(id) {
  await fetch(`/payment/refund/reject?hiringId=${id}`, {
    method: "PUT",
  });

  showToast("Refund Rejected");
  loadPayments();
}

// ================= AVAILABILITY =================
function manageAvailability(teacherId) {
  window.location.href = `addavailability.html?teacherId=${teacherId}&admin=true`;
}

// ================= FAQ =================
async function loadFaq() {
  const res = await fetch("/chat/faq/all");
  const data = await res.json();

  const div = document.getElementById("faq");
  div.innerHTML = "";

  // Add Button

  data.forEach((f) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <p><b>${f.question}</b></p>
    <p>${f.answer}</p>
    <p>Category: ${f.category || "N/A"}</p>
    
    <button onclick='editFaq(${JSON.stringify(f)})'>Edit</button>
    <button onclick="deleteFaq(${f.id})">Delete</button>
    `;

    div.appendChild(card);
  });
  const addBtn = document.createElement("button");
  addBtn.innerText = "+";
  addBtn.className = "add-faq-btn";
  addBtn.onclick = openAddFaq;
  div.appendChild(addBtn);
}

function openAddFaq() {
  openModal(
    "Add FAQ",
    `
      <input id="q" placeholder="Question" />
      <input id="a" placeholder="Answer" />
      <input id="c" placeholder="Category" />

      <button onclick="saveFaq()">Save</button>
    `,
  );
}

async function saveFaq() {
  const q = document.getElementById("q").value.trim();
  const a = document.getElementById("a").value.trim();
  const c = document.getElementById("c").value.trim();

  if (!q || !a || !c) {
    showToast("All fields including category are required");
    return;
  }

  const faq = { question: q, answer: a, category: c };

  await fetch("/chat/faq/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  });

  closeModal();
  showToast("FAQ Added");
  loadFaq();
}

function editFaq(f) {
  openModal(
    "Edit FAQ",
    `
      <input id="q" value="${f.question}" />
      <input id="a" value="${f.answer}" />
      <input id="c" value="${f.category || ""}" />

      <button onclick='updateFaq(${f.id})'>Update</button>
    `,
  );
}

async function updateFaq(id) {
  const q = document.getElementById("q").value.trim();
  const a = document.getElementById("a").value.trim();
  const c = document.getElementById("c").value.trim();

  if (!q || !a || !c) {
    showToast("All fields including category are required");
    return;
  }

  const faq = { question: q, answer: a, category: c };

  await fetch(`/chat/faq/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  });

  closeModal();
  showToast("FAQ Updated");
  loadFaq();
}

async function deleteFaq(id) {
  await fetch(`/chat/faq/delete/${id}`, { method: "DELETE" });

  showToast("FAQ Deleted");
  loadFaq();
}
