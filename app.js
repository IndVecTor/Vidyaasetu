const urlParams = new URLSearchParams(window.location.search);
const portalMode = urlParams.get('portal') || '';
const collegeSlug = urlParams.get('college') || '';

let currentLang = localStorage.getItem('vidyasetu_lang') || 'en';
let editingUserIndex = null;
let selectedAttClass = "ALL";
let selectedAttDate = new Date().toISOString().split('T')[0];

let currentCollege = null;
if (collegeSlug) {
    const allCols = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
    currentCollege = allCols.find(c => c.slug === collegeSlug.toLowerCase());
}

const storagePrefix = currentCollege ? `vs_data_${currentCollege.slug}_` : `vs_data_default_`;

const defaultUsers = [
    { id: "USR01", name: "Rajesh Sharma", username: "teacher1", password: "123", roleLabel: "Senior Teacher", powers: { dashboard: false, students: false, fees: false, payroll: false, accounts: false, library: false, notices: true, attendance: true, exams: true } },
    { id: "USR02", name: "Sunita Verma", username: "clerk1", password: "123", roleLabel: "Office Clerk", powers: { dashboard: true, students: true, fees: true, payroll: true, accounts: true, library: false, notices: true, attendance: false, exams: false } }
];

const superAdminCredentials = { username: "superadmin", password: "123", name: "Aman Kumar (Master Admin)" };

const defaultStudents = [
    { id: "STU101", name: "Aarav Sharma", father: "Rajesh Sharma", class: "Class 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attStatus: "P", attRemark: "On Time", monthlyPercent: 94, marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "Ananya Verma", father: "Suresh Verma", class: "Class 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attStatus: "L", attRemark: "Medical Leave", monthlyPercent: 88, marks: { hindi: 92, english: 89, math: 78, science: 85 } }
];

const defaultExpenses = [{ id: 1, title: "Electricity & Internet Bill", amount: 3200, date: "10/11/2026" }];
const defaultNotices = [{ id: 1, title: "Welcome to Digital Campus", body: "All academic and fee records are now live on VidyaSetu.", date: "24/11/2026" }];
const defaultSeats = Array.from({ length: 20 }, (_, i) => ({ seatNo: i + 1, status: i === 0 ? "booked" : "available", studentName: i === 0 ? "Aarav Sharma" : "" }));

let appUsers = JSON.parse(localStorage.getItem(storagePrefix + 'users')) || defaultUsers;
let students = JSON.parse(localStorage.getItem(storagePrefix + 'students')) || defaultStudents;
let expenses = JSON.parse(localStorage.getItem(storagePrefix + 'expenses')) || defaultExpenses;
let notices = JSON.parse(localStorage.getItem(storagePrefix + 'notices')) || defaultNotices;
let librarySeats = JSON.parse(localStorage.getItem(storagePrefix + 'seats')) || defaultSeats;
let orgName = currentCollege ? currentCollege.name : "VidyaSetu Institute";
let orgLogo = currentCollege ? currentCollege.logo : "";

let loggedUser = null;
let activeTab = "";

function saveData() {
    localStorage.setItem(storagePrefix + 'users', JSON.stringify(appUsers));
    localStorage.setItem(storagePrefix + 'students', JSON.stringify(students));
    localStorage.setItem(storagePrefix + 'expenses', JSON.stringify(expenses));
    localStorage.setItem(storagePrefix + 'notices', JSON.stringify(notices));
    localStorage.setItem(storagePrefix + 'seats', JSON.stringify(librarySeats));
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
    if (!document.getElementById('landing-view').classList.contains('hidden')) renderVidyaSetuLandingPage();
    if (!document.getElementById('login-screen').classList.contains('hidden')) updateLoginScreenLanguage();
    if (loggedUser) { updateSidebarStaticText(); renderApp(); }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    syncAnimatedSwitches();
    if (!document.getElementById('landing-view').classList.contains('hidden')) renderVidyaSetuLandingPage();
}

