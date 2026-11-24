const urlParams = new URLSearchParams(window.location.search);
const portalMode = urlParams.get('portal') || 'user';

// वर्तमान भाषा ('en' या 'hi')
let currentLang = localStorage.getItem('erp_lang') || 'en';

const defaultUsers = [
    { id: "USR01", name: "Rajesh Sharma", username: "teacher1", password: "123", roleLabel: "Teacher", powers: { dashboard: false, students: false, fees: false, accounts: false, library: false, notices: true, attendance: true, exams: true } },
    { id: "USR02", name: "Sunita Verma", username: "clerk1", password: "123", roleLabel: "Office Clerk", powers: { dashboard: true, students: true, fees: true, accounts: true, library: false, notices: true, attendance: false, exams: false } },
    { id: "USR03", name: "Amit Kumar", username: "lib1", password: "123", roleLabel: "Librarian", powers: { dashboard: false, students: false, fees: false, accounts: false, library: true, notices: true, attendance: false, exams: false } }
];

const defaultSchoolPowers = { portalActive: true, allowAdmission: true, allowFees: true, allowAccounts: true, allowLibrary: true, allowNotices: true, allowAttendance: true, allowExams: true };
const adminCredentials = { username: "admin", password: "123", name: "Principal / Admin" };
const superAdminCredentials = { username: "superadmin", password: "123", name: "Aman Kumar (Super Admin)" };

const defaultStudents = [
    { id: "STU101", name: "Aarav Sharma", father: "Rajesh Sharma", class: "Class 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attendance: "Present", marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "Ananya Verma", father: "Suresh Verma", class: "Class 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attendance: "Present", marks: { hindi: 92, english: 89, math: 78, science: 85 } },
    { id: "STU103", name: "Rohan Yadav", father: "Mahesh Yadav", class: "Class 12", roll: "201", mobile: "9876543212", totalFee: 15000, paidFee: 10000, attendance: "Absent", marks: { hindi: 75, english: 70, math: 82, science: 79 } },
    { id: "STU104", name: "Priya Singh", father: "Vinod Singh", class: "Class 12", roll: "202", mobile: "9876543213", totalFee: 15000, paidFee: 15000, attendance: "Present", marks: { hindi: 94, english: 91, math: 89, science: 93 } }
];

const defaultExpenses = [
    { id: 1, title: "Staff & Teacher Salaries", category: "Salary", amount: 22000, date: "05/11/2026" },
    { id: 2, title: "Electricity & Internet Bill", category: "Utility", amount: 3200, date: "10/11/2026" }
];

const defaultNotices = [
    { id: 1, title: "Half-Yearly Exam Schedule", body: "Half-yearly examinations for all classes will commence from upcoming Monday.", date: "20/11/2026", urgent: true },
    { id: 2, title: "Fee Submission Deadline", body: "Students with pending fees must clear dues before the 30th of this month.", date: "18/11/2026", urgent: false }
];

const defaultSeats = Array.from({ length: 20 }, (_, i) => {
    const seatNo = i + 1;
    if (seatNo === 1) return { seatNo, status: "booked", studentName: "Aarav Sharma", shift: "Morning (6-2)" };
    if (seatNo === 4) return { seatNo, status: "booked", studentName: "Ananya Verma", shift: "Full Day" };
    return { seatNo, status: "available", studentName: "", shift: "" };
});

let appUsers = JSON.parse(localStorage.getItem('erp_bi_users')) || defaultUsers;
let schoolPowers = JSON.parse(localStorage.getItem('erp_bi_school_powers')) || defaultSchoolPowers;
let students = JSON.parse(localStorage.getItem('erp_bi_students')) || defaultStudents;
let expenses = JSON.parse(localStorage.getItem('erp_bi_expenses')) || defaultExpenses;
let notices = JSON.parse(localStorage.getItem('erp_bi_notices')) || defaultNotices;
let librarySeats = JSON.parse(localStorage.getItem('erp_bi_seats')) || defaultSeats;
let orgName = localStorage.getItem('erp_bi_org') || "Adarsh Vidya Mandir Inter College";
let orgLogo = localStorage.getItem('erp_bi_logo') || "";

let loggedUser = null;
let activeTab = "";

function saveData() {
    localStorage.setItem('erp_bi_users', JSON.stringify(appUsers));
    localStorage.setItem('erp_bi_school_powers', JSON.stringify(schoolPowers));
    localStorage.setItem('erp_bi_students', JSON.stringify(students));
    localStorage.setItem('erp_bi_expenses', JSON.stringify(expenses));
    localStorage.setItem('erp_bi_notices', JSON.stringify(notices));
    localStorage.setItem('erp_bi_seats', JSON.stringify(librarySeats));
    localStorage.setItem('erp_bi_org', orgName);
    if (orgLogo) localStorage.setItem('erp_bi_logo', orgLogo);
}

// =========================================================================
// 1-क्लिक भाषा बदलने का फंक्शन (One-Click Hindi / English Switch)
// =========================================================================
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('erp_lang', currentLang);
    updateLoginScreenLanguage();
    if (loggedUser) {
        updateSidebarStaticText();
        renderApp();
    }
}

