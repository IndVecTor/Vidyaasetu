// =========================================================================
// 1. गुप्त URL की पहचान (?portal=admin या ?portal=superadmin)
// =========================================================================
const urlParams = new URLSearchParams(window.location.search);
const portalMode = urlParams.get('portal') || 'user'; // 'user', 'admin', या 'superadmin'

// =========================================================================
// 2. डिफ़ॉल्ट यूज़र्स और उनकी कस्टम पावर (जिसे एडमिन/सुपर एडमिन बना व बदल सकते हैं)
// =========================================================================
const defaultUsers = [
    {
        id: "USR01",
        name: "राजेश शर्मा (शिक्षक)",
        username: "teacher1",
        password: "123",
        roleLabel: "शिक्षक स्टाफ",
        // इस यूज़र के साइडबार में केवल यही विकल्प दिखेंगे:
        powers: {
            dashboard: false,
            students: false,
            fees: false,
            accounts: false,
            library: false,
            notices: true,
            attendance: true,
            exams: true
        }
    },
    {
        id: "USR02",
        name: "सुनीता वर्मा (अकाउंटेंट / क्लर्क)",
        username: "clerk1",
        password: "123",
        roleLabel: "ऑफिस क्लर्क",
        powers: {
            dashboard: true,
            students: true,
            fees: true,
            accounts: false,
            library: false,
            notices: true,
            attendance: false,
            exams: false
        }
    },
    {
        id: "USR03",
        name: "अमित कुमार (लाइब्रेरी प्रभारी)",
        username: "lib1",
        password: "123",
        roleLabel: "लाइब्रेरी ऑपरेटर",
        powers: {
            dashboard: false,
            students: false,
            fees: false,
            accounts: false,
            library: true,
            notices: true,
            attendance: false,
            exams: false
        }
    }
];

// सुपर एडमिन द्वारा स्कूल के लिए चालू/बंद की गई मास्टर पावर
const defaultSchoolPowers = {
    portalActive: true,
    allowAdmission: true,
    allowFees: true,
    allowAccounts: true,
    allowLibrary: true,
    allowNotices: true,
    allowAttendance: true,
    allowExams: true
};

// एडमिन और सुपर एडमिन के गुप्त लॉगिन क्रेडेंशियल्स
const adminCredentials = { username: "admin", password: "123", name: "प्रिंसिपल / एडमिन" };
const superAdminCredentials = { username: "superadmin", password: "123", name: "अमन कुमार (Super Admin)" };

// डमी डेटा
const defaultStudents = [
    { id: "STU101", name: "आरव शर्मा", father: "राजेश शर्मा", class: "कक्षा 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attendance: "उपस्थित", marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "अनन्या वर्मा", father: "सुरेश वर्मा", class: "कक्षा 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attendance: "उपस्थित", marks: { hindi: 92, english: 89, math: 78, science: 85 } },
    { id: "STU103", name: "रोहन यादव", father: "महेश यादव", class: "कक्षा 12", roll: "201", mobile: "9876543212", totalFee: 15000, paidFee: 10000, attendance: "अनुपस्थित", marks: { hindi: 75, english: 70, math: 82, science: 79 } },
    { id: "STU104", name: "प्रिया सिंह", father: "विनोद सिंह", class: "कक्षा 12", roll: "202", mobile: "9876543213", totalFee: 15000, paidFee: 15000, attendance: "उपस्थित", marks: { hindi: 94, english: 91, math: 89, science: 93 } }
];

const defaultExpenses = [
    { id: 1, title: "स्टाफ व शिक्षक वेतन", category: "वेतन", amount: 22000, date: "05/11/2026" },
    { id: 2, title: "बिजली एवं इंटरनेट बिल", category: "बिल", amount: 3200, date: "10/11/2026" }
];

const defaultNotices = [
    { id: 1, title: "अर्धवार्षिक परीक्षा सूचना", body: "सभी कक्षाओं की परीक्षाएं आगामी सोमवार से प्रारंभ होंगी।", date: "20/11/2026", urgent: true },
    { id: 2, title: "शुल्क जमा करने की अंतिम तिथि", body: "बकाया फीस इस महीने की 30 तारीख तक अवश्य जमा कर दें।", date: "18/11/2026", urgent: false }
];

const defaultSeats = Array.from({ length: 20 }, (_, i) => {
    const seatNo = i + 1;
    if (seatNo === 1) return { seatNo, status: "booked", studentName: "आरव शर्मा", shift: "सुबह (6-2)" };
    if (seatNo === 4) return { seatNo, status: "booked", studentName: "अनन्या वर्मा", shift: "फुल डे" };
    return { seatNo, status: "available", studentName: "", shift: "" };
});

