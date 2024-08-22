let startTime;
let timerInterval;

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
    const meatType = document.getElementById('meatType').value;
    const employeeName = prompt("Ingrese su nombre:");
    
    addRowToHistory(employeeName, meatType, elapsedTime);
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
