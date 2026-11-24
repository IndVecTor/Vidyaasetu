const urlParams = new URLSearchParams(window.location.search);
const portalMode = urlParams.get('portal') || 'user';

let currentLang = localStorage.getItem('vidyasetu_lang') || 'en';
let editingUserIndex = null;
let selectedAttClass = "ALL";
let selectedAttDate = new Date().toISOString().split('T')[0];

const defaultUsers = [
    { id: "USR01", name: "Rajesh Sharma", username: "teacher1", password: "123", roleLabel: "Teacher", powers: { dashboard: false, students: false, fees: false, payroll: false, accounts: false, library: false, notices: true, attendance: true, exams: true } },
    { id: "USR02", name: "Sunita Verma", username: "clerk1", password: "123", roleLabel: "Office Clerk", powers: { dashboard: true, students: true, fees: true, payroll: true, accounts: true, library: false, notices: true, attendance: false, exams: false } },
    { id: "USR03", name: "Amit Kumar", username: "lib1", password: "123", roleLabel: "Librarian", powers: { dashboard: false, students: false, fees: false, payroll: false, accounts: false, library: true, notices: true, attendance: false, exams: false } }
];

const defaultSchoolPowers = { portalActive: true, allowAdmission: true, allowFees: true, allowPayroll: true, allowAccounts: true, allowLibrary: true, allowNotices: true, allowAttendance: true, allowExams: true };
const adminCredentials = { username: "admin", password: "123", name: "Principal / Admin" };
const superAdminCredentials = { username: "superadmin", password: "123", name: "Aman Kumar (Master Admin)" };

const defaultStudents = [
    { id: "STU101", name: "Aarav Sharma", father: "Rajesh Sharma", class: "Class 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attStatus: "P", attRemark: "On Time", monthlyPercent: 94, marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "Ananya Verma", father: "Suresh Verma", class: "Class 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attStatus: "L", attRemark: "Medical Leave", monthlyPercent: 88, marks: { hindi: 92, english: 89, math: 78, science: 85 } },
    { id: "STU103", name: "Rohan Yadav", father: "Mahesh Yadav", class: "Class 12", roll: "201", mobile: "9876543212", totalFee: 15000, paidFee: 10000, attStatus: "A", attRemark: "Uninformed", monthlyPercent: 76, marks: { hindi: 75, english: 70, math: 82, science: 79 } },
    { id: "STU104", name: "Priya Singh", father: "Vinod Singh", class: "Class 12", roll: "202", mobile: "9876543213", totalFee: 15000, paidFee: 15000, attStatus: "H", attRemark: "Half Day", monthlyPercent: 91, marks: { hindi: 94, english: 91, math: 89, science: 93 } }
];

const defaultExpenses = [
    { id: 1, title: "Electricity & Internet Bill", category: "Utility", amount: 3200, date: "10/11/2026" },
    { id: 2, title: "Stationery & Printing", category: "Office", amount: 1500, date: "15/11/2026" }
];

const defaultNotices = [
    { id: 1, title: "Half-Yearly Exam Schedule", body: "Examinations for all classes will commence from upcoming Monday.", date: "20/11/2026", urgent: true },
    { id: 2, title: "Fee Submission Deadline", body: "Students with pending fees must clear dues before the 30th.", date: "18/11/2026", urgent: false }
];

const defaultSeats = Array.from({ length: 20 }, (_, i) => {
    const seatNo = i + 1;
    if (seatNo === 1) return { seatNo, status: "booked", studentName: "Aarav Sharma", shift: "Morning" };
    if (seatNo === 4) return { seatNo, status: "booked", studentName: "Ananya Verma", shift: "Full Day" };
    return { seatNo, status: "available", studentName: "", shift: "" };
});

let appUsers = JSON.parse(localStorage.getItem('vs_users')) || defaultUsers;
let schoolPowers = JSON.parse(localStorage.getItem('vs_school_powers')) || defaultSchoolPowers;
let students = JSON.parse(localStorage.getItem('vs_students')) || defaultStudents;
let expenses = JSON.parse(localStorage.getItem('vs_expenses')) || defaultExpenses;
let notices = JSON.parse(localStorage.getItem('vs_notices')) || defaultNotices;
let librarySeats = JSON.parse(localStorage.getItem('vs_seats')) || defaultSeats;
let orgName = localStorage.getItem('vs_org') || "Adarsh Vidya Mandir Inter College";
let orgLogo = localStorage.getItem('vs_logo') || "";

