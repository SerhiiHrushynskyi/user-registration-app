const app = document.getElementById('app');

const header = document.createElement('h1');
header.textContent = 'Реєстрація користувача';
app.appendChild(header);

const form = document.createElement('form');
form.id = 'userForm';

const fields = [
    { label: 'Прізвище:', id: 'surname', type: 'text' },
    { label: 'Ім\'я:', id: 'name', type: 'text' },
    { label: 'Вік:', id: 'age', type: 'number' },
    { label: 'Освіта:', id: 'education', type: 'text' },
    { label: 'Бажана посада:', id: 'desiredPosition', type: 'text' }
];

fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.label;

    const input = document.createElement('input');
    input.id = field.id;
    input.type = field.type;
    input.required = true;

    label.appendChild(input);
    form.appendChild(label);
});

const button = document.createElement('button');
button.type = 'submit';
button.textContent = 'Зберегти';
form.appendChild(button);
app.appendChild(form);

const userListContainer = document.createElement('div');
userListContainer.id = 'userList';

const userListHeader = document.createElement('h2');
userListHeader.textContent = 'Користувачі';
userListContainer.appendChild(userListHeader);

const userList = document.createElement('ul');
userList.id = 'users';
userListContainer.appendChild(userList);
app.appendChild(userListContainer);

const localStorageKey = 'userData';

function isOnline() {
    return navigator.onLine;
}

const mockServer = {
    users: [],
    save(data) {
        if (!this.users.some(user => user.id === data.id)) {
            this.users.push(data);
        }
    },
    fetch() {
        return this.users;
    }
};

function addUserToList(user) {
    const li = document.createElement('li');
    li.textContent = `${user.surname} ${user.name}, ${user.age} років, Освіта: ${user.education}, Посада: ${user.desiredPosition}`;
    userList.appendChild(li);
}

function validateUser(user) {
    if (!user.surname || !user.name || !user.education || !user.desiredPosition || isNaN(user.age)) {
        alert('Будь ласка, заповніть всі поля.');
        return false;
    }
    if (user.age < 18) {
        alert('Вік повинен бути не менше 18 років!');
        return false;
    }
    return true;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const user = {
        id: `${Date.now()}-${Math.random()}`, // Унікальний ідентифікатор
        surname: document.getElementById('surname').value.trim(),
        name: document.getElementById('name').value.trim(),
        age: parseInt(document.getElementById('age').value, 10),
        education: document.getElementById('education').value.trim(),
        desiredPosition: document.getElementById('desiredPosition').value.trim(),
    };

    if (!validateUser(user)) return;

    if (isOnline()) {
        mockServer.save(user);
        addUserToList(user);
    } else {
        const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        data.push(user);
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    }

    form.reset();
});

window.addEventListener('load', () => {
    if (isOnline()) {
        mockServer.fetch().forEach(addUserToList);
        localStorage.removeItem(localStorageKey);
    } else {
        const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        data.forEach(addUserToList);
    }
});

window.addEventListener('online', () => {
    const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    data.forEach(user => {
        mockServer.save(user);
        addUserToList(user);
    });
    localStorage.removeItem(localStorageKey);
});

window.addEventListener('offline', () => {
    console.log('Ви офлайн. Дані будуть збережені локально.');
});
