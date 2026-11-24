// 1. पहले से भरा हुआ डमी डेटा
const defaultStudents = [
    { id: "STU101", name: "आरव शर्मा", father: "राजेश शर्मा", class: "कक्षा 10", roll: "101", mobile: "9876543210", totalFee: 12000, paidFee: 12000, attendance: "उपस्थित", marks: { hindi: 88, english: 84, math: 95, science: 91 } },
    { id: "STU102", name: "अनन्या वर्मा", father: "सुरेश वर्मा", class: "कक्षा 10", roll: "102", mobile: "9876543211", totalFee: 12000, paidFee: 8000, attendance: "उपस्थित", marks: { hindi: 92, english: 89, math: 78, science: 85 } },
    { id: "STU103", name: "रोहन यादव", father: "महेश यादव", class: "कक्षा 12", roll: "201", mobile: "9876543212", totalFee: 15000, paidFee: 10000, attendance: "अनुपस्थित", marks: { hindi: 75, english: 70, math: 82, science: 79 } },
    { id: "STU104", name: "प्रिया सिंह", father: "विनोद सिंह", class: "कक्षा 12", roll: "202", mobile: "9876543213", totalFee: 15000, paidFee: 15000, attendance: "उपस्थित", marks: { hindi: 94, english: 91, math: 89, science: 93 } },
    { id: "STU105", name: "कबीर खान", father: "इमरान खान", class: "कक्षा 9", roll: "301", mobile: "9876543214", totalFee: 10000, paidFee: 5000, attendance: "उपस्थित", marks: { hindi: 80, english: 76, math: 85, science: 81 } }
];

let students = JSON.parse(localStorage.getItem('erp_demo_students')) || defaultStudents;
let orgName = localStorage.getItem('erp_demo_org') || "आदर्श विद्या मंदिर इंटर कॉलेज";
let orgLogo = localStorage.getItem('erp_demo_logo') || "";
let currentRole = "admin";
let activeTab = "overview";

function saveData() {
    localStorage.setItem('erp_demo_students', JSON.stringify(students));
    localStorage.setItem('erp_demo_org', orgName);
    if (orgLogo) {
        localStorage.setItem('erp_demo_logo', orgLogo);
    }
}

