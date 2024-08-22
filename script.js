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

// Navigation
document.getElementById('homeMenu').addEventListener('click', showHome);
document.getElementById('employeesMenu').addEventListener('click', showEmployees);
document.getElementById('cutsMenu').addEventListener('click', showCuts);
document.getElementById('reportsMenu').addEventListener('click', showReports);

function hideAllContainers() {
    document.querySelectorAll('.container').forEach(container => container.style.display = 'none');
}

// Show Home (Employee selection)
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

// Show Employees
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
        loadNameList();  // Update the name list in Home
        document.getElementById('newEmployeeName').value = '';
    }
});

// Show Cuts (Categories: Meat, Chicken, Fish)
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

// Start Cut Timer
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

    // Debugging: Verify that the data is being stored correctly
    console.log("New entry added to history:", newEntry);
    console.log("Current history:", history);

    showCuts();
});

// Show Reports
function showReports() {
    hideAllContainers();
    document.getElementById('reportsContainer').style.display = 'block';
    generateReports();
}

function generateReports() {
    const reportsContent = document.getElementById('reportsContent');
    reportsContent.innerHTML = '';

    console.log("Generating reports with history:", history);

    // Agrupar entradas por día
    const groupedByDay = groupBy(history, entry => {
        const date = new Date(entry.startTime);
        return date.toLocaleDateString();  // Agrupar por fecha
    });

    // Generar reportes por cada día
    for (const [day, entries] of Object.entries(groupedByDay)) {
        let dayReport = `<h2>${day}</h2><table border="1"><tr><th>Employee</th><th>Cut</th><th>Start Time</th><th>End Time</th><th>Elapsed Time</th></tr>`;
        let totalDayTime = 0;

        entries.forEach(entry => {
            const timeParts = entry.elapsedTime.split(':');
            const totalSeconds = (+timeParts[0] * 3600) + (+timeParts[1] * 60) + (+timeParts[2]);
            totalDayTime += totalSeconds;

            dayReport += `<tr>
                <td>${entry.employee}</td>
                <td>${entry.meat}</td>
                <td>${new Date(entry.startTime).toLocaleTimeString()}</td>
                <td>${entry.endTime}</td>
                <td>${entry.elapsedTime}</td>
            </tr>`;
        });

        dayReport += `<tr><td colspan="4">Total Work Time</td><td>${formatSeconds(totalDayTime)}</td></tr></table>`;
        reportsContent.innerHTML += dayReport;
    }
}

// Agrupar entradas de historial por una clave específica (por ejemplo, día)
function groupBy(array, keyGetter) {
    const map = {};
    array.forEach(item => {
        const key = keyGetter(item);
        if (!map[key]) {
            map[key] = [];
        }
        map[key].push(item);
    });
    return map;
}

function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Initialize
showHome();
