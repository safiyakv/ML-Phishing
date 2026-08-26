// PhishGuard JavaScript - Page Routing and Interactions

// Page Management
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;
            
            // Simple validation (in real app, this would be server-side)
            if (email && password) {
                // Show loading state
                const loginBtn = document.querySelector('.login-btn');
                const originalText = loginBtn.innerHTML;
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
                loginBtn.disabled = true;
                
                // Simulate authentication delay
                setTimeout(() => {
                    // Navigate to scanner page
                    showPage('scannerPage');
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                    
                    // Reset form
                    loginForm.reset();
                }, 1500);
            }
        });
    }
    
    // URL Scanner Handler
    const urlInput = document.getElementById('urlInput');
    const scanBtn = document.querySelector('.scan-btn');
    
    if (scanBtn && urlInput) {
        scanBtn.addEventListener('click', scanURL);
        
        // Allow Enter key to trigger scan
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                scanURL();
            }
        });
    }
    
    // Initialize dashboard with sample data
    updateDashboardData();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add interactive hover effects
    addInteractiveEffects();
});

// URL Scanner Function
function scanURL() {
    const urlInput = document.getElementById('urlInput');
    const scanBtn = document.querySelector('.scan-btn');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Please enter a URL to scan', 'warning');
        return;
    }
    
    // Validate URL format
    if (!isValidURL(url)) {
        showNotification('Please enter a valid URL format', 'error');
        return;
    }
    
    // Show scanning state
    const originalBtnText = scanBtn.innerHTML;
    scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
    scanBtn.disabled = true;
    urlInput.disabled = true;
    
    // Simulate scanning process
    setTimeout(() => {
        // Generate random analysis results
        const analysisResult = generateAnalysisResult(url);
        
        // Update dashboard with results
        updateDashboardWithResults(url, analysisResult);
        
        // Navigate to dashboard
        showPage('dashboardPage');
        
        // Reset scanner
        scanBtn.innerHTML = originalBtnText;
        scanBtn.disabled = false;
        urlInput.disabled = false;
        urlInput.value = '';
        
        showNotification(`Scan completed for ${url}`, 'success');
    }, 2000);
}

// URL Validation
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        // Try adding https:// if missing
        try {
            new URL('https://' + string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Generate Random Analysis Results
function generateAnalysisResult(url) {
    // Simulate different risk levels based on URL patterns
    let riskLevel = 'safe';
    let riskScore = Math.floor(Math.random() * 15) + 1; // 1-15% for safe
    
    // Check for suspicious patterns
    const suspiciousPatterns = ['login', 'secure', 'verify', 'account', 'update', 'bank', 'paypal'];
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
        url.toLowerCase().includes(pattern)
    );
    
    if (hasSuspiciousPattern) {
        if (Math.random() > 0.5) {
            riskLevel = 'suspicious';
            riskScore = Math.floor(Math.random() * 40) + 40; // 40-80%
        } else {
            riskLevel = 'dangerous';
            riskScore = Math.floor(Math.random() * 20) + 80; // 80-100%
        }
    }
    
    return {
        riskLevel: riskLevel,
        riskScore: riskScore,
        domain: extractDomain(url),
        sslValid: Math.random() > 0.2,
        domainAge: Math.floor(Math.random() * 10) + 1,
        ipAddress: generateRandomIP(),
        httpsEnabled: Math.random() > 0.1,
        suspiciousKeywords: hasSuspiciousPattern,
        urlStructureNormal: !hasSuspiciousPattern || Math.random() > 0.5
    };
}

// Extract domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        return urlObj.hostname;
    } catch (_) {
        return url;
    }
}