window.onload = function() {
    syncAnimatedSwitches();
    if (portalMode === 'superadmin') {
        document.getElementById('login-screen').classList.remove('hidden');
        updateLoginScreenLanguage();
    } else if (collegeSlug) {
        if (!currentCollege) {
            document.body.innerHTML = `<div class="min-h-screen flex flex-col justify-center items-center p-6 text-center"><h1 class="text-3xl font-extrabold text-rose-500">404 • Invalid College URL</h1><p class="text-sm text-slate-400 mt-2">This institute link does not exist on VidyaSetu.</p><a href="?" class="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold">Go to VidyaSetu Home</a></div>`;
            return;
        }
        if (!currentCollege.active) {
            document.body.innerHTML = `<div class="min-h-screen flex flex-col justify-center items-center p-6 text-center"><h1 class="text-3xl font-extrabold text-amber-500">⛔ Subscription Suspended</h1><p class="text-sm text-slate-400 mt-2">The portal for <strong>${currentCollege.name}</strong> is currently inactive.</p></div>`;
            return;
        }
        document.getElementById('login-screen').classList.remove('hidden');
        updateLoginScreenLanguage();
    } else {
        document.getElementById('landing-view').classList.remove('hidden');
        renderVidyaSetuLandingPage();
    }
};

function updateLoginScreenLanguage() {
    const isHi = currentLang === 'hi';
    const titleEl = document.getElementById('login-portal-title');
    const subEl = document.getElementById('login-portal-subtitle');
    const logoEl = document.getElementById('login-logo-box');
    const hintEl = document.getElementById('demo-credentials-hint');
    const btnEl = document.getElementById('login-submit-btn');

    document.getElementById('lbl-username').innerText = isHi ? 'यूज़रनेम (Username)' : 'Username';
    document.getElementById('lbl-password').innerText = isHi ? 'पासवर्ड (Password)' : 'Password';
    btnEl.innerText = isHi ? '🔐 सुरक्षित लॉगिन करें' : '🔐 Secure Login';

    if (portalMode === 'superadmin') {
        titleEl.innerText = isHi ? "👑 विद्यासेतु मास्टर कंट्रोल पैनल" : "👑 VidyaSetu Master Control Panel";
        subEl.innerText = isHi ? "केवल सिस्टम मालिक के लिए प्रतिबंधित प्रवेश" : "Restricted Access • System Owner Only";
        logoEl.innerHTML = "👑";
        btnEl.className = "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition";
        hintEl.innerHTML = `Username: <strong class="text-purple-400">superadmin</strong> | Password: <strong class="text-purple-400">123</strong>`;
    } else if (currentCollege) {
        titleEl.innerText = currentCollege.name;
        subEl.innerText = isHi ? "संस्थान एडमिन एवं स्टाफ लॉगिन पोर्टल" : "Institute Admin & Staff Login Portal";
        logoEl.innerHTML = currentCollege.logo ? `<img src="${currentCollege.logo}" class="w-full h-full object-cover">` : "🏫";
        hintEl.innerHTML = isHi ? `प्रिंसिपल लॉगिन: <strong>${currentCollege.adminUser}</strong> (पासवर्ड: ${currentCollege.adminPass}) | स्टाफ: <strong>clerk1</strong>` : `Principal Login: <strong>${currentCollege.adminUser}</strong> (Pass: ${currentCollege.adminPass}) | Staff: <strong>clerk1</strong>`;
    }
}

function updateSidebarStaticText() {
    const isHi = currentLang === 'hi';
    document.getElementById('sidebar-menu-heading').innerText = isHi ? 'मुख्य मेन्यू' : 'Navigation Menu';
    document.getElementById('btn-logout').innerText = isHi ? '🚪 लॉगआउट करें' : '🚪 Logout';
}

