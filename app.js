const urlParams = new URLSearchParams(window.location.search);
const portalMode = urlParams.get('portal') || '';
const collegeSlug = urlParams.get('college') || '';

let currentLang = localStorage.getItem('vidyasetu_lang') || 'en';
let selectedAttClass = "ALL";
let selectedAttDate = new Date().toISOString().split('T')[0];

let currentCollege = null;
let storagePrefix = `vs_data_default_`;

const superAdminCredentials = { username: "superadmin", password: "123", name: "Aman Kumar (Master Admin)" };

const defaultStudents = [
    {
        id: "STU101", name: "Aarav Sharma", father: "Rajesh Sharma", class: "Class 10", roll: "101", mobile: "9876543210",
        dob: new Date().toISOString().split('T')[0],
        totalFee: 12000, paidFee: 12000, attStatus: "P", attRemark: "On Time", monthlyPercent: 94,
        feeHistory: [{ receiptNo: "REC-48210", date: "2026-11-15", amount: 12000, mode: "UPI / QR", remark: "Annual Fee" }],
        marks: { hindi: 88, english: 84, math: 95, science: 91 }
    },
    {
        id: "STU102", name: "Ananya Verma", father: "Suresh Verma", class: "Class 10", roll: "102", mobile: "9876543211",
        dob: "2008-05-12",
        totalFee: 12000, paidFee: 8000, attStatus: "L", attRemark: "Medical Leave", monthlyPercent: 88,
        feeHistory: [{ receiptNo: "REC-33910", date: "2026-08-05", amount: 8000, mode: "Cash", remark: "1st Installment" }],
        marks: { hindi: 92, english: 89, math: 78, science: 85 }
    }
];

const defaultExpenses = [{ id: 1, title: "Electricity & Internet Bill", amount: 3200, date: "10/11/2026" }];
const defaultNotices = [{ id: 1, title: "Welcome to Digital Campus", body: "All academic and administrative records are now live.", date: "24/11/2026" }];

let students = [];
let expenses = [];
let notices = [];
let orgName = "VidyaSetu Institute";
let orgLogo = "";

let loggedUser = null;
let activeTab = "";
let superAdminViewingSlug = null;

function loadCollegeWorkspaceData(colObj) {
    currentCollege = colObj;
    storagePrefix = `vs_data_${colObj.slug}_`;
    orgName = colObj.name;
    orgLogo = colObj.logo || "";

    students = JSON.parse(localStorage.getItem(storagePrefix + 'students')) || JSON.parse(JSON.stringify(defaultStudents));
    expenses = JSON.parse(localStorage.getItem(storagePrefix + 'expenses')) || JSON.parse(JSON.stringify(defaultExpenses));
    notices = JSON.parse(localStorage.getItem(storagePrefix + 'notices')) || JSON.parse(JSON.stringify(defaultNotices));
    if (typeof loadCurrentInstituteStaff === 'function') loadCurrentInstituteStaff();
    if (typeof loadLibraryProData === 'function') loadLibraryProData();
    if (typeof loadCoachingProData === 'function') loadCoachingProData();
    if (typeof loadGymProData === 'function') loadGymProData();
    if (typeof loadCompLabProData === 'function') loadCompLabProData();
}

if (collegeSlug) {
    const allCols = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
    const foundCol = allCols.find(c => c.slug === collegeSlug.toLowerCase());
    if (foundCol) loadCollegeWorkspaceData(foundCol);
}

function saveData() {
    localStorage.setItem(storagePrefix + 'students', JSON.stringify(students));
    localStorage.setItem(storagePrefix + 'expenses', JSON.stringify(expenses));
    localStorage.setItem(storagePrefix + 'notices', JSON.stringify(notices));
}

function initScrollRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
    }, { threshold: 0.08 });

    document.querySelectorAll('.glass-panel, .super-tile').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        setTimeout(() => observer.observe(el), i * 30);
    });
}

function enterSuperAdminInstituteView(slug) {
    const allCols = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
    const targetCol = allCols.find(c => c.slug === slug);
    if (!targetCol) return;

    superAdminViewingSlug = slug;
    loadCollegeWorkspaceData(targetCol);

    document.getElementById('topbar-org-title').innerText = `${targetCol.name} (Super Admin Control)`;
    document.getElementById('topbar-cat-pill').innerText = `🏢 ${targetCol.category || 'Institute'}`;
    document.getElementById('topbar-city-tag').innerText = `• ${targetCol.city} • Live Control`;
    document.getElementById('topbar-logo-box').innerHTML = targetCol.logo ? `<img src="${targetCol.logo}" class="w-full h-full object-cover">` : "🏢";
    document.getElementById('sidebar-user-badge').innerText = "👑 Master Control Mode";

    const menu = getDynamicMenuItems();
    activeTab = menu.length > 1 ? menu[1].id : 'dashboard';
    switchTab(activeTab);
}

