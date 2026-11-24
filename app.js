// 1. पहले से भरा हुआ डमी डेटा
const defaultStudents = [
    { id: "STU101", name: "आरव शर्मा", father: "राजेश शर्मा", class: "कक्षा 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attendance: "उपस्थित", marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "अनन्या वर्मा", father: "सुरेश वर्मा", class: "कक्षा 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attendance: "उपस्थित", marks: { hindi: 92, english: 89, math: 78, science: 85 } },
    { id: "STU103", name: "रोहन यादव", father: "महेश यादव", class: "कक्षा 12", roll: "201", mobile: "9876543212", totalFee: 15000, paidFee: 10000, attendance: "अनुपस्थित", marks: { hindi: 75, english: 70, math: 82, science: 79 } },
    { id: "STU104", name: "प्रिया सिंह", father: "विनोद सिंह", class: "कक्षा 12", roll: "202", mobile: "9876543213", totalFee: 15000, paidFee: 15000, attendance: "उपस्थित", marks: { hindi: 94, english: 91, math: 89, science: 93 } },
    { id: "STU105", name: "कबीर खान", father: "इमरान खान", class: "कक्षा 9", roll: "301", mobile: "9876543214", totalFee: 10000, paidFee: 5000, attendance: "उपस्थित", marks: { hindi: 80, english: 76, math: 85, science: 81 } }
];

// डमी खर्च (Expenses)
const defaultExpenses = [
    { id: 1, title: "स्टाफ व शिक्षक वेतन (मासिक)", category: "वेतन", amount: 22000, date: "05/11/2026" },
    { id: 2, title: "बिजली एवं इंटरनेट बिल", category: "बिल", amount: 3200, date: "10/11/2026" },
    { id: 3, title: "स्टेशनरी व प्रिंटिंग खर्च", category: "अन्य", amount: 1500, date: "15/11/2026" }
];

// डमी डिजिटल नोटिस बोर्ड
const defaultNotices = [
    { id: 1, title: "अर्धवार्षिक परीक्षा सूचना", body: "सभी कक्षाओं की अर्धवार्षिक परीक्षाएं आगामी सोमवार से प्रारंभ होंगी। सभी छात्र अपना प्रवेश पत्र प्राप्त कर लें।", date: "20/11/2026", urgent: true },
    { id: 2, title: "शुल्क जमा करने की अंतिम तिथि", body: "जिन छात्रों की द्वितीय किस्त की फीस बकाया है, वे इस महीने की 30 तारीख तक अवश्य जमा कर दें।", date: "18/11/2026", urgent: false }
];

// डमी लाइब्रेरी सीट डेटा (1 से 20 सीटें)
const defaultSeats = Array.from({ length: 20 }, (_, i) => {
    const seatNo = i + 1;
    if (seatNo === 1) return { seatNo, status: "booked", studentName: "आरव शर्मा", shift: "सुबह (6 AM - 2 PM)", expiry: "30/11/2026" };
    if (seatNo === 4) return { seatNo, status: "booked", studentName: "अनन्या वर्मा", shift: "फुल डे (Full Day)", expiry: "05/12/2026" };
    if (seatNo === 7) return { seatNo, status: "booked", studentName: "रोहन यादव", shift: "शाम (2 PM - 10 PM)", expiry: "28/11/2026" };
    if (seatNo === 12) return { seatNo, status: "booked", studentName: "प्रिया सिंह", shift: "फुल डे (Full Day)", expiry: "15/12/2026" };
    return { seatNo, status: "available", studentName: "", shift: "", expiry: "" };
});

let students = JSON.parse(localStorage.getItem('erp_demo_students')) || defaultStudents;
let expenses = JSON.parse(localStorage.getItem('erp_demo_expenses')) || defaultExpenses;
let notices = JSON.parse(localStorage.getItem('erp_demo_notices')) || defaultNotices;
let librarySeats = JSON.parse(localStorage.getItem('erp_demo_seats')) || defaultSeats;
let orgName = localStorage.getItem('erp_demo_org') || "आदर्श विद्या मंदिर इंटर कॉलेज";
let orgLogo = localStorage.getItem('erp_demo_logo') || "";
let currentRole = "admin";
let activeTab = "overview";

