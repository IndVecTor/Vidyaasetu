// 1. सुपर एडमिन द्वारा नियंत्रित पावर सेटिंग्स (Permissions)
const defaultPermissions = {
    schoolActive: true,        // पूरा स्कूल पोर्टल चालू या बंद करें
    allowAdmission: true,      // एडमिन को नया एडमिशन जोड़ने की पावर
    allowFees: true,           // एडमिन को फीस व व्हाट्सएप रिमाइंडर की पावर
    allowAccounts: true,       // एडमिन को आमदनी-खर्च देखने की पावर
    allowLibrary: true,        // एडमिन को लाइब्रेरी सीट मैनेज करने की पावर
    allowNotices: true,        // एडमिन को नोटिस जारी करने की पावर
    allowTeacherMarks: true    // टीचर को नंबर बदलने की पावर
};

// सुपर एडमिन के क्लाइंट स्कूलों की सूची (SaaS Management)
const defaultClientSchools = [
    { id: "SCH01", name: "आदर्श विद्या मंदिर इंटर कॉलेज", city: "आज़मगढ़", plan: "वार्षिक प्रो (₹6,999)", expiry: "15/11/2027", status: "Active", studentsCount: 450 },
    { id: "SCH02", name: "सनराइज कॉन्वेंट स्कूल", city: "जियानपुर", plan: "मासिक (₹799/माह)", expiry: "10/12/2026", status: "Active", studentsCount: 280 },
    { id: "SCH03", name: "लक्ष्य सेल्फ-स्टडी लाइब्रेरी", city: "वाराणसी", plan: "लाइब्रेरी प्लान (₹4,999)", expiry: "01/08/2027", status: "Active", studentsCount: 120 },
    { id: "SCH04", name: "न्यू एरा कोचिंग सेंटर", city: "मऊ", plan: "ट्रायल समाप्त", expiry: "20/11/2026", status: "Suspended", studentsCount: 95 }
];

const defaultStudents = [
    { id: "STU101", name: "आरव शर्मा", father: "राजेश शर्मा", class: "कक्षा 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attendance: "उपस्थित", marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "अनन्या वर्मा", father: "सुरेश वर्मा", class: "कक्षा 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attendance: "उपस्थित", marks: { hindi: 92, english: 89, math: 78, science: 85 } },
    { id: "STU103", name: "रोहन यादव", father: "महेश यादव", class: "कक्षा 12", roll: "201", mobile: "9876543212", totalFee: 15000, paidFee: 10000, attendance: "अनुपस्थित", marks: { hindi: 75, english: 70, math: 82, science: 79 } },
    { id: "STU104", name: "प्रिया सिंह", father: "विनोद सिंह", class: "कक्षा 12", roll: "202", mobile: "9876543213", totalFee: 15000, paidFee: 15000, attendance: "उपस्थित", marks: { hindi: 94, english: 91, math: 89, science: 93 } },
    { id: "STU105", name: "कबीर खान", father: "इमरान खान", class: "कक्षा 9", roll: "301", mobile: "9876543214", totalFee: 10000, paidFee: 5000, attendance: "उपस्थित", marks: { hindi: 80, english: 76, math: 85, science: 81 } }
];

const defaultExpenses = [
    { id: 1, title: "स्टाफ व शिक्षक वेतन (मासिक)", category: "वेतन", amount: 22000, date: "05/11/2026" },
    { id: 2, title: "बिजली एवं इंटरनेट बिल", category: "बिल", amount: 3200, date: "10/11/2026" },
    { id: 3, title: "स्टेशनरी व प्रिंटिंग खर्च", category: "अन्य", amount: 1500, date: "15/11/2026" }
];

const defaultNotices = [
    { id: 1, title: "अर्धवार्षिक परीक्षा सूचना", body: "सभी कक्षाओं की अर्धवार्षिक परीक्षाएं आगामी सोमवार से प्रारंभ होंगी। सभी छात्र प्रवेश पत्र प्राप्त कर लें।", date: "20/11/2026", urgent: true },
    { id: 2, title: "शुल्क जमा करने की अंतिम तिथि", body: "जिन छात्रों की द्वितीय किस्त की फीस बकाया है, वे इस महीने की 30 तारीख तक अवश्य जमा कर दें।", date: "18/11/2026", urgent: false }
];

const defaultSeats = Array.from({ length: 20 }, (_, i) => {
    const seatNo = i + 1;
    if (seatNo === 1) return { seatNo, status: "booked", studentName: "आरव शर्मा", shift: "सुबह (6 AM - 2 PM)", expiry: "30/11/2026" };
    if (seatNo === 4) return { seatNo, status: "booked", studentName: "अनन्या वर्मा", shift: "फुल डे (Full Day)", expiry: "05/12/2026" };
    if (seatNo === 7) return { seatNo, status: "booked", studentName: "रोहन यादव", shift: "शाम (2 PM - 10 PM)", expiry: "28/11/2026" };
    return { seatNo, status: "available", studentName: "", shift: "", expiry: "" };
});

// स्टेट वेरिएबल्स
let permissions = JSON.parse(localStorage.getItem('erp_v2_perms')) || defaultPermissions;
let clientSchools = JSON.parse(localStorage.getItem('erp_v2_schools')) || defaultClientSchools;
let students = JSON.parse(localStorage.getItem('erp_v2_students')) || defaultStudents;
let expenses = JSON.parse(localStorage.getItem('erp_v2_expenses')) || defaultExpenses;
let notices = JSON.parse(localStorage.getItem('erp_v2_notices')) || defaultNotices;
let librarySeats = JSON.parse(localStorage.getItem('erp_v2_seats')) || defaultSeats;
let orgName = localStorage.getItem('erp_v2_org') || "आदर्श विद्या मंदिर इंटर कॉलेज";
let orgLogo = localStorage.getItem('erp_v2_logo') || "";
let currentRole = "admin";
let activeTab = "overview";

