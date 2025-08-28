// QuickAid - Advanced Frontend JavaScript - Phase 3
console.log('🎨 QuickAid Phase 3 - Advanced Frontend loaded');

// Global state management
const QuickAid = {
    state: {
        currentSection: null,
        isLoading: false,
        uploadedFile: null,
        isDragging: false,
        notifications: [],
        theme: 'light'
    },
    
    config: {
        maxFileSize: 16 * 1024 * 1024, // 16MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        animationDuration: 300,
        notificationTimeout: 5000
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing QuickAid Advanced Frontend...');
    initializeAdvancedApp();
});

// Advanced initialization
function initializeAdvancedApp() {
    // Initialize core features
    setupAdvancedEventListeners();
    setupDragAndDrop();
    setupKeyboardShortcuts();
    setupIntersectionObserver();
    setupFormValidation();
    
    // Initialize UI enhancements
    addRippleEffects();
    setupTooltips();
    detectUserPreferences();
    
    // Test connection
    performHealthCheck();
    
    // Show welcome animation
    showWelcomeAnimation();
    
    console.log('✨ QuickAid advanced initialization complete!');
}

// Enhanced event listeners
function setupAdvancedEventListeners() {
    // File input with preview
    const imageInput = document.getElementById('image-input');
    if (imageInput) {
        imageInput.addEventListener('change', handleFileSelection);
    }
    
    // Auto-expanding textarea
    const symptomsText = document.getElementById('symptoms-text');
    if (symptomsText) {
        symptomsText.addEventListener('input', handleTextareaInput);
        symptomsText.addEventListener('focus', handleTextareaFocus);
        symptomsText.addEventListener('blur', handleTextareaBlur);
    }
    
    // Real-time form validation
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', validateFormField);
    });
    
    // Smooth scrolling for internal links
    document.addEventListener('click', handleSmoothScroll);
    
    // Escape key handler
    document.addEventListener('keydown', handleEscapeKey);
}

// Advanced drag and drop
function setupDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    if (!uploadArea) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, handleDragEnter, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, handleDragLeave, false);
    });
    
    // Handle dropped files
    uploadArea.addEventListener('drop', handleFileDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragEnter(e) {
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.classList.add('dragover');
    QuickAid.state.isDragging = true;
    
    // Add visual feedback
    uploadArea.style.transform = 'scale(1.02)';
}

function handleDragLeave(e) {
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.classList.remove('dragover');
    QuickAid.state.isDragging = false;
    
    // Remove visual feedback
    uploadArea.style.transform = 'scale(1)';
}

function handleFileDrop(e) {
    const files = e.dataTransfer.files;
    handleDroppedFiles(files);
}

// Enhanced file handling
function handleDroppedFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    const fileInput = document.getElementById('image-input');
    
    // Validate file
    if (!validateFile(file)) return;
    
    // Set file to input
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    
    // Process file
    processUploadedFile(file);
    showSuccessNotification(`File "${file.name}" ready for analysis`);
}

function handleFileSelection(e) {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        if (validateFile(file)) {
            processUploadedFile(file);
        }
    }
}

function validateFile(file) {
    // Check file type
    if (!QuickAid.config.allowedTypes.includes(file.type)) {
        showErrorNotification(`File type not supported. Please use: ${QuickAid.config.allowedTypes.join(', ')}`);
        return false;
    }
    
    // Check file size
    if (file.size > QuickAid.config.maxFileSize) {
        showErrorNotification(`File too large. Maximum size: ${formatFileSize(QuickAid.config.maxFileSize)}`);
        return false;
    }
    
    return true;
}

function processUploadedFile(file) {
    QuickAid.state.uploadedFile = file;
    
    // Create preview
    createImagePreview(file);
    
    // Update UI
    updateFileInfo(file);
    
    // Enable analyze button
    const analyzeBtn = document.querySelector('#image-section .btn.primary');
    if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.add('ready');
    }
    
    console.log('File processed:', file.name);
}

// Image preview functionality
function createImagePreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        showImagePreview(e.target.result, file.name);
    };
    
    reader.readAsDataURL(file);
}

