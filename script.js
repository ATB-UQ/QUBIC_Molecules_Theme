document.addEventListener('DOMContentLoaded', () => {
    fetch('schedule.json')
        .then(response => response.json())
        .then(schedule => {
            const tbody = document.querySelector('#schedule tbody');
            const thead = document.querySelector('#schedule thead');
            const today = new Date();
            const startDate = new Date('2025-06-05');
            const endDate = new Date('2025-12-05');

            // Define the columns to be rendered and their display names
            const columns = {
                date: 'Date',
                time: 'Time',
                presenters: 'Presenters',
                titles: 'Titles',
                chair: 'Chair'
            };

            // Clear existing headers
            thead.innerHTML = '';

            // Generate table headers
            const headerRow = document.createElement('tr');
            Object.values(columns).forEach(columnName => {
                const th = document.createElement('th');
                th.textContent = columnName;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Convert schedule dates to a Set for quick lookup
            const scheduleDates = new Set(schedule.map(entry => new Date(entry.date).toDateString()));

            // Combine schedule entries and default entries
            const combinedSchedule = [...schedule];

            // Sort combined schedule by date
            combinedSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Render the sorted schedule
            combinedSchedule.forEach(entry => {

                const row = document.createElement('tr');
                const date = new Date(entry.date);
                let displayDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

                // Check if the date is tomorrow
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                if (date.toDateString() === tomorrow.toDateString()) {
                    displayDate = 'Tomorrow';
                }

                const formattedEntry = {
                    date: displayDate,
                    time: entry.time,
                    presenters: entry.presenters,
                    titles: entry.titles,
                    chair: entry.chair
                };

                Object.entries(columns).forEach(([key, columnName]) => {
                    const cell = document.createElement('td');
                    const text = formattedEntry[key];
                    cell.textContent = text;

                    if (entry.status === 'pending' && (key === 'presenters' || key === 'titles' || key === 'chair')) {
                        cell.style.fontStyle = 'italic';
                        cell.style.color = 'grey';
                    }

                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching schedule:', error));
});
