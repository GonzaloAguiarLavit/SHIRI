let startTime;
let timerInterval;
let currentEmployee;

// Manejar la pantalla de inicio
document.getElementById('saveNameButton').addEventListener('click', function() {
    const nameInput = document.getElementById('employeeName').value;
    if (nameInput) {
        saveName(nameInput);
        loadNameList();
        alert("Nombre guardado. Selecciónelo de la lista.");
        document.getElementById('employeeName').value = '';
    }
});

document.getElementById('selectNameButton').addEventListener('click', function() {
    const selectedName = document.getElementById('nameList').value;
    if (selectedName) {
        currentEmployee = selectedName;
        showMeatSelection();
    }
});

function saveName(name) {
    let names = localStorage.getItem('names') ? JSON.parse(localStorage.getItem('names')) : [];
    if (!names.includes(name)) {
        names.push(name);
        localStorage.setItem('names', JSON.stringify(names));
    }
}

function loadNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = ''; // Limpiar la lista
    let names = localStorage.getItem('names') ? JSON.parse(localStorage.getItem('names')) : [];
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameList.appendChild(option);
    });
}

function showMeatSelection() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('meatSelectionContainer').style.display = 'block';
}

// Manejar la selección de carne
document.querySelectorAll('.meat-card').forEach(card => {
    card.addEventListener('click', function() {
        const selectedMeat = this.getAttribute('data-meat');
        document.getElementById('selectedMeat').textContent = selectedMeat;
        showTimerScreen();
    });
});

function showTimerScreen() {
    document.getElementById('meatSelectionContainer').style.display = 'none';
    document.getElementById('timerContainer').style.display = 'block';
}

// Manejar el cronómetro
document.getElementById('startButton').addEventListener('click', function() {
    startTime = new Date();
    this.disabled = true;
    document.getElementById('stopButton').disabled = false;
    startTimer();
});

document.getElementById('stopButton').addEventListener('click', function() {
    this.disabled = true;
    document.getElementById('startButton').disabled = false;
    clearInterval(timerInterval);

    const endTime = new Date();
    const elapsedTime = formatTime(new Date(endTime - startTime));
    const meatType = document.getElementById('selectedMeat').textContent;
    
    addRowToHistory(currentEmployee, meatType, elapsedTime);
    showMeatSelection();
});

document.getElementById('backButton').addEventListener('click', function() {
    showMeatSelection();
});

function startTimer() {
    timerInterval = setInterval(function() {
        const currentTime = new Date();
        const elapsedTime = formatTime(new Date(currentTime - startTime));
        document.getElementById('timer').textContent = elapsedTime;
    }, 1000);
}

function formatTime(time) {
    const hours = String(time.getUTCHours()).padStart(2, '0');
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function addRowToHistory(employee, meat, time) {
    const table = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const employeeCell = newRow.insertCell(0);
    const meatCell = newRow.insertCell(1);
    const timeCell = newRow.insertCell(2);

    employeeCell.textContent = employee;
    meatCell.textContent = meat;
    timeCell.textContent = time;
}

// Inicializar la lista de nombres
loadNameList();
