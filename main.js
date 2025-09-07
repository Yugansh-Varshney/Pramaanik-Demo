// SatyaPatra Application JavaScript

// Application State
let appState = {
    currentPage: 'home',
    isLoggedIn: false,
    uploadedFiles: [],
    scannedCodes: [],
    currentRating: 0,
    isScanning: false
};

// Mock certificate database
const mockCertificates = [
    {
        id: "CERT_2024_001",
        name: "Bachelor of Technology in Computer Science",
        issuer: "Indian Institute of Technology, Delhi",
        issuedTo: "Rahul Sharma",
        issueDate: "2024-06-15",
        status: "verified",
        type: "Academic Degree"
    },
    {
        id: "CERT_2024_002", 
        name: "Professional Certification in Data Science",
        issuer: "All India Council for Technical Education",
        issuedTo: "Priya Patel",
        issueDate: "2024-08-20",
        status: "verified",
        type: "Professional Certificate"
    },
    {
        id: "CERT_2024_003",
        name: "Higher Secondary Certificate",
        issuer: "Central Board of Secondary Education",
        issuedTo: "Amit Kumar",
        issueDate: "2024-05-30",
        status: "invalid",
        type: "School Certificate"
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHomePage();
    initializeVerifyPage();
    initializeFeedbackPage();
    initializeFileUpload();
    initializeQRScanner();
    initializeWalletTabs();
    
    console.log('SatyaPatra application initialized');
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Handle login/logout
    loginBtn.addEventListener('click', function() {
        appState.isLoggedIn = true;
        updateAuthUI();
    });
    
    profileBtn.addEventListener('click', function() {
        appState.isLoggedIn = false;
        updateAuthUI();
    });
}

function navigateToPage(page) {
    // Update state
    appState.currentPage = page;
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`[data-page="${page}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    if (appState.isLoggedIn) {
        loginBtn.classList.add('hidden');
        profileBtn.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        profileBtn.classList.add('hidden');
    }
}

// Home page functionality
function initializeHomePage() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update tab buttons
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// File upload functionality
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.querySelector('.upload-btn');
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
}

function handleFileUpload(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showAlert('Please upload a PDF or image file (JPEG, PNG)', 'error');
        return;
    }
    
    // Add to uploaded files
    appState.uploadedFiles.push(file);
    
    // Show success state
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #22c55e;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        <h3>File Uploaded Successfully</h3>
        <p><strong>${file.name}</strong></p>
        <p class="file-info">File size: ${formatFileSize(file.size)}</p>
        <button class="upload-btn" onclick="resetUpload()">Upload Another File</button>
    `;
    
    // Update recent activity
    updateRecentActivity();
}

function resetUpload() {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <h3>Upload Certificate</h3>
        <p>Drag and drop your certificate here, or click to browse</p>
        <p class="file-info">Supported formats: PDF, JPEG, PNG</p>
        <button class="upload-btn">Choose File</button>
        <input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" hidden>
    `;
    
    // Reinitialize file input
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
}

// QR Scanner functionality
function initializeQRScanner() {
    const startScanBtn = document.getElementById('startScanBtn');
    const scannerPreview = document.getElementById('scannerPreview');
    
    startScanBtn.addEventListener('click', function() {
        if (!appState.isScanning) {
            startQRScan();
        } else {
            stopQRScan();
        }
    });
}

function startQRScan() {
    appState.isScanning = true;
    const scannerPreview = document.getElementById('scannerPreview');
    const startScanBtn = document.getElementById('startScanBtn');
    
    // Update UI to scanning state
    scannerPreview.classList.add('scanner-scanning');
    scannerPreview.innerHTML = `
        <div class="loading-spinner"></div>
        <h3>Scanning...</h3>
        <p>Hold steady while we read the QR code</p>
    `;
    
    startScanBtn.textContent = 'Cancel';
    startScanBtn.style.backgroundColor = '#ef4444';
    
    // Simulate QR code scanning
    setTimeout(() => {
        if (appState.isScanning) {
            const mockQRData = "CERT_ID_12345_VERIFIED";
            handleQRScanResult(mockQRData);
        }
    }, 3000);
}

function stopQRScan() {
    appState.isScanning = false;
    resetQRScanner();
}

function handleQRScanResult(result) {
    appState.isScanning = false;
    appState.scannedCodes.push(result);
    
    const scannerPreview = document.getElementById('scannerPreview');
    const startScanBtn = document.getElementById('startScanBtn');
    
    // Show success state
    scannerPreview.classList.remove('scanner-scanning');
    scannerPreview.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #22c55e;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        <h3>Scan Successful!</h3>
        <p>QR code data captured</p>
        <div style="background: #f3f3f5; padding: 0.5rem; border-radius: 0.25rem; margin: 1rem 0;">
            <code style="font-size: 0.875rem;">${result}</code>
        </div>
    `;
    
    startScanBtn.textContent = 'Scan Again';
    startScanBtn.style.backgroundColor = '';
    
    // Reset after 3 seconds
    setTimeout(() => {
        resetQRScanner();
        updateRecentActivity();
    }, 3000);
}

function resetQRScanner() {
    const scannerPreview = document.getElementById('scannerPreview');
    const startScanBtn = document.getElementById('startScanBtn');
    
    scannerPreview.classList.remove('scanner-scanning');
    scannerPreview.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
        </svg>
        <h3>Scan QR Code</h3>
        <p>Position the QR code within the camera view</p>
    `;
    
    startScanBtn.textContent = 'Start Scan';
    startScanBtn.style.backgroundColor = '';
}

// Recent Activity
function updateRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    const activityList = document.getElementById('activityList');
    
    if (appState.uploadedFiles.length === 0 && appState.scannedCodes.length === 0) {
        recentActivity.classList.add('hidden');
        return;
    }
    
    recentActivity.classList.remove('hidden');
    
    let html = '';
    
    // Add uploaded files
    appState.uploadedFiles.forEach((file, index) => {
        html += `
            <div class="activity-item">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #3b82f6;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <div class="activity-details">
                    <h4>${file.name}</h4>
                    <p>Uploaded • ${formatFileSize(file.size)}</p>
                </div>
                <button class="btn outline">Verify</button>
            </div>
        `;
    });
    
    // Add scanned codes
    appState.scannedCodes.forEach((code, index) => {
        html += `
            <div class="activity-item">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #22c55e;">
                    <rect x="3" y="3" width="5" height="5"/>
                    <rect x="16" y="3" width="5" height="5"/>
                    <rect x="3" y="16" width="5" height="5"/>
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                </svg>
                <div class="activity-details">
                    <h4>QR Code Scanned</h4>
                    <p>${code}</p>
                </div>
                <button class="btn outline">Verify</button>
            </div>
        `;
    });
    
    activityList.innerHTML = html;
}

// Verify page functionality
function initializeVerifyPage() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('certificateSearch');
    const sampleItems = document.querySelectorAll('.sample-item');
    
    // Search functionality
    searchBtn.addEventListener('click', handleCertificateSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleCertificateSearch();
        }
    });
    
    // Sample certificate clicks
    sampleItems.forEach(item => {
        item.addEventListener('click', function() {
            const certId = this.dataset.certId;
            searchInput.value = certId;
            handleCertificateSearch();
        });
    });
}

function handleCertificateSearch() {
    const searchInput = document.getElementById('certificateSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResult = document.getElementById('searchResult');
    
    const query = searchInput.value.trim();
    if (!query) {
        showAlert('Please enter a certificate ID or name', 'error');
        return;
    }
    
    // Show loading state
    searchBtn.innerHTML = `
        <div class="loading-spinner" style="width: 16px; height: 16px; margin-right: 0.5rem;"></div>
        Searching...
    `;
    searchBtn.disabled = true;
    
    setTimeout(() => {
        // Search in mock database
        const result = mockCertificates.find(cert => 
            cert.id.toLowerCase().includes(query.toLowerCase()) ||
            cert.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (result) {
            displaySearchResult(result);
        } else {
            displaySearchResult({
                id: query,
                name: "Certificate Not Found",
                issuer: "Unknown",
                issuedTo: "Unknown",
                issueDate: "Unknown",
                status: "invalid",
                type: "Unknown"
            });
        }
        
        // Reset search button
        searchBtn.innerHTML = `
            <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            Search Certificate
        `;
        searchBtn.disabled = false;
    }, 2000);
}

function displaySearchResult(result) {
    const searchResult = document.getElementById('searchResult');
    const statusBadge = document.getElementById('statusBadge');
    const resultDetails = document.getElementById('resultDetails');
    
    // Show result section
    searchResult.classList.remove('hidden');
    searchResult.classList.add('fade-in');
    
    // Set status badge
    let badgeClass = 'verified';
    let badgeText = 'Verified';
    let statusIcon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
    `;
    
    if (result.status === 'invalid') {
        badgeClass = 'invalid';
        badgeText = 'Invalid';
        statusIcon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
        `;
    }
    
    statusBadge.className = `status-badge ${badgeClass}`;
    statusBadge.textContent = badgeText;
    
    // Set result details
    resultDetails.innerHTML = `
        <div class="result-field">
            ${statusIcon}
            <div>
                <h3>${result.name}</h3>
                <p>ID: ${result.id}</p>
            </div>
        </div>
        
        <div style="grid-column: 1 / -1; height: 1px; background: var(--border); margin: 1rem 0;"></div>
        
        <div class="result-field">
            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4v18"/>
                <path d="M19 21V11l-6-4"/>
            </svg>
            <div>
                <label>Issuing Authority</label>
                <p>${result.issuer}</p>
            </div>
        </div>
        
        <div class="result-field">
            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
            <div>
                <label>Issued To</label>
                <p>${result.issuedTo}</p>
            </div>
        </div>
        
        <div class="result-field">
            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
                <label>Issue Date</label>
                <p>${result.issueDate}</p>
            </div>
        </div>
        
        <div class="result-field">
            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
            </svg>
            <div>
                <label>Certificate Type</label>
                <p>${result.type}</p>
            </div>
        </div>
    `;
    
    // Add status message
    let statusMessage = '';
    if (result.status === 'verified') {
        statusMessage = `
            <div class="alert success" style="grid-column: 1 / -1; margin-top: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    ${statusIcon}
                    <strong>Certificate Verified</strong>
                </div>
                <p>This certificate is authentic and has been verified by the issuing authority.</p>
            </div>
        `;
    } else if (result.status === 'invalid') {
        statusMessage = `
            <div class="alert error" style="grid-column: 1 / -1; margin-top: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    ${statusIcon}
                    <strong>Certificate Invalid</strong>
                </div>
                <p>This certificate could not be verified or does not exist in our database.</p>
            </div>
        `;
    }
    
    resultDetails.innerHTML += statusMessage;
}

// Wallet page functionality
function initializeWalletTabs() {
    const walletTabs = document.querySelectorAll('[data-wallet-tab]');
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    walletTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetType = this.dataset.walletTab;
            
            // Update active tab
            walletTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter certificates
            certificateCards.forEach(card => {
                if (targetType === 'all' || card.dataset.type === targetType) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Feedback page functionality
function initializeFeedbackPage() {
    const starRating = document.getElementById('starRating');
    const ratingText = document.getElementById('ratingText');
    const feedbackForm = document.getElementById('feedbackForm');
    const stars = starRating.querySelectorAll('.star');
    
    // Star rating functionality
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = index + 1;
            appState.currentRating = rating;
            updateStarRating(rating);
            updateRatingText(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = index + 1;
            updateStarRating(rating, true);
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        updateStarRating(appState.currentRating);
    });
    
    // Form submission
    feedbackForm.addEventListener('submit', handleFeedbackSubmission);
}

function updateStarRating(rating, isHover = false) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingText(rating) {
    const ratingText = document.getElementById('ratingText');
    ratingText.textContent = `${rating}/5 stars`;
}

function handleFeedbackSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.innerHTML = `
        <div class="loading-spinner" style="width: 16px; height: 16px; margin-right: 0.5rem;"></div>
        Submitting...
    `;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Hide form and show success message
        const feedbackForm = document.querySelector('.feedback-form-section');
        const feedbackSuccess = document.getElementById('feedbackSuccess');
        
        feedbackForm.classList.add('hidden');
        feedbackSuccess.classList.remove('hidden');
        feedbackSuccess.classList.add('fade-in');
        
        // Reset form after 3 seconds
        setTimeout(() => {
            feedbackForm.classList.remove('hidden');
            feedbackSuccess.classList.add('hidden');
            feedbackSuccess.classList.remove('fade-in');
            
            // Reset form
            e.target.reset();
            appState.currentRating = 0;
            updateStarRating(0);
            document.getElementById('ratingText').textContent = 'Select rating';
            
            submitBtn.innerHTML = `
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
                Submit Feedback
            `;
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    // Insert at top of current page
    const currentPage = document.querySelector('.page.active');
    currentPage.insertBefore(alert, currentPage.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Export functions for global access
window.SatyaPatra = {
    navigateToPage,
    resetUpload,
    formatFileSize,
    showAlert
};

console.log('SatyaPatra JavaScript loaded successfully');