function showToast(msg) {
  const div = document.createElement("div");
  div.className = "toast";
  div.innerText = msg;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2000);
}