function updateLoginScreenLanguage() {
    const isHi = currentLang === 'hi';
    const titleEl = document.getElementById('login-portal-title');
    const subEl = document.getElementById('login-portal-subtitle');
    const logoEl = document.getElementById('login-logo-box');
    const hintEl = document.getElementById('demo-credentials-hint');
    const btnEl = document.getElementById('login-submit-btn');

    document.getElementById('login-lang-btn').innerText = isHi ? '🇬🇧 Switch to English' : '🇮🇳 हिंदी में बदलें';
    document.getElementById('lbl-username').innerText = isHi ? 'यूज़रनेम (Username)' : 'Username';
    document.getElementById('lbl-password').innerText = isHi ? 'पासवर्ड (Password)' : 'Password';
    document.getElementById('login-username').placeholder = isHi ? 'अपना यूज़रनेम डालें' : 'Enter your username';
    btnEl.innerText = isHi ? '🔐 सुरक्षित लॉगिन करें' : '🔐 Secure Login';

    if (portalMode === 'superadmin') {
        titleEl.innerText = isHi ? "👑 सुपर एडमिन मास्टर पोर्टल" : "👑 Super Admin Master Portal";
        subEl.innerText = isHi ? "केवल सिस्टम मालिक के लिए प्रतिबंधित प्रवेश" : "Restricted Access • System Owner Only";
        logoEl.innerHTML = "👑";
        logoEl.className = "w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white mx-auto flex items-center justify-center text-3xl shadow-lg mb-3";
        btnEl.className = "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition";
        hintEl.innerHTML = isHi ? `यूज़रनेम: <strong class="text-purple-400">superadmin</strong> | पासवर्ड: <strong class="text-purple-400">123</strong>` : `Username: <strong class="text-purple-400">superadmin</strong> | Password: <strong class="text-purple-400">123</strong>`;
    } else if (portalMode === 'admin') {
        titleEl.innerText = orgName + (isHi ? " (प्रशासक)" : " (Admin)");
        subEl.innerText = isHi ? "संस्थान एडमिन नियंत्रण लॉगिन" : "Institute Administrator Control Login";
        logoEl.innerHTML = orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🛡️";
        hintEl.innerHTML = isHi ? `यूज़रनेम: <strong class="text-indigo-400">admin</strong> | पासवर्ड: <strong class="text-indigo-400">123</strong>` : `Username: <strong class="text-indigo-400">admin</strong> | Password: <strong class="text-indigo-400">123</strong>`;
    } else {
        titleEl.innerText = orgName;
        subEl.innerText = isHi ? "स्टाफ एवं यूज़र लॉगिन पोर्टल" : "Staff & User Login Portal";
        logoEl.innerHTML = orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🏫";
        hintEl.innerHTML = isHi ? `डेमो लॉगिन — <strong>clerk1</strong> या <strong>teacher1</strong> (पासवर्ड: 123)` : `Demo Staff — <strong>clerk1</strong> or <strong>teacher1</strong> (Password: 123)`;
    }
}

function updateSidebarStaticText() {
    const isHi = currentLang === 'hi';
    document.getElementById('sidebar-lang-btn').innerText = isHi ? '🇬🇧 English' : '🇮🇳 हिंदी';
    document.getElementById('sidebar-menu-heading').innerText = isHi ? 'मुख्य मेन्यू' : 'Main Menu';
    document.getElementById('btn-logout').innerText = isHi ? '🚪 लॉगआउट करें' : '🚪 Logout';
}

window.onload = function() {
    updateLoginScreenLanguage();
};

function handleLogin(e) {
    e.preventDefault();
    const isHi = currentLang === 'hi';
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error');

    if (portalMode === 'superadmin' && u === superAdminCredentials.username && p === superAdminCredentials.password) {
        loggedUser = { type: 'superadmin', name: superAdminCredentials.name, roleLabel: "Master Owner" };
        errBox.classList.add('hidden'); openDashboard(); return;
    } else if (portalMode === 'admin') {
        if (!schoolPowers.portalActive) { errBox.innerText = isHi ? "⛔ पोर्टल सुपर एडमिन द्वारा बंद है।" : "⛔ Portal is suspended by Super Admin."; errBox.classList.remove('hidden'); return; }
        if (u === adminCredentials.username && p === adminCredentials.password) {
            loggedUser = { type: 'admin', name: adminCredentials.name, roleLabel: "School Admin", powers: schoolPowers };
            errBox.classList.add('hidden'); openDashboard(); return;
        }
    } else {
        if (!schoolPowers.portalActive) { errBox.innerText = isHi ? "⛔ संस्थान पोर्टल बंद है।" : "⛔ Portal is currently inactive."; errBox.classList.remove('hidden'); return; }
        const foundUser = appUsers.find(user => user.username === u && user.password === p);
        if (foundUser) { loggedUser = { type: 'user', ...foundUser }; errBox.classList.add('hidden'); openDashboard(); return; }
    }
    errBox.innerText = isHi ? "❌ गलत यूज़रनेम या पासवर्ड!" : "❌ Invalid Username or Password!";
    errBox.classList.remove('hidden');
}

function openDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.getElementById('sidebar-org-name').innerText = loggedUser.type === 'superadmin' ? "SaaS Master Control" : orgName;
    document.getElementById('sidebar-user-badge').innerText = loggedUser.roleLabel;
    document.getElementById('logged-user-name').innerText = loggedUser.name;
    document.getElementById('sidebar-logo-box').innerHTML = loggedUser.type === 'superadmin' ? "👑" : (orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🏫");

    updateSidebarStaticText();
    const menu = getDynamicMenuItems();
    activeTab = menu.length > 0 ? menu[0].id : 'no_access';
    switchTab(activeTab);
}

function logoutUser() {
    loggedUser = null;
    document.getElementById('login-username').value = "";
    document.getElementById('login-password').value = "";
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    updateLoginScreenLanguage();
}

function toggleTheme() { document.documentElement.classList.toggle('dark'); }

function getDynamicMenuItems() {
    if (!loggedUser) return [];
    const isHi = currentLang === 'hi';

    if (loggedUser.type === 'superadmin') {
        return [
            { id: 'super_powers', icon: '⚡', label: isHi ? 'संस्थान पावर कंट्रोल' : 'Power Control' },
            { id: 'super_branding', icon: '🎨', label: isHi ? 'स्कूल नाम व लोगो' : 'Branding & Logo' },
            { id: 'manage_users', icon: '👥', label: isHi ? 'यूज़र व पासवर्ड बनाएं' : 'Manage Users' }
        ];
    }
    if (loggedUser.type === 'admin') {
        const items = [{ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' }];
        if (schoolPowers.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
        if (schoolPowers.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp' });
        if (schoolPowers.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
        if (schoolPowers.allowLibrary) items.push({ id: 'library', icon: '🪑', label: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats' });
        if (schoolPowers.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
        if (schoolPowers.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'दैनिक हाज़िरी' : 'Attendance' });
        if (schoolPowers.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
        items.push({ id: 'manage_users', icon: '🔐', label: isHi ? 'स्टाफ यूज़र बनाएं' : 'Staff Users & Roles' });
        return items;
    }
    const p = loggedUser.powers;
    const items = [];
    if (p.dashboard) items.push({ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' });
    if (p.students && schoolPowers.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
    if (p.fees && schoolPowers.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp' });
    if (p.accounts && schoolPowers.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
    if (p.library && schoolPowers.allowLibrary) items.push({ id: 'library', icon: '🪑', label: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats' });
    if (p.notices && schoolPowers.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
    if (p.attendance && schoolPowers.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'दैनिक हाज़िरी' : 'Attendance' });
    if (p.exams && schoolPowers.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
    return items;
}

function switchTab(tabId) {
    activeTab = tabId;
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

    if (activeTab === 'no_access') {
        mainEl.innerHTML = `<div class="glass-panel p-8 rounded-2xl text-center border border-rose-500/30"><h3 class="text-lg font-bold text-rose-400">${isHi ? 'आपको अभी कोई मॉड्यूल आवंटित नहीं किया गया है।' : 'No modules assigned to your account yet.'}</h3></div>`;
        return;
    }

    if (activeTab === 'dashboard') {
        mainEl.innerHTML = renderHighTechDashboard();
        return;
    }

    let html = "";

    // 1. User Management
    if (activeTab === 'manage_users') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-panel p-6 rounded-2xl border border-indigo-500/30 h-fit">
                    <h3 class="font-extrabold text-lg text-indigo-400 mb-3">${isHi ? '🔐 नया यूज़र व पासवर्ड बनाएं' : '🔐 Create New Staff User'}</h3>
                    <form onsubmit="createNewUser(event)" class="space-y-3 text-sm">
                        <input type="text" id="new-u-fullname" required placeholder="${isHi ? 'कर्मचारी का नाम *' : 'Staff Full Name *'}" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <input type="text" id="new-u-role" required placeholder="${isHi ? 'पद (जैसे: क्लर्क) *' : 'Role (e.g. Clerk) *'}" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="new-u-username" required placeholder="${isHi ? 'यूज़रनेम *' : 'Username *'}" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <input type="text" id="new-u-password" required placeholder="${isHi ? 'पासवर्ड *' : 'Password *'}" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-dashboard" checked> 📊 ${isHi ? 'डैशबोर्ड' : 'Dashboard'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-students"> 👨‍🎓 ${isHi ? 'एडमिशन' : 'Admission'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-fees"> 💰 ${isHi ? 'फीस' : 'Fees'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-accounts"> 📉 ${isHi ? 'अकाउंट्स' : 'Accounts'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-library"> 🪑 ${isHi ? 'लाइब्रेरी' : 'Library'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-notices" checked> 📢 ${isHi ? 'नोटिस' : 'Notices'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-attendance"> ✅ ${isHi ? 'हाज़िरी' : 'Attendance'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-exams"> 📝 ${isHi ? 'मार्कशीट' : 'Exams'}</label>
                        </div>
                        <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl">${isHi ? '✅ यूज़र तैयार करें' : '✅ Create User'}</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h3 class="font-bold text-lg">${isHi ? 'सक्रिय यूज़र अकाउंट्स' : 'Active User Accounts'} (${appUsers.length})</h3>
                    ${appUsers.map((u, idx) => `
                        <div class="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <div>
                                <div class="font-bold">${u.name} <span class="text-xs text-indigo-400">(${u.roleLabel})</span></div>
                                <div class="text-xs text-slate-400 mt-1">${isHi ? 'यूज़र:' : 'User:'} <strong class="text-emerald-400">${u.username}</strong> | ${isHi ? 'पासवर्ड:' : 'Pass:'} <strong class="text-amber-400">${u.password}</strong></div>
                            </div>
                            <button onclick="deleteAppUser(${idx})" class="bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold">${isHi ? 'हटाएं' : 'Remove'}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    // 2. Super Admin Powers
    else if (activeTab === 'super_powers') {
        const list = [
            { key: 'portalActive', title: isHi ? 'पूरा संस्थान पोर्टल (Master Switch)' : 'Entire Institute Portal (Master Switch)', desc: isHi ? 'बंद करने पर कोई भी एडमिन या यूज़र लॉगिन नहीं कर पाएगा।' : 'Disabling this blocks all Admin & Staff logins immediately.' },
            { key: 'allowAdmission', title: isHi ? 'छात्र एडमिशन मॉड्यूल' : 'Student Admission Module', desc: isHi ? 'एडमिशन फीचर चालू या बंद करें।' : 'Enable or disable student admission management.' },
            { key: 'allowFees', title: isHi ? 'फीस व WhatsApp मॉड्यूल' : 'Fees & WhatsApp Module', desc: isHi ? 'रसीद और व्हाट्सएप रिमाइंडर की अनुमति।' : 'Allow fee collection, receipts & WhatsApp alerts.' },
            { key: 'allowAccounts', title: isHi ? 'आमदनी व खर्च (Accounts)' : 'Income & Expenses (Accounts)', desc: isHi ? 'बैलेंस शीट और खर्च प्रबंधन।' : 'Allow financial ledger and expense tracking.' },
            { key: 'allowLibrary', title: isHi ? 'लाइब्रेरी सीट बुकिंग' : 'Library Seat Management', desc: isHi ? 'सीट आवंटन सिस्टम।' : 'Enable visual seat booking for self-study libraries.' },
            { key: 'allowNotices', title: isHi ? 'डिजिटल नोटिस बोर्ड' : 'Digital Notice Board', desc: isHi ? 'सूचना जारी करने की अनुमति।' : 'Allow publishing digital notices.' },
            { key: 'allowAttendance', title: isHi ? 'दैनिक उपस्थिति' : 'Daily Attendance', desc: isHi ? 'हाज़िरी लगाने की अनुमति।' : 'Allow marking daily student attendance.' },
            { key: 'allowExams', title: isHi ? 'परीक्षा व मार्कशीट' : 'Exams & Report Cards', desc: isHi ? 'नंबर एंट्री व मार्कशीट प्रिंट।' : 'Allow marks entry, marksheets & ID cards.' }
        ];
        html = `
            <h2 class="text-2xl font-extrabold text-purple-400 mb-4">${isHi ? '⚡ सुपर एडमिन मास्टर पावर कंट्रोल' : '⚡ Super Admin Master Power Control'}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${list.map(item => `
                    <div class="glass-panel p-5 rounded-2xl border ${schoolPowers[item.key] ? 'border-indigo-500/40' : 'border-rose-500/40 opacity-75'} flex justify-between items-center gap-4">
                        <div><div class="font-bold text-sm">${item.title}</div><p class="text-xs text-slate-400 mt-1">${item.desc}</p></div>
                        <button onclick="toggleSchoolPower('${item.key}')" class="shrink-0 w-14 h-7 rounded-full p-1 transition-colors ${schoolPowers[item.key] ? 'bg-emerald-500' : 'bg-slate-600'}">
                            <div class="w-5 h-5 rounded-full bg-white transform transition-transform ${schoolPowers[item.key] ? 'translate-x-7' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    // 3. Super Admin Branding
    else if (activeTab === 'super_branding') {
        html = `
            <div class="max-w-xl glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 class="font-bold text-lg text-purple-400">${isHi ? '🎨 क्लाइंट संस्थान का नाम व लोगो बदलें' : '🎨 Customize Institute Name & Logo'}</h3>
                <input type="text" id="brand-org-input" value="${orgName}" class="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 font-bold">
                <input type="file" accept="image/*" onchange="handleLogoUpload(event)" class="w-full text-xs">
                <button onclick="saveBranding()" class="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">${isHi ? '💾 ब्रांडिंग सेव करें' : '💾 Save Branding'}</button>
            </div>
        `;
    }
    // 4. Students & Admission
    else if (activeTab === 'students') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-indigo-400">${isHi ? '➕ नया छात्र एडमिशन' : '➕ New Student Admission'}</h3>
                    <form onsubmit="addNewStudent(event)" class="space-y-3 text-sm">
                        <input type="text" id="stu-name" required placeholder="${isHi ? 'छात्र का नाम *' : 'Student Name *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <input type="text" id="stu-father" required placeholder="${isHi ? 'पिता का नाम *' : 'Father Name *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="stu-class" required placeholder="${isHi ? 'कक्षा *' : 'Class *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            <input type="text" id="stu-roll" required placeholder="${isHi ? 'रोल नं. *' : 'Roll No. *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="number" id="stu-total-fee" required value="12000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            <input type="number" id="stu-paid-fee" required value="5000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <input type="text" id="stu-mobile" placeholder="${isHi ? 'WhatsApp मोबाइल नंबर' : 'WhatsApp Mobile No.'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl">${isHi ? '✅ एडमिशन सेव करें' : '✅ Save Admission'}</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">${isHi ? 'छात्र सूची' : 'Registered Students'} (${students.length})</h3>
                    <table class="w-full text-left text-sm">
                        <thead><tr class="border-b border-slate-800 text-slate-400 text-xs"><th class="py-2">${isHi ? 'रोल' : 'Roll'}</th><th class="py-2">${isHi ? 'नाम' : 'Name'}</th><th class="py-2">${isHi ? 'कक्षा' : 'Class'}</th><th class="py-2">${isHi ? 'विकल्प' : 'Actions'}</th></tr></thead>
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b border-slate-800/50">
                                    <td class="py-3 font-bold text-indigo-400">${s.roll}</td>
                                    <td class="py-3 font-bold">${s.name} <div class="text-xs text-slate-400 font-normal">${isHi ? 'पिता:' : 'Father:'} ${s.father}</div></td>
                                    <td class="py-3">${s.class}</td>
                                    <td class="py-3 flex gap-2">
                                        <button onclick="viewIDCard(${idx})" class="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-bold">🪪 ${isHi ? 'ID कार्ड' : 'ID Card'}</button>
                                        <button onclick="deleteStudent(${idx})" class="bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-lg text-xs">${isHi ? 'हटाएं' : 'Delete'}</button>
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
    // 5. Fees & WhatsApp
    else if (activeTab === 'fees') {
        html = `
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                <h3 class="font-bold text-lg mb-4">${isHi ? '💰 फीस वसूली व WhatsApp रिमाइंडर' : '💰 Fee Collection & WhatsApp Reminders'}</h3>
                <table class="w-full text-left text-sm">
                    <thead><tr class="border-b border-slate-800 text-slate-400 text-xs"><th class="py-2">${isHi ? 'छात्र' : 'Student'}</th><th class="py-2">${isHi ? 'कुल' : 'Total'}</th><th class="py-2">${isHi ? 'जमा' : 'Paid'}</th><th class="py-2">${isHi ? 'बकाया' : 'Due'}</th><th class="py-2">${isHi ? 'कार्रवाई' : 'Actions'}</th></tr></thead>
                    <tbody>
                        ${students.map((s, idx) => {
                            const due = s.totalFee - s.paidFee;
                            return `
                                <tr class="border-b border-slate-800/50">
                                    <td class="py-3 font-bold">${s.name}</td>
                                    <td class="py-3">₹${s.totalFee}</td>
                                    <td class="py-3 text-emerald-400 font-bold">₹${s.paidFee}</td>
                                    <td class="py-3 text-rose-400 font-bold">₹${due}</td>
                                    <td class="py-3 flex flex-wrap gap-2">
                                        ${due > 0 ? `<button onclick="collectFee(${idx})" class="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">${isHi ? '+ जमा करें' : '+ Pay Fee'}</button><button onclick="sendWhatsAppReminder(${idx})" class="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">💬 WhatsApp</button>` : ''}
                                        <button onclick="printReceipt(${idx})" class="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">🧾 ${isHi ? 'रसीद' : 'Receipt'}</button>
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
    // 6. Accounts
    else if (activeTab === 'accounts') {
        const inc = students.reduce((s, x) => s + Number(x.paidFee), 0);
        const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
        html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="glass-panel p-5 rounded-2xl border border-emerald-500/30"><div class="text-xs text-slate-400">${isHi ? 'कुल आमदनी' : 'Total Income'}</div><div class="text-2xl font-extrabold text-emerald-400 mt-1">₹${inc}</div></div>
                <div class="glass-panel p-5 rounded-2xl border border-rose-500/30"><div class="text-xs text-slate-400">${isHi ? 'कुल खर्च' : 'Total Expenses'}</div><div class="text-2xl font-extrabold text-rose-400 mt-1">₹${exp}</div></div>
                <div class="glass-panel p-5 rounded-2xl border border-indigo-500/30"><div class="text-xs text-slate-400">${isHi ? 'शुद्ध बचत' : 'Net Profit'}</div><div class="text-2xl font-extrabold text-indigo-400 mt-1">₹${inc - exp}</div></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold mb-3 text-rose-400">${isHi ? '➕ नया खर्च जोड़ें' : '➕ Add New Expense'}</h3>
                    <form onsubmit="addExpense(event)" class="space-y-3 text-sm">
                        <input type="text" id="exp-title" required placeholder="${isHi ? 'खर्च का विवरण *' : 'Expense Description *'}" class="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        <input type="number" id="exp-amount" required placeholder="${isHi ? 'राशि (₹) *' : 'Amount (₹) *'}" class="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        <button type="submit" class="w-full bg-rose-600 text-white font-bold py-2.5 rounded-xl">${isHi ? '💾 सेव करें' : '💾 Save Expense'}</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
                    <h3 class="font-bold mb-3">${isHi ? 'खर्चों का ब्यौरा' : 'Expense Ledger'}</h3>
                    ${expenses.map((ex, idx) => `<div class="flex justify-between py-2.5 border-b border-slate-800 text-sm"><span>${ex.title} (${ex.date})</span><span class="text-rose-400 font-bold">₹${ex.amount} <button onclick="deleteExpense(${idx})" class="ml-2 text-xs underline">${isHi ? 'हटाएं' : 'Delete'}</button></span></div>`).join('')}
                </div>
            </div>
        `;
    }
    // 7. Library
    else if (activeTab === 'library') {
        html = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">${isHi ? '🪑 लाइब्रेरी सीट प्रबंधन (क्लिक करके बुक/खाली करें)' : '🪑 Library Seat Management (Click to Book / Vacate)'}</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    ${librarySeats.map((seat, idx) => `
                        <div onclick="manageSeat(${idx})" class="cursor-pointer p-4 rounded-2xl border transition hover:scale-105 ${seat.status === 'booked' ? 'border-rose-500/50 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/5'}">
                            <div class="font-extrabold text-sm">${isHi ? 'सीट #' : 'Seat #'}${seat.seatNo}</div>
                            <div class="text-xs mt-1 ${seat.status === 'booked' ? 'text-rose-300 font-bold' : 'text-emerald-400'}">${seat.status === 'booked' ? seat.studentName : (isHi ? '+ खाली' : '+ Available')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    // 8. Notices
    else if (activeTab === 'notices') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold mb-3 text-amber-400">${isHi ? '📢 नया नोटिस जारी करें' : '📢 Publish New Notice'}</h3>
                    <form onsubmit="addNotice(event)" class="space-y-3 text-sm">
                        <input type="text" id="not-title" required placeholder="${isHi ? 'सूचना का शीर्षक *' : 'Notice Title *'}" class="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        <textarea id="not-body" rows="3" required placeholder="${isHi ? 'विस्तृत संदेश *' : 'Message Details *'}" class="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900"></textarea>
                        <button type="submit" class="w-full bg-amber-600 text-white font-bold py-2.5 rounded-xl">${isHi ? '🚀 प्रकाशित करें' : '🚀 Publish Notice'}</button>
                    </form>
                </div>
                <div class="lg:col-span-2 space-y-3">
                    ${notices.map((n, idx) => `<div class="glass-panel p-4 rounded-2xl border-l-4 border-indigo-500 flex justify-between"><div><div class="font-bold">${n.title}</div><p class="text-xs text-slate-400 mt-1">${n.body}</p></div><button onclick="deleteNotice(${idx})" class="text-xs text-rose-400">${isHi ? 'हटाएं' : 'Delete'}</button></div>`).join('')}
                </div>
            </div>
        `;
    }
    // 9. Attendance
    else if (activeTab === 'attendance') {
        html = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">${isHi ? '✅ दैनिक हाज़िरी' : '✅ Daily Student Attendance'}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-2xl border border-slate-800 flex justify-between items-center bg-slate-900/40">
                            <div><div class="font-bold">${s.name}</div><div class="text-xs text-slate-400">${s.class}</div></div>
                            <button onclick="toggleAttendance(${idx})" class="px-3 py-1.5 rounded-xl text-xs font-bold ${s.attendance === 'Present' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                                ${isHi ? (s.attendance === 'Present' ? '✔ उपस्थित' : '✖ अनुपस्थित') : s.attendance}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    // 10. Exams & Marksheet
    else if (activeTab === 'exams') {
        html = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">${isHi ? '📝 नंबर एंट्री व मार्कशीट जनरेटर' : '📝 Marks Entry & Report Cards'}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-2xl border border-slate-800 flex justify-between items-center bg-slate-900/40">
                            <div><div class="font-bold">${s.name}</div><div class="text-xs text-slate-400">${s.class}</div></div>
                            <div class="flex gap-2">
                                <button onclick="openMarksEditor(${idx})" class="bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">✏️ ${isHi ? 'नंबर' : 'Marks'}</button>
                                <button onclick="viewMarksheet(${idx})" class="bg-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">📄 ${isHi ? 'मार्कशीट' : 'Marksheet'}</button>
                                <button onclick="viewIDCard(${idx})" class="bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">🪪 ID</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="modal-area" class="mt-6"></div>
        `;
    }

    mainEl.innerHTML = html;
}

// Helper Functions
function createNewUser(e) {
    e.preventDefault();
    appUsers.unshift({
        id: "USR" + Date.now(),
        name: document.getElementById('new-u-fullname').value.trim(),
        roleLabel: document.getElementById('new-u-role').value.trim(),
        username: document.getElementById('new-u-username').value.trim(),
        password: document.getElementById('new-u-password').value.trim(),
        powers: {
            dashboard: document.getElementById('p-dashboard').checked,
            students: document.getElementById('p-students').checked,
            fees: document.getElementById('p-fees').checked,
            accounts: document.getElementById('p-accounts').checked,
            library: document.getElementById('p-library').checked,
            notices: document.getElementById('p-notices').checked,
            attendance: document.getElementById('p-attendance').checked,
            exams: document.getElementById('p-exams').checked
        }
    });
    saveData(); renderApp();
}
function deleteAppUser(idx) { appUsers.splice(idx, 1); saveData(); renderApp(); }
function toggleSchoolPower(key) { schoolPowers[key] = !schoolPowers[key]; saveData(); renderApp(); }
function handleLogoUpload(event) { const f = event.target.files[0]; if (f) { const r = new FileReader(); r.onload = e => { orgLogo = e.target.result; saveData(); }; r.readAsDataURL(f); } }
function saveBranding() { const v = document.getElementById('brand-org-input').value.trim(); if (v) orgName = v; saveData(); alert(currentLang === 'hi' ? "ब्रांडिंग सेव हो गई!" : "Branding Saved!"); }
function addNewStudent(e) { e.preventDefault(); students.unshift({ id: "STU" + Math.floor(100+Math.random()*900), name: document.getElementById('stu-name').value, father: document.getElementById('stu-father').value, class: document.getElementById('stu-class').value, roll: document.getElementById('stu-roll').value, mobile: document.getElementById('stu-mobile').value || "9800000000", totalFee: Number(document.getElementById('stu-total-fee').value), paidFee: Number(document.getElementById('stu-paid-fee').value), attendance: "Present", marks: { hindi: 85, english: 80, math: 88, science: 84 } }); saveData(); renderApp(); }
function deleteStudent(idx) { students.splice(idx, 1); saveData(); renderApp(); }
function collectFee(idx) { const due = students[idx].totalFee - students[idx].paidFee; const amt = prompt(currentLang === 'hi' ? `बकाया ₹${due} है। राशि डालें:` : `Balance due is ₹${due}. Enter amount:`, due); if (amt && !isNaN(amt)) { students[idx].paidFee += Number(amt); saveData(); renderApp(); printReceipt(idx); } }
function sendWhatsAppReminder(idx) { const s = students[idx]; const due = s.totalFee - s.paidFee; const phone = s.mobile.replace(/\D/g, ''); const msg = currentLang === 'hi' ? `नमस्ते ${s.father} जी, *${orgName}* में *${s.name}* की *₹${due} फीस बकाया* है।` : `Dear ${s.father}, fee balance of *₹${due}* is pending for *${s.name}* at *${orgName}*. Please pay soon.`; window.open(`https://wa.me/${phone.length === 10 ? '91' + phone : phone}?text=${encodeURIComponent(msg)}`, '_blank'); }
function addExpense(e) { e.preventDefault(); expenses.unshift({ id: Date.now(), title: document.getElementById('exp-title').value, category: "General", amount: Number(document.getElementById('exp-amount').value), date: new Date().toLocaleDateString('en-IN') }); saveData(); renderApp(); }
function deleteExpense(idx) { expenses.splice(idx, 1); saveData(); renderApp(); }
function manageSeat(idx) { const seat = librarySeats[idx]; if (seat.status === 'booked') { librarySeats[idx] = { seatNo: seat.seatNo, status: "available", studentName: "", shift: "" }; } else { const n = prompt(currentLang === 'hi' ? `सीट #${seat.seatNo} के लिए छात्र का नाम:` : `Enter student name for Seat #${seat.seatNo}:`); if (n) librarySeats[idx] = { seatNo: seat.seatNo, status: "booked", studentName: n, shift: "Full Day" }; } saveData(); renderApp(); }
function addNotice(e) { e.preventDefault(); notices.unshift({ id: Date.now(), title: document.getElementById('not-title').value, body: document.getElementById('not-body').value, date: new Date().toLocaleDateString('en-IN'), urgent: false }); saveData(); renderApp(); }
function deleteNotice(idx) { notices.splice(idx, 1); saveData(); renderApp(); }
function toggleAttendance(idx) { students[idx].attendance = students[idx].attendance === "Present" ? "Absent" : "Present"; saveData(); renderApp(); }

function openMarksEditor(idx) {
    const s = students[idx];
    const isHi = currentLang === 'hi';
    document.getElementById('modal-area').innerHTML = `
        <div class="glass-panel p-5 rounded-2xl border-2 border-indigo-500 max-w-md mx-auto">
            <h4 class="font-bold mb-3">✏️ ${s.name} — ${isHi ? 'नंबर अपडेट करें' : 'Update Marks'}</h4>
            <form onsubmit="saveMarks(event, ${idx})" class="space-y-3 text-sm">
                <div class="grid grid-cols-2 gap-2">
                    <div><label class="text-xs">${isHi ? 'हिंदी' : 'Hindi'}</label><input type="number" id="m-hindi" value="${s.marks.hindi}" class="w-full px-3 py-1.5 rounded border bg-slate-900"></div>
                    <div><label class="text-xs">${isHi ? 'अंग्रेज़ी' : 'English'}</label><input type="number" id="m-english" value="${s.marks.english}" class="w-full px-3 py-1.5 rounded border bg-slate-900"></div>
                    <div><label class="text-xs">${isHi ? 'गणित' : 'Maths'}</label><input type="number" id="m-math" value="${s.marks.math}" class="w-full px-3 py-1.5 rounded border bg-slate-900"></div>
                    <div><label class="text-xs">${isHi ? 'विज्ञान' : 'Science'}</label><input type="number" id="m-science" value="${s.marks.science}" class="w-full px-3 py-1.5 rounded border bg-slate-900"></div>
                </div>
                <button type="submit" class="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl">${isHi ? '💾 सेव करें' : '💾 Save Marks'}</button>
            </form>
        </div>
    `;
}
function saveMarks(e, idx) { e.preventDefault(); students[idx].marks = { hindi: Number(document.getElementById('m-hindi').value), english: Number(document.getElementById('m-english').value), math: Number(document.getElementById('m-math').value), science: Number(document.getElementById('m-science').value) }; saveData(); viewMarksheet(idx); }

function printReceipt(idx) {
    const s = students[idx];
    const isHi = currentLang === 'hi';
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-slate-800 max-w-xl mx-auto">
            <h2 class="text-xl font-bold text-center border-b pb-2 mb-3">${orgName} — ${isHi ? 'फीस रसीद' : 'Fee Receipt'}</h2>
            <p class="text-sm mb-2"><strong>${isHi ? 'छात्र:' : 'Student:'}</strong> ${s.name} (${s.class}) | <strong>${isHi ? 'पिता:' : 'Father:'}</strong> ${s.father}</p>
            <p class="text-sm font-bold text-emerald-700">${isHi ? 'जमा राशि:' : 'Paid Amount:'} ₹${s.paidFee} | ${isHi ? 'बकाया:' : 'Balance Due:'} ₹${s.totalFee - s.paidFee}</p>
            <button onclick="window.print()" class="no-print mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">🖨️ ${isHi ? 'प्रिंट करें' : 'Print Receipt'}</button>
        </div>
    `;
}

function viewMarksheet(idx) {
    const s = students[idx];
    const isHi = currentLang === 'hi';
    const t = s.marks.hindi + s.marks.english + s.marks.math + s.marks.science;
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-amber-700 max-w-xl mx-auto">
            <h2 class="text-xl font-bold text-center border-b pb-2 mb-3">${orgName} — ${isHi ? 'वार्षिक अंकपत्र' : 'Progress Report Card'}</h2>
            <p class="text-sm mb-2"><strong>${isHi ? 'छात्र:' : 'Student:'}</strong> ${s.name} (${s.class})</p>
            <p class="text-sm">${isHi ? 'हिंदी' : 'Hindi'}: ${s.marks.hindi} | ${isHi ? 'अंग्रेज़ी' : 'English'}: ${s.marks.english} | ${isHi ? 'गणित' : 'Maths'}: ${s.marks.math} | ${isHi ? 'विज्ञान' : 'Science'}: ${s.marks.science}</p>
            <p class="text-base font-bold mt-2">${isHi ? 'कुल प्राप्तांक:' : 'Grand Total:'} ${t} / 400</p>
            <button onclick="window.print()" class="no-print mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold">🖨️ ${isHi ? 'प्रिंट करें' : 'Print Marksheet'}</button>
        </div>
    `;
}

function viewIDCard(idx) {
    const s = students[idx];
    const isHi = currentLang === 'hi';
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-5 rounded-2xl border-2 border-indigo-600 max-w-xs mx-auto text-center">
            <h3 class="font-bold text-indigo-700">${orgName}</h3>
            <div class="text-lg font-bold mt-2">${s.name}</div>
            <div class="text-xs text-slate-600">${s.class} | ${isHi ? 'रोल:' : 'Roll:'} ${s.roll}</div>
            <div class="text-xs mt-2">${isHi ? 'पिता:' : 'Father:'} ${s.father} | ${isHi ? 'मो.:' : 'Mob:'} ${s.mobile}</div>
        </div>
    `;
}

function exportCSV() {
    let csv = "Roll,Name,Father,Class,TotalFee,PaidFee\n";
    students.forEach(s => { csv += `${s.roll},"${s.name}","${s.father}","${s.class}",${s.totalFee},${s.paidFee}\n`; });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `${orgName}_Report.csv`; link.click();
}