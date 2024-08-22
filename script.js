let startTime;
let timerInterval;
let currentEmployee;
let history = JSON.parse(localStorage.getItem('history')) || [];
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let cuts = JSON.parse(localStorage.getItem('cuts')) || [
    { name: 'Beef', category: 'Meat' },
    { name: 'Pork', category: 'Meat' },
    { name: 'Chicken Breast', category: 'Chicken' },
    { name: 'Salmon', category: 'Fish' }
];

// Navegación
document.getElementById('homeMenu').addEventListener('click', showHome);
document.getElementById('employeesMenu').addEventListener('click', showEmployees);
document.getElementById('cutsMenu').addEventListener('click', showCuts);
document.getElementById('reportsMenu').addEventListener('click', showReports);

function hideAllContainers() {
    document.querySelectorAll('.container').forEach(container => container.style.display = 'none');
}

// Mostrar Home (selección de empleado)
function showHome() {
    hideAllContainers();
    loadNameList();
    document.getElementById('loginContainer').style.display = 'block';
}

function loadNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = '';
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee;
        option.textContent = employee;
        nameList.appendChild(option);
    });
}

document.getElementById('selectNameButton').addEventListener('click', function() {
    currentEmployee = document.getElementById('nameList').value;
    showCuts();
});

// Mostrar Empleados
function showEmployees() {
    hideAllContainers();
    document.getElementById('employeesContainer').style.display = 'block';
    loadEmployees();
}

function loadEmployees() {
    const employeesList = document.getElementById('employeesList');
    employeesList.innerHTML = '';
    employees.forEach(employee => {
        const li = document.createElement('li');
        li.textContent = employee;
        employeesList.appendChild(li);
    });
}

document.getElementById('addEmployeeButton').addEventListener('click', function() {
    const newEmployeeName = document.getElementById('newEmployeeName').value;
    if (newEmployeeName && !employees.includes(newEmployeeName)) {
        employees.push(newEmployeeName);
        localStorage.setItem('employees', JSON.stringify(employees));
        loadEmployees();
        loadNameList();  // Actualizar la lista de nombres en Home
        document.getElementById('newEmployeeName').value = '';
    }
});

// Mostrar Cortes (Categorías: Carne, Pollo, Pescado)
function showCuts() {
    hideAllContainers();
    document.getElementById('cutsContainer').style.display = 'block';
    loadCuts();
}

function loadCuts() {
    const cutsList = document.getElementById('cutsList');
    cutsList.innerHTML = '';
    const categoryFilter = document.getElementById('categoryFilter').value;
    cuts
        .filter(cut => categoryFilter === 'all' || cut.category === categoryFilter)
        .forEach(cut => {
            const li = document.createElement('li');
            li.textContent = `${cut.name} (${cut.category})`;
            li.addEventListener('click', function() {
                startCutTimer(cut.name);
            });
            cutsList.appendChild(li);
        });
}

document.getElementById('addCutButton').addEventListener('click', function() {
    const newCutName = document.getElementById('newCutName').value;
    const newCutCategory = document.getElementById('newCutCategory').value;
    if (newCutName && !cuts.some(cut => cut.name === newCutName)) {
        cuts.push({ name: newCutName, category: newCutCategory });
        localStorage.setItem('cuts', JSON.stringify(cuts));
        loadCuts();
        document.getElementById('newCutName').value = '';
    }
});

document.getElementById('categoryFilter').addEventListener('change', loadCuts);

// Iniciar Cronómetro para el corte seleccionado
function startCutTimer(cutName) {
    document.getElementById('selectedMeat').textContent = cutName;
    hideAllContainers();
    document.getElementById('timerContainer').style.display = 'block';

    startTime = new Date();
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

    startTimer();
}

function startTimer() {
    timerInterval = setInterval(function() {
        const currentTime = new Date();
        const elapsedTime = formatTime(new Date(currentTime - startTime));
        document.getElementById('timer').textContent = elapsedTime;

        const angle = (360 * (new Date() - startTime) / 60000) % 360;
        document.querySelector('.hand').style.transform = `rotate(${angle}deg)`;
    }, 1000);
}

function formatTime(time) {
    const hours = String(time.getUTCHours()).padStart(2, '0');
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Detener el cronómetro y guardar la entrada
document.getElementById('stopButton').addEventListener('click', function() {
    clearInterval(timerInterval);

    const endTime = new Date();
    const elapsedTime = formatTime(new Date(endTime - startTime));
    const timestamp = startTime.toLocaleString();

    const newEntry = {
        employee: currentEmployee,
        meat: document.getElementById('selectedMeat').textContent,
        startTime: timestamp,
        endTime: endTime.toLocaleTimeString(),
        elapsedTime: elapsedTime
    };

    history.push(newEntry);
    localStorage.setItem('history', JSON.stringify(history));

    // Confirmación visual
    alert("Nueva entrada guardada correctamente.");

    // Mostrar historial en la consola para depuración
    console.log("New entry added to history:", newEntry);
    console.log("Current history:", history);

    showCuts();
});

// Mostrar Reportes
function showReports() {
    hideAllContainers();
    document.getElementById('reportsContainer').style.display = 'block';
    displayHistory();
}

// Mostrar la tabla de historial de entradas
function displayHistory() {
    const reportsContent = document.getElementById('reportsContent');
    reportsContent.innerHTML = `
        <h2>Historial de Entradas</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Empleado</th>
                    <th>Corte</th>
                    <th>Hora de Inicio</th>
                    <th>Hora de Fin</th>
                    <th>Tiempo Transcurrido</th>
                </tr>
            </thead>
            <tbody id="historyTableBody"></tbody>
        </table>
    `;

    const historyTableBody = document.getElementById('historyTableBody');

    if (history.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="5">No hay entradas en el historial.</td></tr>';
    } else {
        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.employee}</td>
                <td>${entry.meat}</td>
                <td>${new Date(entry.startTime).toLocaleTimeString()}</td>
                <td>${entry.endTime}</td>
                <td>${entry.elapsedTime}</td>
            `;
            historyTableBody.appendChild(row);
        });
    }
}

// Inicializar la aplicación
showHome();
