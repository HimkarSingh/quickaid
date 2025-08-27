// QuickAid - Enhanced JavaScript for Phase 2
console.log('🏥 QuickAid Phase 2 - Core Flask Application loaded');

// Global variables
let currentSection = null;
let isLoading = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing QuickAid...');
    initializeApp();
});

// Initialize application
function initializeApp() {
    console.log('Initializing QuickAid application...');
    
    // Test API connection
    testHealth();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('QuickAid initialization complete');
}

// Set up event listeners
function setupEventListeners() {
    // File input change listener
    const imageInput = document.getElementById('image-input');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                displaySelectedFile(e.target.files[0]);
            }
        });
    }
    
    // Textarea input listener for symptoms
    const symptomsText = document.getElementById('symptoms-text');
    if (symptomsText) {
        symptomsText.addEventListener('input', function(e) {
            // Auto-resize textarea
            e.target.style.height = 'auto';
            e.target.style.height = (e.target.scrollHeight) + 'px';
        });
    }
}

// Show image upload section
function showImageUpload() {
    console.log('Showing image upload section');
    hideAllSections();
    document.getElementById('image-section').style.display = 'block';
    currentSection = 'image';
}

// Show symptoms input section
function showSymptomsInput() {
    console.log('Showing symptoms input section');
    hideAllSections();
    document.getElementById('symptoms-section').style.display = 'block';
    currentSection = 'symptoms';
}

