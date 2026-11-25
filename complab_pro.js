// =========================================================================
// VidyaSetu Dedicated Multiplex Module: Computer Lab & PC Allocation (complab_pro.js)
// =========================================================================

const defaultLabPCs = Array.from({ length: 16 }, (_, i) => {
    const pcNum = i + 1;
    const pcCode = "PC-" + String(pcNum).padStart(2, '0');
    if (pcNum === 1) return { pcCode, specs: "Core i5 • 16GB RAM", status: "in-use", studentName: "Aarav Sharma", software: "Tally Prime & GST", batchTime: "09:00 AM - 10:00 AM" };
    if (pcNum === 2) return { pcCode, specs: "Core i5 • 16GB RAM", status: "in-use", studentName: "Ananya Verma", software: "Python & Web Dev", batchTime: "09:00 AM - 10:00 AM" };
    if (pcNum === 5) return { pcCode, specs: "Core i3 • 8GB RAM", status: "maintenance", studentName: "", software: "Windows Update / Repair", batchTime: "" };
    return { pcCode, specs: "Core i5 • 8GB RAM", status: "available", studentName: "", software: "MS Office / Typing / ADCA", batchTime: "" };
});

let labPCList = [];

function loadCompLabProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'complab_pro';
    labPCList = JSON.parse(localStorage.getItem(key)) || JSON.parse(JSON.stringify(defaultLabPCs));
}

function saveCompLabProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'complab_pro';
    localStorage.setItem(key, JSON.stringify(labPCList));
}

