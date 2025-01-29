document.addEventListener('DOMContentLoaded', () => {
    fetch('schedule.json')
        .then(response => response.json())
        .then(schedule => {
            const tbody = document.querySelector('#schedule tbody');
            const today = new Date();
            const endDate = new Date('2025-12-05');
            const thursdays = [];

            // Generate all Thursdays until December 5th
            let current = new Date(today);
            current.setDate(current.getDate() + (4 - current.getDay() + 7) % 7); // Set to next Thursday
            while (current <= endDate) {
                thursdays.push(new Date(current));
                current.setDate(current.getDate() + 7);
            }

            // Convert schedule dates to a Set for quick lookup
            const scheduleDates = new Set(schedule.map(entry => new Date(entry.date).toDateString()));

            // Combine schedule entries and default entries
            const combinedSchedule = [...schedule];

            thursdays.forEach(date => {
                const dateString = date.toDateString();
                let displayDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

                // Check if the date is tomorrow
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                if (date.toDateString() === tomorrow.toDateString()) {
                    displayDate = 'Tomorrow';
                }

                // Check if the date is in the schedule
                if (!scheduleDates.has(dateString)) {
                    combinedSchedule.push({
                        date: dateString,
                        time: '9:30 AM',
                        presenter: 'Book this Slot!',
                        topic: 'TBA'
                    });
                }
            });

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
                    ...entry,
                    date: displayDate
                };

                Object.entries(formattedEntry).forEach(([key, text]) => {
                    const cell = document.createElement('td');
                    if (key === 'presenter' && text === 'Book this Slot!') {
                        const link = document.createElement('a');
                        link.href = 'mailto:c.macfarlane@student.uq.edu.au';
                        link.textContent = text;
                        cell.appendChild(link);
                    } else {
                        cell.textContent = text;
                    }
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching schedule:', error));
});