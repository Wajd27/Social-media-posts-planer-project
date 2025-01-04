const postText = document.getElementById('postText');
    const postMedia = document.getElementById('postMedia');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const postTypeDropdown = document.getElementById('postTypeDropdown');
    const postTextLabel = document.querySelector('.post-form-container label');
    const selectedDateInput = document.getElementById('selectedDate');
    const calendarDiv = document.getElementById('calendar');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const gmbError = document.getElementById('gmbError');
    const reelCheckbox = document.getElementById('reelCheckbox');
    const socialIcons = document.querySelectorAll('.social-icon');
    const selectedFilesContainer = document.getElementById('selectedFilesContainer');

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedPlatforms = ['facebook', 'instagram', 'gmb', 'linkedin'];
    let selectedFiles = [];

    const urlParams = new URLSearchParams(window.location.search);
    const postType = urlParams.get('type');

    if (postType === 'story') {
      postText.classList.add('hidden');
      postTextLabel.classList.add('hidden');
    }

    function handleMediaChange() {
      if (selectedPlatforms.includes('gmb') && postMedia.files.length > 1) {
        gmbError.classList.remove('hidden');
      } else {
        gmbError.classList.add('hidden');
      }

      if ((selectedPlatforms.includes('facebook') || selectedPlatforms.includes('instagram')) && postMedia.files.length > 0) {
        const hasVideo = Array.from(postMedia.files).some(file => file.type.startsWith('video'));
        if (hasVideo) {
          reelCheckbox.classList.remove('hidden');
        } else {
          reelCheckbox.classList.add('hidden');
        }
      } else {
        reelCheckbox.classList.add('hidden');
      }

      selectedFiles = Array.from(postMedia.files);
      renderSelectedFiles();
    }

    function renderSelectedFiles() {
      selectedFilesContainer.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.classList.add('selected-file');

        const fileIcon = document.createElement('div');
        fileIcon.classList.add('file-icon');
        if (file.type.startsWith('image')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          fileIcon.appendChild(img);
        } else if (file.type.startsWith('video')) {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.controls = false;
          fileIcon.appendChild(video);
        } else {
          fileIcon.innerHTML = `<span>📄</span>`;
        }
        fileIcon.innerHTML += `<span class="remove-icon" data-index="${index}">x</span>`;
        fileDiv.appendChild(fileIcon);

        const fileName = document.createElement('div');
        fileName.classList.add('file-name');
        fileName.textContent = file.name.substring(0, 5) + '...';
        fileDiv.appendChild(fileName);
        fileDiv.addEventListener('mouseover', () => {
          fileName.textContent = file.name;
        });
        fileDiv.addEventListener('mouseout', () => {
          fileName.textContent = file.name.substring(0, 5) + '...';
        });

        selectedFilesContainer.appendChild(fileDiv);
      });

      selectedFilesContainer.querySelectorAll('.remove-icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
          const index = parseInt(event.target.dataset.index);
          selectedFiles.splice(index, 1);
          postMedia.files = createFileList(selectedFiles);
          renderSelectedFiles();
          handleMediaChange();
        });
      });
    }

    function createFileList(files) {
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      return dt.files;
    }

    socialIcons.forEach(icon => {
      icon.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-icon')) {
          const platform = icon.dataset.platform;
          selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
          icon.classList.remove('selected');
          handleMediaChange();
        } else {
          icon.classList.toggle('selected');
          const platform = icon.dataset.platform;
          if (selectedPlatforms.includes(platform)) {
            selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
          } else {
            selectedPlatforms.push(platform);
          }
          handleMediaChange();
        }
      });
    });

    postMedia.addEventListener('change', handleMediaChange);

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

        calendarDiv.querySelectorAll('td[data-date]').forEach(cell => {
          cell.addEventListener('click', () => {
            selectedDateInput.value = cell.getAttribute('data-date');
            calendarDiv.querySelectorAll('td[data-date]').forEach(td => {
              td.style.backgroundColor = '';
            });
            cell.style.backgroundColor = '#f0f0f0';
          });
        });

      } catch (error) {
        console.error("Error:", error);
        calendarDiv.innerHTML = "<p>Error loading calendar.</p>";
      }
    }

    function populateMonthSelect() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
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
    generateCalendar(currentYear, currentMonth);

    monthSelect.addEventListener('change', () => {
      currentMonth = parseInt(monthSelect.value);
      generateCalendar(currentYear, currentMonth);
    });

    yearSelect.addEventListener('change', () => {
      currentYear = parseInt(yearSelect.value);
      generateCalendar(currentYear, currentMonth);
    });

    submitPostBtn.addEventListener('click', () => {
      // Handle form submission here
      console.log('Post type:', postType);
      if (postType !== 'story') {
        console.log('Post text:', postText.value);
      }
      console.log('Media files:', postMedia.files);
      console.log('Selected date:', selectedDateInput.value);
      console.log('Selected platforms:', selectedPlatforms);
      const isReel = document.getElementById('isReel').checked;
      if (selectedPlatforms.includes('facebook') || selectedPlatforms.includes('instagram')) {
        console.log('Post as reel:', isReel);
      }
      postText.value = '';
      postMedia.value = '';
    });
