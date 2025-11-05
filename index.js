const daysGrid = document.getElementById("daysGrid");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");
const clearEventsBtn = document.getElementById("clearEventsBtn");

const modal = document.getElementById("eventModal");
const modalDate = document.getElementById("modalDate");
const eventInput = document.getElementById("eventInput");
const saveEvent = document.getElementById("saveEvent");
const deleteEvent = document.getElementById("deleteEvent");
const closeModal = document.getElementById("closeModal");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("events")) || {};
let selectedDate = null;

function renderCalendar(date) {
  daysGrid.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = date.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  // Dias do mês anterior
  for (let i = 0; i < startDay; i++) {
    const dayNum =
      new Date(year, month, 0).getDate() - startDay + i + 1;
    const d = new Date(year, month - 1, dayNum);
    createDay(d, true);
  }

  // Dias do mês atual
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    createDay(d, false);
  }

  // Dias do próximo mês para completar a grade
  const totalCells = daysGrid.children.length;
  const nextDays = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= nextDays; i++) {
    const d = new Date(year, month + 1, i);
    createDay(d, true);
  }
}

function createDay(date, otherMonth) {
  const div = document.createElement("div");
  div.classList.add("day");
  if (otherMonth) div.classList.add("other-month");

  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    div.classList.add("today");
  }

  div.textContent = date.getDate();

  const key = formatDateKey(date);
  if (events[key]) {
    const dot = document.createElement("div");
    dot.classList.add("event-dot");
    div.appendChild(dot);
  }

  div.addEventListener("click", () => openModal(date));
  daysGrid.appendChild(div);
}

function openModal(date) {
  selectedDate = date;
  const key = formatDateKey(date);
  modal.style.display = "flex";
  modalDate.textContent = date.toLocaleDateString("pt-BR");
  eventInput.value = events[key] || "";
}

function closeEventModal() {
  modal.style.display = "none";
  selectedDate = null;
}

function saveEventData() {
  const key = formatDateKey(selectedDate);
  const text = eventInput.value.trim();
  if (text) events[key] = text;
  else delete events[key];
  localStorage.setItem("events", JSON.stringify(events));
  renderCalendar(currentDate);
  closeEventModal();
}

function deleteEventData() {
  const key = formatDateKey(selectedDate);
  delete events[key];
  localStorage.setItem("events", JSON.stringify(events));
  renderCalendar(currentDate);
  closeEventModal();
}

function clearAllEvents() {
  if (confirm("Deseja realmente apagar todos os eventos?")) {
    events = {};
    localStorage.removeItem("events");
    renderCalendar(currentDate);
  }
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Navegação
prevMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar(currentDate);
});
nextMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar(currentDate);
});
todayBtn.addEventListener("click", () => {
  currentDate = new Date();
  renderCalendar(currentDate);
});

// Modal
closeModal.addEventListener("click", closeEventModal);
saveEvent.addEventListener("click", saveEventData);
deleteEvent.addEventListener("click", deleteEventData);
clearEventsBtn.addEventListener("click", clearAllEvents);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeEventModal();
});

// Inicializa
renderCalendar(currentDate);
