// =========================================================================
// VidyaSetu Dedicated Teacher & Staff HR / Payroll Module (staff.js)
// =========================================================================

const defaultStaff = [
    { id: "EMP01", name: "Dr. Rajesh Sharma", role: "Senior Maths Teacher", mobile: "9876543210", bank: "SBI •••• 4521", basicSalary: 28000, workingDays: 30, presentDays: 28, absentDays: 1, halfDays: 1, todayStatus: "P", paidStatus: "Paid" },
    { id: "EMP02", name: "Sunita Verma", role: "Head Accountant", mobile: "9876543211", bank: "PNB •••• 8890", basicSalary: 18000, workingDays: 30, presentDays: 29, absentDays: 0, halfDays: 1, todayStatus: "P", paidStatus: "Pending" }
];

let staffList = [];
let payrollMonth = "November 2026";

function loadCurrentInstituteStaff() {
    staffList = JSON.parse(localStorage.getItem(storagePrefix + 'staff')) || JSON.parse(JSON.stringify(defaultStaff));
}

function saveStaffData() {
    localStorage.setItem(storagePrefix + 'staff', JSON.stringify(staffList));
}

function calculateNetSalary(st) {
    const perDay = st.basicSalary / (st.workingDays || 30);
    const deduction = (st.absentDays * perDay) + (st.halfDays * (perDay / 2));
    return Math.max(0, Math.round(st.basicSalary - deduction));
}

