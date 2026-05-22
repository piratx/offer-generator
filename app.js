/* ===========================
   Offer Generator — Script
   Version: 202603210355
   See VERSION file for current version info
   =========================== */

const VERSION = '202605221943';

const DEFAULT_COMPANY = {
    logo:           'https://macworks.gr/macworks-logo.png',
    name:           'MacWorks E.E.',
    phone:          '6972840146',
    email:          'konstantinos@macworks.gr',
    address:        'Φαιδριάδων 49 11364',
    afm:            '802932464',
    doy:            'ΚΕΦΟΔΕ Αττικής',
    gemi:           '149564703000',
    signatory:      'Konstantinos Papasteriadis',
    title:          '',
    banks:          '',
    closingMessage: 'Στην διάθεσή σας.\nΜε εκτίμηση για την MacWorks E.E.',
    page2Notes:     'Οι τιμές δεν περιλαμβάνουν Φ.Π.Α. {vat}%\nΟ χρόνος διαθεσιμότητας υπόκειται στη διαθεσιμότητα του προμηθευτή.\nΗ προσφορά ισχύει {validity} εργάσιμες ημέρες.\nΟι τιμές ενδέχεται να μεταβληθούν.',
    introTemplates: 'apple|αγορά|Κατόπιν συνεννόησης μας παραθέτω την οικονομική μου προσφορά για την αγορά Apple προϊόντων.\n\nservice|επισκευή|Κατόπιν συνεννόησης μας παραθέτω την οικονομική μου προσφορά για την επισκευή/αναβάθμιση της συσκευής σας.\n\ndesktop|αγορά|Κατόπιν συνεννόησης μας παραθέτω την οικονομική μου προσφορά για την αγορά desktop υπολογιστή.\n\ncustompc|αγορά|Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την κατασκευή custom PC.\n\nlaptop|αγορά|Κατόπιν συνεννόησης μας παραθέτω την οικονομική μου προσφορά για την αγορά laptop υπολογιστή.\n\nmicrosoft365|αγορά|Κατόπιν συνεννόησης μας παραθέτω την οικονομική μου προσφορά για συνδρομή Microsoft 365.'
};
console.log('🚀 Script.js loaded - Version:', VERSION);
console.log('✅ Drag & Drop: ENABLED');
console.log('✅ Checkboxes for Signatory/Title: ENABLED');
console.log('✅ Burger Menu: ENABLED (FIXED!)');

