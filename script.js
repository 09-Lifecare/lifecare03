// Navigation and Page Navigation
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupLoginForm();
    setupHamburgerMenu();
    setupDashboard();
    setupProfilePage();
    checkUserSession();
});

// Check User Session
function checkUserSession() {
    const user = JSON.parse(localStorage.getItem('lifecareUser'));
    const currentPage = window.location.pathname;
    
    if (user && currentPage.includes('index.html')) {
        // User is logged in on home page, redirect to dashboard
        window.location.href = 'dashboard.html';
    } else if (!user && currentPage.includes('dashboard.html')) {
        // User not logged in, redirect to home
        window.location.href = 'index.html';
    } else if (!user && currentPage.includes('profile.html')) {
        // User not logged in, redirect to home
        window.location.href = 'index.html';
    }
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section');
    const user = JSON.parse(localStorage.getItem('lifecareUser'));
    const logoutBtn = document.getElementById('logoutBtn');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
            updateActiveNavLink(link);
            closeMobileMenu();
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Show logout button if user is logged in
    if (user && logoutBtn) {
        logoutBtn.style.display = 'inline-block';
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function updateActiveNavLink(activeLink) {
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Hamburger Menu
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Login Form Setup
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const loginContainer = document.getElementById('loginContainer');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            loginContainer.style.display = 'block';
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorMessage = document.getElementById('errorMessage');

    // Validate credentials against mock data
    const users = getMockUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        // Store user session
        localStorage.setItem('lifecareUser', JSON.stringify({
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            role: user.role
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Invalid login credentials!';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('lifecareUser');
    window.location.href = 'index.html';
}

// Dashboard Setup
function setupDashboard() {
    const user = JSON.parse(localStorage.getItem('lifecareUser'));
    
    if (user && window.location.pathname.includes('dashboard.html')) {
        // Update user greeting
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Hi, ${user.nickname || user.name}`;
        }

        // Setup feature navigation
        setupFeatureNavigation();
        setupDashboardCards();
        setupLogoutButton();
    }
}

function setupFeatureNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const featureSections = document.querySelectorAll('.feature-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const feature = link.getAttribute('data-feature');
            
            // Hide all sections
            featureSections.forEach(section => section.classList.remove('active'));
            
            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected section
            if (feature === 'dashboard') {
                document.getElementById('dashboardOverview').classList.add('active');
            } else {
                const sectionId = feature + 'Feature';
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                }
            }
        });
    });
}

function setupDashboardCards() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    dashboardCards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.getAttribute('data-feature');
            const correspondingLink = Array.from(sidebarLinks).find(
                link => link.getAttribute('data-feature') === feature
            );
            
            if (correspondingLink) {
                correspondingLink.click();
            }
        });
    });
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Academic Planner Functions
function addSchedule() {
    const date = document.getElementById('scheduleDate').value;
    const note = document.getElementById('scheduleNote').value;
    const list = document.getElementById('scheduleList');

    if (date && note) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${new Date(date).toDateString()} - ${note}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('scheduleDate').value = '';
        document.getElementById('scheduleNote').value = '';
    }
}

function addTask() {
    const name = document.getElementById('taskName').value;
    const due = document.getElementById('taskDue').value;
    const priority = document.getElementById('taskPriority').value;
    const list = document.getElementById('taskList');

    if (name && due) {
        const li = document.createElement('li');
        const priorityColor = priority === 'High' ? '#e74c3c' : priority === 'Medium' ? '#f39c12' : '#2ecc71';
        li.innerHTML = `<span style="border-left: 4px solid ${priorityColor}; padding-left: 10px;">${name} (${priority}) - Due: ${new Date(due).toDateString()}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('taskName').value = '';
        document.getElementById('taskDue').value = '';
    }
}

function addExam() {
    const name = document.getElementById('examName').value;
    const date = document.getElementById('examDate').value;
    const list = document.getElementById('countdownList');

    if (name && date) {
        const examDate = new Date(date);
        updateCountdown(name, examDate, list);
        document.getElementById('examName').value = '';
        document.getElementById('examDate').value = '';
    }
}

function updateCountdown(examName, examDate, list) {
    const now = new Date();
    const diff = examDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        const div = document.createElement('div');
        div.className = 'countdown-item';
        div.innerHTML = `<span><strong>${examName}</strong></span>
                         <span style="font-weight: bold; color: #4a90e2;">${days}d ${hours}h ${minutes}m</span>
                         <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(div);
    }
}

// Health Monitoring Functions
function addWaterIntake() {
    const amount = parseInt(document.getElementById('waterIntake').value);
    const list = document.getElementById('waterList');
    const totalDisplay = document.getElementById('waterTotal');

    if (amount > 0) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${amount} ml</span>
                        <button class="delete-btn" onclick="this.parentElement.remove(); updateWaterTotal()">Delete</button>`;
        list.appendChild(li);
        
        updateWaterTotal();
        document.getElementById('waterIntake').value = '';
    }
}

function updateWaterTotal() {
    const items = document.querySelectorAll('#waterList li');
    let total = 0;
    items.forEach(item => {
        const amount = parseInt(item.textContent);
        total += amount;
    });
    document.getElementById('waterTotal').textContent = `Total today: ${total} ml`;
}

function addSleepLog() {
    const hours = parseFloat(document.getElementById('sleepHours').value);
    const list = document.getElementById('sleepList');

    if (hours > 0) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${hours} hrs</span>
                        <button class="delete-btn" onclick="this.parentElement.remove(); updateSleepAverage()">Delete</button>`;
        list.appendChild(li);
        
        updateSleepAverage();
        document.getElementById('sleepHours').value = '';
    }
}

function updateSleepAverage() {
    const items = document.querySelectorAll('#sleepList li');
    if (items.length === 0) {
        document.getElementById('sleepAvg').textContent = 'Average sleep: 0 hrs';
        return;
    }
    
    let total = 0;
    items.forEach(item => {
        const hours = parseFloat(item.textContent);
        total += hours;
    });
    const average = (total / items.length).toFixed(1);
    document.getElementById('sleepAvg').textContent = `Average sleep: ${average} hrs`;
}

function addMedication() {
    const name = document.getElementById('medName').value;
    const dose = document.getElementById('medDose').value;
    const time = document.getElementById('medTime').value;
    const list = document.getElementById('medList');

    if (name && dose && time) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${name} - ${dose} at ${time}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('medName').value = '';
        document.getElementById('medDose').value = '';
        document.getElementById('medTime').value = '';
    }
}

function addMealLog() {
    const meal = document.getElementById('mealDesc').value;
    const calories = document.getElementById('mealCalories').value || 'N/A';
    const list = document.getElementById('mealList');

    if (meal) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${meal} (${calories} cal)</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('mealDesc').value = '';
        document.getElementById('mealCalories').value = '';
    }
}

function addActivity() {
    const type = document.getElementById('activityType').value;
    const duration = document.getElementById('activityDuration').value;
    const list = document.getElementById('activityList');

    if (type && duration) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${type} - ${duration} minutes</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('activityType').value = '';
        document.getElementById('activityDuration').value = '';
    }
}

// Mental Health Functions
function logMood() {
    const mood = document.getElementById('moodSelect').value;
    const list = document.getElementById('moodList');

    if (mood) {
        const li = document.createElement('li');
        const date = new Date().toLocaleDateString();
        li.innerHTML = `<span>${date} - ${mood}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('moodSelect').value = '';
    }
}

function logStress() {
    const level = document.getElementById('stressLevel').value;
    const list = document.getElementById('stressList');

    if (level) {
        const li = document.createElement('li');
        const date = new Date().toLocaleDateString();
        li.innerHTML = `<span>${date} - Stress Level: ${level}/10</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
    }
}

function startBreathingExercise() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    let cycle = 0;
    const maxCycles = 5;

    const exercise = setInterval(() => {
        if (cycle % 2 === 0) {
            text.textContent = 'Inhale...';
            circle.style.transform = 'scale(1)';
        } else {
            text.textContent = 'Exhale...';
            circle.style.transform = 'scale(1.3)';
        }
        
        cycle++;
        if (cycle >= maxCycles * 2) {
            clearInterval(exercise);
            text.textContent = 'Great! You completed the exercise.';
            circle.style.transform = 'scale(1)';
        }
    }, 2000);
}

function saveJournalEntry() {
    const entry = document.getElementById('journalEntry').value;
    const list = document.getElementById('journalList');

    if (entry) {
        const li = document.createElement('li');
        const date = new Date().toLocaleDateString();
        li.innerHTML = `<span><strong>${date}:</strong> ${entry}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('journalEntry').value = '';
    }
}

// Daily Life Management Functions
function addHabit() {
    const name = document.getElementById('habitName').value;
    const target = document.getElementById('habitTarget').value;
    const list = document.getElementById('habitList');

    if (name && target) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${name} - Target: ${target} units/day</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('habitName').value = '';
        document.getElementById('habitTarget').value = '';
    }
}

function addExpense() {
    const category = document.getElementById('expCategory').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    const list = document.getElementById('expenseList');

    if (category && amount > 0) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${category}: ₱${amount.toFixed(2)}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove(); updateBudgetDisplay()">Delete</button>`;
        list.appendChild(li);
        updateBudgetDisplay();
        document.getElementById('expCategory').value = '';
        document.getElementById('expAmount').value = '';
    }
}

function updateBudgetDisplay() {
    const items = document.querySelectorAll('#expenseList li');
    let totalSpent = 0;
    items.forEach(item => {
        const amount = parseFloat(item.textContent.split('₱')[1]);
        totalSpent += amount;
    });
    
    const budgetDisplay = document.getElementById('budgetDisplay');
    const remaining = 5000 - totalSpent; // Default budget
    const percentage = (totalSpent / 5000 * 100).toFixed(0);
    
    budgetDisplay.innerHTML = `
        <p><strong>Total Spent:</strong> ₱${totalSpent.toFixed(2)}</p>
        <p><strong>Remaining:</strong> ₱${Math.max(remaining, 0).toFixed(2)}</p>
        <p><strong>Usage:</strong> ${percentage}%</p>
        <div style="background-color: #e0e0e0; border-radius: 5px; height: 10px; margin-top: 0.5rem;">
            <div style="background-color: #4a90e2; height: 100%; width: ${percentage}%; border-radius: 5px;"></div>
        </div>
    `;
}

function addNote() {
    const note = document.getElementById('noteName').value;
    const list = document.getElementById('noteList');

    if (note) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${note}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('noteName').value = '';
    }
}

