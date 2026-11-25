// =========================================================================
// VidyaSetu Dedicated Fees Dashboard, Date-Wise History & White-Label Slip (fees.js)
// =========================================================================

let feeSearchQuery = "";
let feeFilterStatus = "ALL"; // 'ALL', 'DUE', 'PAID'
let selectedFeeStudentIdx = null;

// डिफ़ॉल्ट किश्त इतिहास सुनिश्चित करना
function ensureStudentFeeHistory(s) {
    if (!s.feeHistory) {
        s.feeHistory = s.paidFee > 0 ? [
            {
                receiptNo: "REC-" + Math.floor(1000 + Math.random() * 9000),
                date: "2026-11-01",
                amount: Number(s.paidFee),
                mode: "Cash",
                remark: "Admission / First Installment"
            }
        ] : [];
    }
}

// 1. विस्तृत फीस डैशबोर्ड रेंडर करना
function renderFeesDashboardModule() {
    const isHi = currentLang === 'hi';
    const todayStr = new Date().toISOString().split('T')[0];

    let totalExpected = 0;
    let totalCollected = 0;
    let todayCollection = 0;

    students.forEach(s => {
        ensureStudentFeeHistory(s);
        totalExpected += Number(s.totalFee || 0);
        totalCollected += Number(s.paidFee || 0);
        s.feeHistory.forEach(h => {
            if (h.date === todayStr) todayCollection += Number(h.amount || 0);
        });
    });

    const totalDue = Math.max(0, totalExpected - totalCollected);

    // फ़िल्टर किए गए छात्र
    const filtered = students.filter(s => {
        const due = s.totalFee - s.paidFee;
        const matchQuery = s.name.toLowerCase().includes(feeSearchQuery.toLowerCase()) ||
                           s.roll.toLowerCase().includes(feeSearchQuery.toLowerCase()) ||
                           s.class.toLowerCase().includes(feeSearchQuery.toLowerCase());
        if (!matchQuery) return false;
        if (feeFilterStatus === 'DUE') return due > 0;
        if (feeFilterStatus === 'PAID') return due <= 0;
        return true;
    });

    return `
        <div class="space-y-6">
            <!-- 4 मुख्य वित्तीय कार्ड्स -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass-panel super-tile p-5 rounded-2xl border border-indigo-500/30">
                    <div class="text-xs font-bold adaptive-sub">${isHi ? 'कुल निर्धारित फीस' : 'Total Expected Fees'}</div>
                    <div class="text-2xl font-black text-indigo-500 mt-1">₹${totalExpected.toLocaleString('en-IN')}</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-emerald-500/30">
                    <div class="text-xs font-bold adaptive-sub">${isHi ? 'कुल जमा फीस (Collected)' : 'Total Collected'}</div>
                    <div class="text-2xl font-black text-emerald-500 mt-1">₹${totalCollected.toLocaleString('en-IN')}</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-rose-500/30">
                    <div class="text-xs font-bold adaptive-sub">${isHi ? 'कुल बकाया फीस (Pending)' : 'Total Pending Due'}</div>
                    <div class="text-2xl font-black text-rose-500 mt-1">₹${totalDue.toLocaleString('en-IN')}</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-cyan-500/30">
                    <div class="text-xs font-bold adaptive-sub">${isHi ? 'आज की वसूली (Today)' : "Today's Collection"}</div>
                    <div class="text-2xl font-black text-cyan-500 mt-1">₹${todayCollection.toLocaleString('en-IN')}</div>
                </div>
            </div>

            <!-- सर्च, फ़िल्टर और Excel एक्सपोर्ट बार -->
            <div class="glass-panel p-5 rounded-3xl">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                    <div>
                        <h3 class="font-extrabold text-xl text-emerald-500">${isHi ? '💰 संपूर्ण फीस लेजर व तारीख-वार संग्रह' : '💰 Complete Fee Ledger & Date-Wise Collection'}</h3>
                        <p class="text-xs adaptive-sub">${isHi ? 'तारीख और भुगतान माध्यम के साथ फीस जमा करें और अपने संस्थान के लोगो-मुहर वाली रसीद प्रिंट करें' : 'Record date-wise installments & print receipts with your Institute Logo & Stamp'}</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <input type="text" value="${feeSearchQuery}" oninput="feeSearchQuery=this.value; renderApp()" placeholder="${isHi ? 'नाम या रोल नंबर खोजें...' : 'Search name / roll...'}" class="px-3.5 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-xs">
                        <select onchange="feeFilterStatus=this.value; renderApp()" class="px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-bold">
                            <option value="ALL" ${feeFilterStatus === 'ALL' ? 'selected' : ''}>${isHi ? 'सभी छात्र (All)' : 'All Students'}</option>
                            <option value="DUE" ${feeFilterStatus === 'DUE' ? 'selected' : ''}>${isHi ? 'केवल बकाया (Due Only)' : 'Pending Due Only'}</option>
                            <option value="PAID" ${feeFilterStatus === 'PAID' ? 'selected' : ''}>${isHi ? 'पूरी जमा (Fully Paid)' : 'Fully Paid'}</option>
                        </select>
                        <button onclick="exportDetailedFeesExcel()" class="super-btn bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow">
                            📥 ${isHi ? 'Excel डाउनलोड' : 'Export Excel'}
                        </button>
                    </div>
                </div>

                <!-- फीस तालिका -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b border-slate-300/40 dark:border-slate-800 adaptive-sub text-xs">
                                <th class="py-3">${isHi ? 'रोल व छात्र' : 'Roll & Student'}</th>
                                <th class="py-3">${isHi ? 'कुल फीस' : 'Total Fee'}</th>
                                <th class="py-3">${isHi ? 'जमा (किश्तें)' : 'Paid (Installments)'}</th>
                                <th class="py-3">${isHi ? 'बकाया' : 'Balance Due'}</th>
                                <th class="py-3">${isHi ? 'अंतिम भुगतान तारीख' : 'Last Payment'}</th>
                                <th class="py-3">${isHi ? 'कार्रवाई' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.map(s => {
                                const realIdx = students.findIndex(st => st.id === s.id);
                                const due = Math.max(0, s.totalFee - s.paidFee);
                                const lastTx = s.feeHistory && s.feeHistory.length > 0 ? s.feeHistory[0] : null;
                                return `
                                    <tr class="border-b border-slate-300/30 dark:border-slate-800/60 hover:bg-indigo-500/5 transition">
                                        <td class="py-3.5">
                                            <div class="font-bold adaptive-title">${s.roll} • ${s.name}</div>
                                            <div class="text-xs adaptive-sub">${s.class} | ${isHi ? 'पिता:' : 'Father:'} ${s.father}</div>
                                        </td>
                                        <td class="py-3.5 font-semibold adaptive-title">₹${Number(s.totalFee).toLocaleString('en-IN')}</td>
                                        <td class="py-3.5">
                                            <span class="font-extrabold text-emerald-500">₹${Number(s.paidFee).toLocaleString('en-IN')}</span>
                                            <span class="text-[11px] adaptive-sub block">(${s.feeHistory.length} ${isHi ? 'किश्त' : 'txns'})</span>
                                        </td>
                                        <td class="py-3.5">
                                            ${due > 0 ? `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-500">₹${due.toLocaleString('en-IN')}</span>` : `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-500">✔ Paid</span>`}
                                        </td>
                                        <td class="py-3.5 text-xs adaptive-sub">
                                            ${lastTx ? `<div class="font-semibold adaptive-title">📅 ${lastTx.date}</div><div class="text-[11px] text-indigo-400">₹${lastTx.amount} (${lastTx.mode})</div>` : '—'}
                                        </td>
                                        <td class="py-3.5 flex flex-wrap gap-1.5">
                                            ${due > 0 ? `<button onclick="openCollectFeeModal(${realIdx})" class="super-btn bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow">+ ${isHi ? 'जमा करें' : 'Collect'}</button>` : ''}
                                            <button onclick="openFeeHistoryModal(${realIdx})" class="super-btn bg-slate-500/20 hover:bg-slate-500/30 text-cyan-500 px-2.5 py-1.5 rounded-lg text-xs font-bold">📜 ${isHi ? 'हिस्ट्री' : 'History'}</button>
                                            <button onclick="printDedicatedReceipt(${realIdx}, 0)" class="super-btn bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">🧾 ${isHi ? 'रसीद' : 'Slip'}</button>
                                            ${due > 0 ? `<button onclick="sendWhatsAppReminder(${realIdx})" class="super-btn bg-green-600 hover:bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">💬</button>` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- मोडल / रसीद प्रीव्यू एरिया -->
            <div id="fee-modal-area"></div>
        </div>
    `;
}

// 2. तारीख और पेमेंट मोड के साथ नई फीस जमा करने का फॉर्म
function openCollectFeeModal(idx) {
    const s = students[idx];
    const isHi = currentLang === 'hi';
    const due = Math.max(0, s.totalFee - s.paidFee);
    const todayStr = new Date().toISOString().split('T')[0];

    document.getElementById('fee-modal-area').innerHTML = `
        <div class="glass-panel p-6 rounded-3xl border-2 border-emerald-500/60 max-w-lg mx-auto shadow-2xl tab-transition">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-extrabold text-lg text-emerald-500">💰 ${isHi ? 'फीस जमा करें' : 'Collect Fee Installment'}</h3>
                <button onclick="document.getElementById('fee-modal-area').innerHTML=''" class="text-xs text-rose-400 underline">Close</button>
            </div>
            <div class="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs mb-4 flex justify-between">
                <span class="adaptive-title"><strong>${s.name}</strong> (${s.class} • Roll ${s.roll})</span>
                <span class="text-rose-500 font-bold">${isHi ? 'कुल बकाया:' : 'Due:'} ₹${due.toLocaleString('en-IN')}</span>
            </div>

            <form onsubmit="submitNewFeeInstallment(event, ${idx})" class="space-y-3 text-sm">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold adaptive-sub">${isHi ? 'जमा राशि (₹) *' : 'Amount Paying (₹) *'}</label>
                        <input type="number" id="fee-pay-amt" required min="1" max="${due}" value="${due}" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent font-extrabold text-emerald-500">
                    </div>
                    <div>
                        <label class="text-xs font-bold adaptive-sub">${isHi ? 'भुगतान की तारीख *' : 'Payment Date *'}</label>
                        <input type="date" id="fee-pay-date" required value="${todayStr}" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent font-bold">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold adaptive-sub">${isHi ? 'भुगतान का माध्यम' : 'Payment Mode'}</label>
                        <select id="fee-pay-mode" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-bold">
                            <option value="Cash">💵 Cash (नकद)</option>
                            <option value="UPI / QR">📱 UPI / PhonePe / GPay</option>
                            <option value="Bank Transfer">🏦 Bank Transfer / NEFT</option>
                            <option value="Cheque">📄 Cheque</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold adaptive-sub">${isHi ? 'टिप्पणी (Remark)' : 'Installment Note'}</label>
                        <input type="text" id="fee-pay-remark" placeholder="e.g. 2nd Installment" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                    </div>
                </div>
                <button type="submit" class="super-btn w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold py-3 rounded-xl shadow-lg">
                    ✅ ${isHi ? 'फीस सेव करें और रसीद देखें' : 'Save Payment & Generate Slip'}
                </button>
            </form>
        </div>
    `;
    document.getElementById('fee-modal-area').scrollIntoView({ behavior: 'smooth' });
}

function submitNewFeeInstallment(e, idx) {
    e.preventDefault();
    const s = students[idx];
    ensureStudentFeeHistory(s);

    const amt = Number(document.getElementById('fee-pay-amt').value);
    const payDate = document.getElementById('fee-pay-date').value;
    const payMode = document.getElementById('fee-pay-mode').value;
    const payRemark = document.getElementById('fee-pay-remark').value.trim() || "Tuition Fee Installment";

    const newTx = {
        receiptNo: "REC-" + Math.floor(10000 + Math.random() * 90000),
        date: payDate,
        amount: amt,
        mode: payMode,
        remark: payRemark
    };

    s.feeHistory.unshift(newTx);
    s.paidFee = Number(s.paidFee) + amt;
    saveData();
    renderApp();
    printDedicatedReceipt(idx, 0);
}

// 3. किसी छात्र की तारीख-वार सभी किश्तों का इतिहास देखना
function openFeeHistoryModal(idx) {
    const s = students[idx];
    ensureStudentFeeHistory(s);
    const isHi = currentLang === 'hi';

    document.getElementById('fee-modal-area').innerHTML = `
        <div class="glass-panel p-6 rounded-3xl border border-cyan-500/40 max-w-2xl mx-auto shadow-2xl tab-transition">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="font-extrabold text-lg text-cyan-500">📜 ${s.name} — ${isHi ? 'तारीख-वार फीस इतिहास' : 'Date-Wise Fee Payment History'}</h3>
                    <p class="text-xs adaptive-sub">${s.class} | Roll: ${s.roll} | Total: ₹${s.totalFee} | Paid: ₹${s.paidFee}</p>
                </div>
                <button onclick="document.getElementById('fee-modal-area').innerHTML=''" class="text-xs text-rose-400 underline">Close</button>
            </div>

            <div class="space-y-2.5">
                ${s.feeHistory.length === 0 ? `<p class="text-xs adaptive-sub">No payments recorded yet.</p>` : s.feeHistory.map((h, txIdx) => `
                    <div class="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex flex-wrap justify-between items-center gap-2 text-xs">
                        <div>
                            <span class="font-mono text-indigo-400 font-bold">${h.receiptNo}</span> • <span class="adaptive-title font-bold">📅 ${h.date}</span>
                            <div class="adaptive-sub mt-0.5">${h.mode} — ${h.remark}</div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-base font-extrabold text-emerald-500">₹${Number(h.amount).toLocaleString('en-IN')}</span>
                            <button onclick="printDedicatedReceipt(${idx}, ${txIdx})" class="super-btn bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold">🖨️ Slip</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('fee-modal-area').scrollIntoView({ behavior: 'smooth' });
}

// =========================================================================
// 4. केवल रसीद प्रिंट करने का समर्पित लेआउट (White-Label Logo & Stamp ke saath)
// =========================================================================
function printDedicatedReceipt(stuIdx, txIdx = 0) {
    const s = students[stuIdx];
    ensureStudentFeeHistory(s);
    const tx = s.feeHistory[txIdx] || { receiptNo: "REC-001", date: new Date().toISOString().split('T')[0], amount: s.paidFee, mode: "Cash", remark: "Fee Payment" };
    const due = Math.max(0, s.totalFee - s.paidFee);

    const receiptHTML = `
        <div class="bg-white text-slate-900 p-7 rounded-2xl border-2 border-slate-900 max-w-2xl mx-auto shadow-2xl">
            ${getOfficialPrintHeaderHTML("OFFICIAL FEE RECEIPT")}

            <div class="flex justify-between text-xs font-bold mb-3">
                <span>Receipt No: <strong class="text-indigo-700">${tx.receiptNo}</strong></span>
                <span>Payment Date: <strong>${tx.date}</strong></span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-300 mb-4">
                <div><strong>Student Name:</strong> ${s.name}</div>
                <div><strong>Class & Roll No:</strong> ${s.class} (Roll: ${s.roll})</div>
                <div><strong>Father's Name:</strong> ${s.father}</div>
                <div><strong>Payment Mode:</strong> ${tx.mode}</div>
            </div>

            <table class="w-full border border-slate-900 text-xs mb-4">
                <thead>
                    <tr class="bg-slate-200 border-b border-slate-900">
                        <th class="p-2.5 text-left border-r border-slate-900">S.No</th>
                        <th class="p-2.5 text-left border-r border-slate-900">Fee Particulars / Installment</th>
                        <th class="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-slate-300">
                        <td class="p-2.5 border-r border-slate-900">01</td>
                        <td class="p-2.5 border-r border-slate-900 font-semibold">${tx.remark} (${tx.date})</td>
                        <td class="p-2.5 text-right font-bold">₹${Number(tx.amount).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr class="bg-slate-50 border-b border-slate-300">
                        <td colspan="2" class="p-2 text-right border-r border-slate-900 text-slate-600">Total Annual Fee Structure:</td>
                        <td class="p-2 text-right font-semibold">₹${Number(s.totalFee).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr class="bg-slate-50 border-b border-slate-300">
                        <td colspan="2" class="p-2 text-right border-r border-slate-900 text-emerald-700 font-bold">Total Cumulative Paid Till Date:</td>
                        <td class="p-2 text-right font-bold text-emerald-700">₹${Number(s.paidFee).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr class="bg-slate-100 font-extrabold text-sm">
                        <td colspan="2" class="p-2.5 text-right border-r border-slate-900 ${due > 0 ? 'text-rose-700' : 'text-emerald-800'}">Remaining Balance Due:</td>
                        <td class="p-2.5 text-right ${due > 0 ? 'text-rose-700' : 'text-emerald-800'}">₹${due.toLocaleString('en-IN')}</td>
                    </tr>
                </tbody>
            </table>

            ${getOfficialPrintStampHTML("Depositor / Parent Sign", "Cashier / Principal Sign")}
        </div>
    `;

    document.getElementById('print-only-container').innerHTML = receiptHTML;
    document.getElementById('fee-modal-area').innerHTML = `
        <div class="space-y-4 tab-transition">
            ${receiptHTML}
            <div class="no-print text-center flex justify-center gap-3">
                <button onclick="window.print()" class="super-btn bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-lg">
                    🖨️ Print Only This Receipt / Save PDF
                </button>
                <button onclick="document.getElementById('fee-modal-area').innerHTML=''" class="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold">
                    Close
                </button>
            </div>
        </div>
    `;
    document.getElementById('fee-modal-area').scrollIntoView({ behavior: 'smooth' });
}

// 5. तारीख-वार विस्तृत फीस Excel डाउनलोड
function exportDetailedFeesExcel() {
    let csv = "Roll,Student Name,Father Name,Class,Total Fee,Total Paid,Balance Due,Installment History (Date | Amount | Mode | Receipt)\n";
    students.forEach(s => {
        ensureStudentFeeHistory(s);
        const historyText = s.feeHistory.map(h => `${h.date}: Rs.${h.amount} (${h.mode} - ${h.receiptNo})`).join(" ; ");
        csv += `"${s.roll}","${s.name}","${s.father}","${s.class}",${s.totalFee},${s.paidFee},${s.totalFee - s.paidFee},"${historyText}"\n`;
    });
    downloadCSVFile(csv, `${orgName}_Detailed_Fees_History.csv`);
}