function showImagePreview(src, filename) {
    const uploadArea = document.querySelector('.upload-area');
    
    // Remove existing preview
    const existingPreview = uploadArea.querySelector('.image-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview';
    previewContainer.innerHTML = `
        <div class="preview-header">
            <span class="preview-title">📸 Image Preview</span>
            <button class="preview-close" onclick="removeImagePreview()">×</button>
        </div>
        <div class="preview-image">
            <img src="${src}" alt="${filename}" />
        </div>
        <div class="preview-actions">
            <button class="btn-small secondary" onclick="rotateImage()">🔄 Rotate</button>
            <button class="btn-small secondary" onclick="cropImage()">✂️ Crop</button>
        </div>
    `;
    
    // Add styles
    previewContainer.style.cssText = `
        margin-top: var(--spacing-md);
        background: white;
        border-radius: var(--border-radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        animation: fadeIn 0.3s ease-in;
    `;
    
    uploadArea.appendChild(previewContainer);
    
    // Style the image
    const img = previewContainer.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
        border-radius: var(--border-radius-sm);
    `;
    
    // Style header
    const header = previewContainer.querySelector('.preview-header');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--bg-light);
        font-weight: 600;
    `;
    
    // Style close button
    const closeBtn = previewContainer.querySelector('.preview-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-medium);
        transition: color var(--transition-fast);
    `;
    
    // Style image container
    const imageContainer = previewContainer.querySelector('.preview-image');
    imageContainer.style.cssText = `
        padding: var(--spacing-md);
        text-align: center;
        background: var(--bg-white);
    `;
    
    // Style actions
    const actions = previewContainer.querySelector('.preview-actions');
    actions.style.cssText = `
        display: flex;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--bg-light);
        justify-content: center;
    `;
}

// Enhanced textarea handling
function handleTextareaInput(e) {
    const textarea = e.target;
    
    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
    
    // Character counter
    updateCharacterCounter(textarea);
    
    // Real-time validation
    validateSymptoms(textarea.value);
}

function handleTextareaFocus(e) {
    e.target.parentElement.classList.add('focused');
}

function handleTextareaBlur(e) {
    e.target.parentElement.classList.remove('focused');
}

function updateCharacterCounter(textarea) {
    const section = textarea.closest('.section');
    let counter = section.querySelector('.char-counter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-light);
            text-align: right;
            margin-top: var(--spacing-xs);
        `;
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
    }
    
    const length = textarea.value.length;
    const minLength = 10;
    const maxLength = 1000;
    
    counter.textContent = `${length}/${maxLength} characters`;
    
    if (length < minLength) {
        counter.style.color = '#ffa502';
        counter.textContent += ' (minimum 10 characters)';
    } else if (length > maxLength) {
        counter.style.color = '#ff4757';
    } else {
        counter.style.color = '#2ed573';
    }
}

// Form validation
function validateFormField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    removeFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'textarea' && value.length > 0 && value.length < 10) {
        showFieldError(field, 'Please provide more detailed information');
        return false;
    }
    
    return true;
}

function validateSymptoms(text) {
    const symptomsSection = document.getElementById('symptoms-section');
    const analyzeBtn = symptomsSection.querySelector('.btn.primary');
    
    if (!analyzeBtn) return;
    
    if (text.trim().length >= 10) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.add('ready');
    } else {
        analyzeBtn.disabled = true;
        analyzeBtn.classList.remove('ready');
    }
}

