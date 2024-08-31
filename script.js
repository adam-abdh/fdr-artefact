window.onbeforeunload = function() {
    return "Are you sure you want to leave? Your changes may not be saved.";
};

document.addEventListener("DOMContentLoaded", function() {
    const card = document.querySelector('.card');
    const content = document.getElementById('content');
    let pageHistory = [];

    function fadeOut(element, callback) {
        element.style.opacity = 1;
        (function fade() {
            if ((element.style.opacity -= .1) < 0) {
                element.style.display = "none";
                if (callback) callback();
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    function fadeIn(element) {
        element.style.opacity = 0;
        element.style.display = "block";
        (function fade() {
            var val = parseFloat(element.style.opacity);
            if (!((val += .1) > 1)) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }

    function changePage(newContent) {
        pageHistory.push(content.innerHTML);
        fadeOut(content, function() {
            content.innerHTML = newContent;
            fadeIn(content);
        });
    }

    function goBack() {
        if (pageHistory.length > 0) {
            const previousContent = pageHistory.pop();
            fadeOut(content, function() {
                content.innerHTML = previousContent;
                fadeIn(content);
            });
        }
    }

    window.showLoginPrompt = function(role) {
        let newContent;
        if (role === 'Chairperson') {
            newContent = `
                <p class="description">Welcome, Chairperson! We're excited to have you here.</p>
                <p class="subtext">You should have received an email with a forwarding address and a password. Please use these to log in.</p>
                <div class="separator"></div>
                <input type="email" id="chairEmail" class="input-field" placeholder="Enter your forwarding email">
                <input type="password" id="chairPassword" class="input-field" placeholder="Enter your password">
                <div class="button-container">
                    <button class="previous-button" onclick="goBack()">&#8592; Back</button>
                    <a href="#" class="button" onclick="submitChairLogin()">Log In</a>
                </div>
            `;
        } else {
            newContent = `
                <p class="description">Welcome, Delegate! We're glad you're here.</p>
                <p class="subtext">Please enter your fdrID to continue. You should have received this in the mail when you first applied. Remember, fdrIDs are unique for each edition of the conference.</p>
                <div class="separator"></div>
                <input type="text" id="fdrid" class="input-field" placeholder="Enter your fdrID">
                <div class="button-container">
                    <button class="previous-button" onclick="goBack()">&#8592; Back</button>
                    <a href="#" class="button" onclick="submitDelegateLogin()">Continue</a>
                </div>
            `;
        }
        changePage(newContent);
    };

    window.submitChairLogin = function() {
        const email = document.getElementById('chairEmail').value;
        const password = document.getElementById('chairPassword').value;
        if (email && password) {
            // Verify credentials (implement actual authentication)
            showCommitteeSelection();
        } else {
            showLightbox('Please enter both email and password.');
        }
    };

    window.showCommitteeSelection = function() {
        const committees = [
            ["UNHRC", "UN Human Rights Council"],
            ["EC", "European Council"],
            ["ECOSOC I", "Economic and Social Committee I"],
            ["GA 1", "General Assembly 1—DISEC"],
            ["GA 4", "General Assembly 4—SPECPOL"],
            ["SCOTUS", "SCOTUS—Rights and Constitutional Biases"],
            ["CTC", "Counter-Terrorism Committee"],
            ["SC", "Security Council"],
            ["Ad-Hoc", "Ad-Hoc Committee of the Secretary General—Continuous Crisis"]
        ];

        let committeeButtons = committees.map(committee => 
            `<button class="button committee-button" onclick="selectCommittee('${committee[1]}')">${committee[0]}</button>`
        ).join('');

        const newContent = `
            <h2>Select Committee</h2>
            <div class="button-container committee-selection-container">
                ${committeeButtons}
            </div>
        `;
        changePage(newContent);
    };

    window.selectCommittee = function(committee) {
        localStorage.setItem('selectedCommittee', committee);
        alert("Warning: Disciplinary consequences will be imposed if the wrong committee is selected and values are edited.");
        showDaySelectionPrompt();
    };

    window.showDaySelectionPrompt = function() {
        const newContent = `
            <h2>Select Evaluation Day</h2>
            <p class="subtext">Please choose the conference day you want to evaluate:</p>
            <div class="button-container day-selection-container">
                <button class="button day-button" onclick="selectDay(1)">Day 1<br>(22 Feb, 2025)</button>
                <button class="button day-button" onclick="selectDay(2)">Day 2<br>(23 Feb, 2025)</button>
                <button class="button day-button" onclick="selectDay(3)">Day 3<br>(24 Feb, 2025)</button>
                <button class="button day-button" onclick="selectDay(4)">Day 4<br>(25 Feb, 2025)</button>
            </div>
            <button class="previous-button" onclick="showCommitteeSelection()">&#8592; Back</button>
        `;
        changePage(newContent);
    };

    window.selectDay = function(day) {
        localStorage.setItem('selectedDay', day);
        showCountryList();
    };

    window.showCountryList = function() {
        const committee = localStorage.getItem('selectedCommittee');
        const day = localStorage.getItem('selectedDay');
        const countries = getCountriesForCommittee(committee);

        let countryRows = countries.map(country => 
            `<tr>
                <td>${country}</td>
                <td class="total-score">0</td>
                <td class="communication-score">0</td>
                <td class="strategic-score">0</td>
                <td class="authenticity-score">0</td>
                <td><a href="#" class="modify-link" onclick="modifyCountryScore('${country}')">Modify</a></td>
            </tr>`
        ).join('');

        const newContent = `
            <h2>${committee ? committee.split('—')[1] : ''} - Day ${day}</h2>
            <table id="countryList">
                <thead>
                    <tr style="color: #0B3F69;">
                        <th>Country</th>
                        <th>Total (/36)</th>
                        <th>A (/12)</th>
                        <th>B (/12)</th>
                        <th>C (/12)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${countryRows}
                </tbody>
            </table>
            <div class="button-container">
                <button class="previous-button" onclick="showDaySelectionPrompt()">&#8592; Back</button>
                <button class="previous-button submit-all-button" onclick="confirmSubmitAllScores()">Submit All Scores</button>
            </div>
        `;
        changePage(newContent);
    };

    window.confirmSubmitAllScores = function() {
        showLightbox('Warning: This action should only be performed at the end of the day. Are you sure you want to submit all scores?', submitAllScores);
    };

    window.submitAllScores = function() {
        // Implement the logic to submit all scores here
        alert('All scores have been submitted.');
        // After submission, you might want to redirect or reset the page
    };

    function getCountriesForCommittee(committee) {
        // This function should return an array of countries for the given committee
        // You can implement this based on the matrix you provided
        // For now, I'll return a sample array
        return ["United States", "United Kingdom", "France", "China", "Russia"];
    }

    window.modifyCountryScore = function(country) {
        const committee = localStorage.getItem('selectedCommittee');
        const day = localStorage.getItem('selectedDay');

        const scoreButtons = Array(12).fill().map((_, i) => 
            `<button class="score-button" onclick="setScore(this, ${i+1})">${i+1}</button>`
        ).join('');

        const newContent = `
            <h2 class="country-header">${country}</h2>
            <div class="separator"></div>
            <h3>${committee ? committee.split('—')[1] : ''} - Day ${day}</h3>
            <div class="score-input-container">
                <label>A: Communication (/12)</label>
                <div class="score-buttons">${scoreButtons}</div>
                <label>B: Strategic Intent (/12)</label>
                <div class="score-buttons">${scoreButtons}</div>
                <label>C: Contextual Authenticity (/12)</label>
                <div class="score-buttons">${scoreButtons}</div>
                <label>Wildcard Points (max 1 point)</label>
                <i>A wildcard can only be used once a day, and delegates can only accumulate two wildcard points in total.</i>
                <div class="wildcard-buttons">
                    <button class="wildcard-button" onclick="toggleWildcard(this, 1)">1</button>
                </div>
            </div>
            <div class="total-score">Total: <span>0</span>/36</div>
            <button class="button" onclick="validateAndSaveCountryScore('${country}')">Save</button>
            <button class="previous-button" onclick="confirmGoBack()">&#8592; Back</button>
        `;
        changePage(newContent);
        initializeScores();
    };

    window.setScore = function(button, score) {
        const category = button.closest('.score-buttons').previousElementSibling.textContent.charAt(0);
        const buttons = button.parentElement.querySelectorAll('.score-button');
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        localStorage.setItem(`score${category}`, score);
        updateTotalScore();
    };

    window.toggleWildcard = function(button) {
        button.classList.toggle('selected');
        localStorage.setItem('wildcardPoints', button.classList.contains('selected') ? 1 : 0);
        updateTotalScore();
    };

    function initializeScores() {
        ['A', 'B', 'C'].forEach(category => {
            const score = localStorage.getItem(`score${category}`);
            if (score) {
                const button = document.querySelector(`.score-buttons:nth-of-type(${category.charCodeAt(0) - 64}) .score-button:nth-child(${score})`);
                if (button) button.classList.add('selected');
            }
        });
        const wildcardPoints = localStorage.getItem('wildcardPoints');
        if (wildcardPoints === '1') {
            document.querySelector('.wildcard-button').classList.add('selected');
        }
        updateTotalScore();
    }

    function updateTotalScore() {
        const scoreA = parseInt(localStorage.getItem('scoreA')) || 0;
        const scoreB = parseInt(localStorage.getItem('scoreB')) || 0;
        const scoreC = parseInt(localStorage.getItem('scoreC')) || 0;
        const wildcardPoints = parseInt(localStorage.getItem('wildcardPoints')) || 0;
        const total = scoreA + scoreB + scoreC + wildcardPoints;
        document.querySelector('.total-score span').textContent = total;
    }

    window.validateAndSaveCountryScore = function(country) {
        const scoreA = localStorage.getItem('scoreA');
        const scoreB = localStorage.getItem('scoreB');
        const scoreC = localStorage.getItem('scoreC');

        if (!scoreA || !scoreB || !scoreC) {
            alert("Please select points for all criteria before saving.");
            return;
        }

        confirmSaveCountryScore(country);
    };

    window.confirmSaveCountryScore = function(country) {
        showLightbox('Are you sure you want to save these scores?', () => saveCountryScore(country));
    };

    window.confirmGoBack = function() {
        const scoreA = localStorage.getItem('scoreA');
        const scoreB = localStorage.getItem('scoreB');
        const scoreC = localStorage.getItem('scoreC');

        if (scoreA || scoreB || scoreC) {
            showLightbox('Are you sure you want to go back? Any unsaved changes will be lost.', showCountryList);
        } else {
            showCountryList();
        }
    };

    window.saveCountryScore = function(country) {
        // Implement saving logic here
        showLightbox('Scores saved successfully');
        showCountryList();
    };

    function showLightbox(message, confirmCallback = null) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        document.body.appendChild(overlay);

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox slide-in-blurred-bottom';
        lightbox.innerHTML = `
            <div class="lightbox-content">${message}</div>
            ${confirmCallback ? '<button class="lightbox-confirm">Confirm</button>' : ''}
            <button class="lightbox-close">Close</button>
        `;
        document.body.appendChild(lightbox);

        // Fade in the overlay and lightbox
        setTimeout(() => {
            overlay.style.opacity = '1';
            lightbox.style.opacity = '1';
        }, 10);

        const closeButton = lightbox.querySelector('.lightbox-close');
        closeButton.addEventListener('click', () => {
            // Fade out the overlay and lightbox
            overlay.style.opacity = '0';
            lightbox.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.removeChild(lightbox);
            }, 300); // Wait for the fade-out transition to complete
        });

        if (confirmCallback) {
            const confirmButton = lightbox.querySelector('.lightbox-confirm');
            confirmButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                document.body.removeChild(lightbox);
                confirmCallback();
            });
        }
    }

    window.submitDelegateLogin = function() {
        const fdrid = document.getElementById('fdrid').value;
        if (fdrid) {
            showFileUpload('Delegate');
        } else {
            showLightbox('Oops! It seems you forgot to enter your fdrID. Please enter your fdrID to continue.');
        }
    };

    function showFileUpload(role) {
        const newContent = `
            <p class="description">Great! Now, let's upload your position paper.</p>
            <p class="subtext">This document helps us understand your stance on the topics we'll be discussing.</p>
            <div class="separator"></div>
            <input type="file" id="fileUpload" accept=".pdf,.doc,.docx">
            <label for="fileUpload" class="file-upload-label">Choose File</label>
            <span class="file-name"></span>
            <div class="button-container">
                <button class="previous-button" onclick="goBack()">&#8592; Back</button>
                <a href="#" class="button" onclick="uploadFile('${role}')">Upload</a>
            </div>
        `;
        changePage(newContent);
    }

    window.uploadFile = function(role) {
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload.files.length > 0) {
            showConfirmation(role);
        } else {
            showLightbox('It looks like you haven\'t selected a file yet. Please choose your position paper before uploading.');
        }
    };

    function showConfirmation(role) {
        const newContent = `
            <p class="description">Almost there! We just need a quick confirmation from you.</p>
            <div class="confirmation">
                <input type="checkbox" id="confirmCheckbox">
                <label for="confirmCheckbox">I confirm that I am the ${role.toLowerCase()} I represent and that the information I've provided is accurate.</label>
            </div>
            <div class="button-container">
                <button class="previous-button" onclick="goBack()">&#8592; Back</button>
                <a href="#" class="button" onclick="finalConfirmation('${role}')">Confirm</a>
            </div>
        `;
        changePage(newContent);
    }

    window.finalConfirmation = function(role) {
        const confirmCheckbox = document.getElementById('confirmCheckbox');
        if (confirmCheckbox.checked) {
            changePage(`
                <p class="description">Thank you for your submission, ${role}!</p>
                <p class="description">We're looking forward to a great conference with you.</p>
                <div class="button-container">
                    <a href="#" class="button" onclick="goBack()">Start Over</a>
                </div>
            `);
        } else {
            showLightbox(`We just need your confirmation to proceed. Please check the box to confirm you're the ${role.toLowerCase()} you represent.`);
        }
    };

    window.goBack = goBack;
});
