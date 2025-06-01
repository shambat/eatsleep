
const MASTER_PASSWORD_HASH = CryptoJS.SHA256("shambulk").toString(); // change password

function login() {
  const input = document.getElementById("passwordInput").value;
  const hash = CryptoJS.SHA256(input).toString();
  if (hash === MASTER_PASSWORD_HASH) {
    sessionStorage.setItem("auth", "true");
    localStorage.setItem("userKey", input);
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("appSection").classList.remove("hidden");
    loadHistory();
  } else {
    alert("Incorrect password.");
  }
}

function encrypt(text, key) {
  return CryptoJS.AES.encrypt(text, key).toString();
}

function decrypt(cipher, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "[Corrupted]";
  }
}

function addEntry() {
  const entry = document.getElementById("entryInput").value.trim();
  const key = localStorage.getItem("userKey");
  if (!entry) return alert("Please type something!");
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const timestamp = new Date().toLocaleString();

  history.push({
    entry: encrypt(entry, key),
    time: encrypt(timestamp, key)
  });

  localStorage.setItem("history", JSON.stringify(history));
  document.getElementById("entryInput").value = "";
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const log = document.getElementById("log");
  const historyDiv = document.getElementById("history");
  log.innerHTML = "";
  historyDiv.innerHTML = "";
  const key = localStorage.getItem("userKey");

  history.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${decrypt(item.entry, key)}</strong><br><small>${decrypt(item.time, key)}</small>`;
    log.appendChild(div);
    historyDiv.appendChild(div.cloneNode(true));
  });
}

function toggleHistory() {
  document.getElementById("historyPanel").classList.toggle("hidden");
}

window.onload = () => {
  if (sessionStorage.getItem("auth") === "true") {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("appSection").classList.remove("hidden");
    loadHistory();
  }
};
