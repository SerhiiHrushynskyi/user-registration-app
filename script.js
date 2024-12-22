const app = document.getElementById("app");

const header = document.createElement("h1");
header.textContent = "Реєстрація користувача";
app.appendChild(header);

const form = document.createElement("form");
form.id = "userForm";

const fields = [
  { label: "Прізвище:", id: "surname", type: "text" },
  { label: "Ім'я:", id: "name", type: "text" },
  { label: "Вік:", id: "age", type: "number" },
  { label: "Освіта:", id: "education", type: "text" },
  { label: "Бажана посада:", id: "desiredPosition", type: "text" },
];

fields.forEach((field) => {
  const label = document.createElement("label");
  label.textContent = field.label;

  const input = document.createElement("input");
  input.id = field.id;
  input.type = field.type;
  input.required = true;

  label.appendChild(input);
  form.appendChild(label);
});

const button = document.createElement("button");
button.type = "submit";
button.textContent = "Зареєструвати";
form.appendChild(button);
app.appendChild(form);

const showUsersButton = document.createElement("button");
showUsersButton.textContent = "Показати користувачів";
showUsersButton.style.marginTop = "10px";
app.appendChild(showUsersButton);

const userTableContainer = document.createElement("div");
userTableContainer.id = "userTable";
userTableContainer.style.display = "none";

const userTable = document.createElement("table");
const tableHeader = document.createElement("thead");
tableHeader.innerHTML = `
  <tr>
    <th>Прізвище</th>
    <th>Ім\'я</th>
    <th>Вік</th>
    <th>Освіта</th>
    <th>Бажана посада</th>
  </tr>
`;
userTable.appendChild(tableHeader);

const tableBody = document.createElement("tbody");
userTable.appendChild(tableBody);
userTableContainer.appendChild(userTable);
app.appendChild(userTableContainer);

const localStorageKey = "userData";

function isOnline() {
  return navigator.onLine;
}

const mockServer = {
  users: [],
  save(data) {
    if (!this.users.some((user) => user.id === data.id)) {
      this.users.push(data);
    }
  },
  fetch() {
    return this.users;
  },
};

function addUserToTable(user) {
  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${user.surname}</td>
      <td>${user.name}</td>
      <td>${user.age}</td>
      <td>${user.education}</td>
      <td>${user.desiredPosition}</td>
    `;
  tableBody.appendChild(row);
}

function validateUser(user) {
  if (
    !user.surname ||
    !user.name ||
    !user.education ||
    !user.desiredPosition ||
    isNaN(user.age)
  ) {
    alert("Будь ласка, заповніть всі поля.");
    return false;
  }
  if (user.age < 18) {
    alert("Вік повинен бути не менше 18 років!");
    return false;
  }
  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = {
    id: `${Date.now()}-${Math.random()}`,
    surname: document.getElementById("surname").value.trim(),
    name: document.getElementById("name").value.trim(),
    age: parseInt(document.getElementById("age").value, 10),
    education: document.getElementById("education").value.trim(),
    desiredPosition: document.getElementById("desiredPosition").value.trim(),
  };

  if (!validateUser(user)) return;

  if (isOnline()) {
    mockServer.save(user);
  } else {
    const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    data.push(user);
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  alert("Користувача зареєстровано!");
  form.reset();
});

showUsersButton.addEventListener("click", () => {
  tableBody.innerHTML = "";
  userTableContainer.style.display = "block";

  if (isOnline()) {
    mockServer.fetch().forEach(addUserToTable);
  } else {
    const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    data.forEach(addUserToTable);
  }
});

window.addEventListener("online", () => {
  const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  data.forEach((user) => {
    mockServer.save(user);
  });
  localStorage.removeItem(localStorageKey);
});

window.addEventListener("offline", () => {
  console.log("Ви офлайн. Дані будуть збережені локально.");
});
