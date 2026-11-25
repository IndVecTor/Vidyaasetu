// =========================================================================
// VidyaSetu Dedicated Multiplex Module: Coaching & Computer Institute (coaching_pro.js)
// =========================================================================

const defaultCoachingBatches = [
    { id: "BCH01", batchName: "Morning ADCA Batch", course: "ADCA (1 Year Diploma)", timing: "08:00 AM - 10:00 AM", instructor: "Dr. Rajesh Sharma", capacity: 40, enrolled: 32 },
    { id: "BCH02", batchName: "Tally Prime & GST Special", course: "Tally & Accounting", timing: "11:00 AM - 01:00 PM", instructor: "Sunita Verma", capacity: 30, enrolled: 24 },
    { id: "BCH03", batchName: "Target SSC / UP Police", course: "Competitive Exam Batch", timing: "04:00 PM - 06:30 PM", instructor: "Amit Kumar", capacity: 60, enrolled: 51 }
];

let coachingBatches = [];

function loadCoachingProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'coaching_pro';
    coachingBatches = JSON.parse(localStorage.getItem(key)) || JSON.parse(JSON.stringify(defaultCoachingBatches));
}

function saveCoachingProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'coaching_pro';
    localStorage.setItem(key, JSON.stringify(coachingBatches));
}

function renderCoachingProModule() {
    loadCoachingProData();
    const isHi = currentLang === 'hi';

    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- नया बैच / कोर्स जोड़ने का फॉर्म -->
                <div class="glass-panel p-6 rounded-3xl h-fit">
                    <h3 class="font-extrabold text-lg text-indigo-500 mb-3">💻 ${isHi ? 'नया बैच व कोर्स बनाएं' : 'Create New Batch & Course'}</h3>
                    <form onsubmit="addNewCoachingBatch(event)" class="space-y-3 text-xs sm:text-sm">
                        <input type="text" id="cb-name" required placeholder="Batch Name (e.g. Morning O-Level) *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="cb-course" required placeholder="Course / Exam Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="cb-time" required placeholder="Timing (e.g. 9:00 AM - 11:00 AM) *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="cb-teacher" placeholder="Faculty / Teacher Name" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <button type="submit" class="super-btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl">✅ Add Batch</button>
                    </form>
                </div>

                <!-- सक्रिय बैचों की सूची -->
                <div class="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="font-extrabold text-lg adaptive-title">📚 ${isHi ? 'सक्रिय कोचिंग / कंप्यूटर बैच' : 'Active Coaching & Computer Batches'} (${coachingBatches.length})</h3>
                        <button onclick="exportCoachingExcel()" class="super-btn bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold">📥 Export Excel</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${coachingBatches.map((b, idx) => `
                            <div class="super-tile p-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 space-y-1.5">
                                <div class="flex justify-between items-start">
                                    <span class="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">${b.course}</span>
                                    <button onclick="coachingBatches.splice(${idx},1); saveCoachingProData(); renderApp()" class="text-xs text-rose-400">🗑️</button>
                                </div>
                                <h4 class="font-extrabold text-base adaptive-title">${b.batchName}</h4>
                                <div class="text-xs adaptive-sub">⏰ ${b.timing} • 👨‍🏫 ${b.instructor}</div>
                                <div class="text-xs font-bold text-emerald-500">👥 Enrolled: ${b.enrolled} / ${b.capacity} Students</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 1-क्लिक डिप्लोमा / कोर्स सर्टिफिकेट जनरेटर -->
            <div class="glass-panel p-6 rounded-3xl">
                <h3 class="font-extrabold text-lg adaptive-title mb-3">🎓 ${isHi ? '1-क्लिक डिप्लोमा / कोर्स सर्टिफिकेट प्रिंट करें' : '1-Click Diploma & Course Certificate Generator'}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${students.map((s, idx) => `
                        <div class="p-3.5 rounded-2xl border border-slate-400/30 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <div class="font-bold text-sm adaptive-title">${s.name}</div>
                                <div class="text-xs adaptive-sub">Course/Batch: ${s.class} | Roll: ${s.roll}</div>
                            </div>
                            <button onclick="printDiplomaCertificate(${idx})" class="super-btn bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold">
                                🏆 Print Certificate
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div id="cert-modal-area" class="mt-5"></div>
            </div>
        </div>
    `;
}

function addNewCoachingBatch(e) {
    e.preventDefault();
    coachingBatches.unshift({
        id: "BCH" + Date.now(),
        batchName: document.getElementById('cb-name').value.trim(),
        course: document.getElementById('cb-course').value.trim(),
        timing: document.getElementById('cb-time').value.trim(),
        instructor: document.getElementById('cb-teacher').value.trim() || "Senior Faculty",
        capacity: 40,
        enrolled: 1
    });
    saveCoachingProData();
    renderApp();
}

function printDiplomaCertificate(idx) {
    const s = students[idx];
    const certHTML = `
        <div class="bg-white text-slate-900 p-8 rounded-2xl border-8 border-double border-amber-700 max-w-2xl mx-auto text-center shadow-2xl">
            <div class="text-xs font-extrabold uppercase tracking-widest text-indigo-700">VidyaSetu Verified Digital Credential</div>
            <h1 class="text-2xl font-black uppercase mt-1 text-slate-900">${orgName}</h1>
            <div class="my-4 inline-block px-5 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-full text-sm uppercase tracking-wider">Certificate of Completion</div>
            <p class="text-sm text-slate-700 mt-2">This is proudly awarded to</p>
            <h2 class="text-3xl font-black text-indigo-900 my-2 underline">${s.name}</h2>
            <p class="text-xs text-slate-600">Son/Daughter of <strong>${s.father}</strong> (Roll No: <strong>${s.roll}</strong>)</p>
            <p class="text-sm text-slate-800 mt-3">for successfully completing the course / program in <strong>${s.class}</strong> with Grade <strong>A+</strong>.</p>
            <div class="flex justify-between items-end mt-10 pt-4 border-t border-slate-300 text-xs">
                <span>Date: ${new Date().toLocaleDateString('en-IN')}</span>
                <span class="font-bold border-t border-slate-800 pt-1 px-4">Director / Principal Signature</span>
            </div>
        </div>
    `;
    document.getElementById('print-only-container').innerHTML = certHTML;
    document.getElementById('cert-modal-area').innerHTML = `${certHTML}<div class="no-print text-center mt-4"><button onclick="window.print()" class="super-btn bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold">🖨️ Print Only Certificate</button></div>`;
    document.getElementById('cert-modal-area').scrollIntoView({ behavior: 'smooth' });
}

function exportCoachingExcel() {
    loadCoachingProData();
    let csv = "BatchID,BatchName,Course,Timing,Instructor,Capacity,Enrolled\n";
    coachingBatches.forEach(b => { csv += `"${b.id}","${b.batchName}","${b.course}","${b.timing}","${b.instructor}",${b.capacity},${b.enrolled}\n`; });
    downloadCSVFile(csv, `${orgName}_Coaching_Batches.csv`);
}