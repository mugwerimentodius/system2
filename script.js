// ===========================
// SYMPTOM CHECKER FUNCTIONALITY
// ===========================

const symptomDatabase = {
    'fever,cough,sore_throat,fatigue': {
        conditions: ['Cold', 'Flu', 'COVID-19'],
        severity: 'Common',
        icon: '🤒'
    },
    'shortness_of_breath,chest_pain,fatigue': {
        conditions: ['Heart Problem', 'Asthma', 'Pneumonia'],
        severity: 'Severe',
        icon: '❤️'
    },
    'fever,body_aches,headache,fatigue': {
        conditions: ['Viral Infection', 'Dengue', 'Malaria'],
        severity: 'Moderate',
        icon: '🦟'
    },
    'nausea,diarrhea,headache': {
        conditions: ['Gastroenteritis', 'Food Poisoning', 'Stomach Flu'],
        severity: 'Moderate',
        icon: '🤢'
    },
    'rash,fever,body_aches': {
        conditions: ['Measles', 'Chickenpox', 'Roseola'],
        severity: 'Moderate',
        icon: '🔴'
    }
};

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Symptom Checker
    const symptomForm = document.getElementById('symptomForm');
    if (symptomForm) {
        symptomForm.addEventListener('submit', handleSymptomCheck);
    }

    // Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Articles Page
    if (document.getElementById('articlesContainer')) {
        loadArticles();
        setupArticleFilters();
    }

    // Set minimum date to today for appointments
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput) {
        const today = new Date().toISOString().split('T')[0];
        appointmentDateInput.setAttribute('min', today);
    }
});

// Symptom Checker Handler
function handleSymptomCheck(e) {
    e.preventDefault();

    const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(cb => cb.value);
    const duration = document.getElementById('duration').value;
    const severity = document.getElementById('severity').value;

    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }

    if (!duration || !severity) {
        alert('Please fill in all fields');
        return;
    }

    // Analyze symptoms
    const result = analyzeSymptoms(selectedSymptoms, duration, severity);

    // Display results
    displaySymptomResults(result, selectedSymptoms, duration, severity);
}

function analyzeSymptoms(symptoms, duration, severity) {
    let foundCondition = null;

    // Check for exact matches
    for (const key in symptomDatabase) {
        const dbSymptoms = key.split(',');
        if (dbSymptoms.every(s => symptoms.includes(s))) {
            foundCondition = symptomDatabase[key];
            break;
        }
    }

    // If no exact match, provide general guidance
    if (!foundCondition) {
        foundCondition = {
            conditions: ['Various Conditions'],
            severity: severity === 'severe' ? 'Seek Medical Attention' : 'Monitor Symptoms',
            icon: '🏥'
        };
    }

    return foundCondition;
}