function saveData() {
    localStorage.setItem('erp_v2_perms', JSON.stringify(permissions));
    localStorage.setItem('erp_v2_schools', JSON.stringify(clientSchools));
    localStorage.setItem('erp_v2_students', JSON.stringify(students));
    localStorage.setItem('erp_v2_expenses', JSON.stringify(expenses));
    localStorage.setItem('erp_v2_notices', JSON.stringify(notices));
    localStorage.setItem('erp_v2_seats', JSON.stringify(librarySeats));
    localStorage.setItem('erp_v2_org', orgName);
    if (orgLogo) localStorage.setItem('erp_v2_logo', orgLogo);
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            orgLogo = e.target.result;
            saveData();
        };
        reader.readAsDataURL(file);
    }
}

function getLogoHTML(sizeClass = "w-11 h-11") {
    return orgLogo ? `<img src="${orgLogo}" alt="Logo" class="${sizeClass} object-cover rounded-xl">` : `🏫`;
}

function resetDemoData() {
    if (confirm("क्या आप पूरे सिस्टम और सुपर एडमिन सेटिंग्स को रीसेट करना चाहते हैं?")) {
        localStorage.clear();
        permissions = JSON.parse(JSON.stringify(defaultPermissions));
        clientSchools = JSON.parse(JSON.stringify(defaultClientSchools));
        students = JSON.parse(JSON.stringify(defaultStudents));
        expenses = JSON.parse(JSON.stringify(defaultExpenses));
        notices = JSON.parse(JSON.stringify(defaultNotices));
        librarySeats = JSON.parse(JSON.stringify(defaultSeats));
        orgName = "आदर्श विद्या मंदिर इंटर कॉलेज";
        orgLogo = "";
        alert("पूरा सिस्टम रीसेट हो गया है!");
        if (!document.getElementById('dashboard-screen').classList.contains('hidden')) {
            document.getElementById('header-logo-box').innerHTML = getLogoHTML();
            renderDashboard();
        }
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

function enterDemo(role) {
    // यदि सुपर एडमिन ने स्कूल पोर्टल बंद (Suspend) कर रखा है
    if (role !== 'superadmin' && !permissions.schoolActive) {
        alert("⛔ यह संस्थान पोर्टल वर्तमान में सुपर एडमिन द्वारा सस्पेंड (निष्क्रिय) किया गया है! कृपया सुपर एडमिन पैनल में जाकर इसे चालू करें।");
        return;
    }

    const inputName = document.getElementById('custom-org-name').value.trim();
    if (inputName) {
        orgName = inputName;
        saveData();
    }
    currentRole = role;

    // भूमिका के अनुसार पहला टैब तय करना
    if (role === 'superadmin') activeTab = 'super_control';
    else if (role === 'admin') activeTab = 'overview';
    else if (role === 'teacher') activeTab = 'attendance';
    else if (role === 'library_mgr') activeTab = 'library';
    else activeTab = 'student_portal';

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.getElementById('display-org-name').innerText = role === 'superadmin' ? "SaaS मास्टर कंट्रोल" : orgName;
    document.getElementById('header-logo-box').innerHTML = role === 'superadmin' ? "👑" : getLogoHTML();

    const roleLabels = {
        superadmin: "👑 सुपर एडमिन (अमन कुमार)",
        admin: "🏫 स्कूल एडमिन / प्रिंसिपल",
        teacher: "👨‍🏫 शिक्षक पैनल (सीमित पावर)",
        library_mgr: "🪑 लाइब्रेरी स्टाफ (सीट पावर)",
        student: "🎓 छात्र एवं अभिभावक"
    };
    document.getElementById('display-role-badge').innerText = roleLabels[role];

    renderDashboard();
}

function logoutDemo() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function triggerAnimation() {
    const main = document.getElementById('main-content');
    main.classList.remove('animate-slide-up');
    void main.offsetWidth; // री-ट्रिगर एनिमेशन
    main.classList.add('animate-slide-up');
}

function switchTab(tab) {
    activeTab = tab;
    triggerAnimation();
    renderDashboard();
}

function renderDashboard() {
    const nav = document.getElementById('sidebar-nav');
    const main = document.getElementById('main-content');

    // साइडबार बटन तैयार करना (पावर कंट्रोल के हिसाब से)
    let navItems = [];
    if (currentRole === 'superadmin') {
        navItems = [
            { id: 'super_control', icon: '⚡', label: 'पावर कंट्रोल स्विच' },
            { id: 'super_schools', icon: '🏢', label: 'सभी क्लाइंट स्कूल' },
            { id: 'overview', icon: '📊', label: 'लाइव स्कूल झलक' }
        ];
    } else if (currentRole === 'admin') {
        navItems.push({ id: 'overview', icon: '📊', label: 'मुख्य डैशबोर्ड' });
        if (permissions.allowAdmission) navItems.push({ id: 'students', icon: '👨‍🎓', label: 'छात्र व एडमिशन' });
        if (permissions.allowFees) navItems.push({ id: 'fees', icon: '💰', label: 'फीस व WhatsApp' });
        if (permissions.allowAccounts) navItems.push({ id: 'accounts', icon: '📉', label: 'आमदनी व खर्च' });
        if (permissions.allowLibrary) navItems.push({ id: 'library', icon: '🪑', label: 'लाइब्रेरी सीटें' });
        if (permissions.allowNotices) navItems.push({ id: 'notices', icon: '📢', label: 'नोटिस बोर्ड' });
        navItems.push({ id: 'attendance', icon: '✅', label: 'दैनिक हाज़िरी' });
        navItems.push({ id: 'exams', icon: '📝', label: 'मार्कशीट व ID कार्ड' });
    } else if (currentRole === 'teacher') {
        navItems = [
            { id: 'attendance', icon: '✅', label: 'क्लास हाज़िरी' },
            { id: 'exams', icon: '📝', label: 'नंबर व मार्कशीट' },
            { id: 'notices', icon: '📢', label: 'सूचना पट्ट' }
        ];
    } else if (currentRole === 'library_mgr') {
        navItems = [
            { id: 'library', icon: '🪑', label: 'लाइब्रेरी सीट बुकिंग' }
        ];
    } else {
        navItems = [
            { id: 'student_portal', icon: '🎓', label: 'मेरा पोर्टल व रिजल्ट' }
        ];
    }

    nav.innerHTML = navItems.map(item => `
        <button onclick="switchTab('${item.id}')" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'}">
            <span>${item.icon}</span>
            <span>${item.label}</span>
        </button>
    `).join('');

    let bodyHTML = "";

    // ==========================================
    // 1. सुपर एडमिन: पावर कंट्रोल स्विच (Master Control)
    // ==========================================
    if (activeTab === 'super_control') {
        const toggles = [
            { key: 'schoolActive', title: 'पूरा संस्थान पोर्टल (Master Switch)', desc: 'इसे बंद करने पर कोई भी एडमिन, टीचर या छात्र लॉगिन नहीं कर पाएगा (फीस बकाया होने पर उपयोगी)।', color: 'purple' },
            { key: 'allowAdmission', title: 'नया एडमिशन व छात्र रिकॉर्ड पावर', desc: 'स्कूल एडमिन को नए छात्र जोड़ने या हटाने की अनुमति दें।', color: 'indigo' },
            { key: 'allowFees', title: 'फीस वसूली व WhatsApp रिमाइंडर पावर', desc: 'एडमिन को फीस रसीद बनाने और व्हाट्सएप अलर्ट भेजने की अनुमति दें।', color: 'emerald' },
            { key: 'allowAccounts', title: 'आमदनी और खर्च (Accounts) पावर', desc: 'एडमिन को सैलरी, बिल और शुद्ध मुनाफा देखने की अनुमति दें।', color: 'cyan' },
            { key: 'allowLibrary', title: 'लाइब्रेरी सीट मैनेजमेंट पावर', desc: 'संस्थान को लाइब्रेरी सीट बुकिंग फीचर का उपयोग करने दें।', color: 'amber' },
            { key: 'allowNotices', title: 'डिजिटल नोटिस बोर्ड पावर', desc: 'एडमिन को छात्रों के लिए सूचना प्रकाशित करने की अनुमति दें।', color: 'rose' },
            { key: 'allowTeacherMarks', title: 'शिक्षक नंबर एंट्री (Marks Edit) पावर', desc: 'शिक्षकों को परीक्षा के नंबर बदलने की अनुमति दें (परीक्षा के बाद इसे लॉक कर सकते हैं)।', color: 'teal' }
        ];

        bodyHTML = `
            <div class="mb-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 class="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">👑 सुपर एडमिन पावर कंट्रोल</h2>
                    <p class="text-xs text-slate-400 mt-1">यहाँ से आप तय करते हैं कि स्कूल एडमिन और टीचर को कौन-कौन सी शक्तियाँ (Features) मिलेंगी</p>
                </div>
                <button onclick="enterDemo('admin')" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition">
                    🔍 एडमिन पैनल में जाकर असर देखें →
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${toggles.map(t => `
                    <div class="glass-card p-5 rounded-2xl border ${permissions[t.key] ? 'border-indigo-500/40' : 'border-rose-500/40 opacity-75'} flex justify-between items-center gap-4 transition-all">
                        <div>
                            <div class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <span>${t.title}</span>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${permissions[t.key] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                                    ${permissions[t.key] ? 'चालू (ON)' : 'बंद (OFF)'}
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${t.desc}</p>
                        </div>
                        <button onclick="togglePermission('${t.key}')" class="shrink-0 w-14 h-7 rounded-full transition-colors p-1 ${permissions[t.key] ? 'bg-emerald-500' : 'bg-slate-600'}">
                            <div class="w-5 h-5 rounded-full bg-white shadow transform transition-transform ${permissions[t.key] ? 'translate-x-7' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==========================================
    // 2. सुपर एडमिन: सभी क्लाइंट स्कूल प्रबंधन
    // ==========================================
    else if (activeTab === 'super_schools') {
        bodyHTML = `
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div>
                        <h2 class="text-xl font-extrabold">🏢 पंजीकृत स्कूल, कॉलेज व लाइब्रेरी (SaaS क्लाइंट्स)</h2>
                        <p class="text-xs text-slate-400">यहाँ से आप नए स्कूल जोड़ सकते हैं या किसी भी क्लाइंट का सब्सक्रिप्शन चालू/बंद कर सकते हैं</p>
                    </div>
                    <button onclick="addNewClientSchool()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                        + नया क्लाइंट स्कूल जोड़ें
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                                <th class="py-3">कोड</th>
                                <th class="py-3">संस्थान का नाम व शहर</th>
                                <th class="py-3">प्लान / शुल्क</th>
                                <th class="py-3">समाप्ति तिथि</th>
                                <th class="py-3">स्थिति</th>
                                <th class="py-3">मास्टर एक्शन</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${clientSchools.map((sch, idx) => `
                                <tr class="border-b border-slate-200/50 dark:border-slate-800/60 hover:bg-indigo-500/5">
                                    <td class="py-3.5 font-bold text-indigo-400">${sch.id}</td>
                                    <td class="py-3.5">
                                        <div class="font-bold">${sch.name}</div>
                                        <div class="text-xs text-slate-400">${sch.city} • ${sch.studentsCount} छात्र</div>
                                    </td>
                                    <td class="py-3.5 font-semibold text-emerald-400">${sch.plan}</td>
                                    <td class="py-3.5 text-xs">${sch.expiry}</td>
                                    <td class="py-3.5">
                                        <span class="px-2.5 py-1 rounded-full text-xs font-bold ${sch.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                                            ${sch.status === 'Active' ? '● सक्रिय' : '✖ सस्पेंड'}
                                        </span>
                                    </td>
                                    <td class="py-3.5">
                                        <button onclick="toggleSchoolStatus(${idx})" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${sch.status === 'Active' ? 'bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white' : 'bg-emerald-600 text-white'}">
                                            ${sch.status === 'Active' ? 'बंद करें (Suspend)' : 'चालू करें (Activate)'}
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ==========================================
    // 3. मुख्य डैशबोर्ड ओवरव्यू
    // ==========================================
    else if (activeTab === 'overview') {
        const totalStudents = students.length;
        const totalFeeCollected = students.reduce((sum, s) => sum + Number(s.paidFee), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const netBalance = totalFeeCollected - totalExpense;
        const bookedSeats = librarySeats.filter(s => s.status === 'booked').length;

        bodyHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="hover-lift glass-card p-5 rounded-2xl border border-indigo-500/20">
                    <p class="text-xs text-slate-400 font-bold">कुल पंजीकृत छात्र</p>
                    <h3 class="text-3xl font-extrabold text-indigo-500 mt-1">${totalStudents}</h3>
                    <p class="text-[11px] text-emerald-400 mt-2">सक्रिय सत्र 2026-27</p>
                </div>
                <div class="hover-lift glass-card p-5 rounded-2xl border border-emerald-500/20">
                    <p class="text-xs text-slate-400 font-bold">कुल आमदनी (फीस)</p>
                    <h3 class="text-3xl font-extrabold text-emerald-400 mt-1">₹${totalFeeCollected.toLocaleString('hi-IN')}</h3>
                    <p class="text-[11px] text-slate-400 mt-2">कुल खर्च: ₹${totalExpense.toLocaleString('hi-IN')}</p>
                </div>
                <div class="hover-lift glass-card p-5 rounded-2xl border border-cyan-500/20">
                    <p class="text-xs text-slate-400 font-bold">शुद्ध बचत (Net Profit)</p>
                    <h3 class="text-3xl font-extrabold text-cyan-400 mt-1">₹${netBalance.toLocaleString('hi-IN')}</h3>
                    <p class="text-[11px] text-slate-400 mt-2">लाइव बैलेंस शीट</p>
                </div>
                <div class="hover-lift glass-card p-5 rounded-2xl border border-amber-500/20">
                    <p class="text-xs text-slate-400 font-bold">लाइब्रेरी सीटें</p>
                    <h3 class="text-3xl font-extrabold text-amber-400 mt-1">${bookedSeats} / ${librarySeats.length}</h3>
                    <p class="text-[11px] text-slate-400 mt-2">${librarySeats.length - bookedSeats} सीटें उपलब्ध</p>
                </div>
            </div>

            <div class="glass-card p-5 rounded-2xl border border-amber-500/30 mb-6 flex flex-wrap justify-between items-center gap-3">
                <div class="flex items-center gap-2.5">
                    <span class="bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">📢 नोटिस</span>
                    <span class="font-semibold text-sm">${notices[0] ? notices[0].title + " — " + notices[0].body : "कोई नई सूचना नहीं"}</span>
                </div>
                <button onclick="exportCSV()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                    📥 Excel रिपोर्ट डाउनलोड
                </button>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 class="font-bold text-base mb-4">आपके पैनल को प्राप्त सक्रिय शक्तियाँ (Active Powers)</h3>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${permissions.allowAdmission ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400'}">
                        ${permissions.allowAdmission ? '✔ नया एडमिशन चालू' : '✖ एडमिशन लॉक है'}
                    </span>
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${permissions.allowFees ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400'}">
                        ${permissions.allowFees ? '✔ फीस व WhatsApp चालू' : '✖ फीस लॉक है'}
                    </span>
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${permissions.allowAccounts ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400'}">
                        ${permissions.allowAccounts ? '✔ आमदनी-खर्च चालू' : '✖ अकाउंट्स लॉक है'}
                    </span>
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${permissions.allowLibrary ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400'}">
                        ${permissions.allowLibrary ? '✔ लाइब्रेरी सीटें चालू' : '✖ लाइब्रेरी लॉक है'}
                    </span>
                </div>
            </div>
        `;
    }

    // ==========================================
    // 4. छात्र व नया एडमिशन
    // ==========================================
    else if (activeTab === 'students') {
        bodyHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-indigo-400">➕ नया छात्र एडमिशन</h3>
                    <form onsubmit="addNewStudent(event)" class="space-y-3 text-sm">
                        <input type="text" id="stu-name" required placeholder="छात्र का पूरा नाम *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <input type="text" id="stu-father" required placeholder="पिता का नाम *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="stu-class" required placeholder="कक्षा (जैसे 11)" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <input type="text" id="stu-roll" required placeholder="रोल नं. *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="number" id="stu-total-fee" required value="12000" placeholder="कुल फीस" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <input type="number" id="stu-paid-fee" required value="5000" placeholder="जमा फीस" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        </div>
                        <input type="text" id="stu-mobile" placeholder="WhatsApp मोबाइल नंबर" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg">
                            ✅ एडमिशन सेव करें
                        </button>
                    </form>
                </div>

                <div class="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">पंजीकृत छात्र (${students.length})</h3>
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b dark:border-slate-800 text-slate-400 text-xs">
                                <th class="py-2">रोल</th>
                                <th class="py-2">नाम व पिता</th>
                                <th class="py-2">कक्षा</th>
                                <th class="py-2">मोबाइल</th>
                                <th class="py-2">विकल्प</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b dark:border-slate-800/60">
                                    <td class="py-3 font-bold text-indigo-400">${s.roll}</td>
                                    <td class="py-3"><div class="font-bold">${s.name}</div><div class="text-xs text-slate-400">पिता: ${s.father}</div></td>
                                    <td class="py-3">${s.class}</td>
                                    <td class="py-3">${s.mobile}</td>
                                    <td class="py-3 flex gap-2">
                                        <button onclick="viewIDCard(${idx})" class="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-bold">🪪 ID कार्ड</button>
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

    // ==========================================
    // 5. फीस व व्हाट्सएप रिमाइंडर
    // ==========================================
    else if (activeTab === 'fees') {
        bodyHTML = `
            <div class="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <h3 class="font-bold text-lg mb-4">💰 फीस संग्रह, लाइव रसीद व WhatsApp रिमाइंडर</h3>
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b dark:border-slate-800 text-slate-400 text-xs">
                            <th class="py-2">छात्र</th>
                            <th class="py-2">कुल फीस</th>
                            <th class="py-2">जमा</th>
                            <th class="py-2">बकाया</th>
                            <th class="py-2">कार्रवाई</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map((s, idx) => {
                            const due = s.totalFee - s.paidFee;
                            return `
                                <tr class="border-b dark:border-slate-800/60">
                                    <td class="py-3 font-bold">${s.name} <span class="text-xs text-slate-400">(${s.class})</span></td>
                                    <td class="py-3">₹${s.totalFee}</td>
                                    <td class="py-3 text-emerald-400 font-bold">₹${s.paidFee}</td>
                                    <td class="py-3 ${due > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}">₹${due}</td>
                                    <td class="py-3 flex flex-wrap gap-2">
                                        ${due > 0 ? `
                                            <button onclick="collectFee(${idx})" class="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">+ जमा करें</button>
                                            <button onclick="sendWhatsAppReminder(${idx})" class="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">💬 WhatsApp</button>
                                        ` : `<span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">पूर्ण जमा</span>`}
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

    // ==========================================
    // 6. आमदनी व खर्च
    // ==========================================
    else if (activeTab === 'accounts') {
        const totalIncome = students.reduce((sum, s) => sum + Number(s.paidFee), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const netProfit = totalIncome - totalExpense;

        bodyHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="glass-card p-5 rounded-2xl border border-emerald-500/30">
                    <div class="text-xs text-slate-400 font-bold">कुल आमदनी</div>
                    <div class="text-2xl font-extrabold text-emerald-400 mt-1">+ ₹${totalIncome.toLocaleString('hi-IN')}</div>
                </div>
                <div class="glass-card p-5 rounded-2xl border border-rose-500/30">
                    <div class="text-xs text-slate-400 font-bold">कुल खर्च</div>
                    <div class="text-2xl font-extrabold text-rose-400 mt-1">- ₹${totalExpense.toLocaleString('hi-IN')}</div>
                </div>
                <div class="glass-card p-5 rounded-2xl border border-indigo-500/30">
                    <div class="text-xs text-slate-400 font-bold">शुद्ध मुनाफा</div>
                    <div class="text-2xl font-extrabold text-indigo-400 mt-1">₹${netProfit.toLocaleString('hi-IN')}</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-rose-400">➕ नया खर्च जोड़ें</h3>
                    <form onsubmit="addExpense(event)" class="space-y-3 text-sm">
                        <input type="text" id="exp-title" required placeholder="खर्च का विवरण *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <select id="exp-cat" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                            <option value="वेतन">स्टाफ वेतन</option>
                            <option value="बिल">बिजली / इंटरनेट बिल</option>
                            <option value="अन्य">अन्य खर्च</option>
                        </select>
                        <input type="number" id="exp-amount" required placeholder="राशि (₹) *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <button type="submit" class="w-full bg-rose-600 text-white font-bold py-2.5 rounded-xl">💾 खर्च सेव करें</button>
                    </form>
                </div>

                <div class="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">खर्चों का विवरण</h3>
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b dark:border-slate-800 text-slate-400 text-xs">
                                <th class="py-2">दिनांक</th>
                                <th class="py-2">विवरण</th>
                                <th class="py-2">राशि</th>
                                <th class="py-2">हटाएं</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenses.map((ex, idx) => `
                                <tr class="border-b dark:border-slate-800/60">
                                    <td class="py-3 text-xs">${ex.date}</td>
                                    <td class="py-3 font-bold">${ex.title} <span class="text-xs text-slate-400">(${ex.category})</span></td>
                                    <td class="py-3 text-rose-400 font-bold">₹${ex.amount}</td>
                                    <td class="py-3"><button onclick="deleteExpense(${idx})" class="text-xs text-rose-400 underline">हटाएं</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ==========================================
    // 7. लाइब्रेरी सीट मैनेजमेंट
    // ==========================================
    else if (activeTab === 'library') {
        const bookedCount = librarySeats.filter(s => s.status === 'booked').length;
        bodyHTML = `
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div>
                        <h3 class="font-bold text-lg">🪑 सेल्फ-स्टडी लाइब्रेरी सीट बुकिंग</h3>
                        <p class="text-xs text-slate-400">सीट पर क्लिक करके छात्र को आवंटित या खाली करें</p>
                    </div>
                    <div class="flex gap-2 text-xs font-bold">
                        <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">🟢 खाली: ${librarySeats.length - bookedCount}</span>
                        <span class="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400">🔴 बुक: ${bookedCount}</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    ${librarySeats.map((seat, idx) => `
                        <div onclick="manageSeat(${idx})" class="hover-lift cursor-pointer p-4 rounded-2xl border ${seat.status === 'booked' ? 'border-rose-500/50 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/5'}">
                            <div class="flex justify-between items-center mb-1">
                                <span class="font-extrabold text-sm">सीट #${seat.seatNo}</span>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${seat.status === 'booked' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}">
                                    ${seat.status === 'booked' ? 'बुक' : 'खाली'}
                                </span>
                            </div>
                            ${seat.status === 'booked' ? `
                                <div class="text-xs font-bold mt-2 truncate">${seat.studentName}</div>
                                <div class="text-[11px] text-slate-400">${seat.shift}</div>
                            ` : `<div class="text-[11px] text-emerald-400 mt-3">+ बुक करें</div>`}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ==========================================
    // 8. डिजिटल नोटिस बोर्ड
    // ==========================================
    else if (activeTab === 'notices') {
        bodyHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                ${currentRole === 'admin' ? `
                <div class="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-amber-400">📢 नया नोटिस जारी करें</h3>
                    <form onsubmit="addNotice(event)" class="space-y-3 text-sm">
                        <input type="text" id="not-title" required placeholder="सूचना का शीर्षक *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <textarea id="not-body" rows="3" required placeholder="विस्तृत संदेश *" class="w-full px-3.5 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900"></textarea>
                        <label class="flex items-center gap-2 text-xs font-semibold text-rose-400">
                            <input type="checkbox" id="not-urgent"> अति आवश्यक चिह्नित करें
                        </label>
                        <button type="submit" class="w-full bg-amber-600 text-white font-bold py-2.5 rounded-xl">🚀 प्रकाशित करें</button>
                    </form>
                </div>` : ''}
                <div class="${currentRole === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3">
                    <h3 class="font-bold text-lg">📌 डिजिटल सूचना पट्ट</h3>
                    ${notices.map((n, idx) => `
                        <div class="glass-card p-5 rounded-2xl border-l-4 ${n.urgent ? 'border-rose-500' : 'border-indigo-500'}">
                            <div class="flex justify-between items-start">
                                <div>
                                    <span class="text-xs text-slate-400">${n.date}</span>
                                    <h4 class="font-bold text-base mt-0.5">${n.title}</h4>
                                </div>
                                ${currentRole === 'admin' ? `<button onclick="deleteNotice(${idx})" class="text-xs text-rose-400 underline">हटाएं</button>` : ''}
                            </div>
                            <p class="text-sm text-slate-400 mt-2">${n.body}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ==========================================
    // 9. दैनिक हाज़िरी
    // ==========================================
    else if (activeTab === 'attendance') {
        bodyHTML = `
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 class="font-bold text-lg mb-4">✅ आज की डिजिटल हाज़िरी (${new Date().toLocaleDateString('hi-IN')})</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-2xl border dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                            <div>
                                <div class="font-bold">${s.name}</div>
                                <div class="text-xs text-slate-400">${s.class} | रोल: ${s.roll}</div>
                            </div>
                            <button onclick="toggleAttendance(${idx})" class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${s.attendance === 'उपस्थित' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                                ${s.attendance === 'उपस्थित' ? '✔ उपस्थित' : '✖ अनुपस्थित'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ==========================================
    // 10. मार्कशीट, नंबर एंट्री व छात्र पोर्टल
    // ==========================================
    else if (activeTab === 'exams' || activeTab === 'student_portal') {
        const canEditMarks = (currentRole === 'admin') || (currentRole === 'teacher' && permissions.allowTeacherMarks);
        bodyHTML = `
            ${currentRole === 'student' ? `
                <div class="mb-6 space-y-2">
                    <h3 class="font-bold text-base">📢 नवीनतम सूचनाएं</h3>
                    ${notices.map(n => `<div class="glass-card p-4 rounded-xl border-l-4 border-amber-500 text-sm"><strong>${n.title}:</strong> ${n.body}</div>`).join('')}
                </div>
            ` : ''}
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">🎓 मार्कशीट, रसीद व डिजिटल आईडी कार्ड</h3>
                    ${currentRole === 'teacher' && !permissions.allowTeacherMarks ? '<span class="text-xs bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full font-bold">🔒 नंबर एंट्री सुपर एडमिन द्वारा लॉक है</span>' : ''}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-2xl border dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-white/40 dark:bg-slate-900/40">
                            <div>
                                <div class="font-bold">${s.name}</div>
                                <div class="text-xs text-slate-400">${s.class} | पिता: ${s.father}</div>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                ${canEditMarks ? `<button onclick="openMarksEditor(${idx})" class="bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">✏️ नंबर</button>` : ''}
                                <button onclick="viewMarksheet(${idx})" class="bg-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">📄 मार्कशीट</button>
                                <button onclick="viewIDCard(${idx})" class="bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">🪪 ID कार्ड</button>
                                <button onclick="printReceipt(${idx})" class="bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">🧾 रसीद</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="modal-area" class="mt-6"></div>
        `;
    }

    main.innerHTML = bodyHTML;
}

// सुपर एडमिन पावर स्विच फंक्शन्स
function togglePermission(key) {
    permissions[key] = !permissions[key];
    saveData();
    renderDashboard();
}

function toggleSchoolStatus(idx) {
    clientSchools[idx].status = clientSchools[idx].status === 'Active' ? 'Suspended' : 'Active';
    saveData();
    renderDashboard();
}

function addNewClientSchool() {
    const name = prompt("नए स्कूल/संस्था का नाम लिखें:");
    if (!name) return;
    const city = prompt("शहर का नाम लिखें:", "आज़मगढ़") || "उत्तर प्रदेश";
    const plan = prompt("प्लान व शुल्क लिखें:", "वार्षिक प्रो (₹6,999)") || "वार्षिक प्रो";
    clientSchools.unshift({
        id: "SCH0" + (clientSchools.length + 1),
        name: name.trim(),
        city: city.trim(),
        plan: plan.trim(),
        expiry: "24/11/2027",
        status: "Active",
        studentsCount: 150
    });
    saveData();
    renderDashboard();
}

// बाकी सभी कार्यशील फंक्शन्स
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
    alert("नया छात्र जुड़ गया!");
    renderDashboard();
}

function deleteStudent(idx) {
    if (confirm("रिकॉर्ड हटाएं?")) { students.splice(idx, 1); saveData(); renderDashboard(); }
}

function collectFee(idx) {
    const due = students[idx].totalFee - students[idx].paidFee;
    const amount = prompt(`बकाया ₹${due} है। कितनी राशि जमा करनी है?`, due);
    if (amount && !isNaN(amount) && Number(amount) > 0) {
        students[idx].paidFee += Number(amount);
        saveData();
        renderDashboard();
        printReceipt(idx);
    }
}

function sendWhatsAppReminder(idx) {
    const s = students[idx];
    const due = s.totalFee - s.paidFee;
    const phone = s.mobile.replace(/\D/g, '');
    const formattedPhone = phone.length === 10 ? '91' + phone : phone;
    const message = `नमस्ते ${s.father} जी,\n\n*${orgName}* की ओर से सूचित किया जाता है कि आपके बच्चे *${s.name}* (${s.class}) का *₹${due} शुल्क बकाया* है। कृपया शीघ्र जमा करें।`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
}

function addExpense(e) {
    e.preventDefault();
    expenses.unshift({
        id: Date.now(),
        title: document.getElementById('exp-title').value,
        category: document.getElementById('exp-cat').value,
        amount: Number(document.getElementById('exp-amount').value),
        date: new Date().toLocaleDateString('hi-IN')
    });
    saveData();
    renderDashboard();
}

function deleteExpense(idx) {
    if (confirm("खर्च हटाएं?")) { expenses.splice(idx, 1); saveData(); renderDashboard(); }
}

function manageSeat(idx) {
    const seat = librarySeats[idx];
    if (seat.status === 'booked') {
        if (confirm(`सीट #${seat.seatNo} (${seat.studentName}) खाली करें?`)) {
            librarySeats[idx] = { seatNo: seat.seatNo, status: "available", studentName: "", shift: "", expiry: "" };
            saveData();
            renderDashboard();
        }
    } else {
        const studentName = prompt(`सीट #${seat.seatNo} बुक करने के लिए नाम लिखें:`);
        if (studentName && studentName.trim()) {
            const shift = prompt("शिफ्ट लिखें:", "फुल डे") || "फुल डे";
            librarySeats[idx] = { seatNo: seat.seatNo, status: "booked", studentName: studentName.trim(), shift, expiry: "30/12/2026" };
            saveData();
            renderDashboard();
        }
    }
}

function addNotice(e) {
    e.preventDefault();
    notices.unshift({
        id: Date.now(),
        title: document.getElementById('not-title').value,
        body: document.getElementById('not-body').value,
        date: new Date().toLocaleDateString('hi-IN'),
        urgent: document.getElementById('not-urgent').checked
    });
    saveData();
    renderDashboard();
}

function deleteNotice(idx) {
    if (confirm("नोटिस हटाएं?")) { notices.splice(idx, 1); saveData(); renderDashboard(); }
}

function toggleAttendance(idx) {
    students[idx].attendance = students[idx].attendance === "उपस्थित" ? "अनुपस्थित" : "उपस्थित";
    saveData();
    renderDashboard();
}

function openMarksEditor(idx) {
    const s = students[idx];
    document.getElementById('modal-area').innerHTML = `
        <div class="glass-card p-5 rounded-2xl border-2 border-indigo-500 max-w-md mx-auto">
            <h4 class="font-bold mb-3">✏️ ${s.name} के नंबर अपडेट करें</h4>
            <form onsubmit="saveStudentMarks(event, ${idx})" class="space-y-3 text-sm">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="text-xs">हिंदी</label><input type="number" id="m-hindi" max="100" value="${s.marks.hindi}" class="w-full px-3 py-1.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                    <div><label class="text-xs">अंग्रेज़ी</label><input type="number" id="m-english" max="100" value="${s.marks.english}" class="w-full px-3 py-1.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                    <div><label class="text-xs">गणित</label><input type="number" id="m-math" max="100" value="${s.marks.math}" class="w-full px-3 py-1.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                    <div><label class="text-xs">विज्ञान</label><input type="number" id="m-science" max="100" value="${s.marks.science}" class="w-full px-3 py-1.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                </div>
                <button type="submit" class="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl">💾 सेव करें</button>
            </form>
        </div>
    `;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function saveStudentMarks(e, idx) {
    e.preventDefault();
    students[idx].marks = {
        hindi: Number(document.getElementById('m-hindi').value),
        english: Number(document.getElementById('m-english').value),
        math: Number(document.getElementById('m-math').value),
        science: Number(document.getElementById('m-science').value)
    };
    saveData();
    viewMarksheet(idx);
}

function printReceipt(idx) {
    const s = students[idx];
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-12 h-12 object-cover rounded-lg mx-auto mb-1">` : '';
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-slate-800 max-w-xl mx-auto shadow-2xl">
            <div class="text-center border-b-2 border-slate-800 pb-3 mb-4">
                ${logoImg}
                <h2 class="text-xl font-bold uppercase">${orgName}</h2>
                <p class="text-xs text-slate-600">आधिकारिक फीस रसीद (Official Fee Receipt)</p>
            </div>
            <div class="space-y-1 text-sm mb-4">
                <p><strong>छात्र:</strong> ${s.name} (${s.class} | रोल: ${s.roll})</p>
                <p><strong>पिता:</strong> ${s.father} | <strong>दिनांक:</strong> ${new Date().toLocaleDateString('hi-IN')}</p>
            </div>
            <table class="w-full border border-slate-800 text-sm mb-4">
                <tr class="bg-slate-100 border-b"><th class="p-2 text-left">विवरण</th><th class="p-2 text-right">राशि</th></tr>
                <tr class="border-b"><td class="p-2">कुल शुल्क</td><td class="p-2 text-right">₹${s.totalFee}</td></tr>
                <tr class="border-b font-bold text-emerald-700"><td class="p-2">जमा शुल्क</td><td class="p-2 text-right">₹${s.paidFee}</td></tr>
                <tr class="font-bold text-rose-700"><td class="p-2">शेष बकाया</td><td class="p-2 text-right">₹${s.totalFee - s.paidFee}</td></tr>
            </table>
            <div class="no-print text-center"><button onclick="window.print()" class="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold">🖨️ रसीद प्रिंट करें</button></div>
        </div>
    `;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function viewMarksheet(idx) {
    const s = students[idx];
    const total = s.marks.hindi + s.marks.english + s.marks.math + s.marks.science;
    const percent = (total / 400 * 100).toFixed(1);
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-12 h-12 object-cover rounded-lg mx-auto mb-1">` : '';
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-amber-700 max-w-xl mx-auto shadow-2xl">
            <div class="text-center border-b-2 border-amber-700 pb-3 mb-4">
                ${logoImg}
                <h2 class="text-xl font-bold">${orgName}</h2>
                <p class="text-xs font-bold text-amber-800">वार्षिक परीक्षा अंकपत्र (REPORT CARD)</p>
            </div>
            <div class="grid grid-cols-2 text-sm gap-2 mb-4">
                <div><strong>नाम:</strong> ${s.name}</div><div><strong>रोल:</strong> ${s.roll}</div>
                <div><strong>पिता:</strong> ${s.father}</div><div><strong>कक्षा:</strong> ${s.class}</div>
            </div>
            <table class="w-full border border-slate-800 text-sm mb-4 text-center">
                <tr class="bg-amber-50 border-b"><th class="p-2 text-left">विषय</th><th>पूर्णांक</th><th>प्राप्तांक</th></tr>
                <tr class="border-b"><td class="p-2 text-left">हिंदी</td><td>100</td><td class="font-bold">${s.marks.hindi}</td></tr>
                <tr class="border-b"><td class="p-2 text-left">अंग्रेज़ी</td><td>100</td><td class="font-bold">${s.marks.english}</td></tr>
                <tr class="border-b"><td class="p-2 text-left">गणित</td><td>100</td><td class="font-bold">${s.marks.math}</td></tr>
                <tr class="border-b"><td class="p-2 text-left">विज्ञान</td><td>100</td><td class="font-bold">${s.marks.science}</td></tr>
                <tr class="bg-slate-100 font-bold"><td class="p-2 text-left">योग व प्रतिशत</td><td>400</td><td>${total} (${percent}%)</td></tr>
            </table>
            <div class="no-print text-center"><button onclick="window.print()" class="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold">🖨️ मार्कशीट प्रिंट करें</button></div>
        </div>
    `;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function viewIDCard(idx) {
    const s = students[idx];
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-8 h-8 object-cover rounded mx-auto mb-1 bg-white p-0.5">` : '';
    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 rounded-2xl border-2 border-indigo-600 max-w-xs mx-auto overflow-hidden shadow-2xl text-center">
            <div class="bg-indigo-600 text-white p-3">
                ${logoImg}
                <h3 class="font-bold text-sm">${orgName}</h3>
                <p class="text-[10px]">STUDENT ID CARD</p>
            </div>
            <div class="p-4">
                <div class="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center text-2xl mb-2">🎓</div>
                <h4 class="font-bold text-lg">${s.name}</h4>
                <p class="text-xs font-bold text-indigo-600 mb-3">${s.class} | रोल: ${s.roll}</p>
                <div class="text-left text-xs space-y-1 bg-slate-50 p-3 rounded-xl border">
                    <p><strong>ID:</strong> ${s.id}</p><p><strong>पिता:</strong> ${s.father}</p><p><strong>मोबाइल:</strong> ${s.mobile}</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function exportCSV() {
    let csv = "Roll,Name,Father,Class,Mobile,TotalFee,PaidFee,Attendance\n";
    students.forEach(s => { csv += `${s.roll},"${s.name}","${s.father}","${s.class}",${s.mobile},${s.totalFee},${s.paidFee},"${s.attendance}"\n`; });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `${orgName}_Report.csv`;
    link.click();
}