function handleLogin(e) {
    e.preventDefault();
    const isHi = currentLang === 'hi';
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error');

    if (portalMode === 'superadmin' && u === superAdminCredentials.username && p === superAdminCredentials.password) {
        loggedUser = { type: 'superadmin', name: superAdminCredentials.name, roleLabel: "Master Owner" };
        errBox.classList.add('hidden'); openDashboard(); return;
    } else if (currentCollege) {
        if (u === currentCollege.adminUser && p === currentCollege.adminPass) {
            loggedUser = { type: 'admin', name: "Principal / Admin", roleLabel: "College Admin", powers: currentCollege.powers };
            errBox.classList.add('hidden'); openDashboard(); return;
        }
        const foundUser = appUsers.find(user => user.username === u && user.password === p);
        if (foundUser) {
            loggedUser = { type: 'user', ...foundUser };
            errBox.classList.add('hidden'); openDashboard(); return;
        }
    }
    errBox.innerText = isHi ? "❌ गलत यूज़रनेम या पासवर्ड!" : "❌ Invalid Username or Password!";
    errBox.classList.remove('hidden');
}

function openDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');

    document.getElementById('topbar-org-title').innerText = loggedUser.type === 'superadmin' ? "VidyaSetu Central Master Control" : currentCollege.name;
    document.getElementById('topbar-city-tag').innerText = loggedUser.type === 'superadmin' ? "• Global Admin Console" : `• ${currentCollege.city} • Session 2026-27`;
    document.getElementById('topbar-logo-box').innerHTML = loggedUser.type === 'superadmin' ? "👑" : (currentCollege.logo ? `<img src="${currentCollege.logo}" class="w-full h-full object-cover">` : "🏫");
    
    document.getElementById('sidebar-user-badge').innerText = `● ${loggedUser.roleLabel}`;
    document.getElementById('logged-user-name').innerText = loggedUser.name;

    syncAnimatedSwitches();
    updateSidebarStaticText();
    const menu = getDynamicMenuItems();
    activeTab = menu.length > 0 ? menu[0].id : 'no_access';
    switchTab(activeTab);
}

function logoutUser() {
    loggedUser = null; editingUserIndex = null;
    document.getElementById('login-username').value = "";
    document.getElementById('login-password').value = "";
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    updateLoginScreenLanguage();
}