// Hide all sections
function hideAllSections() {
    const sections = ['image-section', 'symptoms-section', 'results', 'loading'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Display selected file info
function displaySelectedFile(file) {
    console.log('File selected:', file.name, 'Size:', file.size, 'bytes');
    
    const uploadArea = document.querySelector('.upload-area');
    const existingInfo = uploadArea.querySelector('.file-info');
    
    // Remove existing file info
    if (existingInfo) {
        existingInfo.remove();
    }
    
    // Create file info display
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.innerHTML = `
        <p><strong>Selected file:</strong> ${file.name}</p>
        <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
        <p><strong>Type:</strong> ${file.type}</p>
    `;
    fileInfo.style.cssText = `
        background: #e8f4fd;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
        font-size: 0.9em;
    `;
    
    uploadArea.appendChild(fileInfo);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analyze uploaded image
function analyzeImage() {
    console.log('Starting image analysis...');
    
    const fileInput = document.getElementById('image-input');
    if (!fileInput.files || fileInput.files.length === 0) {
        showAlert('Please select an image first', 'warning');
        return;
    }
    
    const file = fileInput.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file', 'error');
        return;
    }
    
    // Validate file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
        showAlert('File too large. Maximum size is 16MB', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    showLoading('Analyzing image...');
    
    fetch('/analyze_image', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Image analysis response:', data);
        hideLoading();
        displayResults(data, 'Image Analysis');
    })
    .catch(error => {
        console.error('Image analysis error:', error);
        hideLoading();
        showAlert(`Error analyzing image: ${error.message}`, 'error');
    });
}

// Analyze symptoms text
function analyzeSymptoms() {
    console.log('Starting symptom analysis...');
    
    const symptomsText = document.getElementById('symptoms-text').value.trim();
    
    if (!symptomsText) {
        showAlert('Please describe the symptoms or situation', 'warning');
        return;
    }
    
    if (symptomsText.length < 10) {
        showAlert('Please provide more detailed description (at least 10 characters)', 'warning');
        return;
    }
    
    showLoading('Analyzing symptoms...');
    
    fetch('/analyze_symptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            symptoms: symptomsText
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Symptom analysis response:', data);
        hideLoading();
        displayResults(data, 'Symptom Analysis');
    })
    .catch(error => {
        console.error('Symptom analysis error:', error);
        hideLoading();
        showAlert(`Error analyzing symptoms: ${error.message}`, 'error');
    });
}

// Show loading state
function showLoading(message = 'Processing...') {
    isLoading = true;
    const loadingElement = document.getElementById('loading');
    const loadingText = loadingElement.querySelector('p');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    loadingElement.style.display = 'block';
    console.log('Loading:', message);
}

// Hide loading state
function hideLoading() {
    isLoading = false;
    document.getElementById('loading').style.display = 'none';
    console.log('Loading hidden');
}

// Display results
function displayResults(data, title = 'Results') {
    const resultsElement = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.textContent = JSON.stringify(data, null, 2);
    resultsElement.style.display = 'block';
    
    // Smooth scroll to results
    resultsElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    console.log('Results displayed:', title, data);
}

// API Testing Functions
function testHealth() {
    console.log('Testing health endpoint...');
    
    fetch('/health')
        .then(response => response.json())
        .then(data => {
            console.log('✅ Health check successful:', data);
            showTemporaryMessage('Health check: ' + data.status, 'success');
        })
        .catch(error => {
            console.error('❌ Health check failed:', error);
            showTemporaryMessage('Health check failed', 'error');
        });
}

function testEmergencyContacts() {
    console.log('Testing emergency contacts endpoint...');
    showLoading('Loading emergency contacts...');
    
    fetch('/emergency_contacts')
        .then(response => response.json())
        .then(data => {
            console.log('Emergency contacts loaded:', data);
            hideLoading();
            displayResults(data, 'Emergency Contacts');
        })
        .catch(error => {
            console.error('Error loading emergency contacts:', error);
            hideLoading();
            showAlert('Error loading emergency contacts', 'error');
        });
}

function testFirstAidGuide() {
    console.log('Testing first aid guide endpoint...');
    showLoading('Loading first aid guide...');
    
    fetch('/first_aid_guide')
        .then(response => response.json())
        .then(data => {
            console.log('First aid guide loaded:', data);
            hideLoading();
            displayResults(data, 'First Aid Guide');
        })
        .catch(error => {
            console.error('Error loading first aid guide:', error);
            hideLoading();
            showAlert('Error loading first aid guide', 'error');
        });
}

// Emergency call function
function callEmergency() {
    const confirmed = confirm(
        '🚨 EMERGENCY CALL\n\n' +
        'This will attempt to call 911 (Emergency Services).\n' +
        'Only use this for real emergencies.\n\n' +
        'Continue?'
    );
    
    if (confirmed) {
        console.log('Emergency call initiated');
        // Try to initiate phone call
        window.location.href = 'tel:911';
        
        // Also show emergency info
        showAlert(
            'Calling 911...\n\nIf the call doesn\'t work:\n• Use your phone to dial 911\n• Stay calm and speak clearly\n• Provide your location first',
            'emergency'
        );
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertColors = {
        'success': '#2ed573',
        'warning': '#ffa502',
        'error': '#ff4757',
        'info': '#3742fa',
        'emergency': '#ff3838'
    };
    
    // Create alert element
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${alertColors[type] || alertColors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        line-height: 1.4;
        white-space: pre-line;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds (10 seconds for emergency)
    const timeout = type === 'emergency' ? 10000 : 5000;
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, timeout);
    
    console.log(`Alert (${type}):`, message);
}

function showTemporaryMessage(message, type = 'info', duration = 3000) {
    showAlert(message, type);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+1: Show image upload
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        showImageUpload();
    }
    
    // Ctrl+2: Show symptoms input
    if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        showSymptomsInput();
    }
    
    // Escape: Hide all sections
    if (e.key === 'Escape') {
        hideAllSections();
        currentSection = null;
    }
});

// Export functions for global access
window.showImageUpload = showImageUpload;
window.showSymptomsInput = showSymptomsInput;
window.analyzeImage = analyzeImage;
window.analyzeSymptoms = analyzeSymptoms;
window.testEmergencyContacts = testEmergencyContacts;
window.testFirstAidGuide = testFirstAidGuide;
window.testHealth = testHealth;
window.callEmergency = callEmergency;

console.log('🚀 QuickAid JavaScript initialization complete!');