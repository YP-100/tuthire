function openModal(title, content) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalBody").innerHTML = content;
  document.getElementById("modal").style.display = "block";
}


function closeModal() {
  document.getElementById("modal").style.display = "none";
}