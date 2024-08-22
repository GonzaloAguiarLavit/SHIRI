let startTime;
let timerInterval;
let currentEmployee;
let history = JSON.parse(localStorage.getItem('history')) || [];

// Navigation
document.getElementById('homeMenu').addEventListener('click', showHome);
document.getElementById('employeesMenu').addEventListener('click', showEmployees);
document.getElementById('cutsMenu').addEventListener('click', showCuts);
document.getElementById('reportsMenu').addEventListener('click', showReports);

function showHome() {
    hideAllContainers();
    document.getElementById('loginContainer').style.display = 'block';
}

function showEmployees() {
    hideAllContainers();
    // Display employee-related content
}

function showCuts() {
    hideAllContainers();
    // Display meat cuts-related content
}

function showReports() {
    hideAllContainers();
    document.getElementById('reportsContainer').style.display = 'block';
    // Generate report content
}

function hideAllContainers() {
    document.querySelectorAll('.container').forEach(container => container.style.display = 'none');
}

// Handling name selection
document.getElementById('saveNameButton').addEventListener('click', function() {
    const nameInput = document.getElementById('employeeName').value;
    if (nameInput) {
        saveName(nameInput);
        loadNameList();
        alert("Name saved. Select it from the list.");
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
    nameList.innerHTML = '';
    let names = localStorage.getItem('names') ? JSON.parse(localStorage.getItem('names')) : [];
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameList.appendChild(option);
    });
}

function showMeatSelection() {
    hideAllContainers();
    document.getElementById('meatSelectionContainer').style.display = 'block';
}

// Handling meat selection
document.querySelectorAll('.meat-card').forEach(card => {
    card.addEventListener('click', function() {
        const selectedMeat = this.getAttribute('data-meat');
        document.getElementById('selectedMeat').textContent = selectedMeat;
        showTimerScreen();
    });
});

function showTimerScreen() {
    hideAllContainers();
    document.getElementById('timerContainer').style.display = 'block';
}

// Handling timer
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
    const timestamp =
