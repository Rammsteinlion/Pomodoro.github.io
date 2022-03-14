const tasks = []; // array
let time = 0; // lleva la cuenta regresiva
let timer = null; // se ejecutara cada determinado tiempo
let timerBreak = null; // los minutos de descanso
let current = null; // cual es la tarea actual que se esta ejecutando
let statusApp = "stop";

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");

renderTasks();
renderTime();

form.addEventListener("submit", (e) => {
  e.preventDefault(); // anula el funcionamiento nativo del form 
  if (itTask.value !== "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

//random generara un valor entre 0 y 1
function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(2),  ///id generico - genera un valor entre 1 y cero
    title: value,
    completed: false,
  };

  tasks.unshift(newTask);
}

//map devuelve un arreglo de string
function renderTasks() {
  const html = tasks.map((task) => {
    return `
        <div class="task">
        <div class="completed">${
          task.completed
            ? "<span class='done'>Done</span>"
            : `<button class="start-button" data-id="${task.id}">Start</button></div>`
        }
            <div class="title">${task.title}</div>
        </div>`;
  });
  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");
  //join transforma un arreglo en un solo string 

  const startButtons = document.querySelectorAll(".task .start-button");
   //se itera con funcion anonima

  startButtons.forEach((startButton) => {
    startButton.addEventListener("click", () => {
      if (!timer) {
        startButtonHandler(startButton.getAttribute("data-id"));
        startButton.textContent = "In progress...";
      }
    });
  });
}

//calcular 25 minutos de la actividad
function startButtonHandler(id) {
  //time = 0.5 * 60;
  time =  8;
  current = id;
  const taskId = tasks.findIndex((task) => task.id === id);
  document.querySelector("#time #taskName").textContent = tasks[taskId].title;

   //funcion que se ejecute cada segundo
 //setInterval permite ejecutar una funcion de forma indefinida hasta que se detenga maneja milisegundos
 //setTimeout  permite ejecutar una funcion  despues de cierto tiempo.
  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

//cada vez que se ejecute la funcion se decrementa en 1
//renderizar el tiempo
function timerHandler(id = null) {
  time--;
  renderTime();
  if (time === 0) {
    markComplete(id);
    clearInterval(timer);
    renderTasks();
    startBreak();
  }
}

function markComplete(id) {
  const taskId = tasks.findIndex((task) => task.id === id);
  tasks[taskId].completed = true;
}

function startBreak() {
  //time = 1 * 60;
  time = 5;
  document.querySelector("#time #taskName").textContent = "Break";
  timerBreak = setInterval(timerBreakHandler, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();
  if (time === 0) {
    clearInterval(timerBreak);
    current = null;
    document.querySelector("#time #taskName").textContent = "";
    renderTime();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);
  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}