function exitSuperAdminInstituteView() {
    superAdminViewingSlug = null;
    currentCollege = null;
    document.getElementById('topbar-org-title').innerText = "VidyaSetu Central Master Control";
    document.getElementById('topbar-cat-pill').innerText = "👑 Multiplex HQ";
    document.getElementById('topbar-city-tag').innerText = "• Global Admin Console";
    document.getElementById('topbar-logo-box').innerHTML = getVidyaSetuSVGLogo(48);
    document.getElementById('sidebar-user-badge').innerText = "● Master Owner";

    activeTab = 'super_colleges';
    switchTab('super_colleges');
}

function downloadCSVFile(csvContent, fileName) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }));
    link.download = fileName.replace(/\s+/g, '_');
    link.click();
}

function syncAnimatedSwitches() {
    const isHi = currentLang === 'hi';
    const isDark = document.documentElement.classList.contains('dark');

    const loginPill = document.getElementById('login-lang-pill');
    if (loginPill) {
        loginPill.classList.toggle('is-hi', isHi);
        document.getElementById('lbl-pill-en').className = `lang-pill-label ${!isHi ? 'text-white' : 'text-slate-400'}`;
        document.getElementById('lbl-pill-hi').className = `lang-pill-label ${isHi ? 'text-white' : 'text-slate-400'}`;
    }

    const topPill = document.getElementById('topbar-lang-pill');
    if (topPill) {
        topPill.classList.toggle('is-hi', isHi);
        document.getElementById('top-pill-en').className = `lang-pill-label ${!isHi ? 'text-white' : 'text-slate-400'}`;
        document.getElementById('top-pill-hi').className = `lang-pill-label ${isHi ? 'text-white' : 'text-slate-400'}`;
    }

    const icon = isDark ? '🌙' : '☀️';
    if (document.getElementById('login-theme-icon')) document.getElementById('login-theme-icon').innerText = icon;
    if (document.getElementById('topbar-theme-icon')) document.getElementById('topbar-theme-icon').innerText = icon;
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('vidyasetu_lang', currentLang);
    syncAnimatedSwitches();
    if (!document.getElementById('landing-view').classList.contains('hidden')) { renderVidyaSetuLandingPage(); initScrollRevealAnimations(); }
    if (!document.getElementById('login-screen').classList.contains('hidden')) updateLoginScreenLanguage();
    if (loggedUser) { updateSidebarStaticText(); renderApp(); }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    syncAnimatedSwitches();
    if (!document.getElementById('landing-view').classList.contains('hidden')) { renderVidyaSetuLandingPage(); initScrollRevealAnimations(); }
}

window.onload = function() {
    syncAnimatedSwitches();
    if (portalMode === 'superadmin') {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('login-role-selector-box').classList.add('hidden');
        updateLoginScreenLanguage();
    } else if (collegeSlug) {
        if (!currentCollege) {
            document.body.innerHTML = `<div class="min-h-screen flex flex-col justify-center items-center p-6 text-center"><h1 class="text-3xl font-extrabold text-rose-500">404 • Invalid Institute URL</h1><a href="?" class="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold">Go to VidyaSetu Home</a></div>`;
            return;
        }
        const isExpired = currentCollege.expiryDate && new Date(currentCollege.expiryDate) < new Date();
        if (!currentCollege.active || isExpired) {
            document.body.innerHTML = `<div class="min-h-screen flex flex-col justify-center items-center p-6 text-center"><h1 class="text-3xl font-extrabold text-rose-500">⛔ Subscription Expired / Suspended</h1><p class="text-sm adaptive-sub mt-2">The subscription for <strong>${currentCollege.name}</strong> has expired (${currentCollege.expiryDate || ''}). Contact VidyaSetu Support (+91 8574210020) for renewal.</p></div>`;
            return;
        }
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('login-role-selector-box').classList.remove('hidden');
        updateLoginScreenLanguage();
    } else {
        document.getElementById('landing-view').classList.remove('hidden');
        renderVidyaSetuLandingPage();
        initScrollRevealAnimations();
    }
};

function updateRoleHint() {
    if (!currentCollege) return;
    const roleVal = document.getElementById('login-role-select').value;
    const hintEl = document.getElementById('demo-credentials-hint');
    if (roleVal === 'admin') {
        hintEl.innerHTML = `Admin ID: <strong class="text-indigo-400">${currentCollege.adminUser}</strong> | Password: <strong class="text-indigo-400">${currentCollege.adminPass}</strong>`;
    } else if (roleVal === 'staff') {
        hintEl.innerHTML = `Staff Demo: <strong class="text-emerald-400">clerk1</strong> or <strong class="text-emerald-400">teacher1</strong> (Pass: 123)`;
    } else {
        hintEl.innerHTML = `Student / Member Login: Roll No. <strong class="text-cyan-400">101</strong> | Mobile: <strong class="text-cyan-400">9876543210</strong>`;
    }
}