function displaySymptomResults(result, symptoms, duration, severity) {
    const resultsDiv = document.getElementById('results');
    const resultMessage = document.getElementById('resultMessage');
    const conditionsList = document.getElementById('conditionsList');
    const recommendationsList = document.getElementById('recommendationsList');

    // Build result message
    let html = `<strong>Based on your symptoms, possible conditions include:</strong>`;
    conditionsList.innerHTML = result.conditions.map(condition => 
        `<div class="condition-item">${result.icon} <strong>${condition}</strong></div>`
    ).join('');

    // Generate recommendations
    const recommendations = generateRecommendations(severity, duration, result.conditions);
    recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');

    resultMessage.textContent = html;
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateRecommendations(severity, duration, conditions) {
    const recommendations = [];

    if (severity === 'severe') {
        recommendations.push('⚠️ Seek immediate medical attention');
        recommendations.push('Visit emergency room if symptoms worsen');
    } else if (severity === 'moderate') {
        recommendations.push('Schedule an appointment with a doctor');
        recommendations.push('Monitor your symptoms closely');
    } else {
        recommendations.push('Rest and stay hydrated');
        recommendations.push('Monitor symptoms for 3-5 days');
        recommendations.push('Consult a doctor if symptoms persist');
    }

    recommendations.push('Get adequate sleep and nutrition');
    recommendations.push('Avoid spreading infection to others');
    recommendations.push('Keep a symptom diary');

    return recommendations;
}

function resetForm() {
    document.getElementById('symptomForm').reset();
    document.getElementById('results').style.display = 'none';
}

// ===========================
// APPOINTMENT BOOKING
// ===========================

function handleAppointmentSubmit(e) {
    e.preventDefault();

    // Validate form
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const hospital = document.getElementById('hospital').value;
    const department = document.getElementById('department').value;

    if (!fullName || !email || !phone || !age || !appointmentDate || !appointmentTime || !hospital || !department) {
        alert('Please fill in all required fields');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number');
        return;
    }

    // Store appointment (in Phase 2, this will be sent to database)
    const appointment = {
        fullName,
        email,
        phone,
        age,
        appointmentDate,
        appointmentTime,
        hospital,
        department,
        symptoms: document.getElementById('symptoms').value
    };

    // Save to localStorage for demo purposes
    localStorage.setItem('lastAppointment', JSON.stringify(appointment));

    // Show success message
    displayAppointmentSuccess(appointment);
}

function displayAppointmentSuccess(appointment) {
    document.getElementById('appointmentForm').style.display = 'none';
    const successDiv = document.getElementById('successMessage');
    
    document.getElementById('confirmEmail').textContent = appointment.email;
    document.getElementById('confirmDate').textContent = formatDate(appointment.appointmentDate);
    document.getElementById('confirmTime').textContent = appointment.appointmentTime;
    document.getElementById('confirmHospital').textContent = appointment.hospital;
    
    successDiv.style.display = 'block';
    successDiv.scrollIntoView({ behavior: 'smooth' });
}

function resetAppointmentForm() {
    document.getElementById('appointmentForm').reset();
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('appointmentForm').style.display = 'block';
}

// ===========================
// ARTICLES PAGE
// ===========================

const articlesData = [
    {
        id: 1,
        title: 'Benefits of Regular Exercise',
        category: 'fitness',
        date: '2026-04-01',
        icon: '🏃',
        excerpt: 'Regular exercise can improve your physical and mental health significantly. Learn about the key benefits.',
        content: 'Full article content about exercise benefits...'
    },
    {
        id: 2,
        title: '10 Healthy Eating Habits',
        category: 'nutrition',
        date: '2026-03-28',
        icon: '🥗',
        excerpt: 'Discover simple habits to improve your diet and nutrition for better health.',
        content: 'Full article content about healthy eating...'
    },
    {
        id: 3,
        title: 'Mental Health Awareness',
        category: 'mental-health',
        date: '2026-03-25',
        icon: '🧠',
        excerpt: 'Understanding mental health is crucial for overall well-being. Learn more about mental wellness.',
        content: 'Full article content about mental health...'
    },
    {
        id: 4,
        title: 'Disease Prevention Tips',
        category: 'disease-prevention',
        date: '2026-03-22',
        icon: '🛡️',
        excerpt: 'Practical tips to prevent common diseases and maintain good health.',
        content: 'Full article content about disease prevention...'
    },
    {
        id: 5,
        title: 'Yoga for Better Health',
        category: 'fitness',
        date: '2026-03-20',
        icon: '🧘',
        excerpt: 'Explore how yoga can improve flexibility, strength, and mental peace.',
        content: 'Full article content about yoga...'
    },
    {
        id: 6,
        title: 'Vitamins and Minerals Guide',
        category: 'nutrition',
        date: '2026-03-18',
        icon: '💊',
        excerpt: 'Understanding essential vitamins and minerals for optimal health.',
        content: 'Full article content about vitamins...'
    },
    {
        id: 7,
        title: 'Stress Management Techniques',
        category: 'mental-health',
        date: '2026-03-15',
        icon: '🧘',
        excerpt: 'Learn effective techniques to manage stress and anxiety.',
        content: 'Full article content about stress management...'
    },
    {
        id: 8,
        title: 'Vaccination: Myths vs Facts',
        category: 'disease-prevention',
        date: '2026-03-12',
        icon: '💉',
        excerpt: 'Understanding the importance and safety of vaccinations.',
        content: 'Full article content about vaccinations...'
    }
];

function loadArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;

    container.innerHTML = articlesData.map(article => `
        <div class="article-card" data-category="${article.category}">
            <div class="article-image">${article.icon}</div>
            <div class="article-content">
                <div class="article-date">${formatDate(article.date)}</div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <span class="article-tag">${capitalize(article.category.replace('-', ' '))}</span>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', function() {
            alert('Article: ' + this.querySelector('h3').textContent + '\n\nIn Phase 2, this will open the full article.');
        });
    });
}

function setupArticleFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter articles
            articleCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            articleCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// ===========================
// LOGIN & REGISTER
// ===========================

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!validateEmail(email)) {
        alert('Please enter a valid email');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    // In Phase 2, send to backend for authentication
    alert('✓ Login successful! (Demo mode - data not saved)\n\nIn Phase 2, this will authenticate against database.');
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters with uppercase, lowercase, and numbers');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // In Phase 2, send to backend for registration
    alert('✓ Account created successfully! (Demo mode - data not saved)\n\nIn Phase 2, this will save to database.');
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^\d{10}$/;
    return regex.test(phone.replace(/\D/g, ''));
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Mobile menu toggle (optional enhancement)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}