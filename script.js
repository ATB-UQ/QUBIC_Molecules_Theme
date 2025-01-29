document.addEventListener('DOMContentLoaded', () => {
    fetch('schedule.json')
        .then(response => response.json())
        .then(schedule => {
            const tbody = document.querySelector('#schedule tbody');
            schedule.forEach(entry => {
                const row = document.createElement('tr');
                Object.values(entry).forEach(text => {
                    const cell = document.createElement('td');
                    cell.textContent = text;
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching schedule:', error));
});