function renderCompLabProModule() {
    loadCompLabProData();
    const isHi = currentLang === 'hi';

    const totalPC = labPCList.length;
    const inUsePC = labPCList.filter(p => p.status === 'in-use').length;
    const freePC = labPCList.filter(p => p.status === 'available').length;
    const repairPC = labPCList.filter(p => p.status === 'maintenance').length;

    return `
        <div class="space-y-6">
            <!-- Computer Lab Analytics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass-panel super-tile p-5 rounded-2xl border border-indigo-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'कुल लैब कंप्यूटर (Systems)' : 'Total Lab Systems'}</span>
                    <div class="text-3xl font-black text-indigo-500 mt-1">${totalPC} <span class="text-xs font-normal adaptive-sub">PCs</span></div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-emerald-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'खाली कंप्यूटर (Available)' : 'Available Systems'}</span>
                    <div class="text-3xl font-black text-emerald-500 mt-1">${freePC}</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-cyan-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'वर्तमान में उपयोग (In-Use)' : 'Currently Occupied'}</span>
                    <div class="text-3xl font-black text-cyan-500 mt-1">${inUsePC}</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'रिपेयरिंग:' : 'Maintenance:'} <strong class="text-rose-500">${repairPC}</strong></span>
                    <div class="flex gap-2 mt-2">
                        <button onclick="addNewLabSystem()" class="super-btn flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold">+ Add PC</button>
                        <button onclick="exportCompLabExcel()" class="super-btn flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">📥 Excel</button>
                    </div>
                </div>
            </div>

            <!-- Visual Computer Lab Grid -->
            <div class="glass-panel p-6 rounded-3xl">
                <div class="mb-5">
                    <h3 class="font-extrabold text-xl adaptive-title">🖥️ ${isHi ? 'कंप्यूटर लैब सिस्टम आवंटन व बैच मॉनिटर' : 'Computer Lab System Allocation & Batch Monitor'}</h3>
                    <p class="text-xs adaptive-sub">${isHi ? 'किसी भी PC पर क्लिक करके छात्र को बैच आवंटित करें, खाली करें या Maintenance पर डालें' : 'Click any PC card to assign a student batch, release system, or mark maintenance'}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    ${labPCList.map((pc, idx) => {
                        let borderClass = "border-emerald-500/40 bg-emerald-500/5";
                        let badgeText = "● Available";
                        let badgeColor = "text-emerald-500";
                        if (pc.status === 'in-use') {
                            borderClass = "border-indigo-500/60 bg-indigo-500/10";
                            badgeText = "🔵 In-Use";
                            badgeColor = "text-indigo-400";
                        } else if (pc.status === 'maintenance') {
                            borderClass = "border-rose-500/50 bg-rose-500/10";
                            badgeText = "🛠️ Maintenance";
                            badgeColor = "text-rose-400";
                        }

                        return `
                            <div onclick="openLabPCModal(${idx})" class="super-tile cursor-pointer p-4 rounded-2xl border-2 ${borderClass} space-y-1.5">
                                <div class="flex justify-between items-center">
                                    <span class="font-black text-base adaptive-title">🖥️ ${pc.pcCode}</span>
                                    <span class="text-[10px] font-extrabold ${badgeColor}">${badgeText}</span>
                                </div>
                                <div class="text-[10px] adaptive-sub">${pc.specs}</div>
                                <div class="pt-1 font-bold text-xs adaptive-title truncate">
                                    ${pc.status === 'in-use' ? `👨‍💻 ${pc.studentName}` : (pc.status === 'maintenance' ? 'System Under Repair' : '+ Assign Student')}
                                </div>
                                ${pc.status === 'in-use' ? `
                                    <div class="text-[10px] text-cyan-400 font-semibold truncate">💿 ${pc.software}</div>
                                    <div class="text-[10px] adaptive-sub">⏰ ${pc.batchTime}</div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="lab-modal-area"></div>
        </div>
    `;
}

function openLabPCModal(idx) {
    const pc = labPCList[idx];
    document.getElementById('lab-modal-area').innerHTML = `
        <div class="glass-panel p-6 rounded-3xl border-2 border-indigo-500/60 max-w-lg mx-auto shadow-2xl tab-transition">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-extrabold text-lg adaptive-title">🖥️ Manage ${pc.pcCode} (${pc.specs})</h3>
                <button onclick="document.getElementById('lab-modal-area').innerHTML=''" class="text-xs text-rose-400 underline">Close</button>
            </div>
            <form onsubmit="saveLabPCAssignment(event, ${idx})" class="space-y-3 text-xs sm:text-sm">
                <div>
                    <label class="text-[11px] font-bold adaptive-sub">System Status</label>
                    <select id="lp-status" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-bold">
                        <option value="in-use" ${pc.status === 'in-use' ? 'selected' : ''}>🔵 Assign to Student (In-Use)</option>
                        <option value="available" ${pc.status === 'available' ? 'selected' : ''}>🟢 Mark Available (Free)</option>
                        <option value="maintenance" ${pc.status === 'maintenance' ? 'selected' : ''}>🛠️ Mark Under Maintenance / Repair</option>
                    </select>
                </div>
                <input type="text" id="lp-student" value="${pc.studentName}" placeholder="Student Name (if In-Use)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                <input type="text" id="lp-soft" value="${pc.software}" placeholder="Software / Lab Subject (e.g. Tally, Python, Typing)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                <input type="text" id="lp-time" value="${pc.batchTime}" placeholder="Lab Timing (e.g. 10:00 AM - 11:00 AM)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                <button type="submit" class="super-btn w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl">💾 Update PC Status</button>
            </form>
        </div>
    `;
    document.getElementById('lab-modal-area').scrollIntoView({ behavior: 'smooth' });
}

function saveLabPCAssignment(e, idx) {
    e.preventDefault();
    const st = document.getElementById('lp-status').value;
    labPCList[idx].status = st;
    labPCList[idx].studentName = st === 'in-use' ? document.getElementById('lp-student').value.trim() : "";
    labPCList[idx].software = document.getElementById('lp-soft').value.trim();
    labPCList[idx].batchTime = st === 'in-use' ? document.getElementById('lp-time').value.trim() : "";
    saveCompLabProData();
    renderApp();
}

function addNewLabSystem() {
    const nextNum = labPCList.length + 1;
    labPCList.push({ pcCode: "PC-" + String(nextNum).padStart(2, '0'), specs: "Core i5 • 16GB RAM", status: "available", studentName: "", software: "MS Office / Coding", batchTime: "" });
    saveCompLabProData();
    renderApp();
}

function exportCompLabExcel() {
    loadCompLabProData();
    let csv = "PCCode,Specs,Status,AssignedStudent,Software,BatchTiming\n";
    labPCList.forEach(p => { csv += `"${p.pcCode}","${p.specs}","${p.status}","${p.studentName}","${p.software}","${p.batchTime}"\n`; });
    downloadCSVFile(csv, `${orgName}_Computer_Lab_Report.csv`);
}