let loggedUser = null;
let activeTab = "";

function saveData() {
    localStorage.setItem('vs_users', JSON.stringify(appUsers));
    localStorage.setItem('vs_school_powers', JSON.stringify(schoolPowers));
    localStorage.setItem('vs_students', JSON.stringify(students));
    localStorage.setItem('vs_expenses', JSON.stringify(expenses));
    localStorage.setItem('vs_notices', JSON.stringify(notices));
    localStorage.setItem('vs_seats', JSON.stringify(librarySeats));
    localStorage.setItem('vs_org', orgName);
    if (orgLogo) localStorage.setItem('vs_logo', orgLogo);
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('vidyasetu_lang', currentLang);
    updateLoginScreenLanguage();
    if (loggedUser) { updateSidebarStaticText(); renderApp(); }
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
        titleEl.innerText = isHi ? "👑 विद्यासेतु मास्टर कंट्रोल पैनल" : "👑 VidyaSetu Master Control Panel";
        subEl.innerText = isHi ? "केवल सिस्टम मालिक के लिए प्रतिबंधित प्रवेश" : "Restricted Access • System Owner Only";
        logoEl.innerHTML = "👑";
        logoEl.className = "w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white mx-auto flex items-center justify-center text-3xl shadow-lg mb-3";
        btnEl.className = "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition";
        hintEl.innerHTML = `Username: <strong class="text-purple-400">superadmin</strong> | Password: <strong class="text-purple-400">123</strong>`;
    } else if (portalMode === 'admin') {
        titleEl.innerText = orgName + (isHi ? " (प्रशासक)" : " (Admin)");
        subEl.innerText = isHi ? "संस्थान एडमिन नियंत्रण लॉगिन" : "Institute Administrator Control Login";
        logoEl.innerHTML = orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🛡️";
        hintEl.innerHTML = `Username: <strong class="text-indigo-400">admin</strong> | Password: <strong class="text-indigo-400">123</strong>`;
    } else {
        titleEl.innerText = orgName;
        subEl.innerText = isHi ? "स्टाफ एवं यूज़र लॉगिन पोर्टल" : "Staff & User Login Portal";
        logoEl.innerHTML = orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🌉";
        hintEl.innerHTML = isHi ? `डेमो लॉगिन — <strong>clerk1</strong> या <strong>teacher1</strong> (पासवर्ड: 123)` : `Demo Staff — <strong>clerk1</strong> or <strong>teacher1</strong> (Password: 123)`;
    }
}

function updateSidebarStaticText() {
    const isHi = currentLang === 'hi';
    document.getElementById('sidebar-lang-btn').innerText = isHi ? '🇬🇧 English' : '🇮🇳 हिंदी';
    document.getElementById('sidebar-menu-heading').innerText = isHi ? 'मुख्य मेन्यू' : 'Main Menu';
    document.getElementById('btn-logout').innerText = isHi ? '🚪 लॉगआउट करें' : '🚪 Logout';
}

window.onload = updateLoginScreenLanguage;

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
        if (!schoolPowers.portalActive) { errBox.innerText = isHi ? "⛔ पोर्टल बंद है।" : "⛔ Portal is suspended."; errBox.classList.remove('hidden'); return; }
        if (u === adminCredentials.username && p === adminCredentials.password) {
            loggedUser = { type: 'admin', name: adminCredentials.name, roleLabel: "School Admin", powers: schoolPowers };
            errBox.classList.add('hidden'); openDashboard(); return;
        }
    } else {
        if (!schoolPowers.portalActive) { errBox.innerText = isHi ? "⛔ संस्थान पोर्टल बंद है।" : "⛔ Portal inactive."; errBox.classList.remove('hidden'); return; }
        const foundUser = appUsers.find(user => user.username === u && user.password === p);
        if (foundUser) { loggedUser = { type: 'user', ...foundUser }; errBox.classList.add('hidden'); openDashboard(); return; }
    }
    errBox.innerText = isHi ? "❌ गलत यूज़रनेम या पासवर्ड!" : "❌ Invalid Username or Password!";
    errBox.classList.remove('hidden');
}

function openDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.getElementById('sidebar-org-name').innerText = loggedUser.type === 'superadmin' ? "VidyaSetu Master" : orgName;
    document.getElementById('sidebar-user-badge').innerText = loggedUser.roleLabel;
    document.getElementById('logged-user-name').innerText = loggedUser.name;
    document.getElementById('sidebar-logo-box').innerHTML = loggedUser.type === 'superadmin' ? "👑" : (orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🌉");

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

function toggleTheme() { document.documentElement.classList.toggle('dark'); }

function getDynamicMenuItems() {
    if (!loggedUser) return [];
    const isHi = currentLang === 'hi';

    if (loggedUser.type === 'superadmin') {
        return [
            { id: 'super_powers', icon: '⚡', label: isHi ? 'संस्थान पावर कंट्रोल' : 'Power Control' },
            { id: 'super_branding', icon: '🎨', label: isHi ? 'स्कूल नाम व लोगो' : 'Branding & Logo' },
            { id: 'manage_users', icon: '👥', label: isHi ? 'यूज़र व पासवर्ड प्रबंधन' : 'Manage Users' }
        ];
    }
    if (loggedUser.type === 'admin') {
        const items = [{ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' }];
        if (schoolPowers.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
        if (schoolPowers.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp' });
        if (schoolPowers.allowPayroll) items.push({ id: 'payroll', icon: '💳', label: isHi ? 'शिक्षक व सैलरी स्लिप' : 'Staff & Payroll' });
        if (schoolPowers.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
        if (schoolPowers.allowLibrary) items.push({ id: 'library', icon: '🪑', label: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats' });
        if (schoolPowers.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
        if (schoolPowers.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance' });
        if (schoolPowers.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
        items.push({ id: 'manage_users', icon: '🔐', label: isHi ? 'स्टाफ यूज़र प्रबंधन' : 'Staff Users & Roles' });
        return items;
    }
    const p = loggedUser.powers;
    const items = [];
    if (p.dashboard) items.push({ id: 'dashboard', icon: '📊', label: isHi ? 'मुख्य डैशबोर्ड' : 'Dashboard' });
    if (p.students && schoolPowers.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: isHi ? 'छात्र व एडमिशन' : 'Students & Admission' });
    if (p.fees && schoolPowers.allowFees) items.push({ id: 'fees', icon: '💰', label: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp' });
    if (p.payroll && schoolPowers.allowPayroll) items.push({ id: 'payroll', icon: '💳', label: isHi ? 'शिक्षक व सैलरी स्लिप' : 'Staff & Payroll' });
    if (p.accounts && schoolPowers.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: isHi ? 'आमदनी व खर्च' : 'Income & Expenses' });
    if (p.library && schoolPowers.allowLibrary) items.push({ id: 'library', icon: '🪑', label: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats' });
    if (p.notices && schoolPowers.allowNotices) items.push({ id: 'notices', icon: '📢', label: isHi ? 'नोटिस बोर्ड' : 'Notice Board' });
    if (p.attendance && schoolPowers.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance' });
    if (p.exams && schoolPowers.allowExams) items.push({ id: 'exams', icon: '📝', label: isHi ? 'मार्कशीट व ID कार्ड' : 'Exams & ID Cards' });
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

    // अलग-अलग डेडिकेटेड फ़ाइलों से स्क्रीन लोड करना
    if (activeTab === 'dashboard') { mainEl.innerHTML = renderHighTechDashboard(); return; }
    if (activeTab === 'payroll') { mainEl.innerHTML = renderStaffPayrollModule(); return; }

    let html = "";

    // यूज़र प्रबंधन (Create + Edit + Delete)
    if (activeTab === 'manage_users') {
        const editObj = editingUserIndex !== null ? appUsers[editingUserIndex] : null;
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-panel p-6 rounded-2xl border ${editObj ? 'border-amber-500/50' : 'border-indigo-500/30'} h-fit">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-extrabold text-lg ${editObj ? 'text-amber-400' : 'text-indigo-400'}">${editObj ? (isHi ? '✏️ यूज़र एडिट करें' : '✏️ Edit User') : (isHi ? '🔐 नया यूज़र बनाएं' : '🔐 Create User')}</h3>
                        ${editObj ? `<button onclick="editingUserIndex=null; renderApp()" class="text-xs text-rose-400 underline">${isHi ? 'रद्द करें' : 'Cancel'}</button>` : ''}
                    </div>
                    <form onsubmit="saveUserForm(event)" class="space-y-3 text-sm">
                        <input type="text" id="new-u-fullname" required value="${editObj ? editObj.name : ''}" placeholder="${isHi ? 'कर्मचारी का नाम *' : 'Staff Full Name *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <input type="text" id="new-u-role" required value="${editObj ? editObj.roleLabel : ''}" placeholder="${isHi ? 'पद (Role) *' : 'Role *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="new-u-username" required value="${editObj ? editObj.username : ''}" placeholder="${isHi ? 'यूज़रनेम *' : 'Username *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                            <input type="text" id="new-u-password" required value="${editObj ? editObj.password : ''}" placeholder="${isHi ? 'पासवर्ड *' : 'Password *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-dashboard" ${editObj ? (editObj.powers.dashboard ? 'checked' : '') : 'checked'}> 📊 ${isHi ? 'डैशबोर्ड' : 'Dashboard'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-students" ${editObj && editObj.powers.students ? 'checked' : ''}> 👨‍🎓 ${isHi ? 'एडमिशन' : 'Admission'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-fees" ${editObj && editObj.powers.fees ? 'checked' : ''}> 💰 ${isHi ? 'फीस' : 'Fees'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-payroll" ${editObj && editObj.powers.payroll ? 'checked' : ''}> 💳 ${isHi ? 'सैलरी स्लिप' : 'Payroll'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-accounts" ${editObj && editObj.powers.accounts ? 'checked' : ''}> 📉 ${isHi ? 'अकाउंट्स' : 'Accounts'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-library" ${editObj && editObj.powers.library ? 'checked' : ''}> 🪑 ${isHi ? 'लाइब्रेरी' : 'Library'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-notices" ${editObj ? (editObj.powers.notices ? 'checked' : '') : 'checked'}> 📢 ${isHi ? 'नोटिस' : 'Notices'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-attendance" ${editObj && editObj.powers.attendance ? 'checked' : ''}> ✅ ${isHi ? 'हाज़िरी' : 'Attendance'}</label>
                            <label class="flex items-center gap-2"><input type="checkbox" id="p-exams" ${editObj && editObj.powers.exams ? 'checked' : ''}> 📝 ${isHi ? 'मार्कशीट' : 'Exams'}</label>
                        </div>
                        <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl">${editObj ? (isHi ? '💾 सेव करें' : '💾 Update') : (isHi ? '✅ बनाएं' : '✅ Create')}</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h3 class="font-bold text-lg">${isHi ? 'सक्रिय यूज़र अकाउंट्स' : 'Active Users'} (${appUsers.length})</h3>
                    ${appUsers.map((u, idx) => `
                        <div class="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <div>
                                <div class="font-bold">${u.name} <span class="text-xs text-indigo-400">(${u.roleLabel})</span></div>
                                <div class="text-xs text-slate-400 mt-1">User: <strong class="text-emerald-400">${u.username}</strong> | Pass: <strong class="text-amber-400">${u.password}</strong></div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="editingUserIndex=${idx}; renderApp()" class="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold">✏️ Edit</button>
                                <button onclick="deleteAppUser(${idx})" class="bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (activeTab === 'super_powers') {
        const list = [
            { key: 'portalActive', title: isHi ? 'पूरा संस्थान पोर्टल (Master Switch)' : 'Entire Institute Portal', desc: isHi ? 'पोर्टल चालू या बंद करें' : 'Enable/Disable whole institute access' },
            { key: 'allowAdmission', title: isHi ? 'छात्र एडमिशन' : 'Student Admission', desc: isHi ? 'एडमिशन मॉड्यूल की अनुमति' : 'Allow admission management' },
            { key: 'allowFees', title: isHi ? 'फीस व WhatsApp' : 'Fees & WhatsApp', desc: isHi ? 'फीस व रसीद मॉड्यूल' : 'Allow fee collection' },
            { key: 'allowPayroll', title: isHi ? 'शिक्षक व सैलरी स्लिप (Payroll)' : 'Staff & Payroll Module', desc: isHi ? 'स्टाफ हाज़िरी व सैलरी स्लिप' : 'Allow staff salary slip generator' },
            { key: 'allowAccounts', title: isHi ? 'आमदनी व खर्च' : 'Income & Expenses', desc: isHi ? 'अकाउंट्स लेजर' : 'Allow accounts tracking' },
            { key: 'allowLibrary', title: isHi ? 'लाइब्रेरी सीटें' : 'Library Seats', desc: isHi ? 'सीट बुकिंग सिस्टम' : 'Allow library seat booking' },
            { key: 'allowNotices', title: isHi ? 'नोटिस बोर्ड' : 'Notice Board', desc: isHi ? 'डिजिटल सूचना पट्ट' : 'Allow digital notices' },
            { key: 'allowAttendance', title: isHi ? 'स्मार्ट हाज़िरी' : 'Smart Attendance', desc: isHi ? 'छात्र उपस्थिति रजिस्टर' : 'Allow attendance register' },
            { key: 'allowExams', title: isHi ? 'मार्कशीट व ID' : 'Exams & ID Cards', desc: isHi ? 'परीक्षा व अंकपत्र' : 'Allow report cards' }
        ];
        html = `
            <h2 class="text-2xl font-extrabold text-purple-400 mb-4">${isHi ? '👑 VidyaSetu मास्टर पावर कंट्रोल' : '👑 VidyaSetu Master Power Control'}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${list.map(item => `
                    <div class="glass-panel p-5 rounded-2xl border ${schoolPowers[item.key] ? 'border-indigo-500/40' : 'border-rose-500/40 opacity-75'} flex justify-between items-center">
                        <div><div class="font-bold text-sm">${item.title}</div><p class="text-xs text-slate-400 mt-1">${item.desc}</p></div>
                        <button onclick="schoolPowers['${item.key}']=!schoolPowers['${item.key}']; saveData(); renderApp()" class="w-14 h-7 rounded-full p-1 transition-colors ${schoolPowers[item.key] ? 'bg-emerald-500' : 'bg-slate-600'}">
                            <div class="w-5 h-5 rounded-full bg-white transform transition-transform ${schoolPowers[item.key] ? 'translate-x-7' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    else if (activeTab === 'super_branding') {
        html = `
            <div class="max-w-xl glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 class="font-bold text-lg text-purple-400">${isHi ? '🎨 संस्थान ब्रांडिंग बदलें' : '🎨 Customize Branding'}</h3>
                <input type="text" id="brand-org-input" value="${orgName}" class="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 font-bold">
                <input type="file" accept="image/*" onchange="handleLogoUpload(event)" class="w-full text-xs">
                <button onclick="saveBranding()" class="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">${isHi ? '💾 सेव करें' : '💾 Save'}</button>
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
                    <h3 class="font-bold text-lg mb-4 text-indigo-400">${isHi ? '➕ नया एडमिशन' : '➕ New Admission'}</h3>
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

// सहायक फंक्शन्स
function saveUserForm(e) {
    e.preventDefault();
    const uData = {
        id: editingUserIndex !== null ? appUsers[editingUserIndex].id : "USR" + Date.now(),
        name: document.getElementById('new-u-fullname').value.trim(),
        roleLabel: document.getElementById('new-u-role').value.trim(),
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
function deleteAppUser(idx) { appUsers.splice(idx, 1); saveData(); renderApp(); }
function handleLogoUpload(e) { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => { orgLogo = ev.target.result; saveData(); }; r.readAsDataURL(f); } }
function saveBranding() { const v = document.getElementById('brand-org-input').value.trim(); if (v) orgName = v; saveData(); alert("Saved!"); }
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
function exportCSV() { let csv = "Roll,Name,Class,PaidFee\n"; students.forEach(s => { csv += `${s.roll},"${s.name}","${s.class}",${s.paidFee}\n`; }); const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' })); l.download = `VidyaSetu_Report.csv`; l.click(); }