function showFieldError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff4757;
        font-size: 0.8rem;
        margin-top: var(--spacing-xs);
        animation: slideIn 0.2s ease-out;
    `;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#ff4757';
}

function removeFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    field.style.borderColor = '';
}

// Enhanced UI interactions
function showImageUpload() {
    console.log('Showing image upload with enhanced UI');
    hideAllSections();
    
    const section = document.getElementById('image-section');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    QuickAid.state.currentSection = 'image';
    
    // Add entrance animation
    section.classList.add('section-enter');
    
    // Focus on file input after animation
    setTimeout(() => {
        const fileInput = document.getElementById('image-input');
        if (fileInput) fileInput.focus();
    }, 300);
}

function showSymptomsInput() {
    console.log('Showing symptoms input with enhanced UI');
    hideAllSections();
    
    const section = document.getElementById('symptoms-section');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    QuickAid.state.currentSection = 'symptoms';
    
    // Add entrance animation
    section.classList.add('section-enter');
    
    // Focus on textarea after animation
    setTimeout(() => {
        const textarea = document.getElementById('symptoms-text');
        if (textarea) {
            textarea.focus();
            // Add typing hint
            showTypingHint(textarea);
        }
    }, 300);
}

function showTypingHint(textarea) {
    if (textarea.value.trim()) return;
    
    const hints = [
        "Person is bleeding from a cut on their hand",
        "Someone fell and hurt their ankle",
        "Child is choking on food",
        "Person burned their hand on stove",
        "Someone is having trouble breathing"
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    textarea.placeholder = `Describe what happened, symptoms, or the emergency situation...\n\nExample: "${randomHint}"`;
}

// Enhanced loading states
function showAdvancedLoading(message = 'Processing...', type = 'analysis') {
    QuickAid.state.isLoading = true;
    
    const loadingElement = document.getElementById('loading');
    const spinner = loadingElement.querySelector('.spinner');
    const text = loadingElement.querySelector('p');
    
    // Update message
    if (text) text.textContent = message;
    
    // Customize spinner based on type
    if (spinner) {
        spinner.className = `spinner spinner-${type}`;
        
        if (type === 'analysis') {
            spinner.style.borderTopColor = '#667eea';
        } else if (type === 'upload') {
            spinner.style.borderTopColor = '#2ed573';
        } else if (type === 'emergency') {
            spinner.style.borderTopColor = '#ff4757';
        }
    }
    
    // Show with animation
    loadingElement.style.display = 'block';
    loadingElement.scrollIntoView({ behavior: 'smooth' });
    
    // Add progress indication
    if (type === 'analysis') {
        showProgressIndicator(loadingElement);
    }
    
    console.log('Advanced loading shown:', message, type);
}

function showProgressIndicator(container) {
    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    progress.innerHTML = `
        <div class="progress-track">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-steps">
            <span class="step active">Uploading</span>
            <span class="step">Processing</span>
            <span class="step">Analyzing</span>
            <span class="step">Generating Response</span>
        </div>
    `;
    
    progress.style.cssText = `
        margin-top: var(--spacing-lg);
        width: 100%;
    `;
    
    container.appendChild(progress);
    
    // Simulate progress
    simulateProgress();
}

function simulateProgress() {
    const steps = document.querySelectorAll('.progress-steps .step');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!steps.length || !progressFill) return;
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    const interval = setInterval(() => {
        if (currentStep < totalSteps && QuickAid.state.isLoading) {
            steps[currentStep].classList.add('active');
            progressFill.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 800);
}

// Enhanced notifications system
function showSuccessNotification(message, duration = 5000) {
    showNotification(message, 'success', duration);
}

function showErrorNotification(message, duration = 8000) {
    showNotification(message, 'error', duration);
}

function showWarningNotification(message, duration = 6000) {
    showNotification(message, 'warning', duration);
}

function showInfoNotification(message, duration = 4000) {
    showNotification(message, 'info', duration);
}

function showNotification(message, type = 'info', duration = 5000) {
    const notification = createNotificationElement(message, type);
    document.body.appendChild(notification);
    
    // Add to state
    QuickAid.state.notifications.push({
        element: notification,
        timestamp: Date.now()
    });
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    console.log(`Notification (${type}):`, message);
}

function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const colors = {
        success: '#2ed573',
        error: '#ff4757',
        warning: '#ffa502',
        info: '#3742fa'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: var(--spacing-lg);
        right: var(--spacing-lg);
        background: ${colors[type] || colors.info};
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        min-width: 300px;
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        cursor: pointer;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    // Stack notifications
    const existingNotifications = document.querySelectorAll('.notification');
    if (existingNotifications.length > 0) {
        notification.style.top = `${20 + (existingNotifications.length * 80)}px`;
    }
    
    return notification;
}

function removeNotification(notification) {
    if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
        
        // Update positions of remaining notifications
        updateNotificationPositions();
    }
}

function updateNotificationPositions() {
    setTimeout(() => {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach((notification, index) => {
            notification.style.top = `${20 + (index * 80)}px`;
        });
    }, 100);
}

// Keyboard shortcuts and accessibility
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+1: Image upload
        if (e.ctrlKey && e.key === '1') {
            e.preventDefault();
            showImageUpload();
            showInfoNotification('Switched to image upload mode');
        }
        
        // Ctrl+2: Symptoms input
        if (e.ctrlKey && e.key === '2') {
            e.preventDefault();
            showSymptomsInput();
            showInfoNotification('Switched to symptoms input mode');
        }
        
        // Ctrl+Enter: Analyze (if in a section)
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (QuickAid.state.currentSection === 'image') {
                analyzeImage();
            } else if (QuickAid.state.currentSection === 'symptoms') {
                analyzeSymptoms();
            }
        }
        
        // F1: Help
        if (e.key === 'F1') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });
}