// Generate Random IP Address
function generateRandomIP() {
    return `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Update Dashboard with Results
function updateDashboardWithResults(url, result) {
    // Update result card
    const resultCard = document.getElementById('resultCard');
    const riskScoreElement = document.getElementById('riskScore');
    const resultStatusElement = document.getElementById('resultStatus');
    const resultMessageElement = document.getElementById('resultMessage');
    const domainNameElement = document.getElementById('domainName');
    
    // Update risk score
    riskScoreElement.textContent = `${result.riskScore}%`;
    
    // Update status based on risk level
    let status, message, statusClass;
    switch (result.riskLevel) {
        case 'safe':
            status = 'SAFE';
            message = 'This website appears to be legitimate.';
            statusClass = 'safe';
            break;
        case 'suspicious':
            status = 'SUSPICIOUS';
            message = 'This website shows some suspicious characteristics.';
            statusClass = 'suspicious';
            break;
        case 'dangerous':
            status = 'DANGEROUS';
            message = 'This website appears to be a phishing threat.';
            statusClass = 'dangerous';
            break;
    }
    
    resultStatusElement.textContent = status;
    resultStatusElement.className = `result-status ${statusClass}`;
    resultMessageElement.textContent = message;
    
    // Update domain name
    domainNameElement.textContent = result.domain;
    
    // Update result card styling
    resultCard.className = `result-card ${statusClass}`;
    
    // Update analysis items
    updateAnalysisItems(result);
    
    // Update domain information
    updateDomainInfo(result);
    
    // Update explainability section
    updateExplainability(result);
    
    // Update statistics
    updateStatistics(result.riskLevel);
    
    // Add to history
    addToHistory(url, result);
}

// Update Analysis Items
function updateAnalysisItems(result) {
    const analysisItems = document.querySelectorAll('.analysis-item');
    
    // HTTPS Enabled
    analysisItems[0].querySelector('.status').textContent = result.httpsEnabled ? '✓' : '✗';
    analysisItems[0].querySelector('.status').className = `status ${result.httpsEnabled ? 'safe' : 'dangerous'}`;
    
    // SSL Certificate
    analysisItems[1].querySelector('.status').textContent = result.sslValid ? 'Valid' : 'Invalid';
    analysisItems[1].querySelector('.status').className = `status ${result.sslValid ? 'safe' : 'dangerous'}`;
    
    // Domain Age
    analysisItems[2].querySelector('.status').textContent = `${result.domainAge} years`;
    analysisItems[2].querySelector('.status').className = `status ${result.domainAge > 2 ? 'safe' : 'suspicious'}`;
    
    // IP Address
    analysisItems[3].querySelector('.status').textContent = result.ipAddress;
    
    // URL Structure
    analysisItems[4].querySelector('.status').textContent = result.urlStructureNormal ? 'Normal' : 'Suspicious';
    analysisItems[4].querySelector('.status').className = `status ${result.urlStructureNormal ? 'safe' : 'suspicious'}`;
    
    // Suspicious Keywords
    analysisItems[5].querySelector('.status').textContent = result.suspiciousKeywords ? 'Detected' : 'None';
    analysisItems[5].querySelector('.status').className = `status ${result.suspiciousKeywords ? 'dangerous' : 'safe'}`;
}

// Update Domain Information
function updateDomainInfo(result) {
    const domainItems = document.querySelectorAll('.domain-item');
    
    domainItems[0].querySelector('.value').textContent = result.domain;
    domainItems[1].querySelector('.value').textContent = result.sslValid ? 'Valid' : 'Invalid';
    domainItems[1].querySelector('.value').className = `value status ${result.sslValid ? 'safe' : 'dangerous'}`;
    domainItems[2].querySelector('.value').textContent = `${result.domainAge} years, ${Math.floor(Math.random() * 12) + 1} months`;
    domainItems[3].querySelector('.value').textContent = result.ipAddress;
}

// Update Explainability Section
function updateExplainability(result) {
    const explainabilityPanel = document.querySelector('.explainability-panel');
    const explanationTitle = explainabilityPanel.querySelector('h3');
    const explanationList = explainabilityPanel.querySelector('.explanation-list');
    const formulaResult = explainabilityPanel.querySelector('.formula-result');
    
    // Update title based on risk level
    let titleText;
    switch (result.riskLevel) {
        case 'safe':
            titleText = 'Why was this classified as safe?';
            break;
        case 'suspicious':
            titleText = 'Why was this classified as suspicious?';
            break;
        case 'dangerous':
            titleText = 'Why was this classified as dangerous?';
            break;
    }
    explanationTitle.textContent = titleText;
    
    // Generate explanation items
    let explanations = [];
    
    if (result.riskLevel === 'safe') {
        explanations = [
            'Domain registered for over 2 years (established reputation)',
            'No suspicious keywords detected in URL structure',
            result.sslValid ? 'Valid SSL certificate with proper encryption' : 'SSL certificate issues detected',
            'Machine learning model indicates legitimate patterns'
        ];
    } else if (result.riskLevel === 'suspicious') {
        explanations = [
            result.domainAge < 2 ? 'Domain registered recently (less than 2 years)' : 'Domain age is moderate',
            result.suspiciousKeywords ? 'URL contains suspicious keywords' : 'URL structure shows unusual patterns',
            result.sslValid ? 'SSL certificate is valid but other indicators are concerning' : 'SSL certificate issues detected',
            'Machine learning model detected some suspicious patterns'
        ];
    } else {
        explanations = [
            result.domainAge < 1 ? 'Domain registered very recently (high risk indicator)' : 'Domain characteristics concerning',
            result.suspiciousKeywords ? 'URL contains multiple suspicious keywords' : 'URL structure highly unusual',
            !result.sslValid ? 'Invalid or missing SSL certificate' : 'SSL certificate present but other risks high',
            'Machine learning model detected strong phishing patterns'
        ];
    }
    
    // Update explanation list
    explanationList.innerHTML = '';
    explanations.forEach(explanation => {
        const item = document.createElement('div');
        item.className = 'explanation-item';
        item.innerHTML = `
            <i class="fas fa-${result.riskLevel === 'safe' ? 'check-circle' : result.riskLevel === 'suspicious' ? 'exclamation-triangle' : 'times-circle'}"></i>
            <span>${explanation}</span>
        `;
        explanationList.appendChild(item);
    });
    
    // Update formula result
    formulaResult.textContent = `${result.riskScore}% Risk Score`;
}

// Update Statistics
function updateStatistics(riskLevel) {
    const totalScansElement = document.getElementById('totalScans');
    const safeUrlsElement = document.getElementById('safeUrls');
    const suspiciousUrlsElement = document.getElementById('suspiciousUrls');
    const dangerousUrlsElement = document.getElementById('dangerousUrls');
    
    // Increment total scans
    let totalScans = parseInt(totalScansElement.textContent) || 0;
    totalScans++;
    totalScansElement.textContent = totalScans.toLocaleString();
    
    // Increment specific category
    switch (riskLevel) {
        case 'safe':
            let safeUrls = parseInt(safeUrlsElement.textContent) || 0;
            safeUrls++;
            safeUrlsElement.textContent = safeUrls.toLocaleString();
            break;
        case 'suspicious':
            let suspiciousUrls = parseInt(suspiciousUrlsElement.textContent) || 0;
            suspiciousUrls++;
            suspiciousUrlsElement.textContent = suspiciousUrls.toLocaleString();
            break;
        case 'dangerous':
            let dangerousUrls = parseInt(dangerousUrlsElement.textContent) || 0;
            dangerousUrls++;
            dangerousUrlsElement.textContent = dangerousUrls.toLocaleString();
            break;
    }
}

// Add to History
function addToHistory(url, result) {
    const historyList = document.querySelector('.history-list');
    
    // Create new history item
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const timeAgo = 'Just now';
    const riskClass = result.riskLevel;
    const statusText = result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1);
    
    historyItem.innerHTML = `
        <div class="history-url">${url}</div>
        <div class="history-risk">Risk ${result.riskScore}%</div>
        <div class="history-status ${riskClass}">${statusText}</div>
        <div class="history-time">${timeAgo}</div>
    `;
    
    // Add to top of history
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Remove last item if more than 5
    const items = historyList.querySelectorAll('.history-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
    
    // Update time for existing items
    const existingItems = historyList.querySelectorAll('.history-item');
    existingItems.forEach((item, index) => {
        if (index > 0) {
            const timeElement = item.querySelector('.history-time');
            const currentTime = timeElement.textContent;
            
            // Simple time update logic
            if (currentTime === 'Just now') {
                timeElement.textContent = '1 min ago';
            } else if (currentTime === '1 min ago') {
                timeElement.textContent = '2 mins ago';
            } else if (currentTime.includes('mins')) {
                const mins = parseInt(currentTime) + 1;
                timeElement.textContent = `${mins} mins ago`;
            } else if (currentTime.includes('hour')) {
                const hours = parseInt(currentTime) + 1;
                timeElement.textContent = `${hours} hours ago`;
            }
        }
    });
}

// Initialize Dashboard Data
function updateDashboardData() {
    // Statistics start at 0 and only increment when URLs are scanned
    // No placeholder values needed
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : type === 'error' ? 'rgba(255, 67, 54, 0.9)' : 'rgba(255, 193, 7, 0.9)'};
        color: #0a0e27;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        font-weight: 600;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add Interactive Effects
function addInteractiveEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .analysis-item, .domain-item, .history-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