function addContact() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const relation = document.getElementById('contactRelation').value;
    const list = document.getElementById('contactList');

    if (name && phone) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${name} (${relation}) - ${phone}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('contactName').value = '';
        document.getElementById('contactPhone').value = '';
        document.getElementById('contactRelation').value = '';
    }
}

// Student Support Functions
function connectPeer() {
    const interest = document.getElementById('peerInterest').value;
    const list = document.getElementById('peerList');

    if (interest) {
        const li = document.createElement('li');
        li.innerHTML = `<span>Looking for peers interested in: ${interest}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Remove</button>`;
        list.appendChild(li);
        document.getElementById('peerInterest').value = '';
    }
}

function setGoal() {
    const goal = document.getElementById('goalName').value;
    const list = document.getElementById('goalList');

    if (goal) {
        const li = document.createElement('li');
        li.innerHTML = `<span>📈 ${goal}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('goalName').value = '';
    }
}

function getSelfCareRecommendations() {
    const recommendations = [
        '💆 Take a 10-minute break and stretch',
        '🎵 Listen to your favorite relaxing music',
        '🚶 Take a short walk outside',
        '🧘 Try a quick meditation session',
        '☕ Enjoy a warm cup of tea',
        '📚 Read something uplifting',
        '🎨 Do a creative activity'
    ];
    
    const random = recommendations[Math.floor(Math.random() * recommendations.length)];
    const list = document.getElementById('selfCareList');
    
    const div = document.createElement('div');
    div.className = 'support-message';
    div.innerHTML = `<p>${random}</p>
                     <button class="delete-btn" onclick="this.parentElement.remove()">Dismiss</button>`;
    list.appendChild(div);
}

function addReminder() {
    const reminderText = document.getElementById('reminderText').value;
    const reminderTime = document.getElementById('reminderTime').value;
    const list = document.getElementById('reminderList');

    if (reminderText && reminderTime) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${reminderTime} - ${reminderText}</span>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>`;
        list.appendChild(li);
        document.getElementById('reminderText').value = '';
        document.getElementById('reminderTime').value = '';
    }
}

