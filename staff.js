// =========================================================================
// VidyaSetu Ultra-Smooth Staff Management, Analytics & Payroll (staff.js)
// =========================================================================

const defaultStaff = [
    {
        id: "EMP101",
        name: "Dr. Rajesh Sharma",
        role: "Senior Maths Teacher",
        mobile: "9876543210",
        whatsapp: "9876543210",
        email: "rajesh.sharma@vidyasetu.in",
        dob: "1985-06-15",
        joiningDate: "2022-07-01",
        qualification: "M.Sc (Maths), B.Ed",
        idProof: "AADHAAR-4521-8890",
        bank: "SBI •••• 4521",
        address: "Civil Lines, Azamgarh, UP",
        basicSalary: 28000,
        workingDays: 30,
        absentDays: 1,
        halfDays: 1,
        todayStatus: "P",
        paidStatus: "Paid",
        username: "teacher1",
        password: "123",
        powers: { dashboard: false, students: false, fees: false, staff: false, accounts: false, library: false, notices: true, attendance: true, exams: true }
    },
    {
        id: "EMP102",
        name: "Sunita Verma",
        role: "Head Accountant & Clerk",
        mobile: "9876543211",
        whatsapp: "9876543211",
        email: "sunita.verma@vidyasetu.in",
        dob: "1990-03-22",
        joiningDate: "2023-04-10",
        qualification: "M.Com, Tally Prime",
        idProof: "AADHAAR-8890-1122",
        bank: "PNB •••• 8890",
        address: "Sidhari, Azamgarh, UP",
        basicSalary: 18000,
        workingDays: 30,
        absentDays: 0,
        halfDays: 1,
        todayStatus: "P",
        paidStatus: "Pending",
        username: "clerk1",
        password: "123",
        powers: { dashboard: true, students: true, fees: true, staff: true, accounts: true, library: false, notices: true, attendance: false, exams: false }
    },
    {
        id: "EMP103",
        name: "Ramesh Yadav",
        role: "Transport & Bus Driver",
        mobile: "9876543215",
        whatsapp: "9876543215",
        email: "",
        dob: "1982-11-05",
        joiningDate: "2024-01-15",
        qualification: "Commercial HMV License",
        idProof: "DL-UP50-20249912",
        bank: "Cash Payment",
        address: "Jiyanpur, Azamgarh, UP",
        basicSalary: 12000,
        workingDays: 30,
        absentDays: 0,
        halfDays: 0,
        todayStatus: "P",
        paidStatus: "Pending",
        username: "",
        password: "",
        powers: {}
    }
];

let staffList = [];
let payrollMonth = "November 2026";
let editingStaffIndex = null;
let viewingStaffIndex = null;
let staffSearchQuery = "";
let staffFilterType = "ALL"; // 'ALL', 'LOGIN', 'PRESENT', 'ABSENT'

// सुरक्षित तरीके से वर्तमान संस्थान का स्टाफ डेटा लोड करना
function loadCurrentInstituteStaff() {
    try {
        const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'staff';
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                staffList = parsed;
                return;
            }
        }
        staffList = JSON.parse(JSON.stringify(defaultStaff));
        localStorage.setItem(key, JSON.stringify(staffList));
    } catch (err) {
        staffList = JSON.parse(JSON.stringify(defaultStaff));
    }
}

function saveStaffData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'staff';
    localStorage.setItem(key, JSON.stringify(staffList));
}

function calculateNetSalary(st) {
    const basic = Number(st.basicSalary || 0);
    if (basic <= 0) return 0;
    const perDay = basic / (Number(st.workingDays) || 30);
    const deduction = (Number(st.absentDays || 0) * perDay) + (Number(st.halfDays || 0) * (perDay / 2));
    return Math.max(0, Math.round(basic - deduction));
}

