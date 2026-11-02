const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();

const menuToggle = $("menuToggle");
const navLinks = $("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

function filterStations() {
  const query = $("stationSearch").value.trim().toLowerCase();
  const type = $("chargerFilter").value;
  let count = 0;
  document.querySelectorAll(".station-card").forEach(card => {
    const matchesText = card.dataset.name.includes(query);
    const matchesType = type === "all" || card.dataset.type === type;
    const show = matchesText && matchesType;
    card.classList.toggle("hidden", !show);
    if (show) count++;
  });
  $("resultCount").textContent = `${count} sample station${count === 1 ? "" : "s"}`;
  if (!count) $("resultCount").textContent = "No sample stations match — try another search";
}
$("searchBtn").addEventListener("click", filterStations);
$("stationSearch").addEventListener("input", filterStations);
$("chargerFilter").addEventListener("change", filterStations);

document.querySelectorAll(".book-card").forEach(button => {
  button.addEventListener("click", () => {
    $("bookingStation").value = button.dataset.station;
    $("booking").scrollIntoView({ behavior: "smooth" });
    $("bookingStation").focus({ preventScroll: true });
  });
});

const dateInput = $("bookingDate");
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
dateInput.min = localDate;
dateInput.value = localDate;

function updateEstimate() {
  const rates = {
    "Sunrise Energy Hub": 12,
    "Greenway Charge Plaza": 10,
    "Suntrail Fast Charge": 14
  };
  const station = $("bookingStation").value;
  const energy = Number($("energySelect").value);
  $("costEstimate").textContent = `₹${(rates[station] || 12) * energy}`;
}
$("bookingStation").addEventListener("change", updateEstimate);
$("energySelect").addEventListener("change", updateEstimate);
updateEstimate();

$("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!dateInput.value || dateInput.value < localDate) {
    dateInput.setCustomValidity("Please choose today or a future date.");
    dateInput.reportValidity();
    return;
  }
  dateInput.setCustomValidity("");
  const station = $("bookingStation").value;
  const date = new Date(`${dateInput.value}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const time = $("bookingTime").value;
  const success = $("bookingSuccess");
  success.textContent = `Demo request prepared for ${station} on ${date} at ${time}. No real reservation has been made.`;
  success.classList.add("show");
});
dateInput.addEventListener("input", () => dateInput.setCustomValidity(""));

$("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  $("contactMessage").textContent = "Thanks! This is a front-end demo; connect a form service to receive messages.";
  $("contactMessage").style.color = "#5f8c2b";
});