// डेटा लोड करना
let appUsers = JSON.parse(localStorage.getItem('erp_v3_users')) || defaultUsers;
let schoolPowers = JSON.parse(localStorage.getItem('erp_v3_school_powers')) || defaultSchoolPowers;
let students = JSON.parse(localStorage.getItem('erp_v3_students')) || defaultStudents;
let expenses = JSON.parse(localStorage.getItem('erp_v3_expenses')) || defaultExpenses;
let notices = JSON.parse(localStorage.getItem('erp_v3_notices')) || defaultNotices;
let librarySeats = JSON.parse(localStorage.getItem('erp_v3_seats')) || defaultSeats;
let orgName = localStorage.getItem('erp_v3_org') || "आदर्श विद्या मंदिर इंटर कॉलेज";
let orgLogo = localStorage.getItem('erp_v3_logo') || "";

let loggedUser = null;
let activeTab = "";

function saveData() {
    localStorage.setItem('erp_v3_users', JSON.stringify(appUsers));
    localStorage.setItem('erp_v3_school_powers', JSON.stringify(schoolPowers));
    localStorage.setItem('erp_v3_students', JSON.stringify(students));
    localStorage.setItem('erp_v3_expenses', JSON.stringify(expenses));
    localStorage.setItem('erp_v3_notices', JSON.stringify(notices));
    localStorage.setItem('erp_v3_seats', JSON.stringify(librarySeats));
    localStorage.setItem('erp_v3_org', orgName);
    if (orgLogo) localStorage.setItem('erp_v3_logo', orgLogo);
}

// पेज खुलते ही URL के हिसाब से लॉगिन स्क्रीन सेट करना
window.onload = function() {
    const titleEl = document.getElementById('login-portal-title');
    const subEl = document.getElementById('login-portal-subtitle');
    const logoEl = document.getElementById('login-logo-box');
    const hintEl = document.getElementById('demo-credentials-hint');
    const btnEl = document.getElementById('login-submit-btn');

    if (portalMode === 'superadmin') {
        titleEl.innerText = "👑 सुपर एडमिन मास्टर पोर्टल";
        subEl.innerText = "केवल सिस्टम मालिक के लिए प्रतिबंधित प्रवेश";
        logoEl.innerHTML = "👑";
        logoEl.className = "w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white mx-auto flex items-center justify-center text-3xl shadow-lg mb-3";
        btnEl.className = "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition";
        hintEl.innerHTML = `डेमो लॉगिन — यूज़रनेम: <strong class="text-purple-400">superadmin</strong> | पासवर्ड: <strong class="text-purple-400">123</strong>`;
    } else if (portalMode === 'admin') {
        titleEl.innerText = orgName + " (प्रशासक)";
        subEl.innerText = "स्कूल / संस्थान एडमिन लॉगिन";
        logoEl.innerHTML = orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🛡️";
        hintEl.innerHTML = `डेमो लॉगिन — यूज़रनेम: <strong class="text-indigo-400">admin</strong> | पासवर्ड: <strong class="text-indigo-400">123</strong>`;
    } else {
        // सामान्य होमपेज: यहाँ केवल यूज़र लॉगिन दिखेगा (एडमिन या सुपर एडमिन का कोई नामोनिशान नहीं)
        titleEl.innerText = orgName;
        subEl.innerText = "स्टाफ एवं यूज़र लॉगिन पोर्टल";
        logoEl.innerHTML = orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🏫";
        hintEl.innerHTML = `डेमो स्टाफ यूज़र — <strong>teacher1</strong> (पासवर्ड: 123) या <strong>clerk1</strong> (पासवर्ड: 123)`;
    }
};

// लॉगिन प्रक्रिया
function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error');

    // 1. सुपर एडमिन URL मोड
    if (portalMode === 'superadmin') {
        if (u === superAdminCredentials.username && p === superAdminCredentials.password) {
            loggedUser = { type: 'superadmin', name: superAdminCredentials.name, roleLabel: "मास्टर मालिक" };
            errBox.classList.add('hidden');
            openDashboard();
            return;
        }
    }
    // 2. स्कूल एडमिन URL मोड
    else if (portalMode === 'admin') {
        if (!schoolPowers.portalActive) {
            errBox.innerText = "⛔ आपका संस्थान पोर्टल सुपर एडमिन द्वारा निष्क्रिय (Suspended) कर दिया गया है।";
            errBox.classList.remove('hidden');
            return;
        }
        if (u === adminCredentials.username && p === adminCredentials.password) {
            loggedUser = { type: 'admin', name: adminCredentials.name, roleLabel: "स्कूल एडमिन", powers: schoolPowers };
            errBox.classList.add('hidden');
            openDashboard();
            return;
        }
    }
    // 3. सामान्य यूज़र मोड (मुख्य होमपेज)
    else {
        if (!schoolPowers.portalActive) {
            errBox.innerText = "⛔ संस्थान पोर्टल वर्तमान में बंद है। प्रशासक से संपर्क करें।";
            errBox.classList.remove('hidden');
            return;
        }
        const foundUser = appUsers.find(user => user.username === u && user.password === p);
        if (foundUser) {
            loggedUser = { type: 'user', ...foundUser };
            errBox.classList.add('hidden');
            openDashboard();
            return;
        }
    }

    errBox.innerText = "❌ गलत यूज़रनेम या पासवर्ड! कृपया सही विवरण डालें।";
    errBox.classList.remove('hidden');
}

function openDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');

    document.getElementById('sidebar-org-name').innerText = loggedUser.type === 'superadmin' ? "SaaS मास्टर कंट्रोल" : orgName;
    document.getElementById('sidebar-user-badge').innerText = loggedUser.roleLabel;
    document.getElementById('logged-user-name').innerText = loggedUser.name;
    document.getElementById('sidebar-logo-box').innerHTML = loggedUser.type === 'superadmin' ? "👑" : (orgLogo ? `<img src="${orgLogo}" class="w-full h-full object-cover">` : "🏫");

    // पहला सक्रिय टैब चुनना
    const menu = getDynamicMenuItems();
    activeTab = menu.length > 0 ? menu[0].id : 'no_access';
    renderApp();
}

function logoutUser() {
    loggedUser = null;
    document.getElementById('login-username').value = "";
    document.getElementById('login-password').value = "";
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

// =========================================================================
// 3. डायनामिक लेफ्ट साइडबार बिल्डर (केवल अनुमति प्राप्त विकल्प ही दिखेंगे)
// =========================================================================
function getDynamicMenuItems() {
    if (!loggedUser) return [];

    // सुपर एडमिन के साइडबार विकल्प
    if (loggedUser.type === 'superadmin') {
        return [
            { id: 'super_powers', icon: '⚡', label: 'संस्थान पावर कंट्रोल' },
            { id: 'super_branding', icon: '🎨', label: 'स्कूल नाम व लोगो सेटिंग' },
            { id: 'manage_users', icon: '👥', label: 'यूज़र व पासवर्ड बनाएं' }
        ];
    }

    // स्कूल एडमिन के साइडबार विकल्प (सुपर एडमिन की अनुमति के अनुसार)
    if (loggedUser.type === 'admin') {
        const items = [{ id: 'dashboard', icon: '📊', label: 'मुख्य डैशबोर्ड' }];
        if (schoolPowers.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: 'छात्र व एडमिशन' });
        if (schoolPowers.allowFees) items.push({ id: 'fees', icon: '💰', label: 'फीस व WhatsApp' });
        if (schoolPowers.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: 'आमदनी व खर्च' });
        if (schoolPowers.allowLibrary) items.push({ id: 'library', icon: '🪑', label: 'लाइब्रेरी सीटें' });
        if (schoolPowers.allowNotices) items.push({ id: 'notices', icon: '📢', label: 'नोटिस बोर्ड' });
        if (schoolPowers.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: 'दैनिक हाज़िरी' });
        if (schoolPowers.allowExams) items.push({ id: 'exams', icon: '📝', label: 'मार्कशीट व ID कार्ड' });
        items.push({ id: 'manage_users', icon: '🔐', label: 'स्टाफ यूज़र व पावर बनाएं' });
        return items;
    }

    // सामान्य यूज़र के साइडबार विकल्प (जो एडमिन ने इस यूज़र के लिए चालू किए हैं + सुपर एडमिन ने भी चालू रखे हैं)
    const p = loggedUser.powers;
    const items = [];
    if (p.dashboard) items.push({ id: 'dashboard', icon: '📊', label: 'मुख्य डैशबोर्ड' });
    if (p.students && schoolPowers.allowAdmission) items.push({ id: 'students', icon: '👨‍🎓', label: 'छात्र व एडमिशन' });
    if (p.fees && schoolPowers.allowFees) items.push({ id: 'fees', icon: '💰', label: 'फीस व WhatsApp' });
    if (p.accounts && schoolPowers.allowAccounts) items.push({ id: 'accounts', icon: '📉', label: 'आमदनी व खर्च' });
    if (p.library && schoolPowers.allowLibrary) items.push({ id: 'library', icon: '🪑', label: 'लाइब्रेरी सीटें' });
    if (p.notices && schoolPowers.allowNotices) items.push({ id: 'notices', icon: '📢', label: 'नोटिस बोर्ड' });
    if (p.attendance && schoolPowers.allowAttendance) items.push({ id: 'attendance', icon: '✅', label: 'दैनिक हाज़िरी' });
    if (p.exams && schoolPowers.allowExams) items.push({ id: 'exams', icon: '📝', label: 'मार्कशीट व ID कार्ड' });
    return items;
}

function switchTab(tabId) {
    activeTab = tabId;
    const main = document.getElementById('main-content');
    main.classList.remove('animate-slide-up');
    void main.offsetWidth;
    main.classList.add('animate-slide-up');
    renderApp();
}