function renderStaffPayrollModule() {
    loadCurrentInstituteStaff();
    const isHi = currentLang === 'hi';
    const totalPayroll = staffList.reduce((sum, st) => sum + calculateNetSalary(st), 0);
    const totalDeductions = staffList.reduce((sum, st) => sum + (st.basicSalary - calculateNetSalary(st)), 0);
    const presentStaff = staffList.filter(st => st.todayStatus === 'P').length;

    return `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="glass-panel p-5 rounded-2xl border border-indigo-500/30">
                <div class="text-xs text-slate-400 font-bold">${isHi ? 'कुल शिक्षक व स्टाफ (आज उपस्थित)' : 'Active Staff (Present Today)'}</div>
                <div class="text-2xl font-extrabold text-indigo-400 mt-1">${staffList.length} <span class="text-xs text-emerald-400">(${presentStaff} ${isHi ? 'उपस्थित' : 'Present'})</span></div>
            </div>
            <div class="glass-panel p-5 rounded-2xl border border-emerald-500/30">
                <div class="text-xs text-slate-400 font-bold">${isHi ? 'कुल देय मासिक वेतन (Net Payroll)' : 'Total Net Payable Salary'}</div>
                <div class="text-2xl font-extrabold text-emerald-400 mt-1">₹${totalPayroll.toLocaleString('en-IN')}</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl border border-rose-500/30">
                <div class="text-xs text-slate-400 font-bold">${isHi ? 'छुट्टी कटौती (Deduction)' : 'Total Leave Deductions'}</div>
                <div class="text-2xl font-extrabold text-rose-400 mt-1">- ₹${totalDeductions.toLocaleString('en-IN')}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
                <h3 class="font-bold text-lg mb-3 text-indigo-400">${isHi ? '➕ नया शिक्षक / स्टाफ जोड़ें' : '➕ Add Teacher / Staff'}</h3>
                <form onsubmit="addNewStaff(event)" class="space-y-3 text-sm">
                    <input type="text" id="stf-name" required placeholder="${isHi ? 'शिक्षक का पूरा नाम *' : 'Staff Full Name *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    <input type="text" id="stf-role" required placeholder="${isHi ? 'पद (जैसे: गणित शिक्षक) *' : 'Designation (e.g. Maths Teacher) *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    <input type="number" id="stf-salary" required placeholder="${isHi ? 'मासिक वेतन (Basic Salary ₹) *' : 'Monthly Basic Salary (₹) *'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    <input type="text" id="stf-bank" placeholder="${isHi ? 'बैंक खाता / UPI विवरण' : 'Bank A/C or UPI Info'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    <input type="text" id="stf-mobile" placeholder="${isHi ? 'मोबाइल नंबर' : 'Mobile Number'}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg">
                        ${isHi ? '✅ स्टाफ प्रोफ़ाइल सेव करें' : '✅ Save Staff Profile'}
                    </button>
                </form>
            </div>

            <div class="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 overflow-x-auto">
                <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <h3 class="font-bold text-lg">${isHi ? '💳 मासिक हाज़िरी व सैलरी शीट' : '💳 Staff Attendance & Salary Sheet'}</h3>
                    <div class="flex items-center gap-2">
                        <select onchange="payrollMonth=this.value; renderApp()" class="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold">
                            <option value="November 2026" ${payrollMonth === 'November 2026' ? 'selected' : ''}>November 2026</option>
                            <option value="December 2026" ${payrollMonth === 'December 2026' ? 'selected' : ''}>December 2026</option>
                            <option value="January 2027" ${payrollMonth === 'January 2027' ? 'selected' : ''}>January 2027</option>
                        </select>
                        <button onclick="exportStaffPayrollExcel()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow">
                            📥 ${isHi ? 'Excel' : 'Export Excel'}
                        </button>
                    </div>
                </div>

                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b border-slate-800 text-slate-400 text-xs">
                            <th class="py-2">${isHi ? 'शिक्षक व आज की हाज़िरी' : 'Staff & Today'}</th>
                            <th class="py-2">${isHi ? 'मूल वेतन' : 'Basic'}</th>
                            <th class="py-2">${isHi ? 'मासिक A / H' : 'Monthly A / H'}</th>
                            <th class="py-2">${isHi ? 'शुद्ध वेतन' : 'Net Pay'}</th>
                            <th class="py-2">${isHi ? 'सैलरी स्लिप' : 'Slip & Status'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${staffList.map((st, idx) => {
                            const netSal = calculateNetSalary(st);
                            return `
                                <tr class="border-b border-slate-800/60 hover:bg-slate-900/40">
                                    <td class="py-3.5">
                                        <div class="font-bold flex items-center gap-2">
                                            <span>${st.name}</span>
                                            <button onclick="toggleStaffToday(${idx})" title="Toggle Today Attendance" class="px-2 py-0.5 rounded text-[10px] font-extrabold ${st.todayStatus === 'P' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                                                ${st.todayStatus === 'P' ? 'P' : 'A'}
                                            </button>
                                        </div>
                                        <div class="text-xs text-slate-400">${st.role}</div>
                                    </td>
                                    <td class="py-3.5 font-semibold">₹${st.basicSalary.toLocaleString('en-IN')}</td>
                                    <td class="py-3.5">
                                        <div class="flex items-center gap-1 text-xs">
                                            <span class="text-rose-400 font-bold">A:</span>
                                            <input type="number" min="0" max="30" value="${st.absentDays}" onchange="updateStaffDays(${idx}, 'absentDays', this.value)" class="w-10 px-1 py-1 rounded border border-slate-700 bg-slate-900 text-center font-bold">
                                            <span class="text-amber-400 font-bold ml-1">H:</span>
                                            <input type="number" min="0" max="30" value="${st.halfDays}" onchange="updateStaffDays(${idx}, 'halfDays', this.value)" class="w-10 px-1 py-1 rounded border border-slate-700 bg-slate-900 text-center font-bold">
                                        </div>
                                    </td>
                                    <td class="py-3.5 font-extrabold text-emerald-400">₹${netSal.toLocaleString('en-IN')}</td>
                                    <td class="py-3.5 flex flex-wrap gap-1.5">
                                        <button onclick="viewSalarySlip(${idx})" class="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow">🧾 Slip</button>
                                        <button onclick="toggleSalaryStatus(${idx})" class="px-2.5 py-1.5 rounded-lg text-xs font-bold ${st.paidStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                                            ${st.paidStatus === 'Paid' ? '✔ Paid' : '⏳ Due'}
                                        </button>
                                        <button onclick="deleteStaff(${idx})" class="text-xs text-rose-400 px-1">🗑️</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <div id="modal-area" class="mt-6"></div>
    `;
}

function addNewStaff(e) {
    e.preventDefault();
    staffList.unshift({
        id: "EMP0" + (staffList.length + 1),
        name: document.getElementById('stf-name').value.trim(),
        role: document.getElementById('stf-role').value.trim(),
        basicSalary: Number(document.getElementById('stf-salary').value),
        bank: document.getElementById('stf-bank').value.trim() || "Bank Transfer",
        mobile: document.getElementById('stf-mobile').value.trim() || "9800000000",
        workingDays: 30, presentDays: 30, absentDays: 0, halfDays: 0, todayStatus: "P", paidStatus: "Pending"
    });
    saveStaffData(); renderApp();
}

function toggleStaffToday(idx) {
    staffList[idx].todayStatus = staffList[idx].todayStatus === 'P' ? 'A' : 'P';
    if (staffList[idx].todayStatus === 'A') staffList[idx].absentDays += 1;
    else if (staffList[idx].absentDays > 0) staffList[idx].absentDays -= 1;
    saveStaffData(); renderApp();
}

function updateStaffDays(idx, field, val) { staffList[idx][field] = Math.max(0, Number(val)); saveStaffData(); renderApp(); }
function toggleSalaryStatus(idx) { staffList[idx].paidStatus = staffList[idx].paidStatus === 'Paid' ? 'Pending' : 'Paid'; saveStaffData(); renderApp(); }
function deleteStaff(idx) { if (confirm("Remove this staff record?")) { staffList.splice(idx, 1); saveStaffData(); renderApp(); } }

function exportStaffPayrollExcel() {
    loadCurrentInstituteStaff();
    let csv = "EmpID,Name,Designation,Mobile,BasicSalary,AbsentDays,HalfDays,NetPayableSalary,TodayAttendance,PaymentStatus\n";
    staffList.forEach(st => {
        csv += `"${st.id}","${st.name}","${st.role}","${st.mobile}",${st.basicSalary},${st.absentDays},${st.halfDays},${calculateNetSalary(st)},"${st.todayStatus}","${st.paidStatus}"\n`;
    });
    downloadCSVFile(csv, `${orgName}_Staff_Payroll_${payrollMonth}.csv`);
}

function viewSalarySlip(idx) {
    const st = staffList[idx];
    const isHi = currentLang === 'hi';
    const netSal = calculateNetSalary(st);
    const deduction = st.basicSalary - netSal;
    const logoImg = orgLogo ? `<img src="${orgLogo}" class="w-12 h-12 object-cover rounded-lg mx-auto mb-1">` : '';

    document.getElementById('modal-area').innerHTML = `
        <div class="bg-white text-slate-900 p-6 rounded-2xl border-2 border-slate-800 max-w-xl mx-auto shadow-2xl">
            <div class="text-center border-b-2 border-slate-800 pb-3 mb-4">
                ${logoImg}
                <div class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">VidyaSetu Official Payroll Slip</div>
                <h2 class="text-xl font-bold uppercase">${orgName}</h2>
                <p class="text-xs text-slate-600">${isHi ? 'मासिक वेतन पर्ची (Salary Slip)' : 'Monthly Salary Statement'} — <strong>${payrollMonth}</strong></p>
            </div>
            <div class="grid grid-cols-2 text-xs gap-2 mb-4 bg-slate-50 p-3 rounded-lg border">
                <div><strong>${isHi ? 'कर्मचारी का नाम:' : 'Employee Name:'}</strong> ${st.name}</div>
                <div><strong>${isHi ? 'कर्मचारी ID:' : 'Employee ID:'}</strong> ${st.id}</div>
                <div><strong>${isHi ? 'पद:' : 'Designation:'}</strong> ${st.role}</div>
                <div><strong>${isHi ? 'बैंक / भुगतान:' : 'Payment Mode:'}</strong> ${st.bank}</div>
            </div>
            <table class="w-full border border-slate-800 text-sm mb-4">
                <tr class="bg-slate-100 border-b border-slate-800"><th class="p-2 text-left">${isHi ? 'वेतन विवरण' : 'Description'}</th><th class="p-2 text-right">${isHi ? 'राशि (₹)' : 'Amount (₹)'}</th></tr>
                <tr class="border-b"><td class="p-2">${isHi ? 'मूल मासिक वेतन' : 'Basic Monthly Salary'}</td><td class="p-2 text-right font-semibold">₹${st.basicSalary.toLocaleString('en-IN')}</td></tr>
                <tr class="border-b text-rose-700"><td class="p-2">${isHi ? `छुट्टी कटौती (${st.absentDays} A,${st.halfDays} H)` : `Leave Deduction (${st.absentDays} Absent,${st.halfDays} Half-Day)`}</td><td class="p-2 text-right font-semibold">- ₹${deduction.toLocaleString('en-IN')}</td></tr>
                <tr class="bg-emerald-50 font-extrabold text-emerald-800 text-base"><td class="p-2">${isHi ? 'शुद्ध देय वेतन' : 'Net Payable Salary'}</td><td class="p-2 text-right">₹${netSal.toLocaleString('en-IN')}</td></tr>
            </table>
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-slate-400 text-xs">
                <span>${isHi ? 'कर्मचारी के हस्ताक्षर' : 'Employee Signature'}</span>
                <span class="font-bold">${isHi ? 'प्रधानाचार्य / अधिकृत मुहर' : 'Principal / Authorized Sign'}</span>
            </div>
            <div class="no-print mt-4 text-center">
                <button onclick="window.print()" class="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow">🖨️ ${isHi ? 'प्रिंट / PDF सेव करें' : 'Print / Save PDF'}</button>
            </div>
        </div>
    `;
    document.getElementById('modal-area').scrollIntoView({ behavior: 'smooth' });
}