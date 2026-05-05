let currentStep = "category";

function toggleChat() {
  const box = document.getElementById("chatbot-box");

  if (box.style.display === "none") {
    box.style.display = "flex";
    startChat(); 
  } else {
    box.style.display = "none";
  }
}

function clearChat() {
  document.getElementById("chat-messages").innerHTML = "";
}

function addMessage(text, isButton = false, callback = null, type = "bot") {
  const container = document.getElementById("chat-messages");

  const msg = document.createElement("div");

  if (isButton) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.className = "chat-option";
    btn.onclick = callback;

    msg.appendChild(btn);
  } else {
    msg.className = type === "bot" ? "chat-bubble bot" : "chat-bubble user";
    msg.innerHTML = text;
  }

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

// ===== START =====
async function startChat() {
  clearChat();
  currentStep = "category";


  addMessage("Hi 👋 Choose a category:", false, null, "bot");

  const res = await fetch("/chat/categories");
  const categories = await res.json();

  console.log(categories);

  categories.forEach((c) => {
    addMessage(c, true, () => loadQuestions(c));
  });
}

// ===== QUESTIONS =====
async function loadQuestions(category) {
  clearChat();
  currentStep = "question";

  addMessage(`Category: ${category}`);
  addMessage("Select your question:");

  const res = await fetch(`/chat/questions/${category}`);
  const data = await res.json();

  data.forEach((faq) => {
    addMessage(faq.question, true, () => showAnswer(faq));
  });
}

// ===== ANSWER =====
function showAnswer(faq) {
  clearChat();
  currentStep = "answer";

  addMessage(`Q: ${faq.question}`);
  addMessage(`A: ${faq.answer}`);

  addMessage("Was this helpful?");

  addMessage("Yes 👍", true, startChat);
  addMessage("No 👎", true, showSupport);
}

// ===== SUPPORT =====
function showSupport() {
  clearChat();

  addMessage("Sorry for the inconvenience 😔");
  addMessage("You can contact support:");

  addMessage("📞 9876543210");
  addMessage("📧 support@tuthire.com");

  addMessage("Start Again", true, startChat);
}