function updateLoginScreenLanguage() {
    const isHi = currentLang === 'hi';
    const titleEl = document.getElementById('login-portal-title');
    const subEl = document.getElementById('login-portal-subtitle');
    const logoEl = document.getElementById('login-logo-box');
    const hintEl = document.getElementById('demo-credentials-hint');
    const btnEl = document.getElementById('login-submit-btn');

    btnEl.innerText = isHi ? '🔐 सुरक्षित लॉगिन करें' : '🔐 Secure Login';

    if (portalMode === 'superadmin') {
        titleEl.innerText = isHi ? "👑 विद्यासेतु मास्टर कंट्रोल पैनल" : "👑 VidyaSetu Master Control Panel";
        subEl.innerText = "Restricted Access • System Owner Only";
        logoEl.innerHTML = getVidyaSetuSVGLogo(64);
        btnEl.className = "super-btn w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg";
        hintEl.innerHTML = `Username: <strong class="text-purple-400">superadmin</strong> | Password: <strong class="text-purple-400">123</strong>`;
    } else if (currentCollege) {
        document.getElementById('login-category-badge').innerText = currentCollege.category || "VidyaSetu Institute";
        titleEl.innerText = currentCollege.name;
        subEl.innerText = isHi ? "अपना पद (Role) चुनें और लॉगिन करें" : "Choose your role and sign in";
        logoEl.innerHTML = currentCollege.logo ? `<img src="${currentCollege.logo}" class="w-full h-full object-cover">` : "🏢";
        updateRoleHint();
    }
}

function updateSidebarStaticText() {
    const isHi = currentLang === 'hi';
    document.getElementById('sidebar-menu-heading').innerText = isHi ? 'मुख्य मेन्यू' : 'Navigation Menu';
    document.getElementById('btn-logout').innerText = isHi ? '🚪 लॉगआउट करें' : '🚪 Logout';
}

function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error');

    if (portalMode === 'superadmin' && u === superAdminCredentials.username && p === superAdminCredentials.password) {
        loggedUser = { type: 'superadmin', name: superAdminCredentials.name, roleLabel: "Master Owner" };
        errBox.classList.add('hidden'); openDashboard(); return;
    } else if (currentCollege) {
        const selectedRole = document.getElementById('login-role-select').value;

        if (selectedRole === 'admin') {
            if (u === currentCollege.adminUser && p === currentCollege.adminPass) {
                loggedUser = { type: 'admin', name: "Institute Admin", roleLabel: "Master Admin", powers: currentCollege.powers };
                errBox.classList.add('hidden'); openDashboard(); return;
            }
        } else if (selectedRole === 'staff') {
            loadCurrentInstituteStaff();
            const foundStaff = staffList.find(st => st.username && st.password && st.username === u && st.password === p);
            if (foundStaff) {
                loggedUser = { type: 'user', name: foundStaff.name, roleLabel: foundStaff.role || "Staff", powers: foundStaff.powers || {} };
                errBox.classList.add('hidden'); openDashboard(); return;
            }
        } else if (selectedRole === 'student') {
            const foundStu = students.find(s => s.roll.toLowerCase() === u.toLowerCase() && s.mobile.includes(p));
            if (foundStu) {
                loggedUser = { type: 'student', studentData: foundStu, name: foundStu.name, roleLabel: `Student (${foundStu.class})` };
                errBox.classList.add('hidden'); openDashboard(); return;
            }
        }
    }
    errBox.innerText = "❌ Invalid Credentials for selected Role!";
    errBox.classList.remove('hidden');
}

function openDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');

    document.getElementById('topbar-org-title').innerText = loggedUser.type === 'superadmin' ? "VidyaSetu Central Master Control" : currentCollege.name;
    document.getElementById('topbar-cat-pill').innerText = loggedUser.type === 'superadmin' ? "👑 Multiplex HQ" : `🏢 ${currentCollege.category || 'Institute'}`;
    document.getElementById('topbar-city-tag').innerText = loggedUser.type === 'superadmin' ? "• Global Admin Console" : `• ${currentCollege.city} • Session 2026-27`;
    document.getElementById('topbar-logo-box').innerHTML = loggedUser.type === 'superadmin' ? getVidyaSetuSVGLogo(56) : (currentCollege.logo ? `<img src="${currentCollege.logo}" class="w-full h-full object-cover">` : "🏢");
    
    document.getElementById('sidebar-user-badge').innerText = `● ${loggedUser.roleLabel}`;
    document.getElementById('logged-user-name').innerText = loggedUser.name;

    // Expiry Warning Banner Check
    const warnBanner = document.getElementById('expiry-warning-banner');
    if (currentCollege && currentCollege.expiryDate && loggedUser.type !== 'superadmin') {
        const daysLeft = Math.ceil((new Date(currentCollege.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 15 && daysLeft >= 0) {
            warnBanner.innerText = `⚠️ Subscription Renewal Alert: Your VidyaSetu portal expires in ${daysLeft} days (${currentCollege.expiryDate}). Contact Admin to renew.`;
            warnBanner.classList.remove('hidden');
        } else {
            warnBanner.classList.add('hidden');
        }
    } else {
        warnBanner.classList.add('hidden');
    }

    syncAnimatedSwitches();
    updateSidebarStaticText();
    const menu = getDynamicMenuItems();
    activeTab = menu.length > 0 ? menu[0].id : 'no_access';
    switchTab(activeTab);
}

function logoutUser() {
    loggedUser = null; editingStaffIndex = null; superAdminViewingSlug = null;
    document.getElementById('login-username').value = "";
    document.getElementById('login-password').value = "";
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    updateLoginScreenLanguage();
}

function getDynamicMenuItems() {
    if (!loggedUser) return [];
    const isHi = currentLang === 'hi';

    if (loggedUser.type === 'student') {
        return [{ id: 'student_portal', icon: '🎓', label: isHi ? 'मेरा डैशबोर्ड व रसीद' : 'My Portal & Receipts' }];
    }

    if (loggedUser.type === 'superadmin' && !superAdminViewingSlug) {
        return [
            { id: 'super_analytics', icon: '📊', label: isHi ? 'सुपर एनालिटिक्स' : 'Super Analytics' },
            { id: 'super_colleges', icon: '🏢', label: isHi ? 'मल्टीप्लेक्स संस्थान व URL' : 'Multiplex Institutes' },
            { id: 'super_leads', icon: '📩', label: isHi ? 'सब्स्क्रिप्शन Leads' : 'Subscription Leads' }
        ];
    }

    const cp = currentCollege.powers;
    if (loggedUser.type === 'admin' || (loggedUser.type === 'superadmin' && superAdminViewingSlug)) {
        const items = [];
        if (superAdminViewingSlug) items.push({ id: 'exit_inst_view', icon: '🔙', label: isHi ? 'सुपर एडमिन पर लौटें' : 'Back to Super Admin' });
        if (cp.allowGym) items.push({ id: 'gym_pro', icon: '💪', label: isHi ? 'जिम मेंबर्स व प्लान' : 'Gym & Fitness Pro' });
        if (cp.allowCompLab) items.push({ id: 'complab_pro', icon: '🖥️', label: isHi ? 'कंप्यूटर लैब PC मैप' : 'Computer Lab PCs' });
        if (cp.allowLibrary) items.push({ id: 'library_pro', icon: '📖', label: isHi ? 'लाइब्रेरी सीट व शिफ्ट' : 'Library Pro & Shifts' });
        if (cp.allowCoaching) items.push({ id: 'coaching_pro', icon: '💻', label: isHi ? 'कोचिंग बैच व सर्टिफिकेट' : 'Coaching & Certificates' });
        items.push({ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' });
        if (cp.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र / सदस्य एडमिशन' : 'Students & Members' });
        if (cp.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व रसीद डैशबोर्ड' : 'Fees & Receipts' });
        if (cp.allowPayroll) items.push({ id: 'staff', icon: '👔', label: isHi ? 'स्टाफ / ट्रेनर प्रबंधन' : 'Staff & Trainers' });
        if (cp.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
        if (cp.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
        if (cp.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance' });
        if (cp.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
        if (cp.allowExams || cp.allowAdmission) items.push({ id: 'certificates', icon: '📜', label: isHi ? 'TC व प्रवेश पत्र (Admit Card)' : 'TC & Admit Cards' });
        items.push({ id: 'branding', icon: '🎨', label: isHi ? 'लोगो, मुहर व बैकअप' : 'Logo, Stamp & Backup' });
        return items;
    }

    const p = loggedUser.powers;
    const items = [];
    if (p.dashboard) items.push({ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' });
    if (cp.allowGym) items.push({ id: 'gym_pro', icon: '💪', label: isHi ? 'जिम मेंबर्स व प्लान' : 'Gym & Fitness Pro' });
    if (cp.allowCompLab) items.push({ id: 'complab_pro', icon: '🖥️', label: isHi ? 'कंप्यूटर लैब PC मैप' : 'Computer Lab PCs' });
    if (p.library && cp.allowLibrary) items.push({ id: 'library_pro', icon: '📖', label: isHi ? 'लाइब्रेरी सीट व शिफ्ट' : 'Library Pro & Shifts' });
    if (p.students && cp.allowCoaching) items.push({ id: 'coaching_pro', icon: '💻', label: isHi ? 'कोचिंग बैच व सर्टिफिकेट' : 'Coaching & Certificates' });
    if (p.students && cp.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
    if (p.fees && cp.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व रसीद डैशबोर्ड' : 'Fees & Receipts' });
    if (p.staff && cp.allowPayroll) items.push({ id: 'staff', icon: '👔', label: isHi ? 'स्टाफ प्रबंधन (Staff)' : 'Staff Management' });
    if (p.accounts && cp.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
    if (p.notices && cp.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
    if (p.attendance && cp.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance' });
    if (p.exams && cp.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
    return items;
}

function switchTab(tabId) {
    if (tabId === 'exit_inst_view') { exitSuperAdminInstituteView(); return; }
    activeTab = tabId;
    editingStaffIndex = null;
    const main = document.getElementById('main-content');
    main.classList.remove('tab-transition');
    void main.offsetWidth;
    main.classList.add('tab-transition');
    renderApp();
    initScrollRevealAnimations();
}

function renderApp() {
    const isHi = currentLang === 'hi';
    const navEl = document.getElementById('dynamic-sidebar-nav');
    const mainEl = document.getElementById('main-content');
    const menuItems = getDynamicMenuItems();

    navEl.innerHTML = menuItems.map(item => `
        <button onclick="switchTab('${item.id}')" class="nav-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap ${item.id === 'exit_inst_view' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2' : (activeTab === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'adaptive-sub hover:bg-indigo-500/10')}">
            <span class="text-base">${item.icon}</span>
            <span>${item.label}</span>
        </button>
    `).join('');

    if (activeTab === 'student_portal') { mainEl.innerHTML = renderStudentSelfPortal(); return; }
    if (activeTab === 'super_analytics') { mainEl.innerHTML = renderSuperAnalyticsDashboard(); return; }
    if (activeTab === 'super_colleges') { mainEl.innerHTML = renderSuperAdminColleges(); return; }
    if (activeTab === 'super_leads') { mainEl.innerHTML = renderSubscriptionLeadsInbox(); return; }
    if (activeTab === 'branding') { mainEl.innerHTML = renderInstituteBrandingModule(); return; }
    if (activeTab === 'certificates') { mainEl.innerHTML = renderCertificatesModule(); return; }
    if (activeTab === 'dashboard') { mainEl.innerHTML = renderDashboardWithBirthdays(); return; }
    if (activeTab === 'gym_pro') { mainEl.innerHTML = renderGymProModule(); return; }
    if (activeTab === 'complab_pro') { mainEl.innerHTML = renderCompLabProModule(); return; }
    if (activeTab === 'library_pro') { mainEl.innerHTML = renderLibraryProModule(); return; }
    if (activeTab === 'coaching_pro') { mainEl.innerHTML = renderCoachingProModule(); return; }
    if (activeTab === 'fees') { mainEl.innerHTML = renderFeesDashboardModule(); return; }
    if (activeTab === 'staff') { mainEl.innerHTML = renderStaffManagementModule(); return; }

    let html = "";
    if (activeTab === 'attendance') {
        const classes = ["ALL", ...new Set(students.map(s => s.class))];
        const filtered = selectedAttClass === "ALL" ? students : students.filter(s => s.class === selectedAttClass);
        html = `
            <div class="glass-panel p-6 rounded-3xl">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                    <h3 class="font-extrabold text-xl text-indigo-500">✅ Smart Student Attendance</h3>
                    <div class="flex flex-wrap gap-2">
                        <select onchange="selectedAttClass=this.value; renderApp()" class="px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-xs font-bold">
                            ${classes.map(c => `<option value="${c}" ${selectedAttClass === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                        <input type="date" value="${selectedAttDate}" onchange="selectedAttDate=this.value" class="px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-xs font-bold">
                        <button onclick="exportAttendanceExcel()" class="super-btn bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold">📥 Export Excel</button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead><tr class="border-b border-slate-300/40 dark:border-slate-800 adaptive-sub text-xs"><th class="py-2">Student</th><th class="py-2">Status (P/A/L/H)</th><th class="py-2">Remark</th><th class="py-2">Alert</th></tr></thead>
                        <tbody>
                            ${filtered.map(s => {
                                const idx = students.findIndex(x => x.id === s.id);
                                return `
                                    <tr class="border-b border-slate-300/30 dark:border-slate-800/60">
                                        <td class="py-3 font-bold adaptive-title">${s.roll} • ${s.name} <div class="text-xs adaptive-sub font-normal">${s.class}</div></td>
                                        <td class="py-3 flex gap-1">
                                            ${['P','A','L','H'].map(st => `<button onclick="students[${idx}].attStatus='${st}'; saveData(); renderApp()" class="super-btn w-7 h-7 rounded text-xs font-bold ${s.attStatus === st ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 adaptive-sub'}">${st}</button>`).join('')}
                                        </td>
                                        <td class="py-3"><input type="text" value="${s.attRemark || ''}" onchange="students[${idx}].attRemark=this.value; saveData()" class="px-2 py-1 rounded border border-slate-400/40 dark:border-slate-700 bg-transparent text-xs w-36"></td>
                                        <td class="py-3">${s.attStatus === 'A' ? `<button onclick="sendAbsentWhatsApp(${idx})" class="super-btn bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold">💬 Alert</button>` : '—'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    else if (activeTab === 'students') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-panel p-5 rounded-3xl h-fit">
                    <h3 class="font-bold text-lg mb-4 text-indigo-500">➕ New Admission</h3>
                    <form onsubmit="addNewStudent(event)" class="space-y-3 text-sm">
                        <input type="text" id="stu-name" required placeholder="Student Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="stu-father" required placeholder="Father Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="stu-class" required placeholder="Class / Batch *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                            <input type="text" id="stu-roll" required placeholder="Roll *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="number" id="stu-total-fee" required value="12000" placeholder="Total Fee" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                            <input type="number" id="stu-paid-fee" required value="5000" placeholder="Initial Paid" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="stu-mobile" placeholder="WhatsApp No." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                            <input type="date" id="stu-dob" title="Date of Birth" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        </div>
                        <button type="submit" class="super-btn w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl">✅ Save Admission</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-panel p-5 rounded-3xl overflow-x-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg adaptive-title">Students / Members (${students.length})</h3>
                        <button onclick="exportCSV()" class="super-btn bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold">📥 Export Excel</button>
                    </div>
                    <table class="w-full text-left text-sm">
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b border-slate-300/30 dark:border-slate-800/50">
                                    <td class="py-3 font-bold adaptive-title">${s.roll} • ${s.name}</td>
                                    <td class="py-3 adaptive-sub">${s.class}</td>
                                    <td class="py-3 flex gap-2">
                                        <button onclick="viewIDCard(${idx})" class="super-btn bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded text-xs font-bold">🪪 ID</button>
                                        <button onclick="students.splice(${idx},1); saveData(); renderApp()" class="super-btn bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded text-xs">🗑️</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div id="modal-area" class="mt-4"></div>
                </div>
            </div>
        `;
    }
    else if (activeTab === 'accounts') {
        const inc = students.reduce((s, x) => s + Number(x.paidFee), 0);
        const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
        html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="glass-panel super-tile p-5 rounded-2xl border border-emerald-500/30"><div class="text-xs adaptive-sub">Income</div><div class="text-2xl font-extrabold text-emerald-500">₹${inc}</div></div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-rose-500/30"><div class="text-xs adaptive-sub">Expenses</div><div class="text-2xl font-extrabold text-rose-500">₹${exp}</div></div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-indigo-500/30"><div class="text-xs adaptive-sub">Net Balance</div><div class="text-2xl font-extrabold text-indigo-500">₹${inc - exp}</div></div>
            </div>
            <div class="glass-panel p-5 rounded-3xl">
                <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <form onsubmit="addExpense(event)" class="flex flex-wrap gap-2 flex-1">
                        <input type="text" id="exp-title" required placeholder="Expense Title *" class="flex-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-sm">
                        <input type="number" id="exp-amount" required placeholder="Amount *" class="w-32 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-sm">
                        <button type="submit" class="super-btn bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold">+ Add Expense</button>
                    </form>
                    <button onclick="exportAccountsExcel()" class="super-btn bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold">📥 Export Excel</button>
                </div>
                ${expenses.map((ex, idx) => `<div class="flex justify-between py-2 border-b border-slate-300/30 dark:border-slate-800 text-sm adaptive-title"><span>${ex.title} (${ex.date})</span><span class="text-rose-500 font-bold">₹${ex.amount} <button onclick="expenses.splice(${idx},1); saveData(); renderApp()" class="ml-2 text-xs">🗑️</button></span></div>`).join('')}
            </div>
        `;
    }
    else if (activeTab === 'notices') {
        html = `
            <div class="glass-panel p-5 rounded-3xl space-y-4">
                <form onsubmit="addNotice(event)" class="space-y-2">
                    <input type="text" id="not-title" required placeholder="Notice Title *" class="w-full px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-sm">
                    <textarea id="not-body" rows="2" required placeholder="Details *" class="w-full px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-sm"></textarea>
                    <button type="submit" class="super-btn bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold">🚀 Publish Notice</button>
                </form>
                ${notices.map((n, idx) => `
                    <div class="super-tile p-4 rounded-2xl border-l-4 border-indigo-500 flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <div class="font-bold text-sm adaptive-title">${n.title}</div>
                            <p class="text-xs adaptive-sub">${n.body}</p>
                        </div>
                        <div class="flex gap-2">
                            <a href="https://wa.me/?text=${encodeURIComponent(`📢 *Notice from ${orgName}*\n*${n.title}*\n${n.body}`)}" target="_blank" class="super-btn bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold">💬 Share on WhatsApp</a>
                            <button onclick="notices.splice(${idx},1); saveData(); renderApp()" class="text-xs text-rose-500">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    else if (activeTab === 'exams') {
        html = `
            <div class="glass-panel p-6 rounded-3xl space-y-3">
                <h3 class="font-bold text-lg adaptive-title">📝 Marksheets & ID Cards</h3>
                ${students.map((s, idx) => `
                    <div class="super-tile p-3 rounded-xl border border-slate-300/40 dark:border-slate-800 flex justify-between items-center">
                        <span class="font-bold text-sm adaptive-title">${s.name} (${s.class})</span>
                        <div class="flex gap-2">
                            <button onclick="viewMarksheet(${idx})" class="super-btn bg-amber-600 text-white px-2.5 py-1 rounded text-xs font-bold">📄 Marksheet</button>
                            <button onclick="viewIDCard(${idx})" class="super-btn bg-indigo-600 text-white px-2.5 py-1 rounded text-xs font-bold">🪪 ID Card</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div id="modal-area" class="mt-6"></div>
        `;
    }

    mainEl.innerHTML = html;
}

// Dashboard + Today's Birthday Wishes Card
function renderDashboardWithBirthdays() {
    const baseDash = typeof renderHighTechDashboard === 'function' ? renderHighTechDashboard() : '';
    const todayMD = new Date().toISOString().slice(5, 10);
    const bdayList = students.filter(s => s.dob && s.dob.slice(5, 10) === todayMD);

    if (bdayList.length === 0) return baseDash;

    const bdayHtml = `
        <div class="glass-panel super-tile p-5 rounded-3xl border-2 border-pink-500/40 mb-6 flex flex-wrap justify-between items-center gap-4">
            <div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">🎂 Today's Campus Birthday Celebration</span>
                <h3 class="font-extrabold text-base adaptive-title mt-0.5">Happy Birthday to ${bdayList.map(b => b.name).join(', ')}!</h3>
            </div>
            <div class="flex flex-wrap gap-2">
                ${bdayList.map(b => `
                    <a href="https://wa.me/91${b.mobile.replace(/\D/g,'')}?text=${encodeURIComponent(`🎂 Happy Birthday *${b.name}*! Wishing you a bright future from *${orgName}*!`)}" target="_blank" class="super-btn bg-pink-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold">
                        🎉 Wish ${b.name} on WhatsApp
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    return bdayHtml + baseDash;
}

// Student / Member Self-Service Portal
function renderStudentSelfPortal() {
    const s = loggedUser.studentData;
    const due = Math.max(0, s.totalFee - s.paidFee);
    const stuIdx = students.findIndex(x => x.id === s.id);

    return `
        <div class="space-y-6">
            <div class="glass-panel p-6 rounded-3xl border border-indigo-500/30">
                <span class="text-xs font-bold text-indigo-400">🎓 Student Self-Service Portal</span>
                <h2 class="text-2xl font-black adaptive-title mt-1">Welcome, ${s.name}</h2>
                <p class="text-xs adaptive-sub">Class: ${s.class} | Roll No: ${s.roll} | Father: ${s.father}</p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                        <span class="text-xs adaptive-sub">Paid Fees</span>
                        <div class="text-2xl font-black text-emerald-500">₹${s.paidFee}</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                        <span class="text-xs adaptive-sub">Balance Due</span>
                        <div class="text-2xl font-black text-rose-500">₹${due}</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                        <span class="text-xs adaptive-sub">Attendance</span>
                        <div class="text-2xl font-black text-cyan-500">${s.monthlyPercent || 92}%</div>
                    </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-3">
                    <button onclick="viewMarksheet(${stuIdx})" class="super-btn bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold">📄 Download Marksheet</button>
                    <button onclick="viewIDCard(${stuIdx})" class="super-btn bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold">🪪 Download ID Card</button>
                </div>
            </div>
            <div id="modal-area"></div>
        </div>
    `;
}

// Helper Functions with Dynamic Institute Logo & Stamp
function addNewStudent(e) {
    e.preventDefault();
    const initPaid = Number(document.getElementById('stu-paid-fee').value);
    const todayStr = new Date().toISOString().split('T')[0];
    students.unshift({
        id: "STU" + Math.floor(100 + Math.random() * 900),
        name: document.getElementById('stu-name').value,
        father: document.getElementById('stu-father').value,
        class: document.getElementById('stu-class').value,
        roll: document.getElementById('stu-roll').value,
        mobile: document.getElementById('stu-mobile').value || "9800000000",
        dob: document.getElementById('stu-dob').value || "",
        totalFee: Number(document.getElementById('stu-total-fee').value),
        paidFee: initPaid,
        feeHistory: initPaid > 0 ? [{ receiptNo: "REC-" + Math.floor(10000 + Math.random() * 90000), date: todayStr, amount: initPaid, mode: "Cash", remark: "Admission Fee" }] : [],
        attStatus: "P", attRemark: "", monthlyPercent: 100,
        marks: { hindi: 85, english: 80, math: 88, science: 84 }
    });
    saveData(); renderApp();
}

function sendWhatsAppReminder(idx) { const s = students[idx]; const due = s.totalFee - s.paidFee; window.open(`https://wa.me/91${s.mobile.replace(/\D/g,'')}?text=${encodeURIComponent(`Dear ${s.father}, ₹${due} fee is pending for ${s.name} at ${orgName}.`)}`, '_blank'); }
function sendAbsentWhatsApp(idx) { const s = students[idx]; window.open(`https://wa.me/91${s.mobile.replace(/\D/g,'')}?text=${encodeURIComponent(`Dear ${s.father}, your ward ${s.name} is ABSENT today (${selectedAttDate}) at ${orgName}.`)}`, '_blank'); }
function addExpense(e) { e.preventDefault(); expenses.unshift({ id: Date.now(), title: document.getElementById('exp-title').value, amount: Number(document.getElementById('exp-amount').value), date: new Date().toLocaleDateString('en-IN') }); saveData(); renderApp(); }
function addNotice(e) { e.preventDefault(); notices.unshift({ id: Date.now(), title: document.getElementById('not-title').value, body: document.getElementById('not-body').value, date: new Date().toLocaleDateString('en-IN') }); saveData(); renderApp(); }

function viewMarksheet(idx) {
    const s = students[idx];
    const t = s.marks.hindi + s.marks.english + s.marks.math + s.marks.science;
    const html = `
        <div class="bg-white text-slate-900 p-7 rounded-2xl border-2 border-slate-900 max-w-xl mx-auto shadow-2xl">
            ${getOfficialPrintHeaderHTML("PROGRESS REPORT CARD")}
            <p class="text-xs mb-3"><strong>Student:</strong> ${s.name} (${s.class}) | <strong>Roll:</strong> ${s.roll} | <strong>Father:</strong> ${s.father}</p>
            <table class="w-full border border-slate-900 text-xs mb-4">
                <tr class="bg-slate-100 border-b border-slate-900"><th class="p-2 text-left">Subject</th><th class="p-2 text-right">Marks</th></tr>
                <tr class="border-b"><td class="p-2">Hindi</td><td class="p-2 text-right font-bold">${s.marks.hindi} / 100</td></tr>
                <tr class="border-b"><td class="p-2">English</td><td class="p-2 text-right font-bold">${s.marks.english} / 100</td></tr>
                <tr class="border-b"><td class="p-2">Mathematics</td><td class="p-2 text-right font-bold">${s.marks.math} / 100</td></tr>
                <tr class="border-b"><td class="p-2">Science</td><td class="p-2 text-right font-bold">${s.marks.science} / 100</td></tr>
                <tr class="bg-amber-50 font-extrabold text-sm"><td class="p-2">Grand Total</td><td class="p-2 text-right">${t} / 400 (${(t/4).toFixed(1)}%)</td></tr>
            </table>
            ${getOfficialPrintStampHTML("Class Teacher", "Principal / Controller Sign")}
        </div>
    `;
    document.getElementById('print-only-container').innerHTML = html;
    document.getElementById('modal-area').innerHTML = `${html}<div class="no-print text-center mt-3"><button onclick="window.print()" class="super-btn bg-amber-600 text-white px-5 py-2 rounded-xl text-xs font-bold">🖨️ Print Only Marksheet</button></div>`;
}

function viewIDCard(idx) {
    const s = students[idx];
    const logoHtml = orgLogo ? `<img src="${orgLogo}" class="w-12 h-12 rounded-xl mx-auto object-cover mb-1 border">` : '';
    const html = `
        <div class="bg-white text-slate-900 p-5 rounded-2xl border-2 border-indigo-700 max-w-xs mx-auto text-center shadow-xl">
            ${logoHtml}
            <h3 class="font-black text-sm uppercase text-indigo-800">${orgName}</h3>
            <div class="text-[10px] text-slate-500 mb-2">Official Identity Card • 2026-27</div>
            <div class="text-lg font-extrabold text-slate-900">${s.name}</div>
            <div class="text-xs font-bold text-indigo-600">${s.class} • Roll: ${s.roll}</div>
            <div class="text-[11px] text-slate-600 mt-2">Father: ${s.father}<br>Contact: ${s.mobile}</div>
        </div>
    `;
    document.getElementById('print-only-container').innerHTML = html;
    document.getElementById('modal-area').innerHTML = `${html}<div class="no-print text-center mt-3"><button onclick="window.print()" class="super-btn bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold">🖨️ Print Only ID Card</button></div>`;
}

function exportCSV() {
    let csv = "Roll,Student Name,Father Name,Class,Mobile,Total Fee,Paid Fee,Due Fee\n";
    students.forEach(s => { csv += `"${s.roll}","${s.name}","${s.father}","${s.class}","${s.mobile}",${s.totalFee},${s.paidFee},${s.totalFee - s.paidFee}\n`; });
    downloadCSVFile(csv, `${orgName}_Students_Report.csv`);
}
function exportAttendanceExcel() {
    let csv = "Date,Roll,Student Name,Class,Attendance Status,Remark\n";
    students.forEach(s => { csv += `"${selectedAttDate}","${s.roll}","${s.name}","${s.class}","${s.attStatus}","${s.attRemark || ''}"\n`; });
    downloadCSVFile(csv, `${orgName}_Attendance_${selectedAttDate}.csv`);
}
function exportAccountsExcel() {
    let csv = "Date,Expense Description,Amount\n";
    expenses.forEach(ex => { csv += `"${ex.date}","${ex.title}",${ex.amount}\n`; });
    downloadCSVFile(csv, `${orgName}_Expenses_Ledger.csv`);
}