// क्लाइंट के लोगो को पढ़ना और सेव करना
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
    if (confirm("क्या आप डेमो डेटा और लोगो को वापस शुरुआती स्थिति में लाना चाहते हैं?")) {
        localStorage.removeItem('erp_demo_students');
        localStorage.removeItem('erp_demo_org');
        localStorage.removeItem('erp_demo_logo');
        students = JSON.parse(JSON.stringify(defaultStudents));
        orgName = "आदर्श विद्या मंदिर इंटर कॉलेज";
        orgLogo = "";
        alert("डेमो डेटा रीसेट हो गया है!");
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
            <button onclick="switchTab('overview')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">📊 डैशबोर्ड रिपोर्ट</button>
            <button onclick="switchTab('students')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">👨‍🎓 छात्र व नया एडमिशन</button>
            <button onclick="switchTab('fees')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'fees' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">💰 फीस, रसीद व WhatsApp</button>
            <button onclick="switchTab('attendance')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'attendance' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">✅ दैनिक हाज़िरी</button>
            <button onclick="switchTab('exams')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'exams' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}">📝 मार्कशीट, नंबर एंट्री व ID</button>
        `;
    } else if (currentRole === 'teacher') {
        navHTML += `
            <button onclick="switchTab('attendance')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'attendance' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800'}">✅ क्लास हाज़िरी लगाएं</button>
            <button onclick="switchTab('exams')" class="px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'exams' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800'}">📝 नंबर एंट्री व मार्कशीट</button>
        `;
    } else {
        navHTML += `
            <button onclick="switchTab('student_portal')" class="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white">🎓 मेरी प्रोफ़ाइल, रसीद व रिजल्ट</button>
        `;
    }
    navHTML += `</div>`;

    let bodyHTML = "";

    // टैब 1: डैशबोर्ड ओवरव्यू
    if (activeTab === 'overview') {
        const totalStudents = students.length;
        const totalFeeExpected = students.reduce((sum, s) => sum + Number(s.totalFee), 0);
        const totalFeeCollected = students.reduce((sum, s) => sum + Number(s.paidFee), 0);
        const pendingFee = totalFeeExpected - totalFeeCollected;
        const presentCount = students.filter(s => s.attendance === "उपस्थित").length;

        bodyHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">कुल पंजीकृत छात्र</p>
                    <h3 class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">${totalStudents}</h3>
                    <p class="text-xs text-emerald-600 mt-2">सक्रिय सत्र 2026-27</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">कुल जमा फीस</p>
                    <h3 class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹${totalFeeCollected.toLocaleString('hi-IN')}</h3>
                    <p class="text-xs text-slate-500 mt-2">कुल लक्ष्य: ₹${totalFeeExpected.toLocaleString('hi-IN')}</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">बकाया फीस (Pending)</p>
                    <h3 class="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">₹${pendingFee.toLocaleString('hi-IN')}</h3>
                    <p class="text-xs text-rose-500 mt-2">WhatsApp रिमाइंडर उपलब्ध</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">आज की उपस्थिति</p>
                    <h3 class="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">${presentCount} / ${totalStudents}</h3>
                    <p class="text-xs text-slate-500 mt-2">${Math.round((presentCount/totalStudents)*100)}% छात्र उपस्थित</p>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">त्वरित कार्रवाई (Quick Actions)</h3>
                    <button onclick="exportCSV()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">📥 Excel (CSV) डाउनलोड करें</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onclick="switchTab('students')" class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-left hover:bg-indigo-100 transition">
                        <div class="font-bold text-indigo-700 dark:text-indigo-300">+ नया एडमिशन जोड़ें</div>
                        <div class="text-xs text-slate-500 mt-1">नए छात्र का फॉर्म भरें और तुरंत रिकॉर्ड बनाएं</div>
                    </button>
                    <button onclick="switchTab('fees')" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-left hover:bg-emerald-100 transition">
                        <div class="font-bold text-emerald-700 dark:text-emerald-300">💬 फीस व WhatsApp अलर्ट</div>
                        <div class="text-xs text-slate-500 mt-1">रसीद निकालें या बकाया फीस का मैसेज भेजें</div>
                    </button>
                    <button onclick="switchTab('exams')" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-left hover:bg-amber-100 transition">
                        <div class="font-bold text-amber-700 dark:text-amber-300">📝 नंबर एंट्री व मार्कशीट</div>
                        <div class="text-xs text-slate-500 mt-1">परीक्षा के नंबर बदलें और लाइव रिपोर्ट कार्ड बनाएं</div>
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
                                <label class="text-xs font-semibold">कक्षा / कोर्स *</label>
                                <input type="text" id="stu-class" required placeholder="कक्षा 11" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                            <div>
                                <label class="text-xs font-semibold">रोल नंबर *</label>
                                <input type="text" id="stu-roll" required placeholder="401" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="text-xs font-semibold">कुल वार्षिक फीस (₹)</label>
                                <input type="number" id="stu-total-fee" required value="12000" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                            </div>
                            <div>
                                <label class="text-xs font-semibold">अभी जमा फीस (₹)</label>
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

    // टैब 3: फीस मैनेजमेंट, रसीद व व्हाट्सएप रिमाइंडर
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

    // टैब 4: दैनिक उपस्थिति
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

    // टैब 5: मार्कशीट, लाइव नंबर एंट्री और आईडी कार्ड
    else if (activeTab === 'exams' || activeTab === 'student_portal') {
        bodyHTML = `
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

// सीधा WhatsApp बकाया रिमाइंडर भेजना
function sendWhatsAppReminder(idx) {
    const s = students[idx];
    const due = s.totalFee - s.paidFee;
    const phone = s.mobile.replace(/\D/g, '');
    const formattedPhone = phone.length === 10 ? '91' + phone : phone;
    const message = `नमस्ते ${s.father} जी,\n\n*${orgName}* की ओर से सूचित किया जाता है कि आपके बच्चे *${s.name}* (${s.class}, रोल नं. ${s.roll}) का कुल शुल्क ₹${s.totalFee} में से ₹${s.paidFee} जमा है और *₹${due} बकाया (Pending)* है।\n\nकृपया शीघ्र बकाया शुल्क जमा करने का कष्ट करें।\nधन्यवाद!`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function toggleAttendance(idx) {
    students[idx].attendance = students[idx].attendance === "उपस्थित" ? "अनुपस्थित" : "उपस्थित";
    saveData();
    renderDashboard();
}

// टीचर लाइव नंबर एंट्री फॉर्म खोलना
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

// लाइव फीस रसीद (लोगो के साथ)
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

// डिजिटल मार्कशीट (लोगो के साथ)
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

// डिजिटल ID कार्ड (लोगो के साथ)
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