function renderApp() {
    const navEl = document.getElementById('dynamic-sidebar-nav');
    const mainEl = document.getElementById('main-content');
    const menuItems = getDynamicMenuItems();

    // लेफ्ट साइडबार रेंडर करना
    navEl.innerHTML = menuItems.map(item => `
        <button onclick="switchTab('${item.id}')" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/80'}">
            <span class="text-base">${item.icon}</span>
            <span>${item.label}</span>
        </button>
    `).join('');

    if (activeTab === 'no_access') {
        mainEl.innerHTML = `<div class="glass-card p-8 rounded-2xl text-center border border-rose-500/30"><h3 class="text-lg font-bold text-rose-400">आपको अभी कोई मॉड्यूल आवंटित नहीं किया गया है।</h3><p class="text-xs text-slate-400 mt-1">कृपया अपने एडमिन से संपर्क करें।</p></div>`;
        return;
    }

    let html = "";

    // =====================================================================
    // A. यूज़र व पासवर्ड क्रिएटर (एडमिन और सुपर एडमिन दोनों के लिए)
    // =====================================================================
    if (activeTab === 'manage_users') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- नया यूज़र बनाने का फॉर्म -->
                <div class="glass-card p-6 rounded-2xl border border-indigo-500/30 h-fit">
                    <h3 class="font-extrabold text-lg text-indigo-400 mb-1">🔐 नया यूज़र व पासवर्ड बनाएं</h3>
                    <p class="text-xs text-slate-400 mb-4">यूज़र के लिए आईडी-पासवर्ड बनाएं और तय करें कि उसके साइडबार में क्या-क्या दिखेगा</p>
                    
                    <form onsubmit="createNewUser(event)" class="space-y-3 text-sm">
                        <input type="text" id="new-u-fullname" required placeholder="कर्मचारी का नाम (जैसे: मनोज कुमार)" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <input type="text" id="new-u-role" required placeholder="पद (जैसे: कंप्यूटर ऑपरेटर)" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="new-u-username" required placeholder="यूज़रनेम *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <input type="text" id="new-u-password" required placeholder="पासवर्ड *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        </div>

                        <div class="pt-2">
                            <div class="text-xs font-bold text-slate-300 mb-2">साइडबार में दिखने वाली शक्तियाँ चुनें:</div>
                            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-dashboard" checked> 📊 डैशबोर्ड</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-students"> 👨‍🎓 छात्र एडमिशन</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-fees"> 💰 फीस व WhatsApp</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-accounts"> 📉 आमदनी-खर्च</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-library"> 🪑 लाइब्रेरी सीट</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-notices" checked> 📢 नोटिस बोर्ड</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-attendance"> ✅ हाज़िरी</label>
                                <label class="flex items-center gap-2"><input type="checkbox" id="p-exams"> 📝 मार्कशीट</label>
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg">
                            ✅ यूज़र आईडी तैयार करें
                        </button>
                    </form>
                </div>

                <!-- बने हुए यूज़र्स की सूची -->
                <div class="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">सक्रिय यूज़र अकाउंट्स (${appUsers.length})</h3>
                    <div class="space-y-3">
                        ${appUsers.map((u, idx) => `
                            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/50 flex flex-wrap justify-between items-center gap-3">
                                <div>
                                    <div class="font-bold text-base">${u.name} <span class="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-1">${u.roleLabel}</span></div>
                                    <div class="text-xs text-slate-400 mt-1">
                                        यूज़रनेम: <strong class="text-emerald-400">${u.username}</strong> | पासवर्ड: <strong class="text-amber-400">${u.password}</strong>
                                    </div>
                                    <div class="flex flex-wrap gap-1.5 mt-2">
                                        ${Object.entries(u.powers).filter(([k, v]) => v).map(([k]) => `<span class="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">${k}</span>`).join('')}
                                    </div>
                                </div>
                                <button onclick="deleteAppUser(${idx})" class="bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                                    हटाएं
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================================
    // B. सुपर एडमिन: संस्थान पावर कंट्रोल और ब्रांडिंग
    // =====================================================================
    else if (activeTab === 'super_powers') {
        const list = [
            { key: 'portalActive', title: 'पूरा संस्थान पोर्टल (Master Switch)', desc: 'बंद करने पर स्कूल का कोई भी एडमिन या यूज़र लॉगिन नहीं कर पाएगा।' },
            { key: 'allowAdmission', title: 'छात्र एडमिशन मॉड्यूल', desc: 'स्कूल एडमिन व यूज़र्स को एडमिशन फीचर की अनुमति।' },
            { key: 'allowFees', title: 'फीस संग्रह व WhatsApp मॉड्यूल', desc: 'रसीद और व्हाट्सएप रिमाइंडर की अनुमति।' },
            { key: 'allowAccounts', title: 'आमदनी व खर्च (Accounts)', desc: 'बैलेंस शीट व खर्च प्रबंधन की अनुमति।' },
            { key: 'allowLibrary', title: 'लाइब्रेरी सीट बुकिंग मॉड्यूल', desc: 'सीट आवंटन सिस्टम की अनुमति।' },
            { key: 'allowNotices', title: 'डिजिटल नोटिस बोर्ड', desc: 'सूचना जारी करने की अनुमति।' },
            { key: 'allowAttendance', title: 'दैनिक उपस्थिति (Attendance)', desc: 'हाज़िरी लगाने की अनुमति।' },
            { key: 'allowExams', title: 'परीक्षा व मार्कशीट जनरेटर', desc: 'नंबर एंट्री व मार्कशीट प्रिंट की अनुमति।' }
        ];
        html = `
            <div class="mb-6">
                <h2 class="text-2xl font-extrabold text-purple-400">⚡ सुपर एडमिन मास्टर पावर कंट्रोल</h2>
                <p class="text-xs text-slate-400 mt-1">यहाँ से जो फीचर बंद करेंगे, वह स्कूल एडमिन और सभी यूज़र्स के साइडबार से तुरंत गायब हो जाएगा</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${list.map(item => `
                    <div class="glass-card p-5 rounded-2xl border ${schoolPowers[item.key] ? 'border-indigo-500/40' : 'border-rose-500/40 opacity-75'} flex justify-between items-center gap-4">
                        <div>
                            <div class="font-bold text-sm">${item.title}</div>
                            <p class="text-xs text-slate-400 mt-1">${item.desc}</p>
                        </div>
                        <button onclick="toggleSchoolPower('${item.key}')" class="shrink-0 w-14 h-7 rounded-full p-1 transition-colors ${schoolPowers[item.key] ? 'bg-emerald-500' : 'bg-slate-600'}">
                            <div class="w-5 h-5 rounded-full bg-white transform transition-transform ${schoolPowers[item.key] ? 'translate-x-7' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    else if (activeTab === 'super_branding') {
        html = `
            <div class="max-w-xl glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 class="font-bold text-lg text-purple-400">🎨 क्लाइंट संस्थान का नाम व लोगो बदलें</h3>
                <div>
                    <label class="text-xs font-bold text-slate-400">संस्थान का नाम</label>
                    <input type="text" id="brand-org-input" value="${orgName}" class="w-full mt-1 px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 font-bold">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-400">नया लोगो अपलोड करें</label>
                    <input type="file" accept="image/*" onchange="handleLogoUpload(event)" class="w-full mt-1 text-xs">
                </div>
                <button onclick="saveBranding()" class="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">💾 ब्रांडिंग सेव करें</button>
            </div>
        `;
    }

    // =====================================================================
    // C. सामान्य कार्यशील मॉड्यूल्स (डैशबोर्ड, छात्र, फीस, अकाउंट्स, लाइब्रेरी, नोटिस, हाज़िरी, परीक्षा)
    // =====================================================================
    else if (activeTab === 'dashboard') {
        const totalFee = students.reduce((s, x) => s + Number(x.paidFee), 0);
        const totalExp = expenses.reduce((s, x) => s + Number(x.amount), 0);
        const booked = librarySeats.filter(s => s.status === 'booked').length;
        html = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="hover-lift glass-card p-5 rounded-2xl border border-indigo-500/20">
                    <p class="text-xs text-slate-400 font-bold">कुल छात्र</p>
                    <h3 class="text-3xl font-extrabold text-indigo-400 mt-1">${students.length}</h3>
                </div>
                <div class="hover-lift glass-card p-5 rounded-2xl border border-emerald-500/20">
                    <p class="text-xs text-slate-400 font-bold">कुल जमा फीस</p>
                    <h3 class="text-3xl font-extrabold text-emerald-400 mt-1">₹${totalFee.toLocaleString('hi-IN')}</h3>
                </div>
                <div class="hover-lift glass-card p-5 rounded-2xl border border-cyan-500/20">
                    <p class="text-xs text-slate-400 font-bold">शुद्ध बचत</p>
                    <h3 class="text-3xl font-extrabold text-cyan-400 mt-1">₹${(totalFee - totalExp).toLocaleString('hi-IN')}</h3>
                </div>
                <div class="hover-lift glass-card p-5 rounded-2xl border border-amber-500/20">
                    <p class="text-xs text-slate-400 font-bold">लाइब्रेरी सीटें</p>
                    <h3 class="text-3xl font-extrabold text-amber-400 mt-1">${booked} / ${librarySeats.length}</h3>
                </div>
            </div>
            <div class="glass-card p-5 rounded-2xl border border-amber-500/30 flex justify-between items-center">
                <span class="text-sm">📢 <strong>नवीनतम सूचना:</strong> ${notices[0] ? notices[0].title : "कोई सूचना नहीं"}</span>
                <button onclick="exportCSV()" class="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold">📥 Excel रिपोर्ट</button>
            </div>
        `;
    }

    else if (activeTab === 'students') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-card p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-indigo-400">➕ नया एडमिशन</h3>
                    <form onsubmit="addNewStudent(event)" class="space-y-3 text-sm">
                        <input type="text" id="stu-name" required placeholder="छात्र का नाम *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <input type="text" id="stu-father" required placeholder="पिता का नाम *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="stu-class" required placeholder="कक्षा *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <input type="text" id="stu-roll" required placeholder="रोल नं. *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="number" id="stu-total-fee" required value="12000" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <input type="number" id="stu-paid-fee" required value="5000" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        </div>
                        <input type="text" id="stu-mobile" placeholder="WhatsApp नंबर" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl">✅ सेव करें</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">छात्र सूची (${students.length})</h3>
                    <table class="w-full text-left text-sm">
                        <thead><tr class="border-b border-slate-800 text-slate-400 text-xs"><th class="py-2">रोल</th><th class="py-2">नाम</th><th class="py-2">कक्षा</th><th class="py-2">विकल्प</th></tr></thead>
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b border-slate-800/50">
                                    <td class="py-3 font-bold text-indigo-400">${s.roll}</td>
                                    <td class="py-3 font-bold">${s.name} <div class="text-xs text-slate-400 font-normal">पिता: ${s.father}</div></td>
                                    <td class="py-3">${s.class}</td>
                                    <td class="py-3 flex gap-2">
                                        <button onclick="viewIDCard(${idx})" class="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-bold">🪪 ID</button>
                                        <button onclick="deleteStudent(${idx})" class="bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-lg text-xs">हटाएं</button>
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
            <div class="glass-card p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                <h3 class="font-bold text-lg mb-4">💰 फीस वसूली व WhatsApp रिमाइंडर</h3>
                <table class="w-full text-left text-sm">
                    <thead><tr class="border-b border-slate-800 text-slate-400 text-xs"><th class="py-2">छात्र</th><th class="py-2">कुल</th><th class="py-2">जमा</th><th class="py-2">बकाया</th><th class="py-2">कार्रवाई</th></tr></thead>
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
                                        ${due > 0 ? `<button onclick="collectFee(${idx})" class="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">+ जमा</button><button onclick="sendWhatsAppReminder(${idx})" class="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">💬 WhatsApp</button>` : ''}
                                        <button onclick="printReceipt(${idx})" class="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">🧾 रसीद</button>
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
                <div class="glass-card p-5 rounded-2xl border border-emerald-500/30"><div class="text-xs text-slate-400">कुल आमदनी</div><div class="text-2xl font-extrabold text-emerald-400 mt-1">₹${inc}</div></div>
                <div class="glass-card p-5 rounded-2xl border border-rose-500/30"><div class="text-xs text-slate-400">कुल खर्च</div><div class="text-2xl font-extrabold text-rose-400 mt-1">₹${exp}</div></div>
                <div class="glass-card p-5 rounded-2xl border border-indigo-500/30"><div class="text-xs text-slate-400">शुद्ध बचत</div><div class="text-2xl font-extrabold text-indigo-400 mt-1">₹${inc - exp}</div></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-card p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold mb-3 text-rose-400">➕ नया खर्च</h3>
                    <form onsubmit="addExpense(event)" class="space-y-3 text-sm">
                        <input type="text" id="exp-title" required placeholder="विवरण *" class="w-full px-3.5 py-2 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <input type="number" id="exp-amount" required placeholder="राशि (₹) *" class="w-full px-3.5 py-2 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <button type="submit" class="w-full bg-rose-600 text-white font-bold py-2.5 rounded-xl">💾 सेव करें</button>
                    </form>
                </div>
                <div class="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800">
                    <h3 class="font-bold mb-3">खर्च सूची</h3>
                    ${expenses.map((ex, idx) => `<div class="flex justify-between py-2.5 border-b border-slate-800 text-sm"><span>${ex.title} (${ex.date})</span><span class="text-rose-400 font-bold">₹${ex.amount} <button onclick="deleteExpense(${idx})" class="ml-2 text-xs underline">हटाएं</button></span></div>`).join('')}
                </div>
            </div>
        `;
    }

    else if (activeTab === 'library') {
        html = `
            <div class="glass-card p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">🪑 लाइब्रेरी सीट प्रबंधन (क्लिक करके बुक/खाली करें)</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    ${librarySeats.map((seat, idx) => `
                        <div onclick="manageSeat(${idx})" class="hover-lift cursor-pointer p-4 rounded-2xl border ${seat.status === 'booked' ? 'border-rose-500/50 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/5'}">
                            <div class="font-extrabold text-sm">सीट #${seat.seatNo}</div>
                            <div class="text-xs mt-1 ${seat.status === 'booked' ? 'text-rose-300 font-bold' : 'text-emerald-400'}">${seat.status === 'booked' ? seat.studentName + ' (' + seat.shift + ')' : '+ खाली (बुक करें)'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    else if (activeTab === 'notices') {
        html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-card p-5 rounded-2xl border border-slate-800 h-fit">
                    <h3 class="font-bold mb-3 text-amber-400">📢 नया नोटिस जारी करें</h3>
                    <form onsubmit="addNotice(event)" class="space-y-3 text-sm">
                        <input type="text" id="not-title" required placeholder="शीर्षक *" class="w-full px-3.5 py-2 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <textarea id="not-body" rows="3" required placeholder="संदेश *" class="w-full px-3.5 py-2 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900"></textarea>
                        <button type="submit" class="w-full bg-amber-600 text-white font-bold py-2.5 rounded-xl">🚀 प्रकाशित करें</button>
                    </form>
                </div>
                <div class="lg:col-span-2 space-y-3">
                    ${notices.map((n, idx) => `<div class="glass-card p-4 rounded-2xl border-l-4 border-indigo-500 flex justify-between"><div><div class="font-bold">${n.title}</div><p class="text-xs text-slate-400 mt-1">${n.body}</p></div><button onclick="deleteNotice(${idx})" class="text-xs text-rose-400">हटाएं</button></div>`).join('')}
                </div>
            </div>
        `;
    }

    else if (activeTab === 'attendance') {
        html = `
            <div class="glass-card p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">✅ दैनिक हाज़िरी (${new Date().toLocaleDateString('hi-IN')})</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-2xl border border-slate-800 flex justify-between items-center bg-slate-900/40">
                            <div><div class="font-bold">${s.name}</div><div class="text-xs text-slate-400">${s.class}</div></div>
                            <button onclick="toggleAttendance(${idx})" class="px-3 py-1.5 rounded-xl text-xs font-bold ${s.attendance === 'उपस्थित' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">${s.attendance}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    else if (activeTab === 'exams') {
        html = `
            <div class="glass-card p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-lg mb-4">📝 नंबर एंट्री व मार्कशीट जनरेटर</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-2xl border border-slate-800 flex justify-between items-center bg-slate-900/40">
                            <div><div class="font-bold">${s.name}</div><div class="text-xs text-slate-400">${s.class}</div></div>
                            <div class="flex gap-2">
                                <button onclick="openMarksEditor(${idx})" class="bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">✏️ नंबर</button>
                                <button onclick="viewMarksheet(${idx})" class="bg-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">📄 मार्कशीट</button>
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

// =========================================================================
// 4. यूज़र क्रिएशन व कंट्रोल फंक्शन्स
// =========================================================================
function createNewUser(e) {
    e.preventDefault();
    const newUser = {
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
    };
    appUsers.unshift(newUser);
    saveData();
    alert(`नया यूज़र "${newUser.username}" तैयार हो गया है! अब वह मुख्य लॉगिन पेज से लॉगिन कर सकता है।`);
    renderApp();
}

function deleteAppUser(idx) {
    if (confirm("क्या आप इस यूज़र को हटाना चाहते हैं?")) {
        appUsers.splice(idx, 1);
        saveData();
        renderApp();
    }
}

function toggleSchoolPower(key) {
    schoolPowers[key] = !schoolPowers[key];
    saveData();
    renderApp();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { orgLogo = e.target.result; saveData(); };
        reader.readAsDataURL(file);
    }
}

function saveBranding() {
    const val = document.getElementById('brand-org-input').value.trim();
    if (val) orgName = val;
    saveData();
    alert("संस्थान की ब्रांडिंग अपडेट हो गई है!");
}

// बाकी कार्यशील फंक्शन्स
function addNewStudent(e) {
    e.preventDefault();
    students.unshift({
        id: "STU" + Math.floor(100 + Math.random() * 900),
        name: document.getElementById('stu-name').value,
        father: document.getElementById('stu-father').value,
        class: document.getElementById('stu-class').value,
        roll: document.getElementById('stu-roll').value,
        mobile: document.getElementById('stu-mobile').value || "9800000000",
        totalFee: Number(document.getElementById('stu-total-fee').value),
        paidFee: Number(document.getElementById('stu-paid-fee').value),
        attendance: "उपस्थित",
        marks: { hindi: 85, english: 80, math: 88, science: 84 }
    });
    saveData();
    renderApp();
}

function deleteStudent(idx) { if (confirm("हटाएं?")) { students.splice(idx, 1); saveData(); renderApp(); } }
function collectFee(idx) {
    const due = students[idx].totalFee - students[idx].paidFee;
    const amt = prompt(`बकाया ₹${due} है। कितनी राशि जमा करनी है?`, due);
    if (amt && !isNaN(amt) && Number(amt) > 0) { students[idx].paidFee += Number(amt); saveData(); renderApp(); printReceipt(idx); }
}
function sendWhatsAppReminder(idx) {
    const s = students[idx];
    const due = s.totalFee - s.paidFee;
    const phone = s.mobile.replace(/\D/g, '');
    const msg = `नमस्ते ${s.father} जी, *${orgName}* में आपके बच्चे *${s.name}* की *₹${due} फीस बकाया* है। कृपया शीघ्र जमा करें।`;
    window.open(`https://wa.me/${phone.length === 10 ? '91' + phone : phone}?text=${encodeURIComponent(msg)}`, '_blank');
}
function addExpense(e) {
    e.preventDefault();
    expenses.unshift({ id: Date.now(), title: document.getElementById('exp-title').value, category: "सामान्य", amount: Number(document.getElementById('exp-amount').value), date: new Date().toLocaleDateString('hi-IN') });
    saveData(); renderApp();
}
function deleteExpense(idx) { expenses.splice(idx, 1); saveData(); renderApp(); }
function manageSeat(idx) {
    const seat = librarySeats[idx];
    if (seat.status === 'booked') {
        if (confirm(`सीट #${seat.seatNo} खाली करें?`)) { librarySeats[idx] = { seatNo: seat.seatNo, status: "available", studentName: "", shift: "" }; saveData(); renderApp(); }
    } else {
        const name = prompt(`सीट #${seat.seatNo} के लिए छात्र का नाम लिखें:`);
        if (name) { librarySeats[idx] = { seatNo: seat.seatNo, status: "booked", studentName: name, shift: "फुल डे" }; saveData(); renderApp(); }
    }
}
function addNotice(e) {
    e.preventDefault();
    notices.unshift({ id: Date.now(), title: document.getElementById('not-title').value, body: document.getElementById('not-body').value, date: new Date().toLocaleDateString('hi-IN'), urgent: false });
    saveData(); renderApp();
}
function deleteNotice(idx) { notices.splice(idx, 1); saveData(); renderApp(); }
function toggleAttendance(idx) { students[idx].attendance = students[idx].attendance === "उपस्थित" ? "अनुपस्थित" : "उपस्थित"; saveData(); renderApp(); }

function openMarksEditor(idx) {
    const s = students[idx];
    document.getElementById('modal-area').innerHTML = `
        <div class="glass-card p-5 rounded-2xl border-2 border-indigo-500 max-w-md mx-auto">
            <h4 class="font-bold mb-3">✏️ ${s.name} के नंबर</h4>
            <form onsubmit="saveMarks(event, ${idx})" class="space-y-3 text-sm">
                <div class="grid grid-cols-2 gap-2">
                    <input type="number" id="m-hindi" value="${s.marks.hindi}" class="px-3 py-1.5 rounded border bg-slate-900">
                    <input type="number" id="m-english" value="${s.marks.english}" class="px-3 py-1.5 rounded border bg-slate-900">
                    <input type="number" id="m-math" value="${s.marks.math}" class="px-3 py-1.5 rounded border bg-slate-900">
                    <input type="number" id="m-science" value="${s.marks.science}" class="px-3 py-1.5 rounded border bg-slate-900">
                </div>
                <button type="submit" class="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl">💾 सेव करें</button>
            </form>
        </div>
    `;
}
function saveMarks(e, idx) {
    e.preventDefault();
    students[idx].marks = { hindi: Number(document.getElementById('m-hindi').value), english: Number(document.getElementById('m-english').value), math: Number(document.getElementById('m-math').value), science: Number(document.getElementById('m-science').value) };
    saveData(); viewMarksheet(idx);
}
function printReceipt(idx) {
    const s = students[idx];
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-slate-800 max-w-xl mx-auto">
            <h2 class="text-xl font-bold text-center border-b pb-2 mb-3">${orgName} — फीस रसीद</h2>
            <p class="text-sm mb-3"><strong>छात्र:</strong> ${s.name} (${s.class}) | <strong>पिता:</strong> ${s.father}</p>
            <p class="text-sm font-bold text-emerald-700">जमा राशि: ₹${s.paidFee} | बकाया: ₹${s.totalFee - s.paidFee}</p>
            <button onclick="window.print()" class="no-print mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">🖨️ प्रिंट करें</button>
        </div>
    `;
}
function viewMarksheet(idx) {
    const s = students[idx];
    const total = s.marks.hindi + s.marks.english + s.marks.math + s.marks.science;
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-amber-700 max-w-xl mx-auto">
            <h2 class="text-xl font-bold text-center border-b pb-2 mb-3">${orgName} — अंकपत्र</h2>
            <p class="text-sm mb-2"><strong>छात्र:</strong> ${s.name} (${s.class})</p>
            <p class="text-sm">हिंदी: ${s.marks.hindi} | अंग्रेज़ी: ${s.marks.english} | गणित: ${s.marks.math} | विज्ञान: ${s.marks.science}</p>
            <p class="text-base font-bold mt-2">कुल प्राप्तांक: ${total} / 400</p>
            <button onclick="window.print()" class="no-print mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold">🖨️ प्रिंट करें</button>
        </div>
    `;
}
function viewIDCard(idx) {
    const s = students[idx];
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-5 rounded-2xl border-2 border-indigo-600 max-w-xs mx-auto text-center">
            <h3 class="font-bold text-indigo-700">${orgName}</h3>
            <div class="text-lg font-bold mt-2">${s.name}</div>
            <div class="text-xs text-slate-600">${s.class} | रोल: ${s.roll}</div>
            <div class="text-xs mt-2">पिता: ${s.father} | मो.: ${s.mobile}</div>
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