// Profile Page Setup
function setupProfilePage() {
    const user = JSON.parse(localStorage.getItem('lifecareUser'));
    
    if (user && window.location.pathname.includes('profile.html')) {
        loadProfileData();
        setupProfileLogout();
    }
}

function loadProfileData() {
    const user = JSON.parse(localStorage.getItem('lifecareUser'));
    
    if (user) {
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileNickname').value = user.nickname || '';
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profileRole').value = user.role;
        
        // Load preferences from localStorage
        const preferences = JSON.parse(localStorage.getItem('lifecarePreferences')) || {};
        document.getElementById('dailyGoal').value = preferences.dailyGoal || 2000;
        document.getElementById('sleepGoal').value = preferences.sleepGoal || 8;
        document.getElementById('budgetLimit').value = preferences.budgetLimit || 0;
        document.getElementById('notificationPref').checked = preferences.notifications !== false;
    }
}

function saveProfile() {
    const user = JSON.parse(localStorage.getItem('lifecareUser'));
    const successMessage = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMsg');
    
    try {
        const nickname = document.getElementById('profileNickname').value;
        const role = document.getElementById('profileRole').value;
        
        user.nickname = nickname;
        user.role = role;
        
        localStorage.setItem('lifecareUser', JSON.stringify(user));
        
        // Save preferences
        const preferences = {
            dailyGoal: parseInt(document.getElementById('dailyGoal').value),
            sleepGoal: parseFloat(document.getElementById('sleepGoal').value),
            budgetLimit: parseFloat(document.getElementById('budgetLimit').value),
            notifications: document.getElementById('notificationPref').checked
        };
        
        localStorage.setItem('lifecarePreferences', JSON.stringify(preferences));
        
        successMessage.style.display = 'block';
        errorMsg.style.display = 'none';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        console.error('Error saving profile:', error);
        errorMsg.style.display = 'block';
        successMessage.style.display = 'none';
    }
}

function cancelProfile() {
    window.location.href = 'dashboard.html';
}

function setupProfileLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}
