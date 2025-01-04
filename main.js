const calendarDiv = document.getElementById('calendar');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const prevYearBtn = document.getElementById('prevYearBtn');
    const nextYearBtn = document.getElementById('nextYearBtn');
    const addPostBtn = document.getElementById('addPostBtn');
    const postTypeDropdown = document.getElementById('postTypeDropdown');

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let files = [];

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function populateMonthSelect() {
      months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = month;
        monthSelect.appendChild(option);
      });
      monthSelect.value = currentMonth;
    }

    function populateYearSelect() {
      const startYear = currentYear - 5;
      const endYear = currentYear + 5;
      for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
      }
      yearSelect.value = currentYear;
    }

    populateMonthSelect();
    populateYearSelect();

    monthSelect.addEventListener('change', () => {
      currentMonth = parseInt(monthSelect.value);
      generateCalendar(currentYear, currentMonth);
    });

    yearSelect.addEventListener('change', () => {
      currentYear = parseInt(yearSelect.value);
      generateCalendar(currentYear, currentMonth);
    });

    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
        yearSelect.value = currentYear;
      }
      monthSelect.value = currentMonth;
      generateCalendar(currentYear, currentMonth);
    });

    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
        yearSelect.value = currentYear;
      }
      monthSelect.value = currentMonth;
      generateCalendar(currentYear, currentMonth);
    });

    prevYearBtn.addEventListener('click', () => {
      currentYear--;
      yearSelect.value = currentYear;
      generateCalendar(currentYear, currentMonth);
    });

    nextYearBtn.addEventListener('click', () => {
      currentYear++;
      yearSelect.value = currentYear;
      generateCalendar(currentYear, currentMonth);
    });

    addPostBtn.addEventListener('click', () => {
      postTypeDropdown.classList.toggle('show');
    });

    postTypeDropdown.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        const selectedPostType = event.target.dataset.type;
        window.location.href = `/post-form.html?type=${selectedPostType}`;
      }
    });

    function generateCalendar(year, month) {
      try {
        console.log("Generating calendar for", year, month);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const numDays = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        console.log("First day:", firstDay);
        console.log("Last day:", lastDay);
        console.log("Number of days:", numDays);
        console.log("First day of week:", firstDayOfWeek);

        let calendarHTML = '<table>';
        calendarHTML += '<thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead>';
        calendarHTML += '<tbody>';

        let day = 1;
        let currentDay = 0;
        for (let i = 0; i < 6; i++) {
          calendarHTML += '<tr>';
          for (let j = 0; j < 7; j++) {
            let cellHTML = '';
            if (currentDay < firstDayOfWeek) {
              cellHTML = '<td></td>';
              currentDay++;
            } else if (day <= numDays) {
              const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const currentFiles = files.filter(file => file.date === currentDate);
              cellHTML = `<td data-date="${currentDate}">${day}</td>`;
              day++;
              currentDay++;
            } else {
              cellHTML = '<td></td>';
            }
            calendarHTML += cellHTML;
          }
          calendarHTML += '</tr>';
        }

        calendarHTML += '</tbody></table>';
        calendarDiv.innerHTML = calendarHTML;

      } catch (error) {
        console.error("Error:", error);
        calendarDiv.innerHTML = "<p>Error loading calendar.</p>";
      }
    }

    generateCalendar(currentYear, currentMonth);