(function () {
    'use strict';
    
    // Update version in header on load
    window.addEventListener('DOMContentLoaded', () => {
        const versionSpan = document.getElementById('versionDisplay');
        if (versionSpan) {
            versionSpan.textContent = `v${VERSION}`;
        }
    });

    // ────────────────────────────
    // State
    // ────────────────────────────
    let items = [];
    let offerCounter = parseInt(localStorage.getItem('offerCounter') || '0', 10);
    let currentUser = null;
    let customPaymentMethods = JSON.parse(localStorage.getItem('customPaymentMethods') || '[]');
    let imageUrlHistory = JSON.parse(localStorage.getItem('imageUrlHistory') || '[]');
    let librarySort = 'desc'; // 'desc' = newest first, 'asc' = oldest first
    let libraryGroupByClient = false;

    // Apple models - Enhanced with M4/M5 lineup
    const appleModels = {
        'iPhone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone SE'],
        'iPad': ['iPad Pro 12.9"', 'iPad Pro 11"', 'iPad Air', 'iPad 10th Gen', 'iPad mini'],
        'Mac': [
            'MacBook Air 13" M4 (2025)',
            'MacBook Air 15" M4 (2025)',
            'MacBook Air 15" M3 (2024)',
            'MacBook Pro 14" M4 (2024)',
            'MacBook Pro 16" M4 (2024)',
            'MacBook Pro 14" M5 (2025)',
            'MacBook Pro 16" M5 (2025)',
            'Mac mini M4 (2024)',
            'Mac Studio M2 Max (2023)',
            'Mac Studio M2 Ultra (2023)',
            'iMac 24" M4 (2024)',
            'Mac Pro'
        ],
        'Apple Watch': ['Apple Watch Ultra 2', 'Apple Watch Series 9', 'Apple Watch SE'],
        'AirPods': ['AirPods Pro 2', 'AirPods 3rd Gen', 'AirPods Max']
    };

    // PC Products
    const pcProducts = {
        brands: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Custom Build'],
        types: ['Desktop', 'Laptop', 'Workstation', 'Server', 'Mini PC', 'All-in-One']
    };

    // Network Equipment
    const networkProducts = {
        brands: ['TP-Link', 'Ubiquiti', 'Cisco', 'Netgear', 'D-Link', 'MikroTik', 'Aruba'],
        types: ['Router', 'Switch', 'Access Point', 'Firewall', 'Modem', 'Mesh System']
    };

    // Microsoft 365 products
    const microsoft365Products = [
        'Microsoft 365 Business Basic',
        'Microsoft 365 Business Standard',
        'Microsoft 365 Business Premium',
        'Microsoft 365 Apps for Business',
        'Microsoft Copilot Pro',
        'Exchange Online Plan 1',
        'Exchange Online Plan 2',
        'Microsoft Teams Essentials',
        'Google Workspace Business Starter',
        'Google Workspace Business Standard',
        'Adobe Creative Cloud'
    ];

    // Service types
    const serviceTypes = [
        'Αντικατάσταση Μπαταρίας',
        'Αντικατάσταση Δίσκου (SSD/HDD)',
        'Αντικατάσταση Οθόνης',
        'Αντικατάσταση Πληκτρολογίου',
        'Καθαρισμός / Συντήρηση',
        'Αναβάθμιση RAM',
        'Εγκατάσταση OS',
        'Επαναφορά Δεδομένων',
        'Virus / Malware Removal',
        'Τεχνική Υποστήριξη',
        'Data Migration',
        'Backup Setup',
        'Network Configuration'
    ];

    // Categories
    const mainCategories = [
        { value: 'apple', label: '🍎 Apple Products' },
        { value: 'pc', label: '💻 PC / Laptop' },
        { value: 'network', label: '🌐 Network Equipment' },
        { value: 'microsoft365', label: '☁️ Microsoft 365 / Cloud' },
        { value: 'service', label: '🔧 Υπηρεσία / Επισκευή' },
        { value: 'accessory', label: '🎧 Αξεσουάρ' },
        { value: 'custompc', label: '🖥️ Custom PC Build' },
        { value: 'other', label: '📦 Άλλο' }
    ];

    // Default users
    const defaultUsers = [{ username: 'admin', password: 'admin123', role: 'admin' }];
    const users = JSON.parse(localStorage.getItem('appUsers') || JSON.stringify(defaultUsers));

    // ────────────────────────────
    // DOM Refs
    // ────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ────────────────────────────
    // Init
    // ────────────────────────────
    function init() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showApp();
        }
        bindLoginEvents();
    }

    function showApp() {
        const loginScreen = $('#loginScreen');
        const appContainer = $('#appContainer');

        if (loginScreen) loginScreen.classList.add('hidden');
        if (appContainer) appContainer.style.display = '';

        const userBadge = $('#userBadge');
        if (userBadge) {
            userBadge.innerHTML = `<span class="user-icon">👤</span><span class="user-name">${currentUser.username}</span>`;
        }

        // Show users button only for admin
        const btnManageUsers = $('#btnManageUsers');
        if (btnManageUsers && currentUser.username === 'admin') {
            btnManageUsers.style.display = '';
        }

        // Load and display version
        loadVersion();

        generateOfferNumber();
        setTodayDate();
        loadCompanySettings();
        loadCustomOptions();
        populateSavedClients(); // Populate client autocomplete
        addItem();
        bindEvents();
        bindGitHubEvents();
        bindMobileToggle(); // Mobile preview toggle
        updatePreview();
        autoSyncGitHub();
    }

    // ────────────────────────────
    // Mobile Toggle
    // ────────────────────────────
    function bindMobileToggle() {
        const toggleBtn = $('#mobileToggle');
        if (!toggleBtn) return;
        
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('preview-active');
            
            // Update button icon
            const isPreview = document.body.classList.contains('preview-active');
            toggleBtn.textContent = isPreview ? '📝' : '📄';
            toggleBtn.setAttribute('aria-label', isPreview ? 'Show form' : 'Show preview');
        });
    }

    // ────────────────────────────
    // Version Loading
    // ────────────────────────────
    async function loadVersion() {
        try {
            const response = await fetch('VERSION');
            const text = await response.text();
            const versionMatch = text.match(/VERSION=(\d+)/);
            if (versionMatch) {
                const versionElement = document.querySelector('.subtitle span');
                if (versionElement) {
                    versionElement.textContent = `v${versionMatch[1]}`;
                }
            }
        } catch (error) {
            console.log('VERSION file not found, using default');
        }
    }

    // ────────────────────────────
    // Login
    // ────────────────────────────
    function bindLoginEvents() {
        const btnLogin = $('#btnLogin');
        const loginPassword = $('#loginPassword');

        if (btnLogin) btnLogin.addEventListener('click', handleLogin);
        if (loginPassword) loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    async function handleLogin() {
        console.log('=== handleLogin called ===');
        
        const usernameEl = $('#loginUsername');
        const passwordEl = $('#loginPassword');

        console.log('Username element:', usernameEl);
        console.log('Password element:', passwordEl);

        if (!usernameEl || !passwordEl) {
            console.error('Login elements not found');
            showToast('❌ Login form error - please refresh');
            return;
        }

        const username = usernameEl.value.trim();
        const token = passwordEl.value.trim();

        console.log('Login attempt - Username:', username, 'Token length:', token.length);
        console.log('Token starts with:', token.substring(0, 10) + '...');

        if (!username || !token) {
            showToast('❌ Enter GitHub username and token');
            return;
        }

        // Validate token format
        if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
            showToast('⚠️ Token should start with ghp_ or github_pat_');
            console.error('Invalid token format. Token starts with:', token.substring(0, 5));
            return;
        }

        showToast('⏳ Validating GitHub credentials...');

        try {
            console.log('Calling GitHub API...');
            console.log('Using token:', token.substring(0, 10) + '...' + token.substring(token.length - 5));
            
            // Determine auth method based on token type
            const authHeader = token.startsWith('github_pat_') 
                ? `Bearer ${token}`  // Fine-grained token
                : `token ${token}`;   // Classic token (ghp_)
            
            console.log('Auth method:', token.startsWith('github_pat_') ? 'Bearer (fine-grained)' : 'token (classic)');
            
            // Test authentication by getting user info
            const userResponse = await fetch('https://api.github.com/user', {
                method: 'GET',
                headers: {
                    'Authorization': authHeader,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            console.log('GitHub API response status:', userResponse.status);
            console.log('Response headers:', Object.fromEntries(userResponse.headers.entries()));

            if (!userResponse.ok) {
                const errorBody = await userResponse.text();
                console.error('GitHub API error body:', errorBody);
                
                let errorMessage = '';
                try {
                    const errorJson = JSON.parse(errorBody);
                    errorMessage = errorJson.message || 'Unknown error';
                } catch (e) {
                    errorMessage = errorBody;
                }
                
                if (userResponse.status === 401) {
                    showToast('❌ Invalid token - Please generate a new one');
                    console.error('Token rejected:', errorMessage);
                    console.error('SOLUTION: Generate a new token at https://github.com/settings/tokens/new');
                    console.error('Required scopes: repo (full control)');
                } else if (userResponse.status === 403) {
                    showToast('❌ Token expired or rate limited');
                } else {
                    showToast('❌ GitHub API error: ' + errorMessage);
                }
                return;
            }

            const githubUser = await userResponse.json();
            console.log('GitHub user:', githubUser.login);
            console.log('User scopes:', userResponse.headers.get('x-oauth-scopes'));
            
            // Verify username matches
            if (githubUser.login.toLowerCase() !== username.toLowerCase()) {
                showToast('❌ Username does not match token owner');
                console.error('Expected:', username, 'Got:', githubUser.login);
                return;
            }

            // Store current user with GitHub info
            currentUser = {
                username: githubUser.login,
                name: githubUser.name || githubUser.login,
                email: githubUser.email,
                avatar: githubUser.avatar_url,
                token: token,
                role: 'user'
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            console.log('Login successful, showing app');
            showToast('✅ Login successful! Welcome ' + githubUser.login);
            showApp();
            
        } catch (error) {
            console.error('Login error:', error);
            showToast('❌ Authentication failed: ' + error.message);
        }
    }

    function handleLogout() {
        if (confirm('Logout? Your offers are saved locally.')) {
            localStorage.removeItem('currentUser');
            currentUser = null;
            location.reload();
        }
    }

    // ────────────────────────────
    // Offer Number & Date
    // ────────────────────────────
    function generateOfferNumber() {
        // Generate timestamp-based UUID: YYYYMMDDHHmm
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const timestamp = `${year}${month}${day}${hour}${minute}`;
        
        // Get client name - use full name with underscores
        const clientName = getVal('#clientName') || getVal('#clientCompany') || 'Client';
        const sanitizedName = clientName
            .trim()
            .replace(/[^a-zA-Z0-9\u0370-\u03FF\s]/g, '') // Keep alphanumeric + Greek chars
            .replace(/\s+/g, '_') // Replace spaces with underscore
            .substring(0, 30); // Limit length
        
        const offerNumber = `${timestamp}-${sanitizedName || 'Client'}`;
        const el = $('#offerNumber');
        if (el) el.value = offerNumber;
        
        return offerNumber;
    }

    function setTodayDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const el = $('#offerDate');
        if (el) el.value = `${yyyy}-${mm}-${dd}`;
    }

    function formatDateGR(dateStr) {
        if (!dateStr) return '—';
        const months = ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
            'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'];
        const d = new Date(dateStr);
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    // ────────────────────────────
    // Company Settings
    // ────────────────────────────
    async function loadCompanySettings() {
        // Step 1: start from hardcoded defaults, then try to overlay local JSON
        let cs = Object.assign({}, DEFAULT_COMPANY);
        try {
            const response = await fetch('company-settings.json?v=' + VERSION);
            if (response.ok) {
                const file = await response.json();
                const fromFile = file.companySettings || file;
                Object.keys(fromFile).forEach(k => { if (fromFile[k]) cs[k] = fromFile[k]; });
                if (file.customPaymentMethods?.length && !localStorage.getItem('customPaymentMethods')) {
                    localStorage.setItem('customPaymentMethods', JSON.stringify(file.customPaymentMethods));
                }
            }
        } catch (e) {
            console.log('Could not load company-settings.json, using built-in defaults.');
        }

        // Step 2: overlay with user-saved localStorage settings (non-empty values win)
        const saved = localStorage.getItem('companySettings');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(k => { if (data[k]) cs[k] = data[k]; });
            const badge = $('#companySavedBadge');
            if (badge) badge.style.display = '';
        }

        // Step 3: apply merged result to form
        setVal('#companyLogo',      cs.logo || cs.logoUrl || '');
        setVal('#companyName',      cs.name || cs.companyName || '');
        setVal('#companyPhone',     cs.phone || '');
        setVal('#companyEmail',     cs.email || '');
        setVal('#companyAddress',   cs.address || '');
        setVal('#companyAFM',       cs.afm || '');
        setVal('#companyDOY',       cs.doy || '');
        setVal('#companyGEMI',      cs.gemi || '');
        setVal('#companySignatory', cs.signatory || '');
        setVal('#companyTitle',     cs.title || '');
        setVal('#closingMessage',   cs.closingMessage || '');
        setVal('#page2Notes',       cs.page2Notes || cs.notes || '');
        setVal('#introTemplates',   cs.introTemplates || '');
        if (cs.banks) setVal('#companyBanks', cs.banks);
        previewLogoInForm(cs.logo || cs.logoUrl || '');

        populateIntroTemplates();
        updatePreview();
    }

    function setVal(sel, val) {
        const el = $(sel);
        if (el) el.value = val || '';
    }

    function getVal(sel) {
        const el = $(sel);
        return el ? el.value : '';
    }

    function previewLogoInForm(url) {
        const preview = $('#logoPreview');
        const img = $('#logoPreviewImg');
        if (preview && img) {
            if (url && url.trim()) {
                img.src = url;
                preview.classList.add('active');
            } else {
                preview.classList.remove('active');
            }
        }
    }

    function saveCompanySettings() {
        const data = {
            logo: getVal('#companyLogo'),
            name: getVal('#companyName'),
            phone: getVal('#companyPhone'),
            email: getVal('#companyEmail'),
            address: getVal('#companyAddress'),
            afm: getVal('#companyAFM'),
            doy: getVal('#companyDOY'),
            gemi: getVal('#companyGEMI'),
            signatory: getVal('#companySignatory'),
            title: getVal('#companyTitle'),
            banks: getVal('#companyBanks'),
            closing: getVal('#companyClosing'),
            closingMessage: getVal('#closingMessage'),
            page2Notes: getVal('#page2Notes'),
            introTemplates: getVal('#introTemplates')
        };
        localStorage.setItem('companySettings', JSON.stringify(data));
        const badge = $('#companySavedBadge');
        if (badge) badge.style.display = '';
        populateIntroTemplates(); // Refresh template dropdown
        showToast('✅ Στοιχεία εταιρείας αποθηκεύτηκαν!');
        updatePreview();
    }

    function exportSettings() {
        // Gather all settings
        const settings = {
            companySettings: JSON.parse(localStorage.getItem('companySettings') || '{}'),
            customPaymentMethods: JSON.parse(localStorage.getItem('customPaymentMethods') || '[]'),
            imageUrlHistory: JSON.parse(localStorage.getItem('imageUrlHistory') || '[]'),
            exportDate: new Date().toISOString(),
            version: '202603042240'
        };
        
        // Create JSON file
        const json = JSON.stringify(settings, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Download file
        const a = document.createElement('a');
        a.href = url;
        a.download = `macworks-settings-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('📤 Settings exported!');
    }

    function importSettings() {
        const fileInput = $('#importSettingsFile');
        if (!fileInput) return;
        
        fileInput.click();
    }

    function handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);

                if (settings.customPaymentMethods) {
                    localStorage.setItem('customPaymentMethods', JSON.stringify(settings.customPaymentMethods));
                    customPaymentMethods = settings.customPaymentMethods;
                    loadCustomOptions();
                }
                if (settings.imageUrlHistory) {
                    localStorage.setItem('imageUrlHistory', JSON.stringify(settings.imageUrlHistory));
                    imageUrlHistory = settings.imageUrlHistory;
                }

                // Apply company settings live — no page reload needed
                const cs = settings.companySettings;
                if (cs) {
                    localStorage.setItem('companySettings', JSON.stringify(cs));
                    setVal('#companyLogo',      cs.logo || cs.logoUrl || '');
                    setVal('#companyName',      cs.name || cs.companyName || '');
                    setVal('#companyPhone',     cs.phone || '');
                    setVal('#companyEmail',     cs.email || '');
                    setVal('#companyAddress',   cs.address || '');
                    setVal('#companyAFM',       cs.afm || '');
                    setVal('#companyDOY',       cs.doy || '');
                    setVal('#companyGEMI',      cs.gemi || '');
                    setVal('#companySignatory', cs.signatory || '');
                    setVal('#companyTitle',     cs.title || '');
                    setVal('#closingMessage',   cs.closingMessage || '');
                    setVal('#page2Notes',       cs.page2Notes || cs.notes || '');
                    setVal('#introTemplates',   cs.introTemplates || '');
                    if (cs.banks) setVal('#companyBanks', cs.banks);
                    previewLogoInForm(cs.logo || cs.logoUrl || '');
                    const badge = $('#companySavedBadge');
                    if (badge) badge.style.display = '';
                    populateIntroTemplates();
                }

                showToast('✅ Settings imported!');
                updatePreview();
            } catch (error) {
                showToast('❌ Invalid JSON file!');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);

        event.target.value = '';
    }
    
    function applyCompanySettingsObject(cs) {
        localStorage.removeItem('companySettings');
        localStorage.removeItem('customPaymentMethods');

        const badge = $('#companySavedBadge');
        if (badge) badge.style.display = 'none';

        setVal('#companyLogo',      cs.logo || cs.logoUrl || '');
        setVal('#companyName',      cs.name || cs.companyName || '');
        setVal('#companyPhone',     cs.phone || '');
        setVal('#companyEmail',     cs.email || '');
        setVal('#companyAddress',   cs.address || '');
        setVal('#companyAFM',       cs.afm || '');
        setVal('#companyDOY',       cs.doy || '');
        setVal('#companyGEMI',      cs.gemi || '');
        setVal('#companySignatory', cs.signatory || '');
        setVal('#companyTitle',     cs.title || '');
        setVal('#closingMessage',   cs.closingMessage || '');
        setVal('#page2Notes',       cs.page2Notes || cs.notes || '');
        setVal('#introTemplates',   cs.introTemplates || '');
        if (cs.banks) setVal('#companyBanks', cs.banks);
        previewLogoInForm(cs.logo || cs.logoUrl || '');
        populateIntroTemplates();

        if (cs.customPaymentMethods?.length) {
            localStorage.setItem('customPaymentMethods', JSON.stringify(cs.customPaymentMethods));
        }

        showToast('✅ Reset to defaults from company-settings.json!');
        updatePreview();
    }

    function resetToDefaults() {
        if (!confirm('Reset to defaults?\n\nThis will DELETE your saved company settings and restore the built-in defaults.')) {
            return;
        }
        applyCompanySettingsObject(DEFAULT_COMPANY);
    }

    // ────────────────────────────
    // Custom Options
    // ────────────────────────────
    function loadCustomOptions() {
        const paymentSelect = $('#paymentMethod');
        if (paymentSelect) {
            customPaymentMethods.forEach(method => {
                if (!Array.from(paymentSelect.options).some(o => o.value === method)) {
                    const opt = document.createElement('option');
                    opt.value = method;
                    opt.textContent = method;
                    paymentSelect.insertBefore(opt, paymentSelect.lastElementChild);
                }
            });
        }
    }

    window.saveCustomPayment = function () {
        const input = $('#customPaymentInput');
        if (!input) return;
        const value = input.value.trim();
        if (value) {
            customPaymentMethods.push(value);
            localStorage.setItem('customPaymentMethods', JSON.stringify(customPaymentMethods));
            const select = $('#paymentMethod');
            if (select) {
                const opt = document.createElement('option');
                opt.value = value;
                opt.textContent = value;
                select.insertBefore(opt, select.lastElementChild);
                select.value = value;
            }
            input.value = '';
            const row = $('#customPaymentRow');
            if (row) row.classList.remove('active');
            updatePreview();
            showToast('✅ Νέος τρόπος πληρωμής αποθηκεύτηκε!');
        }
    };

    window.cancelCustomPayment = function () {
        const input = $('#customPaymentInput');
        const row = $('#customPaymentRow');
        const select = $('#paymentMethod');
        if (input) input.value = '';
        if (row) row.classList.remove('active');
        if (select) select.value = 'Τραπεζική Κατάθεση';
    };

    // ────────────────────────────
    // Items Management
    // ────────────────────────────
    function addItem() {
        const id = Date.now() + Math.random();
        console.log('➕ addItem() called - Creating item with ID:', id);
        items.push({
            id,
            category: 'device',
            appleType: 'Mac',
            appleModel: '',
            microsoft365: '',
            serviceType: '',
            brand: '',
            model: '',
            description: '',
            quantity: 1,
            price: 0,
            discount: 0,
            margin: 0,
            priceIncludesVAT: true,
            warranty: '24 μήνες',
            imageUrl: '',
            customModel: ''
        });
        renderItems();
        updatePreview();
        
        // Auto-fill intro text if empty
        autoFillIntroText();
    }

    // Auto-fill intro text based on first item's category
    function autoFillIntroText() {
        const introTextEl = $('#introText');
        if (!introTextEl || introTextEl.value.trim()) return; // Skip if already has text
        
        if (items.length === 0) return;
        
        const firstItem = items[0];
        const category = firstItem.category;
        
        // Get templates
        const templatesText = getVal('#introTemplates');
        const templates = parseIntroTemplates(templatesText);
        
        // Find matching template
        const template = templates.find(t => t.category === category);
        if (template) {
            introTextEl.value = template.text;
            updatePreview();
        }
    }

    // Parse intro templates from format: category|action|text
    function parseIntroTemplates(text) {
        if (!text) return getDefaultIntroTemplates();
        
        const lines = text.split('\n').filter(l => l.trim());
        return lines.map(line => {
            const parts = line.split('|');
            if (parts.length >= 3) {
                return {
                    category: parts[0].trim(),
                    action: parts[1].trim(),
                    text: parts.slice(2).join('|').trim()
                };
            }
            return null;
        }).filter(Boolean);
    }

    // Populate intro template dropdown
    function populateIntroTemplates() {
        const selectEl = $('#introTemplateSelect');
        if (!selectEl) return;
        
        const templatesText = getVal('#introTemplates');
        const templates = parseIntroTemplates(templatesText);
        
        // Clear existing options except first
        selectEl.innerHTML = '<option value="">-- Επιλέξτε πρότυπο --</option>';
        
        // Category labels
        const categoryLabels = {
            'apple': '🍎 Apple Products',
            'pc': '💻 PC / Laptop',
            'network': '🌐 Network Equipment',
            'microsoft365': '☁️ Microsoft 365 / Cloud',
            'service': '🔧 Υπηρεσία / Επισκευή',
            'accessory': '🎧 Αξεσουάρ',
            'custompc': '🖥️ Custom PC Build',
            'other': '📦 Άλλο'
        };
        
        // Add options
        templates.forEach((template, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            const label = categoryLabels[template.category] || template.category;
            opt.textContent = `${label} (${template.action})`;
            selectEl.appendChild(opt);
        });
    }

    // Apply selected intro template
    function applyIntroTemplate() {
        const selectEl = $('#introTemplateSelect');
        const introTextEl = $('#introText');
        if (!selectEl || !introTextEl) return;
        
        const selectedIndex = selectEl.value;
        if (selectedIndex === '') return;
        
        const templatesText = getVal('#introTemplates');
        const templates = parseIntroTemplates(templatesText);
        const template = templates[parseInt(selectedIndex)];
        
        if (template) {
            introTextEl.value = template.text;
            updatePreview();
            showToast('✅ Πρότυπο εφαρμόστηκε!');
        }
        
        // Reset dropdown
        selectEl.value = '';
    }

    // Default intro templates
    function getDefaultIntroTemplates() {
        return [
            { category: 'apple', action: 'αγορά', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την αγορά Apple προϊόντων.' },
            { category: 'service', action: 'επισκευή', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την επισκευή/αναβάθμιση της συσκευής σας.' },
            { category: 'pc', action: 'αγορά', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την αγορά υπολογιστή.' },
            { category: 'network', action: 'αγορά', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την αγορά εξοπλισμού δικτύου.' },
            { category: 'microsoft365', action: 'συνδρομή', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για συνδρομές cloud υπηρεσιών.' },
            { category: 'custompc', action: 'αγορά', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την κατασκευή custom υπολογιστή.' },
            { category: 'accessory', action: 'αγορά', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά για την αγορά αξεσουάρ.' },
            { category: 'other', action: 'αγορά', text: 'Κατόπιν συνεννόησης μας και έχοντας λάβει γνώση των αναγκών σας, παραθέτω την οικονομική μου προσφορά.' }
        ];
    }

    // Calculate effective price with margin and VAT
    function calculateItemPrice(item, globalVatRate = 24) {
        // ΤΙΜΗ = Always NET price (without VAT)
        let netPrice = parseFloat(item.price) || 0;
        const discount = parseFloat(item.discount) || 0;
        const margin = parseFloat(item.margin) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const addVAT = item.addVAT !== false; // Default: add VAT
        
        // Step 1: Apply DISCOUNT to NET price
        const priceAfterDiscount = netPrice * (1 - discount / 100);
        
        // Step 2: Apply MARGIN (περιθώριο)
        const priceWithMargin = priceAfterDiscount * (1 + margin / 100);
        
        // Step 3: Calculate line total (before VAT)
        const netLineTotal = priceWithMargin * quantity;
        
        // Step 4: Add VAT ONLY if "Ναι" (addVAT = true)
        if (addVAT && globalVatRate > 0) {
            const vatAmount = netLineTotal * (globalVatRate / 100);
            const lineTotal = netLineTotal + vatAmount;
            
            return {
                unitNetPrice: priceWithMargin,  // Unit price after discount+margin (no VAT)
                unitPriceWithVAT: priceWithMargin * (1 + globalVatRate / 100),  // Unit with VAT
                netLineTotal: netLineTotal,  // Line total without VAT
                vatAmount: vatAmount,  // VAT amount
                lineTotal: lineTotal,  // Final line total with VAT
                marginAdded: priceAfterDiscount * (margin / 100),  // Margin amount
                hasVAT: true
            };
        } else {
            // NO VAT added (ΠΡΟΣΘΗΚΗ ΦΠΑ = "Όχι")
            return {
                unitNetPrice: priceWithMargin,  // Same as line price (no VAT)
                unitPriceWithVAT: priceWithMargin,  // Same (no VAT added)
                netLineTotal: netLineTotal,  // Line total
                vatAmount: 0,  // No VAT
                lineTotal: netLineTotal,  // Final = net (no VAT)
                marginAdded: priceAfterDiscount * (margin / 100),  // Margin amount
                hasVAT: false
            };
        }
    }

    function removeItem(id) {
        items = items.filter(item => item.id !== id);
        if (items.length === 0) addItem();
        renderItems();
        updatePreview();
    }

    function updateItem(id, field, value) {
        const item = items.find(i => i.id === id);
        if (item) {
            if (field === 'quantity' || field === 'price' || field === 'discount' || field === 'setupFee' || field === 'margin') {
                item[field] = parseFloat(value) || 0;
            } else if (field === 'addVAT') {
                item[field] = value === 'true' || value === true;
            } else if (field === 'priceIncludesVAT') {
                // Legacy support - convert to addVAT
                item.addVAT = value === 'true' || value === true;
            } else if (field === 'imageUrl' && value.trim()) {
                // Track image URL history
                item[field] = value;
                addToImageHistory(value.trim());
            } else {
                item[field] = value;
            }

            // Initialize pcComponents if switching to custompc
            if (field === 'category' && value === 'custompc' && !item.pcComponents) {
                item.pcComponents = {
                    cpu: { name: '', price: 0 },
                    gpu: { name: '', price: 0 },
                    ram: { name: '', price: 0 },
                    storage: { name: '', price: 0 },
                    motherboard: { name: '', price: 0 },
                    psu: { name: '', price: 0 },
                    case: { name: '', price: 0 },
                    cooler: { name: '', price: 0 },
                    os: { name: '', price: 0 },
                    extra: { name: '', price: 0 }
                };
            }

            // Only re-render on structural changes
            if (field === 'category' || field === 'appleType' ||
                (field === 'appleModel' && value === '__custom__') ||
                (field === 'microsoft365' && value === '__custom__') ||
                (field === 'serviceType' && value === '__custom__')) {
                if (field === 'category') {
                    item.brand = '';
                    item.model = '';
                    item.appleType = 'Mac';
                    item.appleModel = '';
                    item.microsoft365 = '';
                    item.serviceType = '';
                    item.customModel = '';
                }
                renderItems();
            }
            
            // Update PC totals if custompc category
            if (item.category === 'custompc') {
                updatePCTotals(item);
            }
        }
        updatePreview();
    }

    function updatePCComponent(itemId, component, field, value) {
        const item = items.find(i => i.id === itemId);
        if (!item || !item.pcComponents) return;
        
        if (!item.pcComponents[component]) {
            item.pcComponents[component] = { name: '', price: 0 };
        }
        
        if (field === 'price') {
            item.pcComponents[component][field] = parseFloat(value) || 0;
        } else {
            item.pcComponents[component][field] = value;
        }
        
        updatePCTotals(item);
        updatePreview();
    }

    function addToImageHistory(url) {
        if (!url || url === '') return;
        
        // Remove if already exists (to move to top)
        imageUrlHistory = imageUrlHistory.filter(u => u !== url);
        
        // Add to beginning
        imageUrlHistory.unshift(url);
        
        // Keep only last 10
        if (imageUrlHistory.length > 10) {
            imageUrlHistory = imageUrlHistory.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('imageUrlHistory', JSON.stringify(imageUrlHistory));
    }

    function updatePCTotals(item) {
        if (!item.pcComponents) return;
        
        let componentsTotal = 0;
        Object.values(item.pcComponents).forEach(comp => {
            componentsTotal += (comp.price || 0);
        });
        
        const setupFee = item.setupFee || 0;
        const discount = item.discount || 0;
        const discountedSetup = setupFee * (1 - discount / 100);
        const subtotal = componentsTotal + discountedSetup;
        const totalWithVAT = subtotal * 1.24;
        
        // Update the item's price to the total
        item.price = totalWithVAT;
        
        // Update display elements if they exist
        const compEl = $(`#pc-components-total-${item.id}`);
        const subEl = $(`#pc-subtotal-${item.id}`);
        const totalEl = $(`#pc-total-${item.id}`);
        
        if (compEl) compEl.textContent = formatCurrency(componentsTotal);
        if (subEl) subEl.textContent = formatCurrency(subtotal);
        if (totalEl) totalEl.textContent = formatCurrency(totalWithVAT);
    }

    function renderItems() {
        console.log('🔄 renderItems() called - items count:', items.length);
        const container = $('#itemsList');
        if (!container) {
            console.error('❌ #itemsList container not found!');
            return;
        }

        container.innerHTML = items.map((item, index) => `
            <div class="item-card" data-id="${item.id}" draggable="true">
                <div class="item-card-header">
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                        <span class="drag-handle" title="Σύρετε για αναδιάταξη">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="4" y1="8" x2="20" y2="8"></line>
                                <line x1="4" y1="16" x2="20" y2="16"></line>
                            </svg>
                        </span>
                        <span class="item-number">ΣΤΟΙΧΕΙΟ #${index + 1}</span>
                    </div>
                    <button class="btn-danger-sm" onclick="window._removeItem(${item.id})" title="Αφαίρεση">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                </div>
                
                <div class="form-group">
                    <label>Κατηγορία</label>
                    <select onchange="window._updateItem(${item.id}, 'category', this.value)">
                        ${mainCategories.map(c => `<option value="${c.value}" ${c.value === item.category ? 'selected' : ''}>${c.label}</option>`).join('')}
                    </select>
                </div>

                ${renderCategoryFields(item)}

                <div class="form-row">
                    <div class="form-group">
                        <label>Ποσότητα</label>
                        <input type="number" value="${item.quantity}" min="1"
                            oninput="window._updateItem(${item.id}, 'quantity', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Τιμή (€)</label>
                        <input type="number" value="${item.price}" min="0" step="0.01"
                            oninput="window._updateItem(${item.id}, 'price', this.value)">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Έκπτωση %</label>
                        <input type="number" value="${item.discount}" min="0" max="100"
                            oninput="window._updateItem(${item.id}, 'discount', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Περιθώριο %</label>
                        <input type="number" value="${item.margin || 0}" min="0" max="100" step="0.1"
                            oninput="window._updateItem(${item.id}, 'margin', this.value)">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Προσθήκη ΦΠΑ;</label>
                        <select onchange="window._updateItem(${item.id}, 'addVAT', this.value)">
                            <option value="true" ${(item.addVAT !== false) ? 'selected' : ''}>✓ Ναι (Προσθήκη ${$('#vatRate')?.value || 24}%)</option>
                            <option value="false" ${(item.addVAT === false) ? 'selected' : ''}>✗ Όχι (Χωρίς ΦΠΑ)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>ΦΠΑ % (προσφορά)</label>
                        <input type="number" value="${$('#vatRate')?.value || 24}" min="0" max="100" readonly
                            style="background:var(--bg-secondary);cursor:not-allowed;" 
                            title="Αλλάξτε το ΦΠΑ στα Στοιχεία Προσφοράς">
                    </div>
                </div>
                <div class="form-hint" style="font-size:0.75rem;color:var(--text-muted);margin-top:-0.5rem;margin-bottom:1rem;">
                    💡 <strong>ΤΙΜΗ = Καθαρή τιμή (NET)</strong><br>
                    Υπολογισμός: NET × (1 - ΕΚΠΤΩΣΗ%) × (1 + ΠΕΡΙΘΩΡΙΟ%) × [+ ΦΠΑ% αν "Ναι"]
                </div>

                ${item.category !== 'microsoft365' ? `
                <div class="form-group">
                    <label>Εγγύηση</label>
                    <select onchange="window._updateItem(${item.id}, 'warranty', this.value)">
                        ${warrantyOptions(item.warranty)}
                    </select>
                </div>
                ` : ''}

                <div class="form-group">
                    <label>URL Εικόνας (προαιρετικό)</label>
                    <input type="url" value="${escapeHtml(item.imageUrl || '')}" placeholder="https://..."
                        list="imageHistory"
                        oninput="window._updateItem(${item.id}, 'imageUrl', this.value)">
                    <datalist id="imageHistory">
                        ${imageUrlHistory.map(url => `<option value="${escapeHtml(url)}">`).join('')}
                    </datalist>
                </div>
            </div>
        `).join('');
        
        // Initialize drag-and-drop for reordering
        console.log('🎯 About to call initDragAndDrop...');
        initDragAndDrop();
    }

    function renderCategoryFields(item) {
        switch (item.category) {
            case 'apple':
                return `
                    <div class="form-row">
                        <div class="form-group">
                            <label>Τύπος</label>
                            <select onchange="window._updateItem(${item.id}, 'appleType', this.value)">
                                ${Object.keys(appleModels).map(t => `<option value="${t}" ${t === item.appleType ? 'selected' : ''}>${t}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Μοντέλο</label>
                            <select onchange="window._updateItem(${item.id}, 'appleModel', this.value)">
                                <option value="">— Επιλέξτε —</option>
                                ${(appleModels[item.appleType] || []).map(m => `<option value="${m}" ${m === item.appleModel ? 'selected' : ''}>${m}</option>`).join('')}
                                <option value="__custom__">+ Άλλο...</option>
                            </select>
                        </div>
                    </div>
                    ${item.appleModel === '__custom__' ? `
                    <div class="form-group">
                        <label>Custom Μοντέλο</label>
                        <input type="text" value="${escapeHtml(item.customModel || '')}" placeholder="Πληκτρολογήστε..."
                            oninput="window._updateItem(${item.id}, 'customModel', this.value)">
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label>Περιγραφή</label>
                        <textarea rows="2" placeholder="π.χ. M4 Max, 32GB, 1TB"
                            oninput="window._updateItem(${item.id}, 'description', this.value)">${escapeHtml(item.description || '')}</textarea>
                    </div>
                `;

            case 'microsoft365':
                return `
                    <div class="form-group">
                        <label>Προϊόν</label>
                        <select onchange="window._updateItem(${item.id}, 'microsoft365', this.value)">
                            <option value="">— Επιλέξτε —</option>
                            ${microsoft365Products.map(p => `<option value="${p}" ${p === item.microsoft365 ? 'selected' : ''}>${p}</option>`).join('')}
                            <option value="__custom__">+ Άλλο...</option>
                        </select>
                    </div>
                    ${item.microsoft365 === '__custom__' ? `
                    <div class="form-group">
                        <label>Custom Προϊόν</label>
                        <input type="text" value="${escapeHtml(item.customModel || '')}" placeholder="Όνομα..."
                            oninput="window._updateItem(${item.id}, 'customModel', this.value)">
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label>Περίοδος / Άδειες</label>
                        <input type="text" value="${escapeHtml(item.description || '')}" placeholder="π.χ. 1 έτος / 5 χρήστες"
                            oninput="window._updateItem(${item.id}, 'description', this.value)">
                    </div>
                `;

            case 'service':
                return `
                    <div class="form-group">
                        <label>Τύπος Υπηρεσίας</label>
                        <select onchange="window._updateItem(${item.id}, 'serviceType', this.value)">
                            <option value="">— Επιλέξτε —</option>
                            ${serviceTypes.map(s => `<option value="${s}" ${s === item.serviceType ? 'selected' : ''}>${s}</option>`).join('')}
                            <option value="__custom__">+ Άλλο...</option>
                        </select>
                    </div>
                    ${item.serviceType === '__custom__' ? `
                    <div class="form-group">
                        <label>Custom Υπηρεσία</label>
                        <input type="text" value="${escapeHtml(item.customModel || '')}" placeholder="Περιγραφή..."
                            oninput="window._updateItem(${item.id}, 'customModel', this.value)">
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label>Λεπτομέρειες</label>
                        <input type="text" value="${escapeHtml(item.description || '')}" placeholder="π.χ. για MacBook Pro 2021"
                            oninput="window._updateItem(${item.id}, 'description', this.value)">
                    </div>
                `;

            case 'custompc':
                // Initialize components if not exists
                if (!item.pcComponents) {
                    item.pcComponents = {
                        cpu: { name: '', price: 0 },
                        gpu: { name: '', price: 0 },
                        ram: { name: '', price: 0 },
                        storage: { name: '', price: 0 },
                        motherboard: { name: '', price: 0 },
                        psu: { name: '', price: 0 },
                        case: { name: '', price: 0 },
                        cooler: { name: '', price: 0 },
                        os: { name: '', price: 0 },
                        extra: { name: '', price: 0 }
                    };
                }
                
                const components = [
                    { key: 'cpu', label: 'CPU' },
                    { key: 'gpu', label: 'GPU' },
                    { key: 'ram', label: 'RAM' },
                    { key: 'storage', label: 'Storage' },
                    { key: 'motherboard', label: 'Motherboard' },
                    { key: 'psu', label: 'PSU' },
                    { key: 'case', label: 'Case' },
                    { key: 'cooler', label: 'Cooler' },
                    { key: 'os', label: 'OS' },
                    { key: 'extra', label: 'Extra' }
                ];
                
                return `
                    <div class="form-group">
                        <label>Τίτλος PC</label>
                        <input type="text" value="${escapeHtml(item.brand || '')}" placeholder="π.χ. Video / Graphics Editing PC"
                            oninput="window._updateItem(${item.id}, 'brand', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Υπότιτλος</label>
                        <input type="text" value="${escapeHtml(item.model || '')}" placeholder="π.χ. High-End Workstation"
                            oninput="window._updateItem(${item.id}, 'model', this.value)">
                    </div>
                    
                    <div style="background:var(--bg-tertiary);padding:0.8rem;border-radius:6px;margin-top:0.8rem">
                        <h4 style="margin:0 0 0.6rem;font-size:0.75rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase">Εξαρτήματα:</h4>
                        ${components.map(comp => `
                            <div style="background:var(--bg-secondary);padding:0.5rem;border-radius:4px;margin-bottom:0.4rem">
                                <div style="font-size:0.7rem;font-weight:500;color:var(--text-muted);margin-bottom:0.3rem">${comp.label}:</div>
                                <input type="text" value="${escapeHtml((item.pcComponents[comp.key]?.name || ''))}" 
                                    placeholder="Περιγραφή..." style="margin-bottom:0.3rem;font-size:0.8rem"
                                    oninput="window._updatePCComponent(${item.id}, '${comp.key}', 'name', this.value)">
                                <input type="number" value="${item.pcComponents[comp.key]?.price || 0}" 
                                    placeholder="Τιμή €" min="0" step="0.01" style="font-size:0.8rem"
                                    oninput="window._updatePCComponent(${item.id}, '${comp.key}', 'price', this.value)">
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="form-row" style="margin-top:0.8rem">
                        <div class="form-group">
                            <label>Setup Fee</label>
                            <select onchange="window._updateItem(${item.id}, 'setupFee', this.value)">
                                <option value="0" ${(item.setupFee || 0) === 0 ? 'selected' : ''}>Χωρίς</option>
                                <option value="60" ${item.setupFee === 60 ? 'selected' : ''}>60€ Small</option>
                                <option value="80" ${item.setupFee === 80 ? 'selected' : ''}>80€ Medium</option>
                                <option value="100" ${item.setupFee === 100 ? 'selected' : ''}>100€ Large</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Έκπτωση % (Setup)</label>
                            <input type="number" value="${item.discount || 0}" min="0" max="100"
                                oninput="window._updateItem(${item.id}, 'discount', this.value)">
                        </div>
                    </div>
                    
                    <div style="background:var(--azul-subtle);padding:0.6rem;border-radius:4px;margin-top:0.6rem;font-size:0.8rem">
                        <div style="color:var(--text-secondary)">Εξαρτήματα: <strong id="pc-components-total-${item.id}">0,00 €</strong></div>
                        <div style="color:var(--text-secondary)">Σύνολο: <strong id="pc-subtotal-${item.id}">0,00 €</strong></div>
                        <div style="color:var(--azul-dark);font-weight:600;margin-top:0.3rem">Τελική (+ΦΠΑ): <strong id="pc-total-${item.id}">0,00 €</strong></div>
                    </div>
                `;

            default:
                return `
                    <div class="form-row">
                        <div class="form-group">
                            <label>Μάρκα</label>
                            <input type="text" value="${escapeHtml(item.brand)}" placeholder="π.χ. HP, Dell"
                                oninput="window._updateItem(${item.id}, 'brand', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Μοντέλο</label>
                            <input type="text" value="${escapeHtml(item.model)}" placeholder="π.χ. ProDesk 600"
                                oninput="window._updateItem(${item.id}, 'model', this.value)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Περιγραφή / Specs</label>
                        <textarea rows="3" placeholder="CPU: Intel i5&#10;RAM: 8GB&#10;Storage: 256GB"
                            oninput="window._updateItem(${item.id}, 'description', this.value)">${escapeHtml(item.description || '')}</textarea>
                    </div>
                `;
        }
    }
    
    // Drag-and-drop functionality for reordering items
    let draggedItemId = null;
    
    function initDragAndDrop() {
        const itemCards = document.querySelectorAll('.item-card');
        
        console.log('🔧 initDragAndDrop called - Found', itemCards.length, 'item cards');
        
        if (itemCards.length === 0) {
            console.warn('⚠️ No item cards found! Drag-drop not initialized.');
            return;
        }
        
        itemCards.forEach((card, index) => {
            console.log(`  Attaching listeners to card ${index + 1}, ID:`, card.dataset.id);
            
            card.addEventListener('dragstart', (e) => {
                draggedItemId = parseFloat(card.dataset.id);
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                console.log('🎯 Drag start - Item ID:', draggedItemId);
            });
            
            card.addEventListener('dragend', (e) => {
                card.classList.remove('dragging');
                draggedItemId = null;
                // Remove all drag-over classes
                document.querySelectorAll('.item-card').forEach(c => {
                    c.classList.remove('drag-over');
                });
                console.log('✋ Drag end');
            });
            
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                const currentId = parseFloat(card.dataset.id);
                if (draggedItemId !== currentId) {
                    card.classList.add('drag-over');
                }
            });
            
            card.addEventListener('dragleave', (e) => {
                card.classList.remove('drag-over');
            });
            
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove('drag-over');
                
                const dropItemId = parseFloat(card.dataset.id);
                
                if (draggedItemId && draggedItemId !== dropItemId) {
                    console.log('📍 Drop - Moving item', draggedItemId, 'to position of', dropItemId);
                    
                    // Find indices in items array
                    const draggedIndex = items.findIndex(item => item.id === draggedItemId);
                    const dropIndex = items.findIndex(item => item.id === dropItemId);
                    
                    console.log('📊 Indices - From:', draggedIndex, 'To:', dropIndex);
                    
                    if (draggedIndex !== -1 && dropIndex !== -1) {
                        // Reorder items array
                        const movedItem = items.splice(draggedIndex, 1)[0];
                        items.splice(dropIndex, 0, movedItem);
                        
                        console.log('✅ Items reordered!', items.map((i, idx) => `#${idx + 1}: ${i.brand || i.model || 'Item'}`));
                        
                        // Re-render
                        renderItems();
                        updatePreview();
                        
                        showToast('✅ Στοιχείο μετακινήθηκε!');
                    } else {
                        console.error('❌ Could not find items in array!');
                    }
                } else {
                    console.log('⏭️ Drop ignored (same position)');
                }
            });
        });
    }

    function warrantyOptions(selected) {
        const opts = ['6 μήνες', '12 μήνες', '24 μήνες', '36 μήνες', 'Χωρίς εγγύηση'];
        return opts.map(o => `<option value="${o}" ${o === selected ? 'selected' : ''}>${o}</option>`).join('');
    }

    // ────────────────────────────
    // Preview Update
    // ────────────────────────────
    function updatePreview() {
        // Company logo
        const logoUrl = getVal('#companyLogo').trim();
        previewLogoInForm(logoUrl);

        const logoImg = $('#previewLogoImg');
        const logoContainer = $('#previewCompanyLogo');
        if (logoImg && logoContainer) {
            if (logoUrl) {
                logoImg.src = logoUrl;
                logoContainer.style.display = 'block';
            } else {
                logoContainer.style.display = 'none';
            }
        }

        // Company details
        const companyDetailsEl = $('#previewCompanyDetails');
        if (companyDetailsEl) {
            const parts = [
                [getVal('#companyEmail'), getVal('#companyPhone')].filter(Boolean).join(' • '),
                [
                    getVal('#companyAFM') ? `ΑΦΜ: ${getVal('#companyAFM')}` : '', 
                    getVal('#companyDOY') ? `ΔΟΥ: ${getVal('#companyDOY')}` : '',
                    getVal('#companyGEMI') ? `ΓΕΜΗ: ${getVal('#companyGEMI')}` : ''
                ].filter(Boolean).join(' • '),
                getVal('#companyAddress')
            ].filter(Boolean).join('\n');
            companyDetailsEl.textContent = parts;
        }

        // Offer number - show only timestamp for client (not the full internal ID)
        const offerNumEl = $('#previewOfferNumber');
        if (offerNumEl) {
            const fullNumber = getVal('#offerNumber');
            // Extract timestamp part (before dash)
            const displayNumber = fullNumber.split('-')[0] || fullNumber;
            offerNumEl.textContent = displayNumber;
        }

        // Client
        const clientNameEl = $('#previewClientName');
        if (clientNameEl) clientNameEl.textContent = getVal('#clientName').trim() || '[Πελάτης]';

        // Date
        const dateEl = $('#previewCityDate');
        if (dateEl) dateEl.textContent = `Αθήνα, ${formatDateGR(getVal('#offerDate'))}`;

        // Intro with placeholder replacement
        let introText = getVal('#introText').trim();
        const introEl = $('#previewIntro');
        const introSize = getVal('#introTextSize') || 'normal';
        
        if (introEl) {
            // Apply size class
            introEl.className = `pdf-intro size-${introSize}`;
            
            if (introText) {
                // Get first item category and action from templates
                if (items.length > 0) {
                    const firstItem = items[0];
                    const category = firstItem.category;
                    const templatesText = getVal('#introTemplates');
                    const templates = parseIntroTemplates(templatesText);
                    const template = templates.find(t => t.category === category);
                    
                    // Replace placeholders
                    if (template) {
                        introText = introText.replace(/\{action\}/g, template.action);
                    }
                    
                    // Category names mapping
                    const categoryNames = {
                        'apple': 'Apple προϊόντων',
                        'pc': 'υπολογιστή',
                        'network': 'εξοπλισμού δικτύου',
                        'microsoft365': 'cloud υπηρεσιών',
                        'service': 'επισκευής/αναβάθμισης',
                        'accessory': 'αξεσουάρ',
                        'custompc': 'custom PC',
                        'other': 'προϊόντων'
                    };
                    
                    introText = introText.replace(/\{category\}/g, categoryNames[category] || 'προϊόντων');
                }
                
                introEl.textContent = introText;
                introEl.style.display = '';
            } else {
                introEl.style.display = 'none';
            }
        }

        // Client details
        updateClientRow('previewClientCompany', 'clientCompany', 'previewClientCompanyRow');
        updateClientRow('previewClientPhone', 'clientPhone', 'previewClientPhoneRow');
        updateClientRow('previewClientEmail', 'clientEmail', 'previewClientEmailRow');
        updateClientRow('previewClientAddress', 'clientAddress', 'previewClientAddressRow');
        updateClientRow('previewClientAFM', 'clientAFM', 'previewClientAFMRow');
        updateClientRow('previewClientDOY', 'clientDOY', 'previewClientDOYRow');

        const hasClient = ['clientCompany', 'clientPhone', 'clientEmail', 'clientAddress', 'clientAFM', 'clientDOY']
            .some(id => getVal(`#${id}`).trim());
        const clientSection = $('#previewClientDetailsSection');
        if (clientSection) clientSection.style.display = hasClient ? '' : 'none';

        // Items
        renderPreviewItems();

        // Terms
        const validity = parseInt(getVal('#offerValidity'), 10) || 7;
        const vatRateStr = getVal('#vatRate');
        const vatRate = vatRateStr !== '' ? parseFloat(vatRateStr) : 24;

        const paymentEl = $('#previewPayment');
        if (paymentEl) paymentEl.textContent = getVal('#paymentMethod');

        const validityEl = $('#previewValidity');
        if (validityEl) validityEl.textContent = `${validity} ημέρες`;

        const validity2El = $('#previewValidityDays2');
        if (validity2El) validity2El.textContent = validity;

        const vatEl = $('#previewVatPercent');
        if (vatEl) vatEl.textContent = vatRate;

        // Notes
        const notes = getVal('#offerNotes').trim();
        const notesSection = $('#previewNotesSection');
        const notesEl = $('#previewNotes');
        if (notesSection && notesEl) {
            if (notes) {
                notesSection.style.display = '';
                notesEl.textContent = notes;
            } else {
                notesSection.style.display = 'none';
            }
        }

        // Page 2 (if exists)
        updatePage2();
    }

    function updateClientRow(previewId, inputId, rowId) {
        const value = getVal(`#${inputId}`).trim();
        const previewEl = $(`#${previewId}`);
        const rowEl = $(`#${rowId}`);
        if (previewEl) previewEl.textContent = value;
        if (rowEl) rowEl.style.display = value ? '' : 'none';
    }

    function updatePage2() {
        const companyName = getVal('#companyName');
        const signatory = getVal('#companySignatory');
        const title = getVal('#companyTitle');
        const banks = getVal('#companyBanks');
        const vatRateStr2 = getVal('#vatRate');
        const vatRate = vatRateStr2 !== '' ? parseFloat(vatRateStr2) : 24;
        const validity = parseInt(getVal('#offerValidity'), 10) || 7;

        const el1 = $('#previewCompanyName2');
        if (el1) el1.textContent = companyName;

        // Signatory - check if enabled
        const enableSignatory = $('#enableSignatory')?.checked !== false;
        const signatoryContainer = $('#previewSignatory2')?.parentElement;
        const el2 = $('#previewSignatory2');
        if (el2) {
            el2.textContent = signatory;
            if (signatoryContainer) {
                signatoryContainer.style.display = enableSignatory ? '' : 'none';
            }
        }

        // Title - check if enabled  
        const enableTitle = $('#enableTitle')?.checked !== false;
        const el3 = $('#previewTitle2');
        if (el3) {
            el3.textContent = title;
            el3.style.display = enableTitle ? '' : 'none';
        }

        const el4 = $('#previewVat2');
        if (el4) el4.textContent = vatRate;

        const el5 = $('#previewValidityDays3');
        if (el5) el5.textContent = validity;

        // Update closing message
        const closingMsg = getVal('#closingMessage');
        const closingEl = $('#previewClosingMessage');
        if (closingEl && closingMsg) {
            // Replace {company} placeholder with actual company name
            const formattedMsg = closingMsg.replace(/\{company\}/g, `<strong>${companyName}</strong>`);
            closingEl.innerHTML = formattedMsg.replace(/\n/g, '<br>');
        } else if (closingEl) {
            // Default message if none set
            closingEl.innerHTML = `Στην διάθεσή σας.<br>Με εκτίμηση για την <strong>${companyName}</strong>`;
        }

        // Update page 2 notes
        const page2NotesText = getVal('#page2Notes');
        const page2NotesEl = $('#previewPage2Notes');
        if (page2NotesEl) {
            if (page2NotesText && page2NotesText.trim()) {
                // Parse custom notes
                const lines = page2NotesText.split('\n').filter(l => l.trim());
                const processedLines = lines.map(line => {
                    // Replace placeholders
                    let processed = line.replace(/\{vat\}/g, vatRate);
                    processed = processed.replace(/\{validity\}/g, validity);
                    return `<li>${processed}</li>`;
                });
                page2NotesEl.innerHTML = processedLines.join('');
            } else {
                // Default notes
                page2NotesEl.innerHTML = `
                    <li>Οι τιμές περιλαμβάνουν Φ.Π.Α. ${vatRate}%</li>
                    <li>Ο χρόνος διαθεσιμότητας υπόκειται στη διαθεσιμότητα του προμηθευτή.</li>
                    <li>Η προσφορά ισχύει ${validity} εργάσιμες ημέρες.</li>
                    <li>Οι τιμές ενδέχεται να μεταβληθούν.</li>
                `;
            }
        }

        const banksEl = $('#previewBanks');
        if (banksEl && banks) {
            const lines = banks.split('\n').filter(l => l.trim());
            banksEl.innerHTML = lines.map(line => {
                const parts = line.match(/^(\S+)\s+(.+)$/);
                if (parts) {
                    return `<div><span class="bank-name">${escapeHtml(parts[1])}</span> <span class="bank-iban">${escapeHtml(parts[2])}</span></div>`;
                }
                return `<div>${escapeHtml(line)}</div>`;
            }).join('');
        }
    }

    function renderPreviewItems() {
        const container = $('#previewItemsBody');
        if (!container) return;

        const vatRateStr3 = getVal('#vatRate');
        const vatRate = vatRateStr3 !== '' ? parseFloat(vatRateStr3) : 24;
        const validItems = items.filter(i => i.price > 0 || i.brand || i.model || i.appleModel || i.microsoft365 || i.serviceType);

        if (validItems.length === 0) {
            container.innerHTML = '<div class="offer-items-empty">Προσθέστε προϊόντα στην προσφορά</div>';
            setTotal('#previewNetTotal', 0);
            setTotal('#previewVat', 0);
            setTotal('#previewGrandTotal', 0);
            const discRow = $('#previewDiscountRow');
            if (discRow) discRow.style.display = 'none';
            return;
        }

        let subtotal = 0;
        let totalDiscount = 0;
        let netBeforeVAT = 0;
        let totalVAT = 0;
        let grandTotal = 0;

        const cards = validItems.map((item) => {
            // Use the calculateItemPrice function for consistent pricing
            const pricing = calculateItemPrice(item, vatRate);
            
            netBeforeVAT += pricing.netLineTotal;
            totalVAT += pricing.vatAmount;
            grandTotal += pricing.lineTotal;

            const { title, subtitle, specs, specsAreHTML } = buildItemDetails(item);
            
            // Visibility toggles
            const showItemDetails = $('#showItemDetails')?.checked !== false;
            const showVATPerItem = $('#showVATPerItem')?.checked !== false;

            return `
                <div class="offer-item-card">
                    ${item.imageUrl ? `
                        <div class="offer-item-image">
                            <img src="${escapeHtml(item.imageUrl)}" alt="">
                        </div>
                    ` : ''}
                    <div class="offer-item-content">
                        <div class="offer-item-title">${escapeHtml(title)}</div>
                        ${subtitle ? `<div class="offer-item-subtitle">${escapeHtml(subtitle)}</div>` : ''}
                        ${showItemDetails && specs.length > 0 ? (specsAreHTML ? 
                            `<div class="offer-item-specs" style="list-style:none;padding:0">${specs.join('')}</div>` : 
                            `<ul class="offer-item-specs">${specs.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
                        ) : ''}
                    </div>
                    <div class="offer-item-price">
                        <div class="offer-item-price-value">${formatCurrency(pricing.lineTotal)}</div>
                        ${showVATPerItem ? (pricing.hasVAT ? 
                            `<div class="offer-item-price-vat" style="font-size:8pt;color:var(--text-muted);margin-top:0.2rem;">συμπ. ΦΠΑ ${vatRate}%</div>` : 
                            `<div class="offer-item-price-vat" style="font-size:8pt;color:var(--text-muted);margin-top:0.2rem;">χωρίς ΦΠΑ</div>`
                        ) : ''}
                        ${item.discount > 0 ? `<div class="offer-item-price-discount">-${item.discount}%</div>` : ''}
                        ${item.quantity > 1 ? `<div class="offer-item-price-qty">x${item.quantity}</div>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = cards.join('');

        // Use the actual totals from items (don't recalculate)
        const netTotal = netBeforeVAT;
        const vatAmount = totalVAT;
        const finalTotal = grandTotal;

        const discRow = $('#previewDiscountRow');
        if (discRow) {
            if (totalDiscount > 0) {
                discRow.style.display = '';
                setTotal('#previewTotalDiscount', totalDiscount, '-');
            } else {
                discRow.style.display = 'none';
            }
        }

        // Visibility toggles
        const showTotalsSection = $('#showTotalsSection')?.checked !== false;
        const showNetPrice = $('#showNetPrice')?.checked !== false;
        const showVAT = $('#showVAT')?.checked !== false;
        
        // Control visibility of entire totals section - use class for print compatibility
        const totalsSection = $('.offer-totals');
        if (totalsSection) {
            if (showTotalsSection) {
                totalsSection.classList.remove('hidden-by-user');
                totalsSection.style.display = '';
            } else {
                totalsSection.classList.add('hidden-by-user');
                totalsSection.style.display = 'none';
            }
        }
        
        // Control visibility of net price row (only if totals section is visible)
        const netRow = $('#previewNetTotal')?.closest('.total-row');
        if (netRow) netRow.style.display = (showTotalsSection && showNetPrice) ? '' : 'none';
        
        // Control visibility of VAT row (only if totals section is visible)
        const vatRow = $('#previewVat')?.closest('.total-row');
        if (vatRow) vatRow.style.display = (showTotalsSection && showVAT) ? '' : 'none';
        
        // Enable/disable sub-options based on main toggle
        const subOptions = $('#totalsSubOptions');
        if (subOptions) {
            subOptions.style.opacity = showTotalsSection ? '1' : '0.5';
            $('#showNetPrice').disabled = !showTotalsSection;
            $('#showVAT').disabled = !showTotalsSection;
        }

        setTotal('#previewNetTotal', netTotal);
        setTotal('#previewVat', vatAmount);
        setTotal('#previewGrandTotal', finalTotal);
    }

    function setTotal(sel, amount, prefix = '') {
        const el = $(sel);
        if (el) el.textContent = prefix + formatCurrency(amount);
    }

    function buildItemDetails(item) {
        let title = '';
        let subtitle = '';
        let specs = [];
        let specsAreHTML = false; // Flag to indicate if specs contain HTML

        switch (item.category) {
            case 'apple':
                const appleModel = item.appleModel === '__custom__' ? item.customModel : item.appleModel;
                title = `Apple ${item.appleType}${appleModel ? ' ' + appleModel : ''}`;
                if (item.description) subtitle = item.description;
                break;
            case 'microsoft365':
                title = item.microsoft365 === '__custom__' ? item.customModel : item.microsoft365;
                if (item.description) subtitle = item.description;
                break;
            case 'service':
                title = item.serviceType === '__custom__' ? item.customModel : item.serviceType;
                if (item.description) subtitle = item.description;
                break;
            case 'custompc':
                title = item.brand || 'Custom PC Build';
                subtitle = item.model || '';
                specsAreHTML = true; // Custom PC specs contain HTML formatting
                // Add each component as a spec line with label and description on separate lines
                if (item.pcComponents) {
                    Object.entries(item.pcComponents).forEach(([key, comp]) => {
                        if (comp.name && comp.price > 0) {
                            const labels = {
                                cpu: 'CPU',
                                gpu: 'GPU',
                                ram: 'RAM',
                                storage: 'Storage',
                                motherboard: 'Motherboard',
                                psu: 'PSU',
                                case: 'Case',
                                cooler: 'Cooler',
                                os: 'OS',
                                extra: 'Extra'
                            };
                            // Format: Label on top (light, small), Description below (bold, larger), Price on right
                            specs.push(`
                                <div style="margin-bottom:8px">
                                    <div style="font-size:7pt;color:#999;font-weight:300;margin-bottom:2px">${labels[key]}:</div>
                                    <div style="display:flex;justify-content:space-between;align-items:baseline">
                                        <strong style="font-size:9pt;font-weight:600;flex:1">${comp.name}</strong>
                                        <strong style="font-size:9pt;font-weight:600;margin-left:1rem;white-space:nowrap">${formatCurrency(comp.price)}</strong>
                                    </div>
                                </div>
                            `);
                        }
                    });
                }
                // Add setup fee if present
                if (item.setupFee && item.setupFee > 0) {
                    const setupDiscount = item.discount || 0;
                    const finalSetup = item.setupFee * (1 - setupDiscount / 100);
                    specs.push(`
                        <div style="margin-bottom:8px">
                            <div style="font-size:7pt;color:#999;font-weight:300;margin-bottom:2px">Setup & Installation${setupDiscount > 0 ? ` (-${setupDiscount}%)` : ''}:</div>
                            <div style="display:flex;justify-content:space-between;align-items:baseline">
                                <strong style="font-size:9pt;font-weight:600;flex:1">Professional assembly and testing</strong>
                                <strong style="font-size:9pt;font-weight:600;margin-left:1rem;white-space:nowrap">${formatCurrency(finalSetup)}</strong>
                            </div>
                        </div>
                    `);
                }
                break;
            default:
                title = [item.brand, item.model].filter(Boolean).join(' ') || 'Προϊόν';
                if (item.description) {
                    const lines = item.description.split('\n').filter(l => l.trim());
                    if (lines.length > 1) {
                        specs = lines;
                    } else {
                        subtitle = item.description;
                    }
                }
        }

        if (item.category !== 'microsoft365' && item.warranty && item.warranty !== 'Χωρίς εγγύηση') {
            specs.push(`Εγγύηση: ${item.warranty}`);
        }

        return { title, subtitle, specs, specsAreHTML };
    }

    // ────────────────────────────
    // Save & Library
    // ────────────────────────────
    function saveOffer() {
        // If internal notes are empty, prompt the user first
        if (!getVal('#internalNotes').trim()) {
            const modal = $('#internalNotesModal');
            const input = $('#internalNotesPromptInput');
            if (modal && input) {
                input.value = '';
                modal.classList.add('active');
                setTimeout(() => input.focus(), 80);
                return;
            }
        }
        _doSaveOffer();
    }

    function _doSaveOffer() {
        // Generate or use existing offer number
        const offerNumber = getVal('#offerNumber') || generateOfferNumber();
        
        const offer = {
            id: offerNumber, // Use offer number as unique ID
            number: offerNumber,
            date: getVal('#offerDate'),
            clientName: getVal('#clientName'),
            clientCompany: getVal('#clientCompany'),
            clientPhone: getVal('#clientPhone'),
            clientEmail: getVal('#clientEmail'),
            clientAddress: getVal('#clientAddress'),
            clientAFM: getVal('#clientAFM'),
            clientDOY: getVal('#clientDOY'),
            items: [...items],
            validity: getVal('#offerValidity'),
            vatRate: getVal('#vatRate'),
            paymentMethod: getVal('#paymentMethod'),
            notes: getVal('#offerNotes'),
            internalNotes: getVal('#internalNotes'),
            introText: getVal('#introText'),
            introTextSize: getVal('#introTextSize') || 'normal',
            savedBy: currentUser?.username,
            savedAt: new Date().toISOString()
        };

        let library = JSON.parse(localStorage.getItem('offersLibrary') || '[]');
        
        // Check if offer with this ID already exists
        const existingIndex = library.findIndex(o => o.id === offerNumber);
        
        if (existingIndex >= 0) {
            // Update existing offer
            library[existingIndex] = offer;
            showToast('✅ Προσφορά ενημερώθηκε!');
        } else {
            // Add new offer at the beginning
            library.unshift(offer);
            showToast('✅ Προσφορά αποθηκεύτηκε!');
        }
        
        localStorage.setItem('offersLibrary', JSON.stringify(library));

        // Save client data for autocomplete
        saveClientData();

        // Auto-push to GitHub if configured
        if (getGitHubConfig()?.token) syncToGitHub(true);
    }

    function saveClientData() {
        const clientCompany = getVal('#clientCompany').trim();
        if (!clientCompany) return;
        
        const clientData = {
            company: clientCompany,
            name: getVal('#clientName'),
            phone: getVal('#clientPhone'),
            email: getVal('#clientEmail'),
            address: getVal('#clientAddress'),
            afm: getVal('#clientAFM'),
            doy: getVal('#clientDOY')
        };
        
        // Load existing clients
        let clients = JSON.parse(localStorage.getItem('savedClients') || '{}');
        
        // Save or update this client (keyed by company name)
        clients[clientCompany] = clientData;
        
        localStorage.setItem('savedClients', JSON.stringify(clients));
        
        // Refresh autocomplete
        populateSavedClients();
    }

    function populateSavedClients() {
        const datalist = $('#savedClients');
        if (!datalist) return;
        
        const clients = JSON.parse(localStorage.getItem('savedClients') || '{}');
        
        datalist.innerHTML = Object.keys(clients)
            .sort()
            .map(company => `<option value="${company}">`)
            .join('');
    }

    function loadClientData(company) {
        const clients = JSON.parse(localStorage.getItem('savedClients') || '{}');
        const client = clients[company];
        
        if (client) {
            setVal('#clientName', client.name || '');
            setVal('#clientPhone', client.phone || '');
            setVal('#clientEmail', client.email || '');
            setVal('#clientAddress', client.address || '');
            setVal('#clientAFM', client.afm || '');
            setVal('#clientDOY', client.doy || '');
            updatePreview();
        }
    }

    function loadLibrary() {
        const rawLibrary = JSON.parse(localStorage.getItem('offersLibrary') || '[]');
        const container = $('#libraryContent');
        if (!container) return;

        // Sync toolbar button states
        const btnSort = $('#btnSortLibrary');
        const btnGroup = $('#btnGroupClient');
        if (btnSort) btnSort.textContent = librarySort === 'desc' ? '📅↓ Νεότερα' : '📅↑ Παλαιότερα';
        if (btnGroup) btnGroup.classList.toggle('active', libraryGroupByClient);

        // Filter by search
        const searchTerm = ($('#librarySearch')?.value || '').toLowerCase().trim();
        let library = rawLibrary.filter(offer => {
            if (!searchTerm) return true;
            const client = (offer.clientName || offer.clientCompany || '').toLowerCase();
            const number = (offer.number || '').toLowerCase();
            return client.includes(searchTerm) || number.includes(searchTerm);
        });

        // Sort by date
        library.sort((a, b) => {
            const da = a.date ? new Date(a.date).getTime() : 0;
            const db = b.date ? new Date(b.date).getTime() : 0;
            return librarySort === 'desc' ? db - da : da - db;
        });

        if (library.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:1.5rem;color:var(--text-muted)">Κενή βιβλιοθήκη</p>';
            return;
        }

        const renderItem = (offer) => `
            <div class="library-item">
                <div class="library-item-info">
                    <div class="library-item-name">${escapeHtml(offer.number)} — ${escapeHtml(offer.clientName || offer.clientCompany || 'Χωρίς όνομα')}</div>
                    <div class="library-item-date">${formatDateGR(offer.date)}</div>
                </div>
                <div class="library-item-actions">
                    <button class="btn-load-offer" data-offer-id="${escapeHtml(offer.id)}" style="background:var(--azul-subtle);color:var(--azul-light)">Φόρτωση</button>
                    <button class="btn-delete-offer" data-offer-id="${escapeHtml(offer.id)}" style="background:rgba(239,68,68,0.1);color:var(--danger)">🗑️</button>
                </div>
            </div>
        `;

        if (libraryGroupByClient) {
            const groups = {};
            library.forEach(offer => {
                const key = (offer.clientName || offer.clientCompany || 'Χωρίς όνομα').trim();
                if (!groups[key]) groups[key] = [];
                groups[key].push(offer);
            });
            const sortedKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'el'));
            container.innerHTML = sortedKeys.map(key => `
                <div class="library-group">
                    <div class="library-group-header">
                        <span class="library-group-name">${escapeHtml(key)}</span>
                        <span class="library-group-count">${groups[key].length}</span>
                    </div>
                    ${groups[key].map(renderItem).join('')}
                </div>
            `).join('');
        } else {
            container.innerHTML = library.map(renderItem).join('');
        }

        container.querySelectorAll('.btn-load-offer').forEach(btn => {
            btn.addEventListener('click', () => loadOffer(btn.getAttribute('data-offer-id')));
        });
        container.querySelectorAll('.btn-delete-offer').forEach(btn => {
            btn.addEventListener('click', () => deleteOffer(btn.getAttribute('data-offer-id')));
        });
    }

    function loadOffer(id) {
        const library = JSON.parse(localStorage.getItem('offersLibrary') || '[]');
        const offer = library.find(o => o.id === id);
        if (!offer) {
            showToast('❌ Offer not found');
            return;
        }

        // Client details
        setVal('#clientName', offer.clientName || '');
        setVal('#clientCompany', offer.clientCompany || '');
        setVal('#clientPhone', offer.clientPhone || '');
        setVal('#clientEmail', offer.clientEmail || '');
        setVal('#clientAddress', offer.clientAddress || '');
        setVal('#clientAFM', offer.clientAFM || '');
        setVal('#clientDOY', offer.clientDOY || '');
        
        // Offer details
        setVal('#offerNumber', offer.number || '');
        setVal('#offerDate', offer.date || '');
        setVal('#offerValidity', offer.validity || 7);
        setVal('#vatRate', offer.vatRate || 24);
        setVal('#paymentMethod', offer.paymentMethod || '');
        setVal('#offerNotes', offer.notes || '');
        setVal('#internalNotes', offer.internalNotes || '');
        setVal('#introText', offer.introText || '');
        setVal('#introTextSize', offer.introTextSize || 'normal');

        items = offer.items || [];
        if (items.length === 0) addItem();

        renderItems();
        updatePreview();

        const modal = $('#libraryModal');
        if (modal) modal.classList.remove('active');
        showToast('📂 Προσφορά φορτώθηκε!');
    }

    function deleteOffer(id) {
        if (!confirm('Διαγραφή;')) return;
        let library = JSON.parse(localStorage.getItem('offersLibrary') || '[]');
        library = library.filter(o => o.id !== id);
        localStorage.setItem('offersLibrary', JSON.stringify(library));
        loadLibrary();
        showToast('🗑️ Διαγράφηκε');
    }

    function exportBackup() {
        const data = {
            offers: JSON.parse(localStorage.getItem('offersLibrary') || '[]'),
            company: JSON.parse(localStorage.getItem('companySettings') || '{}'),
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offers-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📦 Backup!');
    }

    // ────────────────────────────
    // Utilities
    // ────────────────────────────
    function formatCurrency(amount) {
        return amount.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    function showToast(message) {
        console.log('Showing toast:', message);
        const toast = $('#toast');
        const msg = $('#toastMessage');
        if (toast && msg) {
            msg.textContent = message;
            toast.classList.add('show');
            
            // Auto-dismiss after 4 seconds (longer for Safari)
            setTimeout(() => {
                console.log('Auto-dismissing toast');
                toast.classList.remove('show');
            }, 4000);
        }
    }
    
    function hideToast() {
        console.log('Hiding toast');
        const toast = $('#toast');
        if (toast) {
            toast.classList.remove('show');
            console.log('Toast hidden, classList:', toast.className);
        }
    }

    // ────────────────────────────
    // Quick Add - Smart Text Parser
    // ────────────────────────────
    function parseQuickAdd(text) {
        const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
        
        // Check for labeled format (A=, B=, P1=, P2=, etc.)
        const hasLabels = lines.some(l => /^[A-Z]\d*=/i.test(l));
        
        if (hasLabels) {
            return parseLabeledFormat(lines);
        } else {
            // Smart unlabeled format
            return parseSmartFormat(lines);
        }
    }
    
    function parseSmartFormat(lines) {
        console.log('=== parseSmartFormat called ===');
        console.log('Lines:', lines);
        
        if (lines.length < 3) {
            console.log('Not enough lines (< 3)');
            return null;
        }
        
        const client = {};
        const product = {
            name: '',
            model: '',
            specs: [],
            price: null,
            imageUrl: null
        };
        
        let i = 0;
        
        // Try to detect client name (first line)
        // Client name usually: has spaces, looks like a person/company name, not a product
        const firstLine = lines[i];
        const looksLikeClient = (
            firstLine.split(' ').length >= 2 &&  // Has spaces (name/company)
            !/^\d/.test(firstLine) &&  // Doesn't start with number
            !firstLine.includes(':') &&  // Not a spec
            !/^https?:\/\//i.test(firstLine)  // Not a URL
        );
        
        console.log('First line:', firstLine);
        console.log('Looks like client?', looksLikeClient);
        
        if (looksLikeClient) {
            client.name = firstLine;  // ΟΝΟΜΑΤΕΠΩΝΥΜΟ / ΕΠΩΝΥΜΙΑ
            console.log('Set client.name =', firstLine);
            i++;
        }
        
        // Next line: Product name
        if (i < lines.length) {
            product.name = lines[i];
            console.log('Set product.name =', lines[i]);
            i++;
        }
        
        // Next line: Model
        if (i < lines.length) {
            product.model = lines[i];
            console.log('Set product.model =', lines[i]);
            i++;
        }
        
        // Collect specs until we hit price or image URL
        let currentSpec = '';
        
        for (; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if it's a URL (any http/https URL)
            if (/^https?:\/\//i.test(line)) {
                // Save current spec if exists
                if (currentSpec.trim()) {
                    product.specs.push(currentSpec.trim());
                    currentSpec = '';
                }
                product.imageUrl = line;
                continue;
            }
            
            // Check if it's a price (number, possibly with €)
            const priceMatch = line.match(/^(\d+(?:[.,]\d+)?)\s*€?$/);
            if (priceMatch) {
                // Save current spec if exists
                if (currentSpec.trim()) {
                    product.specs.push(currentSpec.trim());
                    currentSpec = '';
                }
                product.price = parseFloat(priceMatch[1].replace(',', '.'));
                continue;
            }
            
            // Check if it's a spec label (ends with colon)
            if (line.endsWith(':')) {
                // Save previous spec if exists
                if (currentSpec.trim()) {
                    product.specs.push(currentSpec.trim());
                }
                // Start new spec with label
                currentSpec = line + ' ';
            } else {
                // It's a value - append to current spec
                if (currentSpec) {
                    currentSpec += line;
                } else {
                    // Standalone spec line (no label)
                    product.specs.push(line);
                }
            }
        }
        
        // Add last spec if exists
        if (currentSpec.trim()) {
            product.specs.push(currentSpec.trim());
        }
        
        console.log('Final product:', product);
        console.log('Final client:', client);
        
        // Return based on what we found
        const hasClient = client.name;  // FIXED: was client.company
        const hasProduct = product.name;
        
        console.log('hasClient:', hasClient);
        console.log('hasProduct:', hasProduct);
        
        if (hasClient && hasProduct) {
            console.log('Returning MIXED type');
            return { type: 'mixed', client, product };
        } else if (hasProduct) {
            console.log('Returning PRODUCT type');
            return { type: 'product', data: product };
        }
        
        console.log('Returning NULL');
        return null;
    }
    
    function parseLabeledFormat(lines) {
        const client = {};
        const product = {
            name: '',
            model: '',
            specs: [],
            price: null,
            imageUrl: null
        };
        
        let hasClient = false;
        let hasProduct = false;
        let collectingSpecs = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Match format: KEY=VALUE or just KEY= (value on next lines)
            const match = line.match(/^([A-Z]\d*)=(.*)$/i);
            if (match) {
                const key = match[1].toUpperCase();
                const value = match[2].trim();
                
                // Stop collecting specs if we hit a new labeled field
                if (collectingSpecs && key !== 'P3') {
                    collectingSpecs = false;
                }
                
                // Client fields (A-E)
                if (key === 'A') { client.name = value; hasClient = true; }
                else if (key === 'B') { client.company = value; hasClient = true; }
                else if (key === 'C') { client.email = value; hasClient = true; }
                else if (key === 'D') { client.phone = value; hasClient = true; }
                else if (key === 'E') { client.address = value; hasClient = true; }
                
                // Product fields (P1-P5)
                else if (key === 'P1') { product.name = value; hasProduct = true; }
                else if (key === 'P2') { product.model = value; hasProduct = true; }
                else if (key === 'P3') { 
                    // P3 can have value on same line or start collecting next lines
                    if (value) {
                        product.specs.push(value);
                    }
                    collectingSpecs = true;
                    hasProduct = true;
                }
                else if (key === 'P4') { 
                    collectingSpecs = false;
                    product.price = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
                    hasProduct = true;
                }
                else if (key === 'P5') { 
                    collectingSpecs = false;
                    product.imageUrl = value;
                    hasProduct = true;
                }
            } else if (collectingSpecs && line) {
                // Collecting specs - add this line
                product.specs.push(line);
            }
        }
        
        // Return based on what was found
        if (hasClient && hasProduct) {
            return { type: 'mixed', client, product };
        } else if (hasClient) {
            return { type: 'client', data: client };
        } else if (hasProduct) {
            return { type: 'product', data: product };
        }
        
        return null;
    }
    
    function parseClientFormat(lines) {
        const client = {};
        
        lines.forEach(line => {
            const match = line.match(/^([A-Z])=(.+)$/i);
            if (match) {
                const key = match[1].toUpperCase();
                const value = match[2].trim();
                
                switch(key) {
                    case 'A': client.name = value; break;
                    case 'B': client.company = value; break;
                    case 'C': client.email = value; break;
                    case 'D': client.phone = value; break;
                    case 'E': client.address = value; break;
                }
            }
        });
        
        return { type: 'client', data: client };
    }
    
    function parseProductFormat(lines) {
        if (lines.length < 2) return null;
        
        const product = {
            name: lines[0] || '',      // P1: Brand/Product name
            model: lines[1] || '',     // P2: Model
            specs: [],                 // P3: Specs (concatenated)
            price: null,               // P4: Price
            imageUrl: null             // P5: Image URL
        };
        
        let currentSpec = '';  // For concatenating multi-line specs
        
        // Parse remaining lines
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Check if it's an image URL
            if (line.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)) {
                product.imageUrl = line;
                continue;
            }
            
            // Check if it's a price (number, possibly with €)
            const priceMatch = line.match(/^(\d+(?:[.,]\d+)?)\s*€?$/);
            if (priceMatch) {
                product.price = parseFloat(priceMatch[1].replace(',', '.'));
                continue;
            }
            
            // Check if it's a spec label (ends with colon)
            if (line.endsWith(':')) {
                // Save previous spec if exists
                if (currentSpec) {
                    product.specs.push(currentSpec.trim());
                }
                // Start new spec with label
                currentSpec = line + ' ';
            } else {
                // It's a value - append to current spec or start new one
                if (currentSpec) {
                    // Append to existing spec
                    currentSpec += line;
                } else {
                    // Standalone spec line
                    product.specs.push(line);
                }
            }
        }
        
        // Add last spec if exists
        if (currentSpec && currentSpec.trim()) {
            product.specs.push(currentSpec.trim());
        }
        
        return { type: 'product', data: product };
    }
    
    function applyQuickAdd(parsed) {
        if (!parsed) {
            showToast('❌ Could not parse text');
            return;
        }
        
        if (parsed.type === 'mixed') {
            // Handle both client and product data
            const { client, product } = parsed;
            
            // Fill client fields
            if (client.name) setVal('#clientName', client.name);
            if (client.company) setVal('#clientCompany', client.company);
            if (client.email) setVal('#clientEmail', client.email);
            if (client.phone) setVal('#clientPhone', client.phone);
            if (client.address) setVal('#clientAddress', client.address);
            
            // Add product item
            const { name, model, specs, price, imageUrl } = product;
            
            console.log('Quick Add - Mixed type detected');
            console.log('Product data:', { name, model, specs, price, imageUrl });
            
            addItem(); // Create new item
            
            // Wait for item to be added to DOM
            setTimeout(() => {
                // Get the last item from the items array (just added)
                const newItem = items[items.length - 1];
                if (!newItem) {
                    console.error('No item found in items array!');
                    return;
                }
                
                const itemId = newItem.id;
                console.log('Updating item ID:', itemId);
                
                // Update item data
                if (name) {
                    console.log('Setting brand:', name);
                    window._updateItem(itemId, 'brand', name);  // Use 'brand' not 'name'
                }
                if (model) {
                    console.log('Setting model:', model);
                    window._updateItem(itemId, 'model', model);
                }
                if (specs && specs.length > 0) {
                    console.log('Setting description:', specs);
                    window._updateItem(itemId, 'description', specs.join('\n'));  // Use 'description' not 'specs'
                }
                if (price) {
                    console.log('Setting price:', price);
                    window._updateItem(itemId, 'price', price);
                }
                if (imageUrl) {
                    console.log('Setting imageUrl:', imageUrl);
                    window._updateItem(itemId, 'imageUrl', imageUrl);
                }
                window._updateItem(itemId, 'quantity', '1');
                
                console.log('=== Before renderItems() ===');
                console.log('Items array:', items);
                console.log('Item we just updated:', items.find(i => i.id === itemId));
                
                console.log('Calling renderItems() to refresh UI...');
                renderItems(); // Re-render the items to show updated fields
                
                console.log('=== After renderItems() ===');
                console.log('Checking if fields are filled...');
                const updatedCard = document.querySelector(`.item-card[data-id="${itemId}"]`);
                if (updatedCard) {
                    const nameInput = updatedCard.querySelector('[data-field="name"]');
                    const modelInput = updatedCard.querySelector('[data-field="model"]');
                    console.log('Name input value:', nameInput?.value);
                    console.log('Model input value:', modelInput?.value);
                } else {
                    console.error('Could not find item card after renderItems!');
                }
                
                showToast('✅ Client & Product added!');
                updatePreview();
            }, 100);
        }
        else if (parsed.type === 'client') {
            // Fill client fields
            const { name, company, email, phone, address } = parsed.data;
            if (name) setVal('#clientName', name);
            if (company) setVal('#clientCompany', company);
            if (email) setVal('#clientEmail', email);
            if (phone) setVal('#clientPhone', phone);
            if (address) setVal('#clientAddress', address);
            
            showToast('✅ Client info filled!');
            updatePreview();
        } 
        else if (parsed.type === 'product') {
            // Add new item with parsed data
            const { name, model, specs, price, imageUrl } = parsed.data;
            
            addItem(); // Create new item
            
            // Wait for item to be added to DOM
            setTimeout(() => {
                // Get the last item from the items array (just added)
                const newItem = items[items.length - 1];
                if (!newItem) {
                    console.error('No item found in items array!');
                    return;
                }
                
                const itemId = newItem.id;
                
                // Update item data using the updateItem function
                if (name) window._updateItem(itemId, 'brand', name);  // Use 'brand' not 'name'
                if (model) window._updateItem(itemId, 'model', model);
                if (specs.length > 0) window._updateItem(itemId, 'description', specs.join('\n'));  // Use 'description' not 'specs'
                if (price) window._updateItem(itemId, 'price', price);
                if (imageUrl) window._updateItem(itemId, 'imageUrl', imageUrl);
                window._updateItem(itemId, 'quantity', '1');
                
                renderItems(); // Re-render to show updated fields
                
                showToast('✅ Product added: ' + name);
                updatePreview();
            }, 100);
        }
        
        // Close modal
        const modal = $('#quickAddModal');
        if (modal) modal.classList.remove('active');
        
        // Clear input
        const input = $('#quickAddInput');
        if (input) input.value = '';
    }

    // ────────────────────────────
    // Events
    // ────────────────────────────
    function bindEvents() {
        // Toast close button - Safari-specific fix with multiple event types
        const toastClose = $('#toastClose');
        const toast = $('#toast');
        
        if (toastClose && toast) {
            // Click event
            toastClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toast close clicked');
                hideToast();
            }, { passive: false });
            
            // Touch events for iOS/Safari
            toastClose.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });
            
            toastClose.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toast close touched');
                hideToast();
            }, { passive: false });
            
            // Also allow tapping anywhere on toast to dismiss
            toast.addEventListener('click', (e) => {
                if (e.target === toast || e.target.closest('.toast-close')) {
                    console.log('Toast clicked to dismiss');
                    hideToast();
                }
            });
        }
        
        // Section toggles
        $$('[data-toggle]').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-toggle');
                const body = $(`#${targetId}`);
                if (body) {
                    body.classList.toggle('open');
                    header.classList.toggle('collapsed');
                }
            });
        });

        // Buttons
        const btnSaveCompany = $('#btnSaveCompany');
        if (btnSaveCompany) btnSaveCompany.addEventListener('click', saveCompanySettings);

        const btnExportSettings = $('#btnExportSettings');
        if (btnExportSettings) btnExportSettings.addEventListener('click', exportSettings);

        const btnImportSettings = $('#btnImportSettings');
        if (btnImportSettings) btnImportSettings.addEventListener('click', importSettings);

        const importSettingsFile = $('#importSettingsFile');
        if (importSettingsFile) importSettingsFile.addEventListener('change', handleImportFile);
        
        const btnResetToDefaults = $('#btnResetToDefaults');
        if (btnResetToDefaults) btnResetToDefaults.addEventListener('click', resetToDefaults);

        const btnAddItem = $('#btnAddItem');
        if (btnAddItem) btnAddItem.addEventListener('click', addItem);
        
        // Quick Add modal handlers
        const btnQuickAdd = $('#btnQuickAdd');
        if (btnQuickAdd) {
            btnQuickAdd.addEventListener('click', () => {
                const modal = $('#quickAddModal');
                if (modal) modal.classList.add('active');
                const input = $('#quickAddInput');
                if (input) input.focus();
            });
        }
        
        const closeQuickAdd = $('#closeQuickAdd');
        if (closeQuickAdd) {
            closeQuickAdd.addEventListener('click', () => {
                const modal = $('#quickAddModal');
                if (modal) modal.classList.remove('active');
            });
        }
        
        const btnParseQuickAdd = $('#btnParseQuickAdd');
        if (btnParseQuickAdd) {
            btnParseQuickAdd.addEventListener('click', () => {
                const input = $('#quickAddInput');
                if (!input || !input.value.trim()) {
                    showToast('❌ Please paste some text first');
                    return;
                }
                const parsed = parseQuickAdd(input.value);
                applyQuickAdd(parsed);
            });
        }
        
        const btnClearQuickAdd = $('#btnClearQuickAdd');
        if (btnClearQuickAdd) {
            btnClearQuickAdd.addEventListener('click', () => {
                const input = $('#quickAddInput');
                if (input) input.value = '';
            });
        }

        const btnNewOffer = $('#btnNewOffer');
        if (btnNewOffer) btnNewOffer.addEventListener('click', () => {
            if (confirm('Νέα προσφορά;')) resetForm();
        });

        const btnPrint = $('#btnPrint');
        if (btnPrint) btnPrint.addEventListener('click', () => {
            // Set PDF filename based on date-company-client
            const offerDate = getVal('#offerDate') || new Date().toISOString().split('T')[0];
            const companyName = getVal('#companyName') || 'MacWorks';
            const clientName = getVal('#clientName') || 'Client';
            
            // Sanitize names for filename
            const sanitize = (str) => str
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9\u0370-\u03FF-]/g, '')
                .substring(0, 30);
            
            const filename = `${offerDate}-${sanitize(companyName)}-${sanitize(clientName)}`;
            
            // Store original title
            const originalTitle = document.title;
            
            // Set title (becomes PDF filename)
            document.title = filename;
            
            // Safari-specific print fix
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            
            if (isSafari) {
                // Force page 2 visibility before print for Safari
                const page2 = document.getElementById('offerPage2');
                if (page2) {
                    // Apply aggressive visibility fixes
                    page2.style.cssText = `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: relative !important;
                        page-break-before: always !important;
                        -webkit-page-break-before: always !important;
                    `;
                    
                    // Also ensure all child elements are visible
                    const page2Content = page2.querySelector('.page2-content');
                    if (page2Content) {
                        page2Content.style.cssText = `
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        `;
                    }
                }
                
                // Small delay to ensure styles are applied before print dialog
                setTimeout(() => {
                    window.print();
                    // Restore original title after print
                    setTimeout(() => { document.title = originalTitle; }, 500);
                }, 100);
            } else {
                // Standard print for other browsers
                window.print();
                // Restore original title after print
                setTimeout(() => { document.title = originalTitle; }, 500);
            }
        });

        const btnSaveOffer = $('#btnSaveOffer');
        if (btnSaveOffer) btnSaveOffer.addEventListener('click', saveOffer);

        const closeInternalNotesModal = $('#closeInternalNotesModal');
        if (closeInternalNotesModal) closeInternalNotesModal.addEventListener('click', () => {
            $('#internalNotesModal')?.classList.remove('active');
        });

        const btnSaveWithNotes = $('#btnSaveWithNotes');
        if (btnSaveWithNotes) btnSaveWithNotes.addEventListener('click', () => {
            const notes = $('#internalNotesPromptInput')?.value.trim() || '';
            setVal('#internalNotes', notes);
            $('#internalNotesModal')?.classList.remove('active');
            _doSaveOffer();
        });

        const btnSkipNotes = $('#btnSkipNotes');
        if (btnSkipNotes) btnSkipNotes.addEventListener('click', () => {
            $('#internalNotesModal')?.classList.remove('active');
            _doSaveOffer();
        });

        const btnExportBackup = $('#btnExportBackup');
        if (btnExportBackup) btnExportBackup.addEventListener('click', exportBackup);

        const btnLibrary = $('#btnLibrary');
        if (btnLibrary) btnLibrary.addEventListener('click', () => {
            loadLibrary();
            const modal = $('#libraryModal');
            if (modal) modal.classList.add('active');
        });
        
        const btnNightMode = $('#btnNightMode');
        if (btnNightMode) {
            // Check saved preference
            const isNight = localStorage.getItem('nightMode') === 'true';
            if (isNight) {
                document.body.classList.add('night-mode');
                btnNightMode.textContent = '☀️ Day';
            }
            
            btnNightMode.addEventListener('click', () => {
                document.body.classList.toggle('night-mode');
                const nowNight = document.body.classList.contains('night-mode');
                btnNightMode.textContent = nowNight ? '☀️ Day' : '🌙 Night';
                localStorage.setItem('nightMode', nowNight);
                showToast(nowNight ? '🌙 Night mode enabled' : '☀️ Day mode restored');
            });
        }
        
        const btnCompactView = $('#btnCompactView');
        if (btnCompactView) {
            // Check saved preference
            const isCompact = localStorage.getItem('compactView') === 'true';
            if (isCompact) {
                document.body.classList.add('compact-view');
                btnCompactView.textContent = '📐 Normal';
            }
            
            btnCompactView.addEventListener('click', () => {
                document.body.classList.toggle('compact-view');
                const nowCompact = document.body.classList.contains('compact-view');
                btnCompactView.textContent = nowCompact ? '📐 Normal' : '📐 Compact';
                localStorage.setItem('compactView', nowCompact);
                showToast(nowCompact ? '📐 Compact view enabled' : '📐 Normal view restored');
            });
        }

        const closeLibrary = $('#closeLibrary');
        if (closeLibrary) closeLibrary.addEventListener('click', () => {
            const modal = $('#libraryModal');
            if (modal) modal.classList.remove('active');
        });

        const librarySearch = $('#librarySearch');
        if (librarySearch) librarySearch.addEventListener('input', () => loadLibrary());

        const btnSortLibrary = $('#btnSortLibrary');
        if (btnSortLibrary) btnSortLibrary.addEventListener('click', () => {
            librarySort = librarySort === 'desc' ? 'asc' : 'desc';
            loadLibrary();
        });

        const btnGroupClient = $('#btnGroupClient');
        if (btnGroupClient) btnGroupClient.addEventListener('click', () => {
            libraryGroupByClient = !libraryGroupByClient;
            loadLibrary();
        });

        // GitHub buttons
        const btnGitHubSetup = $('#btnGitHubSetup');
        if (btnGitHubSetup) btnGitHubSetup.addEventListener('click', () => {
            const modal = $('#githubModal');
            if (modal) modal.classList.add('active');
            // Load existing config
            const config = getGitHubConfig();
            if (config) {
                if ($('#githubUsername')) $('#githubUsername').value = config.username || '';
                if ($('#githubRepo')) $('#githubRepo').value = config.repo || '';
                if ($('#githubToken')) $('#githubToken').value = config.token || '';
            }
        });

        const btnGitHubPull = $('#btnGitHubPull');
        if (btnGitHubPull) btnGitHubPull.addEventListener('click', syncFromGitHub);

        const btnGitHubPush = $('#btnGitHubPush');
        if (btnGitHubPush) btnGitHubPush.addEventListener('click', syncToGitHub);

        // Users management
        const btnManageUsers = $('#btnManageUsers');
        if (btnManageUsers) btnManageUsers.addEventListener('click', openUsersModal);

        const closeUsers = $('#closeUsers');
        if (closeUsers) closeUsers.addEventListener('click', () => {
            const modal = $('#usersModal');
            if (modal) modal.classList.remove('active');
        });

        const btnAddUser = $('#btnAddUser');
        if (btnAddUser) btnAddUser.addEventListener('click', addUser);

        const btnLogout = $('#btnLogout');
        if (btnLogout) btnLogout.addEventListener('click', handleLogout);

        // Client company autocomplete
        const clientCompany = $('#clientCompany');
        if (clientCompany) {
            clientCompany.addEventListener('change', function() {
                loadClientData(this.value);
            });
        }

        // Payment custom
        const paymentMethod = $('#paymentMethod');
        if (paymentMethod) paymentMethod.addEventListener('change', function () {
            const row = $('#customPaymentRow');
            if (row) {
                if (this.value === '__custom__') {
                    row.classList.add('active');
                } else {
                    row.classList.remove('active');
                }
            }
            updatePreview();
        });

        // Regenerate offer number when client name/company changes
        const clientName = $('#clientName');
        // clientCompany already declared above
        if (clientName) clientName.addEventListener('blur', () => {
            // Only regenerate if offer number is empty or follows the timestamp pattern
            const currentNumber = getVal('#offerNumber');
            if (!currentNumber || /^\d{12}-/.test(currentNumber)) {
                generateOfferNumber();
            }
        });
        if (clientCompany) clientCompany.addEventListener('blur', () => {
            const currentNumber = getVal('#offerNumber');
            if (!currentNumber || /^\d{12}-/.test(currentNumber)) {
                generateOfferNumber();
            }
        });

        // Live preview
        const formPanel = $('.form-panel');
        if (formPanel) {
            formPanel.addEventListener('input', updatePreview);
            formPanel.addEventListener('change', updatePreview);
        }
    }

    function resetForm() {
        setVal('#clientName', '');
        setVal('#clientCompany', '');
        setVal('#clientPhone', '');
        setVal('#clientEmail', '');
        setVal('#clientAddress', '');
        setVal('#clientAFM', '');
        setVal('#clientDOY', '');
        setVal('#offerValidity', '7');
        setVal('#vatRate', '24');
        setVal('#paymentMethod', 'Τραπεζική Κατάθεση');
        setVal('#offerNotes', '');
        setVal('#internalNotes', '');
        setVal('#introText', '');

        generateOfferNumber();
        setTodayDate();
        items = [];
        addItem();
        updatePreview();
        showToast('📝 Νέα προσφορά!');
    }

    // ────────────────────────────
    // GitHub Sync
    // ────────────────────────────
    function getGitHubConfig() {
        const config = localStorage.getItem('githubConfig');
        return config ? JSON.parse(config) : null;
    }

    function saveGitHubConfig(username, repo, token) {
        const config = { username, repo, token };
        localStorage.setItem('githubConfig', JSON.stringify(config));
        return config;
    }

    function setSyncStatus(msg, color = 'var(--text-muted)') {
        const el = $('#syncStatus');
        if (!el) return;
        el.style.display = 'block';
        el.style.color = color;
        el.textContent = msg;
    }

    async function syncToGitHub(silent = false) {
        const config = getGitHubConfig();
        if (!config || !config.token) {
            if (!silent) showToast('⚠️ Ρυθμίστε πρώτα το GitHub', 'error');
            return;
        }

        if (!silent) showToast('⏳ Uploading to GitHub...');
        setSyncStatus('⏳ Pushing...');

        try {
            const offers = JSON.parse(localStorage.getItem('offersLibrary') || '[]');
            const jsonString = JSON.stringify(offers, null, 2);
            
            // Convert to base64
            const base64Content = btoa(unescape(encodeURIComponent(jsonString)));
            
            const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/offers.json`;
            let sha = null;
            
            // Try to get existing file SHA
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${config.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (response.ok) {
                    sha = (await response.json()).sha;
                }
            } catch (e) {
                // File doesn't exist yet
            }
            
            // Upload file
            const payload = {
                message: `Update offers ${new Date().toISOString()}`,
                content: base64Content,
                branch: 'main'
            };
            if (sha) payload.sha = sha;
            
            const resp = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const now = new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
            setSyncStatus(`☁️ Pushed ${offers.length} • ${now}`, 'var(--success)');
            if (!silent) showToast(`✅ Pushed ${offers.length} offers to GitHub!`, 'success');
        } catch (error) {
            console.error('GitHub sync error:', error);
            setSyncStatus(`❌ Push failed: ${error.message}`, 'var(--danger)');
            if (!silent) showToast(`❌ Sync failed: ${error.message}`, 'error');
        }
    }

    async function syncFromGitHub(silent = false) {
        const config = getGitHubConfig();
        if (!config || !config.token) {
            if (!silent) showToast('⚠️ Ρυθμίστε πρώτα το GitHub', 'error');
            return;
        }

        if (!silent) showToast('⏳ Downloading from GitHub...');
        setSyncStatus('⏳ Pulling...');

        try {
            const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/offers.json`;
            const resp = await fetch(url, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (resp.status === 404) {
                showToast('📝 No remote data found. Push to create.', 'info');
                return;
            }
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            const data = await resp.json();
            const base64 = data.content.replace(/\n/g, '');
            const jsonString = decodeURIComponent(escape(atob(base64)));
            const githubOffers = JSON.parse(jsonString);
            
            // Merge with local offers
            const local = JSON.parse(localStorage.getItem('offersLibrary') || '[]');
            const merged = [...githubOffers];
            const mergedIds = new Set(merged.map(o => o.id));
            
            local.forEach(l => {
                if (!mergedIds.has(l.id)) {
                    merged.push(l);
                }
            });
            
            localStorage.setItem('offersLibrary', JSON.stringify(merged));
            const now = new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
            setSyncStatus(`☁️ Pulled ${githubOffers.length} • ${now}`, 'var(--success)');
            if (!silent) showToast(`✅ Pulled ${githubOffers.length} offers from GitHub!`, 'success');

            // Refresh library if open
            if ($('#libraryModal')?.classList.contains('active')) {
                loadLibrary();
            }
        } catch (error) {
            console.error('GitHub sync error:', error);
            setSyncStatus(`❌ Pull failed: ${error.message}`, 'var(--danger)');
            if (!silent) showToast(`❌ Pull failed: ${error.message}`, 'error');
        }
    }

    function bindGitHubEvents() {
        const btnSaveGithub = $('#btnSaveGithub');
        const closeGithub = $('#closeGithub');
        const githubModal = $('#githubModal');

        if (btnSaveGithub) {
            btnSaveGithub.addEventListener('click', () => {
                const username = $('#githubUsername')?.value.trim();
                const repo = $('#githubRepo')?.value.trim();
                const token = $('#githubToken')?.value.trim();

                if (!username || !repo || !token) {
                    showToast('❌ Συμπληρώστε όλα τα πεδία', 'error');
                    return;
                }

                saveGitHubConfig(username, repo, token);
                showToast('✅ GitHub config saved!', 'success');
                if (githubModal) githubModal.classList.remove('active');
                
                // Auto-pull after saving config
                setTimeout(() => syncFromGitHub(), 500);
            });
        }

        if (closeGithub && githubModal) {
            closeGithub.addEventListener('click', () => {
                githubModal.classList.remove('active');
            });
        }
    }

    // Auto-sync on load
    function autoSyncGitHub() {
        const config = getGitHubConfig();
        if (config && config.token && config.username && config.repo) {
            setTimeout(() => syncFromGitHub(true), 1000);
        }
    }

    // ────────────────────────────
    // User Management
    // ────────────────────────────
    function openUsersModal() {
        renderUsersList();
        const modal = $('#usersModal');
        if (modal) modal.classList.add('active');
    }

    function renderUsersList() {
        const container = $('#usersContent');
        if (!container) return;

        const users = JSON.parse(localStorage.getItem('appUsers') || JSON.stringify(defaultUsers));
        
        container.innerHTML = users.map((user, index) => `
            <div class="library-item" style="margin-bottom:0.5rem">
                <div class="library-item-info">
                    <div class="library-item-name">${escapeHtml(user.username)}</div>
                    <div class="library-item-date">${user.role || 'user'}</div>
                </div>
                <div>
                    ${user.username !== 'admin' ? `
                        <button onclick="window._deleteUser(${index})" 
                            style="background:rgba(239,68,68,0.1);color:var(--danger);font-size:0.75rem;padding:0.3rem 0.6rem">
                            🗑️
                        </button>
                    ` : `<span style="color:var(--text-muted);font-size:0.75rem">Default</span>`}
                </div>
            </div>
        `).join('');
    }

    function addUser() {
        const username = $('#newUsername')?.value.trim();
        const password = $('#newPassword')?.value.trim();

        if (!username || !password) {
            showToast('❌ Συμπληρώστε username και password');
            return;
        }

        const users = JSON.parse(localStorage.getItem('appUsers') || JSON.stringify(defaultUsers));
        
        // Check if username exists
        if (users.find(u => u.username === username)) {
            showToast('❌ Το username υπάρχει ήδη');
            return;
        }

        users.push({ username, password, role: 'user' });
        localStorage.setItem('appUsers', JSON.stringify(users));
        
        $('#newUsername').value = '';
        $('#newPassword').value = '';
        
        renderUsersList();
        showToast('✅ Χρήστης προστέθηκε!');
    }

    function deleteUser(index) {
        if (!confirm('Διαγραφή χρήστη;')) return;

        const users = JSON.parse(localStorage.getItem('appUsers') || JSON.stringify(defaultUsers));
        
        if (users[index].username === 'admin') {
            showToast('❌ Δεν μπορείτε να διαγράψετε τον admin');
            return;
        }

        users.splice(index, 1);
        localStorage.setItem('appUsers', JSON.stringify(users));
        renderUsersList();
        showToast('🗑️ Χρήστης διαγράφηκε');
    }

    // ────────────────────────────
    // Global
    // ────────────────────────────
    window._removeItem = removeItem;
    window._updateItem = updateItem;
    window._updatePCComponent = updatePCComponent;
    window._loadOffer = loadOffer;
    window._deleteOffer = deleteOffer;
    window._syncToGitHub = syncToGitHub;
    window._syncFromGitHub = syncFromGitHub;
    window._deleteUser = deleteUser;
    window.applyIntroTemplate = applyIntroTemplate;

    // ────────────────────────────
    // Burger Menu (Mobile)
    // ────────────────────────────
    function initBurgerMenu() {
        const burgerMenu = $('#burgerMenu');
        const menuOverlay = $('#menuOverlay');
        const appHeader = $('#appHeader');
        
        if (!burgerMenu || !menuOverlay || !appHeader) {
            console.warn('Burger menu elements not found');
            return;
        }
        
        console.log('🍔 Burger menu initialized');
        
        function toggleMenu() {
            burgerMenu.classList.toggle('active');
            appHeader.classList.toggle('menu-open');
            menuOverlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (appHeader.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        function closeMenu() {
            burgerMenu.classList.remove('active');
            appHeader.classList.remove('menu-open');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Burger menu click
        burgerMenu.addEventListener('click', toggleMenu);
        
        // Overlay click closes menu
        menuOverlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking any menu button
        appHeader.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    // ────────────────────────────
    // Boot
    // ────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initBurgerMenu();
    });
})();
