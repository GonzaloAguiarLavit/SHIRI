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