function getDynamicMenuItems() {
    if (!loggedUser) return [];
    const isHi = currentLang === 'hi';

    if (loggedUser.type === 'superadmin') {
        return [
            { id: 'super_analytics', icon: '📊', label: isHi ? 'सुपर एनालिटिक्स' : 'Super Analytics' },
            { id: 'super_colleges', icon: '🏫', label: isHi ? 'कॉलेज व कस्टम URL' : 'Colleges & Custom URLs' },
            { id: 'super_leads', icon: '📩', label: isHi ? 'सब्स्क्रिप्शन फॉर्म डेटा' : 'Subscription Leads' }
        ];
    }

    const cp = currentCollege.powers;
    if (loggedUser.type === 'admin') {
        const items = [{ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' }];
        if (cp.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
        if (cp.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp' });
        if (cp.allowPayroll) items.push({ id: 'payroll', icon: '💳', label: isHi ? 'शिक्षक व सैलरी स्लिप' : 'Staff & Payroll' });
        if (cp.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
        if (cp.allowLibrary) items.push({ id: 'library', icon: '🪑', label: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats' });
        if (cp.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
        if (cp.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance' });
        if (cp.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
        items.push({ id: 'manage_users', icon: '🔐', label: isHi ? 'कस्टम पद व स्टाफ लॉगिन' : 'Custom Posts & Logins' });
        return items;
    }

    const p = loggedUser.powers;
    const items = [];
    if (p.dashboard) items.push({ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' });
    if (p.students && cp.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
    if (p.fees && cp.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp' });
    if (p.payroll && cp.allowPayroll) items.push({ id: 'payroll', icon: '💳', label: isHi ? 'शिक्षक व सैलरी स्लिप' : 'Staff & Payroll' });
    if (p.accounts && cp.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
    if (p.library && cp.allowLibrary) items.push({ id: 'library', icon: '🪑', label: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats' });
    if (p.notices && cp.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
    if (p.attendance && cp.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance' });
    if (p.exams && cp.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
    return items;
}

function switchTab(tabId) {
    activeTab = tabId;
    editingUserIndex = null;
    const main = document.getElementById('main-content');
    main.classList.remove('tab-transition');
    void main.offsetWidth;
    main.classList.add('tab-transition');
    renderApp();
}

function renderApp() {
    const isHi = currentLang === 'hi';
    const navEl = document.getElementById('dynamic-sidebar-nav');
    const mainEl = document.getElementById('main-content');
    const menuItems = getDynamicMenuItems();

    navEl.innerHTML = menuItems.map(item => `
        <button onclick="switchTab('${item.id}')" class="nav-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap ${activeTab === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/80'}">
            <span class="text-base">${item.icon}</span>
            <span>${item.label}</span>
        </button>
    `).join('');

    if (activeTab === 'super_analytics') { mainEl.innerHTML = renderSuperAnalyticsDashboard(); return; }
    if (activeTab === 'super_colleges') { mainEl.innerHTML = renderSuperAdminColleges(); return; }
    if (activeTab === 'super_leads') { mainEl.innerHTML = renderSubscriptionLeadsInbox(); return; }
    if (activeTab === 'dashboard') { mainEl.innerHTML = renderHighTechDashboard(); return; }
    if (activeTab === 'payroll') { mainEl.innerHTML = renderStaffPayrollModule(); return; }

    let html = "";
    if (activeTab === 'manage_users') {
        const editObj = editingUserIndex !== null ? appUsers[editingUserIndex] : null;
        const collegePosts = (currentCollege && currentCollege.customPosts) ? currentCollege.customPosts : ["Vice Principal", "Office Clerk", "Teacher", "Accountant", "Librarian"];

        html = `
            <div class="space-y-6">
                <div class="glass-panel p-5 rounded-2xl border border-indigo-500/30 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h4 class="font-bold text-sm text-indigo-400">${isHi ? '🏷️ संस्थान के कस्टम पद (Custom Posts / Designations)' : '🏷️ Institute Custom Posts / Designations'}</h4>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            ${collegePosts.map((p, pIdx) => `
                                <span class="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                    ${p}
                                    <button onclick="deleteInstitutePost(${pIdx})" class="text-rose-400 hover:text-rose-300 text-[10px]">✖</button>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    <form onsubmit="addInstitutePost(event)" class="flex gap-2">
                        <input type="text" id="inst-new-post" required placeholder="${isHi ? 'नया पद जोड़ें (जैसे: Clerk)' : 'Add new post...'}" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs">
                        <button type="submit" class="bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold">+ Add Post</button>
                    </form>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="glass-panel p-6 rounded-2xl border ${editObj ? 'border-amber-500/50' : 'border-indigo-500/30'} h-fit">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-extrabold text-lg ${editObj ? 'text-amber-400' : 'text-indigo-400'}">${editObj ? (isHi ? '✏️ स्टाफ यूज़र एडिट करें' : '✏️ Edit Staff User') : (isHi ? '🔐 नया स्टाफ लॉगिन बनाएं' : '🔐 Create Staff Login')}</h3>
                            ${editObj ? `<button onclick="editingUserIndex=null; renderApp()" class="text-xs text-rose-400 underline">Cancel</button>` : ''}
                        </div>
                        <form onsubmit="saveUserForm(event)" class="space-y-3 text-sm">
                            <input type="text" id="new-u-fullname" required value="${editObj ? editObj.name : ''}" placeholder="${isHi ? 'कर्मचारी का पूरा नाम *' : 'Staff Full Name *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            
                            <div>
                                <label class="text-[11px] font-bold text-slate-400">${isHi ? 'पद चुनें (Select Custom Post) *' : 'Select Custom Post *'}</label>
                                <select id="new-u-role" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 font-bold text-indigo-300">
                                    ${collegePosts.map(p => `<option value="${p}" ${editObj && editObj.roleLabel === p ? 'selected' : ''}>${p}</option>`).join('')}
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <input type="text" id="new-u-username" required value="${editObj ? editObj.username : ''}" placeholder="${isHi ? 'यूज़रनेम *' : 'Username *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                                <input type="text" id="new-u-password" required value="${editObj ? editObj.password : ''}" placeholder="${isHi ? 'पासवर्ड *' : 'Password *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            </div>

                            <div class="text-[11px] font-bold text-slate-400 pt-1">${isHi ? 'इस पद के लिए पावर चुनें:' : 'Assign Powers for this Post:'}</div>
                            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-dashboard" ${editObj ? (editObj.powers.dashboard ? 'checked' : '') : 'checked'}> Dashboard</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-students" ${editObj && editObj.powers.students ? 'checked' : ''}> Admission</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-fees" ${editObj && editObj.powers.fees ? 'checked' : ''}> Fees</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-payroll" ${editObj && editObj.powers.payroll ? 'checked' : ''}> Payroll</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-accounts" ${editObj && editObj.powers.accounts ? 'checked' : ''}> Accounts</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-library" ${editObj && editObj.powers.library ? 'checked' : ''}> Library</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-notices" ${editObj ? (editObj.powers.notices ? 'checked' : '') : 'checked'}> Notices</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-attendance" ${editObj && editObj.powers.attendance ? 'checked' : ''}> Attendance</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-exams" ${editObj && editObj.powers.exams ? 'checked' : ''}> Exams</label>
                            </div>
                            <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl">${editObj ? '💾 Update Staff' : '✅ Create Staff Login'}</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                        <h3 class="font-bold text-lg">${isHi ? 'सक्रिय स्टाफ यूज़र्स' : 'Active Staff Users'} (${appUsers.length})</h3>
                        ${appUsers.map((u, idx) => `
                            <div class="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                <div>
                                    <div class="font-bold">${u.name} <span class="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full ml-1">${u.roleLabel}</span></div>
                                    <div class="text-xs text-slate-400 mt-1">User: <strong class="text-emerald-400">${u.username}</strong> | Pass: <strong class="text-amber-400">${u.password}</strong></div>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editingUserIndex=${idx}; renderApp()" class="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold">✏️ Edit</button>
                                    <button onclick="appUsers.splice(${idx},1); saveData(); renderApp()" class="bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    else if (activeTab === 'attendance') {
        const classes = ["ALL", ...new Set(students.map(s => s.class))];
        const filtered = selectedAttClass === "ALL" ? students : students.filter(s => s.class === selectedAttClass);
        html = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                    <h3 class="font-extrabold text-xl text-indigo-400">${isHi ? '✅ स्मार्ट छात्र उपस्थिति' : '✅ Smart Student Attendance'}</h3>
                    <div class="flex gap-2">
                        <select onchange="selectedAttClass=this.value; renderApp()" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold">
                            ${classes.map(c => `<option value="${c}" ${selectedAttClass === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                        <input type="date" value="${selectedAttDate}" onchange="selectedAttDate=this.value" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold">
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead><tr class="border-b border-slate-800 text-slate-400 text-xs"><th class="py-2">Student</th><th class="py-2">Status (P/A/L/H)</th><th class="py-2">Remark</th><th class="py-2">Alert</th></tr></thead>
                        <tbody>
                            ${filtered.map(s => {
                                const idx = students.findIndex(x => x.id === s.id);
                                return `
                                    <tr class="border-b border-slate-800/60">
                                        <td class="py-3 font-bold">${s.roll} • ${s.name} <div class="text-xs text-slate-400 font-normal">${s.class}</div></td>
                                        <td class="py-3 flex gap-1">
                                            ${['P','A','L','H'].map(st => `<button onclick="students[${idx}].attStatus='${st}'; saveData(); renderApp()" class="w-7 h-7 rounded text-xs font-bold ${s.attStatus === st ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}">${st}</button>`).join('')}
                                        </td>
                                        <td class="py-3"><input type="text" value="${s.attRemark || ''}" onchange="students[${idx}].attRemark=this.value; saveData()" class="px-2 py-1 rounded border border-slate-700 bg-slate-900 text-xs w-36"></td>
                                        <td class="py-3">${s.attStatus === 'A' ? `<button onclick="sendAbsentWhatsApp(${idx})" class="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold">💬 Alert</button>` : '—'}</td>
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
                <div class="glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-indigo-400">➕ New Admission</h3>
                    <form onsubmit="addNewStudent(event)" class="space-y-3 text-sm">
                        <input type="text" id="stu-name" required placeholder="Student Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <input type="text" id="stu-father" required placeholder="Father Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="stu-class" required placeholder="Class *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            <input type="text" id="stu-roll" required placeholder="Roll *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="number" id="stu-total-fee" required value="12000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            <input type="number" id="stu-paid-fee" required value="5000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <input type="text" id="stu-mobile" placeholder="WhatsApp No." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl">✅ Save</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">Students (${students.length})</h3>
                    <table class="w-full text-left text-sm">
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b border-slate-800/50">
                                    <td class="py-3 font-bold">${s.roll} • ${s.name}</td>
                                    <td class="py-3">${s.class}</td>
                                    <td class="py-3 flex gap-2">
                                        <button onclick="viewIDCard(${idx})" class="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded text-xs font-bold">🪪 ID</button>
                                        <button onclick="students.splice(${idx},1); saveData(); renderApp()" class="bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded text-xs">🗑️</button>
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
    else if (activeTab === 'fees') {
        html = `
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                <h3 class="font-bold text-lg mb-4">💰 Fees & WhatsApp</h3>
                <table class="w-full text-left text-sm">
                    <tbody>
                        ${students.map((s, idx) => {
                            const due = s.totalFee - s.paidFee;
                            return `
                                <tr class="border-b border-slate-800/50">
                                    <td class="py-3 font-bold">${s.name}</td>
                                    <td class="py-3 text-emerald-400 font-bold">Paid: ₹${s.paidFee}</td>
                                    <td class="py-3 text-rose-400 font-bold">Due: ₹${due}</td>
                                    <td class="py-3 flex gap-2">
                                        ${due > 0 ? `<button onclick="collectFee(${idx})" class="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-bold">+ Pay</button><button onclick="sendWhatsAppReminder(${idx})" class="bg-green-500 text-white px-2.5 py-1 rounded text-xs font-bold">💬 WhatsApp</button>` : ''}
                                        <button onclick="printReceipt(${idx})" class="bg-indigo-600 text-white px-2.5 py-1 rounded text-xs font-bold">🧾 Receipt</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div id="modal-area" class="mt-6"></div>
        `;
    }
    else if (activeTab === 'accounts') {
        const inc = students.reduce((s, x) => s + Number(x.paidFee), 0);
        const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
        html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="glass-panel p-5 rounded-2xl border border-emerald-500/30"><div class="text-xs text-slate-400">Income</div><div class="text-2xl font-extrabold text-emerald-400">₹${inc}</div></div>
                <div class="glass-panel p-5 rounded-2xl border border-rose-500/30"><div class="text-xs text-slate-400">Expenses</div><div class="text-2xl font-extrabold text-rose-400">₹${exp}</div></div>
                <div class="glass-panel p-5 rounded-2xl border border-indigo-500/30"><div class="text-xs text-slate-400">Net Balance</div><div class="text-2xl font-extrabold text-indigo-400">₹${inc - exp}</div></div>
            </div>
            <div class="glass-panel p-5 rounded-2xl border border-slate-800">
                <form onsubmit="addExpense(event)" class="flex flex-wrap gap-2 mb-4">
                    <input type="text" id="exp-title" required placeholder="Expense Title *" class="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm">
                    <input type="number" id="exp-amount" required placeholder="Amount *" class="w-32 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm">
                    <button type="submit" class="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold">+ Add Expense</button>
                </form>
                ${expenses.map((ex, idx) => `<div class="flex justify-between py-2 border-b border-slate-800 text-sm"><span>${ex.title}</span><span class="text-rose-400 font-bold">₹${ex.amount} <button onclick="expenses.splice(${idx},1); saveData(); renderApp()" class="ml-2 text-xs">🗑️</button></span></div>`).join('')}
            </div>
        `;
    }
    else if (activeTab === 'library') {
        html = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">🪑 Library Seats</h3>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    ${librarySeats.map((seat, idx) => `
                        <div onclick="manageSeat(${idx})" class="cursor-pointer p-4 rounded-2xl border ${seat.status === 'booked' ? 'border-rose-500/50 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/5'}">
                            <div class="font-bold text-sm">Seat #${seat.seatNo}</div>
                            <div class="text-xs mt-1">${seat.status === 'booked' ? seat.studentName : '+ Available'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (activeTab === 'notices') {
        html = `
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <form onsubmit="addNotice(event)" class="space-y-2">
                    <input type="text" id="not-title" required placeholder="Notice Title *" class="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm">
                    <textarea id="not-body" rows="2" required placeholder="Details *" class="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm"></textarea>
                    <button type="submit" class="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold">🚀 Publish</button>
                </form>
                ${notices.map((n, idx) => `<div class="p-3 rounded-xl border-l-4 border-indigo-500 bg-slate-900/50 flex justify-between"><div><div class="font-bold text-sm">${n.title}</div><p class="text-xs text-slate-400">${n.body}</p></div><button onclick="notices.splice(${idx},1); saveData(); renderApp()" class="text-xs text-rose-400">🗑️</button></div>`).join('')}
            </div>
        `;
    }
    else if (activeTab === 'exams') {
        html = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 class="font-bold text-lg">📝 Marksheets & ID Cards</h3>
                ${students.map((s, idx) => `
                    <div class="p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span class="font-bold text-sm">${s.name} (${s.class})</span>
                        <div class="flex gap-2">
                            <button onclick="viewMarksheet(${idx})" class="bg-amber-600 text-white px-2.5 py-1 rounded text-xs font-bold">📄 Marksheet</button>
                            <button onclick="viewIDCard(${idx})" class="bg-indigo-600 text-white px-2.5 py-1 rounded text-xs font-bold">🪪 ID Card</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div id="modal-area" class="mt-6"></div>
        `;
    }

    mainEl.innerHTML = html;
}

// Helper Functions
function addInstitutePost(e) {
    e.preventDefault();
    const val = document.getElementById('inst-new-post').value.trim();
    if (!val || !currentCollege) return;
    if (!currentCollege.customPosts) currentCollege.customPosts = [];
    if (!currentCollege.customPosts.includes(val)) {
        currentCollege.customPosts.push(val);
        let allCols = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
        const cIdx = allCols.findIndex(c => c.slug === currentCollege.slug);
        if (cIdx !== -1) { allCols[cIdx] = currentCollege; localStorage.setItem('vs_colleges_db', JSON.stringify(allCols)); }
    }
    renderApp();
}

function deleteInstitutePost(pIdx) {
    if (!currentCollege || !currentCollege.customPosts) return;
    currentCollege.customPosts.splice(pIdx, 1);
    let allCols = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
    const cIdx = allCols.findIndex(c => c.slug === currentCollege.slug);
    if (cIdx !== -1) { allCols[cIdx] = currentCollege; localStorage.setItem('vs_colleges_db', JSON.stringify(allCols)); }
    renderApp();
}

function saveUserForm(e) {
    e.preventDefault();
    const uData = {
        id: editingUserIndex !== null ? appUsers[editingUserIndex].id : "USR" + Date.now(),
        name: document.getElementById('new-u-fullname').value.trim(),
        roleLabel: document.getElementById('new-u-role').value,
        username: document.getElementById('new-u-username').value.trim(),
        password: document.getElementById('new-u-password').value.trim(),
        powers: {
            dashboard: document.getElementById('p-dashboard').checked,
            students: document.getElementById('p-students').checked,
            fees: document.getElementById('p-fees').checked,
            payroll: document.getElementById('p-payroll').checked,
            accounts: document.getElementById('p-accounts').checked,
            library: document.getElementById('p-library').checked,
            notices: document.getElementById('p-notices').checked,
            attendance: document.getElementById('p-attendance').checked,
            exams: document.getElementById('p-exams').checked
        }
    };
    if (editingUserIndex !== null) { appUsers[editingUserIndex] = uData; editingUserIndex = null; }
    else { appUsers.unshift(uData); }
    saveData(); renderApp();
}

function addNewStudent(e) { e.preventDefault(); students.unshift({ id: "STU" + Math.floor(100+Math.random()*900), name: document.getElementById('stu-name').value, father: document.getElementById('stu-father').value, class: document.getElementById('stu-class').value, roll: document.getElementById('stu-roll').value, mobile: document.getElementById('stu-mobile').value || "9800000000", totalFee: Number(document.getElementById('stu-total-fee').value), paidFee: Number(document.getElementById('stu-paid-fee').value), attStatus: "P", attRemark: "", monthlyPercent: 100, marks: { hindi: 85, english: 80, math: 88, science: 84 } }); saveData(); renderApp(); }
function collectFee(idx) { const due = students[idx].totalFee - students[idx].paidFee; const amt = prompt(`Balance due ₹${due}:`, due); if (amt && !isNaN(amt)) { students[idx].paidFee += Number(amt); saveData(); renderApp(); printReceipt(idx); } }
function sendWhatsAppReminder(idx) { const s = students[idx]; const due = s.totalFee - s.paidFee; window.open(`https://wa.me/91${s.mobile.replace(/\D/g,'')}?text=${encodeURIComponent(`Dear ${s.father}, ₹${due} fee is pending for ${s.name} at ${orgName}.`)}`, '_blank'); }
function sendAbsentWhatsApp(idx) { const s = students[idx]; window.open(`https://wa.me/91${s.mobile.replace(/\D/g,'')}?text=${encodeURIComponent(`Dear ${s.father}, your ward ${s.name} is ABSENT today (${selectedAttDate}) at ${orgName}.`)}`, '_blank'); }
function addExpense(e) { e.preventDefault(); expenses.unshift({ id: Date.now(), title: document.getElementById('exp-title').value, amount: Number(document.getElementById('exp-amount').value), date: new Date().toLocaleDateString('en-IN') }); saveData(); renderApp(); }
function manageSeat(idx) { const seat = librarySeats[idx]; if (seat.status === 'booked') librarySeats[idx] = { seatNo: seat.seatNo, status: "available", studentName: "" }; else { const n = prompt("Student Name:"); if (n) librarySeats[idx] = { seatNo: seat.seatNo, status: "booked", studentName: n }; } saveData(); renderApp(); }
function addNotice(e) { e.preventDefault(); notices.unshift({ id: Date.now(), title: document.getElementById('not-title').value, body: document.getElementById('not-body').value, date: new Date().toLocaleDateString('en-IN') }); saveData(); renderApp(); }
function printReceipt(idx) { const s = students[idx]; document.getElementById('modal-area').innerHTML = `<div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-slate-800 max-w-xl mx-auto"><h2 class="text-xl font-bold text-center border-b pb-2 mb-3">${orgName} — Fee Receipt</h2><p class="text-sm"><strong>Student:</strong> ${s.name} | <strong>Paid:</strong> ₹${s.paidFee} | <strong>Due:</strong> ₹${s.totalFee - s.paidFee}</p><button onclick="window.print()" class="no-print mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">🖨️ Print</button></div>`; }
function viewMarksheet(idx) { const s = students[idx]; const t = s.marks.hindi + s.marks.english + s.marks.math + s.marks.science; document.getElementById('modal-area').innerHTML = `<div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-amber-700 max-w-xl mx-auto"><h2 class="text-xl font-bold text-center border-b pb-2 mb-3">${orgName} — Report Card</h2><p class="text-sm"><strong>Student:</strong> ${s.name} | <strong>Total:</strong> ${t} / 400</p><button onclick="window.print()" class="no-print mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold">🖨️ Print</button></div>`; }
function viewIDCard(idx) { const s = students[idx]; document.getElementById('modal-area').innerHTML = `<div class="bg-white text-slate-900 p-5 rounded-2xl border-2 border-indigo-600 max-w-xs mx-auto text-center"><h3 class="font-bold text-indigo-700">${orgName}</h3><div class="text-lg font-bold mt-2">${s.name}</div><div class="text-xs">${s.class} | Roll: ${s.roll}</div></div>`; }
function exportCSV() { let csv = "Roll,Name,Class,PaidFee\n"; students.forEach(s => { csv += `${s.roll},"${s.name}","${s.class}",${s.paidFee}\n`; }); const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' })); l.download = `${orgName}_Report.csv`; l.click(); }