window.onload = async function () {
  loadNavbar();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  let url =
    role === "students"
      ? `/hiring/student/${user.id}`
      : `/hiring/teacher/${user.id}`;

  const res = await fetch(url);
  const hirings = await res.json();

  const container = document.getElementById("completed");
  console.log(hirings);

  hirings
    .filter((h) => h.status === "COMPLETED")
    .forEach(async (h) => {
      console.log(h);
      const div = document.createElement("div");
      div.className = "card";

      // get feedback (optional)
      let feedback = null;
      try {
        const f = await fetch(`/feedback/teacher/${h.teacher.id}`);
        const all = await f.json();
        feedback = all.find((x) => x.hiring.id === h.id);
      } catch {}

      let buttons = "";

      if (role === "students") {
        buttons = `
        <button onclick="handleFeedback(${h.id}, ${feedback ? true : false})">
        ${feedback ? "Edit Feedback" : "Add Feedback"}
        </button>
        `;
      }

      if (role === "teachers" && feedback) {
        buttons = `
      <button onclick="replyFeedback(${h.id}, '${feedback?.reply || ""}')">
          Reply
      </button>
      `;
      }

      div.innerHTML = `
                <p><b>Teacher:</b> ${h.teacher.fullName}</p>
                <p><b>Subject:</b> ${h.subject}</p>
                <p><b>Status:</b> ${h.status}</p>
                <p><b>Rating:</b> ${feedback?.rating || "N/A"}</p>
                <p><b>Review:</b> ${feedback?.review || "N/A"}</p>
                <p><b>Reply:</b> ${feedback?.reply || "No reply"}</p>
                ${buttons}
            `;

      container.appendChild(div);
    });
  async function giveFeedback(hiringId) {
    const rating = prompt("Enter rating (1-5):");
    const review = prompt("Enter review:");

    if (!rating || !review) return;

    await fetch(
      `/feedback/add?hiringId=${hiringId}&rating=${rating}&review=${review}`,
      {
        method: "POST",
      },
    );

    showToast("Feedback saved");
    location.reload();
  }

};

function handleFeedback(hiringId, isEdit) {

    openModal(isEdit ? "Edit Feedback" : "Add Feedback", `
        <input id="rating" placeholder="Rating (1-5)" />
        <input id="review" placeholder="Review" />
        <button onclick="saveFeedback(${hiringId}, ${isEdit})" style="margin-bottom: 10px">Save</button>
    `);
}

async function saveFeedback(hiringId, isEdit) {

    const rating = document.getElementById("rating").value;
    const review = document.getElementById("review").value;

    let url = "";
    let method = "";

    if (isEdit) {
        url = `/feedback/update?hiringId=${hiringId}&rating=${rating}&review=${review}`;
        method = "PUT";
    } else {
        url = `/feedback/add?hiringId=${hiringId}&rating=${rating}&review=${review}`;
        method = "POST";
    }

    await fetch(url, { method });

    closeModal();
    showToast(isEdit ? "Updated" : "Added");
    location.reload();
}

function replyFeedback(hiringId, existingReply) {

    openModal("Reply Feedback", `
        <input id="reply" value="${existingReply}" placeholder="Reply" />
        <button onclick="saveReply(${hiringId})" style="margin-bottom: 10px">Save</button>
    `);
}

async function saveReply(hiringId) {

    const reply = document.getElementById("reply").value;

    await fetch(`/feedback/reply?hiringId=${hiringId}&reply=${reply}`, {
        method: "PUT"
    });

    closeModal();
    showToast("Reply saved");
    location.reload();
}