function saveData() {
    localStorage.setItem('erp_demo_students', JSON.stringify(students));
    localStorage.setItem('erp_demo_expenses', JSON.stringify(expenses));
    localStorage.setItem('erp_demo_notices', JSON.stringify(notices));
    localStorage.setItem('erp_demo_seats', JSON.stringify(librarySeats));
    localStorage.setItem('erp_demo_org', orgName);
    if (orgLogo) {
        localStorage.setItem('erp_demo_logo', orgLogo);
    }
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

function getLogoHTML(sizeClass = "w-10 h-10") {
    if (orgLogo) {
        return `<img src="${orgLogo}" alt="Logo" class="${sizeClass} object-cover rounded-lg">`;
    }
    return `🏫`;
}

function resetDemoData() {
    if (confirm("क्या आप डेमो का सारा डेटा (छात्र, खर्च, नोटिस, सीटें) वापस शुरुआती स्थिति में लाना चाहते हैं?")) {
        localStorage.clear();
        students = JSON.parse(JSON.stringify(defaultStudents));
        expenses = JSON.parse(JSON.stringify(defaultExpenses));
        notices = JSON.parse(JSON.stringify(defaultNotices));
        librarySeats = JSON.parse(JSON.stringify(defaultSeats));
        orgName = "आदर्श विद्या मंदिर इंटर कॉलेज";
        orgLogo = "";
        alert("डेमो डेटा पूरी तरह रीसेट हो गया है!");
        if (!document.getElementById('dashboard-screen').classList.contains('hidden')) {
            document.getElementById('header-logo-box').innerHTML = getLogoHTML("w-11 h-11");
            renderDashboard();
        }
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

function enterDemo(role) {
    const inputName = document.getElementById('custom-org-name').value.trim();
    if (inputName) {
        orgName = inputName;
        saveData();
    }
    currentRole = role;
    activeTab = role === 'teacher' ? 'attendance' : (role === 'student' ? 'student_portal' : 'overview');

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.getElementById('display-org-name').innerText = orgName;
    document.getElementById('header-logo-box').innerHTML = getLogoHTML("w-11 h-11");

    const roleNames = {
        admin: "प्रिंसिपल / एडमिन पैनल",
        teacher: "शिक्षक (Teacher) पैनल",
        student: "छात्र एवं अभिभावक पोर्टल"
    };
    document.getElementById('display-role-badge').innerText = roleNames[role];

    renderDashboard();
}

function logoutDemo() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function renderDashboard() {
    const main = document.getElementById('main-content');

    let navHTML = `<div class="no-print flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">`;
    if (currentRole === 'admin') {
        navHTML += `
            <button onclick="switchTab('overview')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">📊 डैशबोर्ड</button>
            <button onclick="switchTab('students')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">👨‍🎓 छात्र व एडमिशन</button>
            <button onclick="switchTab('fees')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'fees' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">💰 फीस व WhatsApp</button>
            <button onclick="switchTab('accounts')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'accounts' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">📉 आमदनी व खर्च</button>
            <button onclick="switchTab('library')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'library' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">🪑 लाइब्रेरी सीटें</button>
            <button onclick="switchTab('notices')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'notices' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">📢 नोटिस बोर्ड</button>
            <button onclick="switchTab('attendance')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'attendance' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">✅ हाज़िरी</button>
            <button onclick="switchTab('exams')" class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${activeTab === 'exams' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">📝 मार्कशीट व ID</button>
        `;
    } else if (currentRole === 'teacher') {
        navHTML += `
            <button onclick="switchTab('attendance')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'attendance' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800'}">✅ क्लास हाज़िरी लगाएं</button>
            <button onclick="switchTab('exams')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'exams' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800'}">📝 नंबर एंट्री व मार्कशीट</button>
            <button onclick="switchTab('notices')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'notices' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800'}">📢 सूचना पट्ट (Notice)</button>
        `;
    } else {
        navHTML += `
            <button onclick="switchTab('student_portal')" class="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white">🎓 नोटिस बोर्ड, रसीद, रिजल्ट व आईडी कार्ड</button>
        `;
    }
    navHTML += `</div>`;

    let bodyHTML = "";

    // टैब 1: डैशबोर्ड ओवरव्यू
    if (activeTab === 'overview') {
        const totalStudents = students.length;
        const totalFeeCollected = students.reduce((sum, s) => sum + Number(s.paidFee), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const netBalance = totalFeeCollected - totalExpense;
        const bookedSeats = librarySeats.filter(s => s.status === 'booked').length;

        bodyHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">कुल पंजीकृत छात्र</p>
                    <h3 class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">${totalStudents}</h3>
                    <p class="text-xs text-emerald-600 mt-2">सक्रिय सत्र 2026-27</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">कुल आमदनी (फीस संग्रह)</p>
                    <h3 class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹${totalFeeCollected.toLocaleString('hi-IN')}</h3>
                    <p class="text-xs text-slate-500 mt-2">कुल खर्च: ₹${totalExpense.toLocaleString('hi-IN')}</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">शुद्ध बचत (Net Balance)</p>
                    <h3 class="text-3xl font-bold ${netBalance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'} mt-1">₹${netBalance.toLocaleString('hi-IN')}</h3>
                    <p class="text-xs text-slate-500 mt-2">आमदनी घटाव खर्च</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">लाइब्रेरी सीट स्थिति</p>
                    <h3 class="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">${bookedSeats} / ${librarySeats.length}</h3>
                    <p class="text-xs text-slate-500 mt-2">${librarySeats.length - bookedSeats} सीटें खाली हैं</p>
                </div>
            </div>

            <!-- नवीनतम नोटिस झलक -->
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mb-6 flex flex-wrap justify-between items-center gap-3">
                <div>
                    <span class="text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded mr-2">नवीनतम सूचना</span>
                    <span class="font-semibold text-sm">${notices[0] ? notices[0].title + " — " + notices[0].body : "कोई नई सूचना नहीं"}</span>
                </div>
                <button onclick="switchTab('notices')" class="text-xs font-bold text-amber-700 dark:text-amber-300 underline">सभी नोटिस देखें / जोड़ें →</button>
            </div>

            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">त्वरित कार्य (Quick Actions)</h3>
                    <button onclick="exportCSV()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">📥 Excel (CSV) रिपोर्ट डाउनलोड करें</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onclick="switchTab('students')" class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-left hover:bg-indigo-100 transition">
                        <div class="font-bold text-indigo-700 dark:text-indigo-300">+ नया एडमिशन जोड़ें</div>
                        <div class="text-xs text-slate-500 mt-1">नए छात्र का फॉर्म भरें</div>
                    </button>
                    <button onclick="switchTab('accounts')" class="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-left hover:bg-teal-100 transition">
                        <div class="font-bold text-teal-700 dark:text-teal-300">📉 आमदनी व खर्च जोड़ें</div>
                        <div class="text-xs text-slate-500 mt-1">सैलरी, बिल व मुनाफा देखें</div>
                    </button>
                    <button onclick="switchTab('library')" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-left hover:bg-amber-100 transition">
                        <div class="font-bold text-amber-700 dark:text-amber-300">🪑 लाइब्रेरी सीट बुकिंग</div>
                        <div class="text-xs text-slate-500 mt-1">खाली और भरी सीटें मैनेज करें</div>
                    </button>
                    <button onclick="switchTab('notices')" class="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-left hover:bg-rose-100 transition">
                        <div class="font-bold text-rose-700 dark:text-rose-300">📢 नया नोटिस जारी करें</div>
                        <div class="text-xs text-slate-500 mt-1">छात्रों व अभिभावकों के लिए सूचना</div>
                    </button>
                </div>
            </div>
        `;
    }

    // टैब 2: छात्र लिस्ट व नया एडमिशन
    else if (activeTab === 'students') {
        bodyHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-indigo-600 dark:text-indigo-400">➕ नया छात्र एडमिशन फॉर्म</h3>
                    <form onsubmit="addNewStudent(event)" class="space-y-3">
                        <div>
                            <label class="text-xs font-semibold">छात्र का पूरा नाम *</label>
                            <input type="text" id="stu-name" required placeholder="जैसे: आदित्य कुमार" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">पिता का नाम *</label>
                            <input type="text" id="stu-father" required placeholder="जैसे: श्री रमेश कुमार" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="text-xs font-semibold">कक्षा / बैच *</label>
                                <input type="text" id="stu-class" required placeholder="कक्षा 11" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                            <div>
                                <label class="text-xs font-semibold">रोल नंबर *</label>
                                <input type="text" id="stu-roll" required placeholder="401" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="text-xs font-semibold">कुल शुल्क (₹)</label>
                                <input type="number" id="stu-total-fee" required value="12000" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                            <div>
                                <label class="text-xs font-semibold">अभी जमा शुल्क (₹)</label>
                                <input type="number" id="stu-paid-fee" required value="5000" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-semibold">अभिभावक का मोबाइल नंबर (WhatsApp)</label>
                            <input type="text" id="stu-mobile" placeholder="9876500000" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                        </div>
                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition">
                            ✅ एडमिशन सेव करें
                        </button>
                    </form>
                </div>

                <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg">पंजीकृत छात्रों की सूची (${students.length})</h3>
                        <button onclick="exportCSV()" class="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded text-xs font-semibold">📥 Excel डाउनलोड</button>
                    </div>
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b dark:border-slate-700 text-slate-500 text-xs">
                                <th class="py-2">रोल नं.</th>
                                <th class="py-2">छात्र व पिता का नाम</th>
                                <th class="py-2">कक्षा</th>
                                <th class="py-2">मोबाइल</th>
                                <th class="py-2">कार्रवाई</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <td class="py-3 font-bold">${s.roll}</td>
                                    <td class="py-3">
                                        <div class="font-semibold">${s.name}</div>
                                        <div class="text-xs text-slate-500">पिता: ${s.father}</div>
                                    </td>
                                    <td class="py-3">${s.class}</td>
                                    <td class="py-3">${s.mobile}</td>
                                    <td class="py-3 flex gap-2">
                                        <button onclick="viewIDCard(${idx})" class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">🪪 ID कार्ड</button>
                                        <button onclick="deleteStudent(${idx})" class="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs">हटाएं</button>
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

    // टैब 3: फीस मैनेजमेंट, रसीद व WhatsApp रिमाइंडर
    else if (activeTab === 'fees') {
        bodyHTML = `
            <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
                <h3 class="font-bold text-lg mb-4">💰 छात्र फीस विवरण, लाइव रसीद व WhatsApp रिमाइंडर</h3>
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b dark:border-slate-700 text-slate-500 text-xs">
                            <th class="py-2">छात्र का नाम</th>
                            <th class="py-2">कक्षा</th>
                            <th class="py-2">कुल फीस</th>
                            <th class="py-2">जमा फीस</th>
                            <th class="py-2">बकाया (Pending)</th>
                            <th class="py-2">कार्रवाई एवं संदेश</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map((s, idx) => {
                            const due = s.totalFee - s.paidFee;
                            return `
                                <tr class="border-b dark:border-slate-700/50">
                                    <td class="py-3 font-semibold">${s.name} <span class="text-xs text-slate-400">(${s.roll})</span></td>
                                    <td class="py-3">${s.class}</td>
                                    <td class="py-3">₹${s.totalFee}</td>
                                    <td class="py-3 text-emerald-600 font-bold">₹${s.paidFee}</td>
                                    <td class="py-3 ${due > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">₹${due}</td>
                                    <td class="py-3 flex flex-wrap gap-2">
                                        ${due > 0 ? `
                                            <button onclick="collectFee(${idx})" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-semibold">+ जमा करें</button>
                                            <button onclick="sendWhatsAppReminder(${idx})" class="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded text-xs font-semibold">💬 WhatsApp रिमाइंडर</button>
                                        ` : `<span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">पूर्ण जमा</span>`}
                                        <button onclick="printReceipt(${idx})" class="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-xs font-semibold">🧾 रसीद</button>
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

    // टैब 4: आमदनी और खर्च का हिसाब (Income vs Expense)
    else if (activeTab === 'accounts') {
        const totalIncome = students.reduce((sum, s) => sum + Number(s.paidFee), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const netProfit = totalIncome - totalExpense;

        bodyHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5 rounded-xl">
                    <div class="text-xs font-bold text-emerald-700 dark:text-emerald-300">कुल आमदनी (फीस से प्राप्त)</div>
                    <div class="text-2xl font-bold text-emerald-600 mt-1">+ ₹${totalIncome.toLocaleString('hi-IN')}</div>
                </div>
                <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-5 rounded-xl">
                    <div class="text-xs font-bold text-rose-700 dark:text-rose-300">कुल खर्च (वेतन, बिल व अन्य)</div>
                    <div class="text-2xl font-bold text-rose-600 mt-1">- ₹${totalExpense.toLocaleString('hi-IN')}</div>
                </div>
                <div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-5 rounded-xl">
                    <div class="text-xs font-bold text-indigo-700 dark:text-indigo-300">शुद्ध मुनाफा / शेष बैलेंस</div>
                    <div class="text-2xl font-bold ${netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'} mt-1">₹${netProfit.toLocaleString('hi-IN')}</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-rose-600">➕ नया खर्च दर्ज करें</h3>
                    <form onsubmit="addExpense(event)" class="space-y-3 text-sm">
                        <div>
                            <label class="text-xs font-semibold">खर्च का विवरण *</label>
                            <input type="text" id="exp-title" required placeholder="जैसे: जनरेटर डीज़ल / सफाई खर्च" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">श्रेणी (Category)</label>
                            <select id="exp-cat" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                                <option value="वेतन">स्टाफ वेतन (Salary)</option>
                                <option value="बिल">बिजली / इंटरनेट बिल</option>
                                <option value="मरम्मत">रखरखाव व मरम्मत</option>
                                <option value="अन्य">स्टेशनरी व अन्य</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs font-semibold">खर्च राशि (₹) *</label>
                            <input type="number" id="exp-amount" required placeholder="1500" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                        </div>
                        <button type="submit" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg">
                            💾 खर्च रिकॉर्ड करें
                        </button>
                    </form>
                </div>

                <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
                    <h3 class="font-bold text-lg mb-4">संस्थान के खर्चों का ब्यौरा</h3>
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b dark:border-slate-700 text-slate-500 text-xs">
                                <th class="py-2">दिनांक</th>
                                <th class="py-2">विवरण</th>
                                <th class="py-2">श्रेणी</th>
                                <th class="py-2">राशि (₹)</th>
                                <th class="py-2">हटाएं</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenses.map((ex, idx) => `
                                <tr class="border-b dark:border-slate-700/50">
                                    <td class="py-3 text-xs">${ex.date}</td>
                                    <td class="py-3 font-semibold">${ex.title}</td>
                                    <td class="py-3"><span class="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">${ex.category}</span></td>
                                    <td class="py-3 text-rose-600 font-bold">₹${ex.amount}</td>
                                    <td class="py-3"><button onclick="deleteExpense(${idx})" class="text-xs text-rose-500 underline">हटाएं</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // टैब 5: लाइब्रेरी सीट मैनेजमेंट
    else if (activeTab === 'library') {
        const bookedCount = librarySeats.filter(s => s.status === 'booked').length;
        bodyHTML = `
            <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                    <div>
                        <h3 class="font-bold text-lg">🪑 सेल्फ-स्टडी लाइब्रेरी सीट मैनेजमेंट</h3>
                        <p class="text-xs text-slate-500">किसी भी सीट पर क्लिक करके छात्र को आवंटित (Book) या खाली करें</p>
                    </div>
                    <div class="flex gap-3 text-xs font-bold">
                        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">🟢 खाली: ${librarySeats.length - bookedCount}</span>
                        <span class="px-3 py-1 rounded-full bg-rose-100 text-rose-800">🔴 भरी हुई: ${bookedCount}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    ${librarySeats.map((seat, idx) => `
                        <div onclick="manageSeat(${idx})" class="cursor-pointer p-4 rounded-xl border-2 transition ${seat.status === 'booked' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100'}">
                            <div class="flex justify-between items-center mb-1">
                                <span class="font-bold text-base">सीट #${seat.seatNo}</span>
                                <span class="text-xs font-bold px-2 py-0.5 rounded ${seat.status === 'booked' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}">
                                    ${seat.status === 'booked' ? 'बुक है' : 'खाली'}
                                </span>
                            </div>
                            ${seat.status === 'booked' ? `
                                <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 truncate">${seat.studentName}</div>
                                <div class="text-[11px] text-slate-500">${seat.shift}</div>
                                <div class="text-[10px] text-rose-600 font-semibold mt-1">समाप्ति: ${seat.expiry}</div>
                            ` : `
                                <div class="text-xs text-emerald-700 dark:text-emerald-300 mt-3">+ बुकिंग के लिए क्लिक करें</div>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // टैब 6: डिजिटल नोटिस बोर्ड
    else if (activeTab === 'notices') {
        bodyHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                ${currentRole === 'admin' ? `
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
                    <h3 class="font-bold text-lg mb-4 text-amber-600">📢 नया नोटिस / सूचना जारी करें</h3>
                    <form onsubmit="addNotice(event)" class="space-y-3 text-sm">
                        <div>
                            <label class="text-xs font-semibold">सूचना का शीर्षक *</label>
                            <input type="text" id="not-title" required placeholder="जैसे: कल अवकाश की सूचना" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">विस्तृत संदेश *</label>
                            <textarea id="not-body" rows="3" required placeholder="यहाँ पूरी सूचना लिखें..." class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700"></textarea>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="not-urgent" class="rounded">
                            <label for="not-urgent" class="text-xs font-semibold text-rose-600">अति आवश्यक (Urgent) चिह्नित करें</label>
                        </div>
                        <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg">
                            🚀 नोटिस प्रकाशित करें
                        </button>
                    </form>
                </div>
                ` : ''}

                <div class="${currentRole === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4">
                    <h3 class="font-bold text-lg">📌 संस्थान का डिजिटल सूचना पट्ट (Notice Board)</h3>
                    ${notices.map((n, idx) => `
                        <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border-l-4 ${n.urgent ? 'border-rose-600' : 'border-indigo-600'} shadow-sm">
                            <div class="flex justify-between items-start gap-2">
                                <div>
                                    ${n.urgent ? '<span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded mr-2">अति आवश्यक</span>' : ''}
                                    <span class="text-xs text-slate-400">दिनांक: ${n.date}</span>
                                    <h4 class="font-bold text-base mt-1">${n.title}</h4>
                                </div>
                                ${currentRole === 'admin' ? `<button onclick="deleteNotice(${idx})" class="text-xs text-rose-500 underline">हटाएं</button>` : ''}
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">${n.body}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // टैब 7: दैनिक उपस्थिति
    else if (activeTab === 'attendance') {
        bodyHTML = `
            <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h3 class="font-bold text-lg">✅ आज की डिजिटल हाज़िरी</h3>
                        <p class="text-xs text-slate-500">एक क्लिक में छात्र की उपस्थिति बदलें</p>
                    </div>
                    <span class="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold">दिनांक: ${new Date().toLocaleDateString('hi-IN')}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-xl border dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <div class="font-bold">${s.name}</div>
                                <div class="text-xs text-slate-500">${s.class} | रोल: ${s.roll}</div>
                            </div>
                            <button onclick="toggleAttendance(${idx})" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${s.attendance === 'उपस्थित' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                                ${s.attendance === 'उपस्थित' ? '✔ उपस्थित' : '✖ अनुपस्थित'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // टैब 8: मार्कशीट, लाइव नंबर एंट्री, ID कार्ड व छात्र पोर्टल
    else if (activeTab === 'exams' || activeTab === 'student_portal') {
        let noticeBanner = '';
        if (currentRole === 'student') {
            noticeBanner = `
                <div class="mb-6 space-y-3">
                    <h3 class="font-bold text-lg">📢 संस्थान की नवीनतम सूचनाएं (Notice Board)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${notices.map(n => `
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 ${n.urgent ? 'border-rose-600' : 'border-amber-500'} shadow-sm">
                                <div class="text-xs text-slate-400">${n.date} ${n.urgent ? '• <span class="text-rose-600 font-bold">अति आवश्यक</span>' : ''}</div>
                                <div class="font-bold text-sm mt-1">${n.title}</div>
                                <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${n.body}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        bodyHTML = `
            ${noticeBanner}
            <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-lg mb-4">🎓 छात्र मार्कशीट, नंबर एंट्री, रसीद व आईडी कार्ड</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${students.map((s, idx) => `
                        <div class="p-4 rounded-xl border dark:border-slate-700 flex flex-wrap justify-between items-center gap-3">
                            <div>
                                <div class="font-bold text-base">${s.name}</div>
                                <div class="text-xs text-slate-500">${s.class} | पिता: ${s.father}</div>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                ${currentRole !== 'student' ? `<button onclick="openMarksEditor(${idx})" class="bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold">✏️ नंबर बदलें</button>` : ''}
                                <button onclick="viewMarksheet(${idx})" class="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold">📄 मार्कशीट</button>
                                <button onclick="viewIDCard(${idx})" class="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold">🪪 ID कार्ड</button>
                                <button onclick="printReceipt(${idx})" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold">🧾 रसीद</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="modal-area" class="mt-6"></div>
        `;
    }

    main.innerHTML = navHTML + bodyHTML;
}

function switchTab(tab) {
    activeTab = tab;
    renderDashboard();
}

function addNewStudent(e) {
    e.preventDefault();
    const newStu = {
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
    };
    students.unshift(newStu);
    saveData();
    alert("नया छात्र सफलतापूर्वक जुड़ गया है!");
    renderDashboard();
}

function deleteStudent(idx) {
    if (confirm("क्या आप इस छात्र का रिकॉर्ड हटाना चाहते हैं?")) {
        students.splice(idx, 1);
        saveData();
        renderDashboard();
    }
}

function collectFee(idx) {
    const due = students[idx].totalFee - students[idx].paidFee;
    const amount = prompt(`${students[idx].name} की बकाया फीस ₹${due} है। अभी कितनी राशि जमा करनी है?`, due);
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
    const message = `नमस्ते ${s.father} जी,\n\n*${orgName}* की ओर से सूचित किया जाता है कि आपके बच्चे *${s.name}* (${s.class}, रोल नं. ${s.roll}) का कुल शुल्क ₹${s.totalFee} में से ₹${s.paidFee} जमा है और *₹${due} बकाया (Pending)* है।\n\nकृपया शीघ्र बकाया शुल्क जमा करने का कष्ट करें।\nधन्यवाद!`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// खर्च जोड़ना व हटाना
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
    if (confirm("क्या आप इस खर्च का रिकॉर्ड हटाना चाहते हैं?")) {
        expenses.splice(idx, 1);
        saveData();
        renderDashboard();
    }
}

// लाइब्रेरी सीट बुकिंग व खाली करना
function manageSeat(idx) {
    const seat = librarySeats[idx];
    if (seat.status === 'booked') {
        if (confirm(`सीट #${seat.seatNo} वर्तमान में "${seat.studentName}" (${seat.shift}) के नाम बुक है। क्या आप इसे खाली करना चाहते हैं?`)) {
            librarySeats[idx] = { seatNo: seat.seatNo, status: "available", studentName: "", shift: "", expiry: "" };
            saveData();
            renderDashboard();
        }
    } else {
        const studentName = prompt(`सीट #${seat.seatNo} बुक करने के लिए छात्र का नाम लिखें:`);
        if (studentName && studentName.trim()) {
            const shift = prompt("शिफ्ट चुनें (जैसे: सुबह 6-2, शाम 2-10, या फुल डे):", "फुल डे (Full Day)") || "फुल डे";
            librarySeats[idx] = {
                seatNo: seat.seatNo,
                status: "booked",
                studentName: studentName.trim(),
                shift: shift,
                expiry: "30/12/2026"
            };
            saveData();
            renderDashboard();
        }
    }
}

// नोटिस जोड़ना व हटाना
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
    alert("नया नोटिस प्रकाशित हो गया है! यह अब छात्र पोर्टल पर भी दिखेगा।");
    renderDashboard();
}

function deleteNotice(idx) {
    if (confirm("क्या आप यह नोटिस हटाना चाहते हैं?")) {
        notices.splice(idx, 1);
        saveData();
        renderDashboard();
    }
}

function toggleAttendance(idx) {
    students[idx].attendance = students[idx].attendance === "उपस्थित" ? "अनुपस्थित" : "उपस्थित";
    saveData();
    renderDashboard();
}

function openMarksEditor(idx) {
    const s = students[idx];
    const html = `
        <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border-2 border-indigo-500 max-w-md mx-auto shadow-lg">
            <h4 class="font-bold text-base mb-3">✏️ ${s.name} (${s.class}) के नंबर अपडेट करें</h4>
            <form onsubmit="saveStudentMarks(event, ${idx})" class="space-y-3 text-sm">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-semibold">हिंदी (100 में से)</label>
                        <input type="number" id="m-hindi" max="100" min="0" value="${s.marks.hindi}" required class="w-full mt-1 px-3 py-1.5 rounded border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                    </div>
                    <div>
                        <label class="text-xs font-semibold">अंग्रेज़ी (100 में से)</label>
                        <input type="number" id="m-english" max="100" min="0" value="${s.marks.english}" required class="w-full mt-1 px-3 py-1.5 rounded border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                    </div>
                    <div>
                        <label class="text-xs font-semibold">गणित (100 में से)</label>
                        <input type="number" id="m-math" max="100" min="0" value="${s.marks.math}" required class="w-full mt-1 px-3 py-1.5 rounded border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                    </div>
                    <div>
                        <label class="text-xs font-semibold">विज्ञान (100 में से)</label>
                        <input type="number" id="m-science" max="100" min="0" value="${s.marks.science}" required class="w-full mt-1 px-3 py-1.5 rounded border dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                    </div>
                </div>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg">
                    💾 नंबर सेव करें और मार्कशीट देखें
                </button>
            </form>
        </div>
    `;
    document.getElementById('modal-area').innerHTML = html;
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
    const receiptHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-xl border-2 border-slate-800 max-w-xl mx-auto shadow-lg mt-6">
            <div class="text-center border-b-2 border-slate-800 pb-3 mb-4">
                ${logoImg}
                <h2 class="text-xl font-bold uppercase">${orgName}</h2>
                <p class="text-xs text-slate-600">डिजिटल फीस रसीद (Official Fee Receipt)</p>
            </div>
            <div class="flex justify-between text-xs mb-4">
                <span><strong>रसीद संख्या:</strong> REC-${Math.floor(1000 + Math.random()*9000)}</span>
                <span><strong>दिनांक:</strong> ${new Date().toLocaleDateString('hi-IN')}</span>
            </div>
            <div class="space-y-1.5 text-sm mb-4">
                <p><strong>छात्र का नाम:</strong> ${s.name} (रोल नं.: ${s.roll})</p>
                <p><strong>पिता का नाम:</strong> ${s.father}</p>
                <p><strong>कक्षा:</strong> ${s.class}</p>
            </div>
            <table class="w-full border border-slate-800 text-sm mb-4">
                <tr class="bg-slate-100 border-b border-slate-800">
                    <th class="p-2 text-left">विवरण</th>
                    <th class="p-2 text-right">राशि (₹)</th>
                </tr>
                <tr class="border-b border-slate-300">
                    <td class="p-2">कुल वार्षिक शुल्क</td>
                    <td class="p-2 text-right">₹${s.totalFee}</td>
                </tr>
                <tr class="border-b border-slate-300 font-bold text-emerald-700">
                    <td class="p-2">कुल जमा शुल्क (Paid)</td>
                    <td class="p-2 text-right">₹${s.paidFee}</td>
                </tr>
                <tr class="font-bold text-rose-700">
                    <td class="p-2">शेष बकाया शुल्क (Balance Due)</td>
                    <td class="p-2 text-right">₹${s.totalFee - s.paidFee}</td>
                </tr>
            </table>
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-slate-400 text-xs">
                <span>अभिभावक के हस्ताक्षर</span>
                <span class="font-bold">प्राधिकृत हस्ताक्षर व मुहर</span>
            </div>
            <div class="no-print mt-4 text-center">
                <button onclick="window.print()" class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold">🖨️ रसीद प्रिंट / PDF सेव करें</button>
            </div>
        </div>
    `;
    document.getElementById('modal-area').innerHTML = receiptHTML;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function viewMarksheet(idx) {
    const s = students[idx];
    const total = s.marks.hindi + s.marks.english + s.marks.math + s.marks.science;
    const percent = (total / 400 * 100).toFixed(1);
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-12 h-12 object-cover rounded-lg mx-auto mb-1">` : '';
    const html = `
        <div class="bg-white text-slate-900 p-6 rounded-xl border-2 border-amber-700 max-w-xl mx-auto shadow-lg mt-6">
            <div class="text-center border-b-2 border-amber-700 pb-3 mb-4">
                ${logoImg}
                <h2 class="text-xl font-bold">${orgName}</h2>
                <p class="text-xs font-bold text-amber-800">वार्षिक परीक्षा अंकपत्र (PROGRESS REPORT CARD)</p>
            </div>
            <div class="grid grid-cols-2 text-sm gap-2 mb-4">
                <div><strong>नाम:</strong> ${s.name}</div>
                <div><strong>रोल नंबर:</strong> ${s.roll}</div>
                <div><strong>पिता:</strong> ${s.father}</div>
                <div><strong>कक्षा:</strong> ${s.class}</div>
            </div>
            <table class="w-full border border-slate-800 text-sm mb-4 text-center">
                <tr class="bg-amber-50 border-b border-slate-800">
                    <th class="p-2 text-left">विषय</th>
                    <th class="p-2">पूर्णांक</th>
                    <th class="p-2">प्राप्तांक</th>
                </tr>
                <tr class="border-b"><td class="p-2 text-left">हिंदी</td><td>100</td><td class="font-bold">${s.marks.hindi}</td></tr>
                <tr class="border-b"><td class="p-2 text-left">अंग्रेज़ी</td><td>100</td><td class="font-bold">${s.marks.english}</td></tr>
                <tr class="border-b"><td class="p-2 text-left">गणित</td><td>100</td><td class="font-bold">${s.marks.math}</td></tr>
                <tr class="border-b"><td class="p-2 text-left">विज्ञान</td><td>100</td><td class="font-bold">${s.marks.science}</td></tr>
                <tr class="bg-slate-100 font-bold">
                    <td class="p-2 text-left">महायोग एवं प्रतिशत</td>
                    <td>400</td>
                    <td>${total} (${percent}%) — उत्तीर्ण</td>
                </tr>
            </table>
            <div class="no-print text-center">
                <button onclick="window.print()" class="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-bold">🖨️ मार्कशीट प्रिंट करें</button>
            </div>
        </div>
    `;
    document.getElementById('modal-area').innerHTML = html;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function viewIDCard(idx) {
    const s = students[idx];
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-8 h-8 object-cover rounded mx-auto mb-1 bg-white p-0.5">` : '';
    const html = `
        <div class="bg-white text-slate-900 rounded-2xl border-2 border-indigo-600 max-w-xs mx-auto overflow-hidden shadow-xl mt-6 text-center">
            <div class="bg-indigo-600 text-white p-3">
                ${logoImg}
                <h3 class="font-bold text-sm leading-tight">${orgName}</h3>
                <p class="text-[10px] opacity-90">छात्र पहचान पत्र (STUDENT ID CARD)</p>
            </div>
            <div class="p-4">
                <div class="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center text-2xl font-bold mb-2 border-2 border-indigo-600">
                    🎓
                </div>
                <h4 class="font-bold text-lg text-slate-900">${s.name}</h4>
                <p class="text-xs font-semibold text-indigo-600 mb-3">${s.class} | रोल नं.: ${s.roll}</p>
                <div class="text-left text-xs space-y-1 bg-slate-50 p-3 rounded-lg border">
                    <p><strong>आईडी नं.:</strong> ${s.id}</p>
                    <p><strong>पिता का नाम:</strong> ${s.father}</p>
                    <p><strong>मोबाइल:</strong> ${s.mobile}</p>
                </div>
            </div>
            <div class="bg-slate-100 py-2 text-[10px] text-slate-500 border-t">
                सत्र 2026-27 | प्राचार्य हस्ताक्षर
            </div>
        </div>
    `;
    document.getElementById('modal-area').innerHTML = html;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}

function exportCSV() {
    let csv = "Roll No,Student Name,Father Name,Class,Mobile,Total Fee,Paid Fee,Attendance\n";
    students.forEach(s => {
        csv += `${s.roll},"${s.name}","${s.father}","${s.class}",${s.mobile},${s.totalFee},${s.paidFee},"${s.attendance}"\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${orgName}_Students_Report.csv`;
    link.click();
}