// =========================================================================
// मुख्य Staff Management स्क्रीन (Top Analytics + Form + Full Directory)
// =========================================================================
function renderStaffManagementModule() {
    loadCurrentInstituteStaff();
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

    const totalStaff = staffList.length;
    const presentToday = staffList.filter(st => st.todayStatus === 'P').length;
    const loginEnabledCount = staffList.filter(st => st.username && st.password).length;
    const totalNetPayroll = staffList.reduce((sum, st) => sum + calculateNetSalary(st), 0);

    const editObj = (editingStaffIndex !== null && staffList[editingStaffIndex]) ? staffList[editingStaffIndex] : null;
    const viewObj = (viewingStaffIndex !== null && staffList[viewingStaffIndex]) ? staffList[viewingStaffIndex] : null;

    const filteredStaff = staffList.filter(st => {
        const q = staffSearchQuery.toLowerCase();
        const matchText = (st.name || "").toLowerCase().includes(q) ||
                          (st.role || "").toLowerCase().includes(q) ||
                          (st.mobile || "").includes(q) ||
                          (st.address || "").toLowerCase().includes(q);
        if (!matchText) return false;
        if (staffFilterType === 'LOGIN') return Boolean(st.username && st.password);
        if (staffFilterType === 'PRESENT') return st.todayStatus === 'P';
        if (staffFilterType === 'ABSENT') return st.todayStatus === 'A';
        return true;
    });

    return `
        <div class="space-y-6">
            <!-- 1. Staff Analytics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass-panel p-5 rounded-2xl border border-indigo-500/30">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400">${isHi ? 'कुल पंजीकृत स्टाफ' : 'Total Registered Staff'}</span>
                        <span class="text-xl">👔</span>
                    </div>
                    <div class="text-3xl font-black text-indigo-400 mt-1">${totalStaff}</div>
                    <div class="text-[11px] text-slate-400 mt-1">${isHi ? 'शिक्षक व अन्य कर्मचारी' : 'All Teaching & Support Staff'}</div>
                </div>

                <div class="glass-panel p-5 rounded-2xl border border-emerald-500/30">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400">${isHi ? 'आज उपस्थित (Present)' : 'Present Today'}</span>
                        <span class="text-xl">✅</span>
                    </div>
                    <div class="text-3xl font-black text-emerald-400 mt-1">${presentToday} <span class="text-xs font-normal text-slate-400">/ ${totalStaff}</span></div>
                    <div class="text-[11px] text-emerald-300/80 mt-1">${totalStaff > 0 ? Math.round((presentToday / totalStaff) * 100) : 0}% ${isHi ? 'उपस्थिति' : 'Attendance'}</div>
                </div>

                <div class="glass-panel p-5 rounded-2xl border border-cyan-500/30">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400">${isHi ? 'लॉगिन सक्रिय स्टाफ' : 'Login Enabled Staff'}</span>
                        <span class="text-xl">🔐</span>
                    </div>
                    <div class="text-3xl font-black text-cyan-400 mt-1">${loginEnabledCount}</div>
                    <div class="text-[11px] text-slate-400 mt-1">${isHi ? 'केवल ID-पासवर्ड वाले लॉगिन करेंगे' : 'Restricted Portal Access'}</div>
                </div>

                <div class="glass-panel p-5 rounded-2xl border border-amber-500/30">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400">${isHi ? 'कुल मासिक वेतन बजट' : 'Net Monthly Payroll'}</span>
                        <span class="text-xl">💳</span>
                    </div>
                    <div class="text-3xl font-black text-amber-400 mt-1">₹${totalNetPayroll.toLocaleString('en-IN')}</div>
                    <div class="text-[11px] text-slate-400 mt-1">${payrollMonth}</div>
                </div>
            </div>

            <!-- यदि किसी स्टाफ का पूरा विवरण (Full Details Modal) खोला गया है -->
            ${viewObj ? `
                <div class="glass-panel p-6 rounded-2xl border-2 border-cyan-500/60 shadow-2xl tab-transition">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                        <div>
                            <span class="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">Complete Staff Bio-Data & Profile</span>
                            <h3 class="text-xl font-black">${viewObj.name} <span class="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full ml-1">${viewObj.role}</span></h3>
                        </div>
                        <button onclick="viewingStaffIndex=null; renderApp()" class="bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold">✖ Close</button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Employee ID</span><strong class="text-sm">${viewObj.id}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Mobile Number</span><strong class="text-sm">${viewObj.mobile || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">WhatsApp Number</span><strong class="text-sm text-emerald-400">${viewObj.whatsapp || viewObj.mobile || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Email Address</span><strong class="text-sm">${viewObj.email || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Qualification</span><strong class="text-sm">${viewObj.qualification || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Date of Birth</span><strong class="text-sm">${viewObj.dob || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Joining Date</span><strong class="text-sm">${viewObj.joiningDate || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Aadhaar / ID Proof</span><strong class="text-sm">${viewObj.idProof || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Bank / UPI Info</span><strong class="text-sm">${viewObj.bank || '—'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Basic Salary</span><strong class="text-sm text-amber-400">₹${Number(viewObj.basicSalary || 0).toLocaleString('en-IN')}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Portal Login ID</span><strong class="text-sm text-cyan-400">${viewObj.username ? `${viewObj.username} (Pass: ${viewObj.password})` : 'No Login Access'}</strong></div>
                        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><span class="text-slate-400 block">Full Address</span><strong class="text-sm">${viewObj.address || '—'}</strong></div>
                    </div>
                </div>
            ` : ''}

            <!-- 2. Add / Edit Staff Form (All Fields Optional + Optional Login) -->
            <div id="staff-form-box" class="glass-panel p-6 rounded-2xl border ${editObj ? 'border-amber-500/60' : 'border-indigo-500/30'}">
                <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div>
                        <h3 class="font-extrabold text-lg ${editObj ? 'text-amber-400' : 'text-indigo-400'}">
                            ${editObj ? (isHi ? `✏️ एडिट कर रहे हैं: ${editObj.name}` : `✏️ Editing Staff: ${editObj.name}`) : (isHi ? '➕ नया स्टाफ जोड़ें (सभी कॉलम वैकल्पिक हैं)' : '➕ Add New Staff (All Fields Optional)')}
                        </h3>
                        <p class="text-xs text-slate-400">${isHi ? 'जितनी जानकारी उपलब्ध हो भरें। Username और Password केवल तभी भरें जब इस स्टाफ को पोर्टल लॉगिन देना हो।' : 'Fill available details. Enter Username & Password only if this staff needs portal login.'}</p>
                    </div>
                    ${editObj ? `<button type="button" onclick="cancelStaffEdit()" class="bg-rose-500/20 text-rose-400 px-3.5 py-1.5 rounded-xl text-xs font-bold">✖ Cancel Edit</button>` : ''}
                </div>

                <form onsubmit="saveStaffMemberForm(event)" class="space-y-4 text-xs sm:text-sm">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'पूरा नाम (Full Name)' : 'Full Name'}</label>
                            <input type="text" id="stf-name" value="${editObj ? (editObj.name || '') : ''}" placeholder="e.g. Dr. Rajesh Sharma" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'पद (Custom Post / Role)' : 'Custom Post / Designation'}</label>
                            <input type="text" id="stf-role" value="${editObj ? (editObj.role || '') : ''}" placeholder="e.g. Teacher / Clerk / Driver" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-indigo-300 font-semibold">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'मोबाइल नंबर (Contact)' : 'Contact Mobile No.'}</label>
                            <input type="tel" id="stf-mobile" value="${editObj ? (editObj.mobile || '') : ''}" placeholder="9876543210" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'व्हाट्सएप नंबर (WhatsApp)' : 'WhatsApp Number'}</label>
                            <input type="tel" id="stf-whatsapp" value="${editObj ? (editObj.whatsapp || '') : ''}" placeholder="9876543210" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-emerald-400">
                        </div>

                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'ईमेल आईडी (Email)' : 'Email Address'}</label>
                            <input type="email" id="stf-email" value="${editObj ? (editObj.email || '') : ''}" placeholder="staff@school.in" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'योग्यता (Qualification)' : 'Qualification'}</label>
                            <input type="text" id="stf-qual" value="${editObj ? (editObj.qualification || '') : ''}" placeholder="M.A, B.Ed / Graduate" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'जन्मतिथि (DOB)' : 'Date of Birth'}</label>
                            <input type="date" id="stf-dob" value="${editObj ? (editObj.dob || '') : ''}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'ज्वाइनिंग तारीख' : 'Joining Date'}</label>
                            <input type="date" id="stf-join" value="${editObj ? (editObj.joiningDate || '') : ''}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>

                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'मासिक वेतन (Basic Salary ₹)' : 'Monthly Basic Salary (₹)'}</label>
                            <input type="number" id="stf-salary" value="${editObj ? (editObj.basicSalary || '') : ''}" placeholder="15000" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 font-bold text-amber-400">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'बैंक खाता / UPI' : 'Bank A/C or UPI'}</label>
                            <input type="text" id="stf-bank" value="${editObj ? (editObj.bank || '') : ''}" placeholder="SBI A/C or UPI ID" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'आधार / ID प्रूफ नं.' : 'Aadhaar / ID Proof No.'}</label>
                            <input type="text" id="stf-idproof" value="${editObj ? (editObj.idProof || '') : ''}" placeholder="XXXX-XXXX-1234" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400 font-bold">${isHi ? 'पूरा पता (Address)' : 'Full Address'}</label>
                            <input type="text" id="stf-address" value="${editObj ? (editObj.address || '') : ''}" placeholder="Village / City, District" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                    </div>

                    <!-- Optional Login & Powers -->
                    <div class="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/25 space-y-3">
                        <div class="text-xs font-extrabold text-indigo-400">🔐 ${isHi ? 'वैकल्पिक पोर्टल लॉगिन व पावर (केवल लॉगिन देने के लिए भरें)' : 'Optional Portal Login & Powers (Leave blank if no login needed)'}</div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
                            <input type="text" id="stf-user" value="${editObj ? (editObj.username || '') : ''}" placeholder="${isHi ? 'यूज़रनेम (Optional)' : 'Username (Optional)'}" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-emerald-400 font-bold">
                            <input type="text" id="stf-pass" value="${editObj ? (editObj.password || '') : ''}" placeholder="${isHi ? 'पासवर्ड (Optional)' : 'Password (Optional)'}" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-amber-400 font-bold">
                            <div class="sm:col-span-2 flex flex-wrap gap-2.5 text-[11px] bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-dash" ${editObj && editObj.powers && editObj.powers.dashboard ? 'checked' : ''}> Dashboard</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-stu" ${editObj && editObj.powers && editObj.powers.students ? 'checked' : ''}> Admission</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-fee" ${editObj && editObj.powers && editObj.powers.fees ? 'checked' : ''}> Fees</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-stf" ${editObj && editObj.powers && editObj.powers.staff ? 'checked' : ''}> Staff</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-acc" ${editObj && editObj.powers && editObj.powers.accounts ? 'checked' : ''}> Accounts</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-lib" ${editObj && editObj.powers && editObj.powers.library ? 'checked' : ''}> Library</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-not" ${editObj && editObj.powers && editObj.powers.notices ? 'checked' : ''}> Notices</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-att" ${editObj && editObj.powers && editObj.powers.attendance ? 'checked' : ''}> Attendance</label>
                                <label class="flex items-center gap-1"><input type="checkbox" id="sp-exm" ${editObj && editObj.powers && editObj.powers.exams ? 'checked' : ''}> Exams</label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full sm:w-auto px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition transform active:scale-95">
                        ${editObj ? (isHi ? '💾 बदलाव सेव करें (Update Staff)' : '💾 Update Staff Record') : (isHi ? '✅ स्टाफ सुरक्षित करें (Save Staff)' : '✅ Save Staff Member')}
                    </button>
                </form>
            </div>

            <!-- 3. Complete Staff Data Table -->
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
                    <h3 class="font-bold text-lg">${isHi ? '📋 संपूर्ण स्टाफ डायरेक्टरी व डेटा' : '📋 All Staff Records & Live Payroll'} (${filteredStaff.length})</h3>
                    <div class="flex flex-wrap items-center gap-2">
                        <input type="text" value="${staffSearchQuery}" oninput="staffSearchQuery=this.value; renderApp()" placeholder="${isHi ? 'नाम, पद, मोबाइल या पता खोजें...' : 'Search name, role, mobile...'}" class="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs">
                        <select onchange="staffFilterType=this.value; renderApp()" class="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold">
                            <option value="ALL" ${staffFilterType === 'ALL' ? 'selected' : ''}>All Staff (${totalStaff})</option>
                            <option value="LOGIN" ${staffFilterType === 'LOGIN' ? 'selected' : ''}>Login Enabled (${loginEnabledCount})</option>
                            <option value="PRESENT" ${staffFilterType === 'PRESENT' ? 'selected' : ''}>Present Today (${presentToday})</option>
                            <option value="ABSENT" ${staffFilterType === 'ABSENT' ? 'selected' : ''}>Absent Today (${totalStaff - presentToday})</option>
                        </select>
                        <select onchange="payrollMonth=this.value; renderApp()" class="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold">
                            <option value="November 2026" ${payrollMonth === 'November 2026' ? 'selected' : ''}>November 2026</option>
                            <option value="December 2026" ${payrollMonth === 'December 2026' ? 'selected' : ''}>December 2026</option>
                            <option value="January 2027" ${payrollMonth === 'January 2027' ? 'selected' : ''}>January 2027</option>
                        </select>
                        <button onclick="exportStaffPayrollExcel()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow">
                            📥 ${isHi ? 'Excel डाउनलोड' : 'Export Excel'}
                        </button>
                    </div>
                </div>

                ${filteredStaff.length === 0 ? `
                    <div class="p-8 text-center text-slate-400 text-sm border border-dashed border-slate-800 rounded-2xl">
                        No staff records found matching your filter.
                    </div>
                ` : `
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400 text-xs">
                                <th class="py-3">${isHi ? 'ID व पूरा विवरण' : 'ID & Full Details'}</th>
                                <th class="py-3">${isHi ? 'संपर्क व पता' : 'Contact & Address'}</th>
                                <th class="py-3">${isHi ? 'लॉगिन ID' : 'Portal Login'}</th>
                                <th class="py-3">${isHi ? 'आज / मासिक A-H' : 'Attendance (A/H)'}</th>
                                <th class="py-3">${isHi ? 'शुद्ध वेतन' : 'Net Salary'}</th>
                                <th class="py-3">${isHi ? 'विकल्प' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredStaff.map(st => {
                                const realIdx = staffList.findIndex(x => x.id === st.id);
                                const netSal = calculateNetSalary(st);
                                const waNum = (st.whatsapp || st.mobile || "").replace(/\D/g, '');
                                return `
                                    <tr class="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                                        <td class="py-3.5">
                                            <div class="text-[10px] font-mono text-indigo-400 font-bold">${st.id} ${st.joiningDate ? `• Joined: ${st.joiningDate}` : ''}</div>
                                            <div class="font-extrabold text-base">${st.name || 'Staff Member'}</div>
                                            <span class="inline-block text-[11px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full mt-0.5">${st.role || 'Staff'}</span>
                                            ${st.qualification ? `<div class="text-[11px] text-slate-400 mt-0.5">🎓 ${st.qualification}</div>` : ''}
                                        </td>
                                        <td class="py-3.5 text-xs space-y-0.5">
                                            ${st.mobile ? `<div>📞 <strong>${st.mobile}</strong></div>` : ''}
                                            ${st.email ? `<div class="text-slate-400">✉️ ${st.email}</div>` : ''}
                                            ${st.address ? `<div class="text-slate-400">📍 ${st.address}</div>` : ''}
                                            ${st.idProof ? `<div class="text-[10px] text-slate-500">🪪 ${st.idProof}</div>` : ''}
                                        </td>
                                        <td class="py-3.5 text-xs">
                                            ${st.username && st.password
                                                ? `<div class="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold inline-block">🔑 ${st.username}<div class="text-[10px] text-amber-300 font-normal">Pass: ${st.password}</div></div>`
                                                : `<span class="text-slate-500 italic">${isHi ? 'लॉगिन नहीं' : 'Record Only'}</span>`
                                            }
                                        </td>
                                        <td class="py-3.5">
                                            <div class="flex items-center gap-1.5 text-xs">
                                                <button onclick="toggleStaffToday(${realIdx})" title="Click to toggle Present/Absent" class="px-2.5 py-1 rounded-lg font-extrabold ${st.todayStatus === 'P' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                                                    ${st.todayStatus === 'P' ? 'P' : 'A'}
                                                </button>
                                                <span class="text-rose-400 font-bold ml-1">A:</span>
                                                <input type="number" min="0" max="30" value="${st.absentDays || 0}" onchange="updateStaffDays(${realIdx}, 'absentDays', this.value)" class="w-10 px-1 py-1 rounded border border-slate-700 bg-slate-900 text-center font-bold">
                                                <span class="text-amber-400 font-bold">H:</span>
                                                <input type="number" min="0" max="30" value="${st.halfDays || 0}" onchange="updateStaffDays(${realIdx}, 'halfDays', this.value)" class="w-10 px-1 py-1 rounded border border-slate-700 bg-slate-900 text-center font-bold">
                                            </div>
                                        </td>
                                        <td class="py-3.5">
                                            <div class="font-extrabold text-emerald-400 text-base">₹${netSal.toLocaleString('en-IN')}</div>
                                            <div class="text-[10px] text-slate-400">Basic: ₹${Number(st.basicSalary || 0).toLocaleString('en-IN')}</div>
                                        </td>
                                        <td class="py-3.5">
                                            <div class="flex flex-wrap gap-1.5">
                                                <button onclick="viewStaffFullDetails(${realIdx})" title="View Full Bio-Data" class="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition">👁️ Details</button>
                                                ${waNum ? `<a href="https://wa.me/${waNum.length === 10 ? '91' + waNum : waNum}" target="_blank" title="WhatsApp Message" class="bg-green-600 hover:bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">💬</a>` : ''}
                                                <button onclick="viewSalarySlip(${realIdx})" title="Print Salary Slip" class="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">🧾 Slip</button>
                                                <button onclick="startStaffEdit(${realIdx})" title="Edit Staff" class="bg-amber-500/20 hover:bg-amber-600 text-amber-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition">✏️ Edit</button>
                                                <button onclick="deleteStaff(${realIdx})" title="Delete Staff" class="bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs transition">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `}
            </div>

            <div id="modal-area" class="mt-6"></div>
        </div>
    `;
}

// =========================================================================
// स्मूद Edit, View Details, Save & Delete फंक्शन्स
// =========================================================================
function startStaffEdit(idx) {
    editingStaffIndex = idx;
    viewingStaffIndex = null;
    renderApp();
    const formBox = document.getElementById('staff-form-box');
    if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cancelStaffEdit() {
    editingStaffIndex = null;
    renderApp();
}

function viewStaffFullDetails(idx) {
    viewingStaffIndex = idx;
    renderApp();
    window.scrollTo({ top: 180, behavior: 'smooth' });
}

function saveStaffMemberForm(e) {
    e.preventDefault();
    loadCurrentInstituteStaff();

    const rawName = document.getElementById('stf-name').value.trim();
    const existing = (editingStaffIndex !== null && staffList[editingStaffIndex]) ? staffList[editingStaffIndex] : null;

    const staffObj = {
        id: existing ? existing.id : "EMP" + Math.floor(100 + Math.random() * 900),
        name: rawName || "Staff Member #" + (staffList.length + 1),
        role: document.getElementById('stf-role').value.trim() || "Staff",
        mobile: document.getElementById('stf-mobile').value.trim(),
        whatsapp: document.getElementById('stf-whatsapp').value.trim(),
        email: document.getElementById('stf-email').value.trim(),
        qualification: document.getElementById('stf-qual').value.trim(),
        dob: document.getElementById('stf-dob').value,
        joiningDate: document.getElementById('stf-join').value,
        basicSalary: Number(document.getElementById('stf-salary').value || 0),
        bank: document.getElementById('stf-bank').value.trim() || "Cash / Bank",
        idProof: document.getElementById('stf-idproof').value.trim(),
        address: document.getElementById('stf-address').value.trim(),
        workingDays: 30,
        absentDays: existing ? (existing.absentDays || 0) : 0,
        halfDays: existing ? (existing.halfDays || 0) : 0,
        todayStatus: existing ? (existing.todayStatus || "P") : "P",
        paidStatus: existing ? (existing.paidStatus || "Pending") : "Pending",
        username: document.getElementById('stf-user').value.trim(),
        password: document.getElementById('stf-pass').value.trim(),
        powers: {
            dashboard: document.getElementById('sp-dash').checked,
            students: document.getElementById('sp-stu').checked,
            fees: document.getElementById('sp-fee').checked,
            staff: document.getElementById('sp-stf').checked,
            accounts: document.getElementById('sp-acc').checked,
            library: document.getElementById('sp-lib').checked,
            notices: document.getElementById('sp-not').checked,
            attendance: document.getElementById('sp-att').checked,
            exams: document.getElementById('sp-exm').checked
        }
    };

    if (editingStaffIndex !== null && existing) {
        staffList[editingStaffIndex] = staffObj;
        editingStaffIndex = null;
    } else {
        staffList.unshift(staffObj);
    }

    saveStaffData();
    renderApp();
}

function toggleStaffToday(idx) {
    loadCurrentInstituteStaff();
    staffList[idx].todayStatus = staffList[idx].todayStatus === 'P' ? 'A' : 'P';
    if (staffList[idx].todayStatus === 'A') staffList[idx].absentDays = (staffList[idx].absentDays || 0) + 1;
    else if (staffList[idx].absentDays > 0) staffList[idx].absentDays -= 1;
    saveStaffData();
    renderApp();
}

function updateStaffDays(idx, field, val) {
    loadCurrentInstituteStaff();
    staffList[idx][field] = Math.max(0, Number(val));
    saveStaffData();
    renderApp();
}

function deleteStaff(idx) {
    if (confirm("Remove this staff record permanently?")) {
        loadCurrentInstituteStaff();
        staffList.splice(idx, 1);
        if (editingStaffIndex === idx) editingStaffIndex = null;
        if (viewingStaffIndex === idx) viewingStaffIndex = null;
        saveStaffData();
        renderApp();
    }
}

function exportStaffPayrollExcel() {
    loadCurrentInstituteStaff();
    let csv = "EmpID,Name,Post,Mobile,WhatsApp,Email,Qualification,DOB,JoiningDate,IDProof,Bank,Address,BasicSalary,AbsentDays,HalfDays,NetPayableSalary,LoginUsername\n";
    staffList.forEach(st => {
        csv += `"${st.id}","${st.name}","${st.role}","${st.mobile || ''}","${st.whatsapp || ''}","${st.email || ''}","${st.qualification || ''}","${st.dob || ''}","${st.joiningDate || ''}","${st.idProof || ''}","${st.bank || ''}","${st.address || ''}",${st.basicSalary || 0},${st.absentDays || 0},${st.halfDays || 0},${calculateNetSalary(st)},"${st.username || 'No Login'}"\n`;
    });
    downloadCSVFile(csv, `${orgName}_Complete_Staff_Directory_${payrollMonth}.csv`);
}

function viewSalarySlip(idx) {
    loadCurrentInstituteStaff();
    const st = staffList[idx];
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const netSal = calculateNetSalary(st);
    const deduction = (st.basicSalary || 0) - netSal;
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-12 h-12 object-cover rounded-lg mx-auto mb-1">` : '';

    const slipHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-slate-900 max-w-xl mx-auto shadow-2xl">
            <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
                ${logoImg}
                <div class="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest">VidyaSetu Official Salary Slip</div>
                <h2 class="text-xl font-bold uppercase">${orgName}</h2>
                <p class="text-xs text-slate-600">${isHi ? 'मासिक वेतन पर्ची' : 'Monthly Salary Statement'} — <strong>${payrollMonth}</strong></p>
            </div>
            <div class="grid grid-cols-2 text-xs gap-2 mb-4 bg-slate-50 p-3 rounded-lg border">
                <div><strong>Name:</strong> ${st.name}</div>
                <div><strong>Employee ID:</strong> ${st.id}</div>
                <div><strong>Designation:</strong> ${st.role}</div>
                <div><strong>Payment Mode:</strong> ${st.bank || 'Cash'}</div>
            </div>
            <table class="w-full border border-slate-900 text-sm mb-4">
                <tr class="bg-slate-100 border-b border-slate-900"><th class="p-2 text-left">Particulars</th><th class="p-2 text-right">Amount (₹)</th></tr>
                <tr class="border-b"><td class="p-2">Basic Monthly Salary</td><td class="p-2 text-right font-semibold">₹${Number(st.basicSalary || 0).toLocaleString('en-IN')}</td></tr>
                <tr class="border-b text-rose-700"><td class="p-2">Leave Deduction (${st.absentDays || 0} Absent, ${st.halfDays || 0} Half-Day)</td><td class="p-2 text-right font-semibold">- ₹${deduction.toLocaleString('en-IN')}</td></tr>
                <tr class="bg-emerald-50 font-extrabold text-emerald-800 text-base"><td class="p-2">Net Payable Salary</td><td class="p-2 text-right">₹${netSal.toLocaleString('en-IN')}</td></tr>
            </table>
            <div class="flex justify-between items-center mt-8 pt-4 border-t border-dashed border-slate-400 text-xs">
                <span>Employee Signature</span>
                <span class="font-bold">Principal / Authorized Sign</span>
            </div>
        </div>
    `;

    document.getElementById('print-only-container').innerHTML = slipHTML;
    document.getElementById('modal-area').innerHTML = `
        <div class="space-y-3">
            ${slipHTML}
            <div class="no-print text-center flex justify-center gap-3">
                <button onclick="window.print()" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow">🖨️ Print Only This Salary Slip</button>
                <button onclick="document.getElementById('modal-area').innerHTML=''" class="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold">Close</button>
            </div>
        </div>
    `;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}