// =========================================================================
// VidyaSetu Dedicated Multiplex Module: Gym & Fitness Club Pro (gym_pro.js)
// =========================================================================

const defaultGymMembers = [
    { id: "GYM101", name: "Vikram Singh", mobile: "9876543210", plan: "Quarterly (3 Months)", goal: "Muscle Gain", trainer: "Coach Arjun", feePaid: 2500, validTill: "2027-01-15", status: "Active" },
    { id: "GYM102", name: "Neha Gupta", mobile: "9876543211", plan: "Monthly Pack", goal: "Weight Loss & Cardio", trainer: "Coach Riya", feePaid: 1000, validTill: "2026-11-28", status: "Expiring Soon" },
    { id: "GYM103", name: "Rohit Verma", mobile: "9876543212", plan: "Annual VIP (12 Months)", goal: "Strength & CrossFit", trainer: "Coach Arjun", feePaid: 8000, validTill: "2027-10-10", status: "Active" }
];

let gymMembersList = [];
let gymSearchQuery = "";

function loadGymProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'gym_pro';
    gymMembersList = JSON.parse(localStorage.getItem(key)) || JSON.parse(JSON.stringify(defaultGymMembers));
}

function saveGymProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'gym_pro';
    localStorage.setItem(key, JSON.stringify(gymMembersList));
}

function renderGymProModule() {
    loadGymProData();
    const isHi = currentLang === 'hi';

    const totalMembers = gymMembersList.length;
    const activeMembers = gymMembersList.filter(m => m.status === 'Active').length;
    const expiringCount = gymMembersList.filter(m => m.status === 'Expiring Soon').length;
    const totalGymRev = gymMembersList.reduce((sum, m) => sum + Number(m.feePaid || 0), 0);

    const filtered = gymMembersList.filter(m =>
        m.name.toLowerCase().includes(gymSearchQuery.toLowerCase()) ||
        m.mobile.includes(gymSearchQuery) ||
        m.trainer.toLowerCase().includes(gymSearchQuery.toLowerCase())
    );

    return `
        <div class="space-y-6">
            <!-- Gym Analytics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass-panel super-tile p-5 rounded-2xl border border-indigo-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'कुल जिम मेंबर्स' : 'Total Gym Members'}</span>
                    <div class="text-3xl font-black text-indigo-500 mt-1">${totalMembers}</div>
                    <div class="text-[11px] text-emerald-500 font-bold mt-1">${activeMembers} Active Subscriptions</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-amber-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'रिन्यूअल अलर्ट (Expiring)' : 'Renewal Alerts'}</span>
                    <div class="text-3xl font-black text-amber-500 mt-1">${expiringCount}</div>
                    <div class="text-[11px] adaptive-sub mt-1">Send WhatsApp Reminder</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-emerald-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'कुल मेंबरशिप आय' : 'Membership Revenue'}</span>
                    <div class="text-3xl font-black text-emerald-500 mt-1">₹${totalGymRev.toLocaleString('en-IN')}</div>
                    <div class="text-[11px] adaptive-sub mt-1">Collected Gym Fees</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'जिम डेटा रिपोर्ट' : 'Export Gym Report'}</span>
                    <button onclick="exportGymProExcel()" class="super-btn mt-2 w-full bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-extrabold">📥 Export Excel</button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- नया मेंबर रजिस्ट्रेशन फॉर्म -->
                <div class="glass-panel p-6 rounded-3xl h-fit">
                    <h3 class="font-extrabold text-lg text-indigo-500 mb-3">💪 ${isHi ? 'नया जिम मेंबर जोड़ें' : 'Add New Gym Member'}</h3>
                    <form onsubmit="addNewGymMember(event)" class="space-y-3 text-xs sm:text-sm">
                        <input type="text" id="gm-name" required placeholder="Member Full Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="tel" id="gm-mobile" required placeholder="WhatsApp Mobile No. *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <select id="gm-plan" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-bold">
                            <option value="Monthly Pack">Monthly Pack (1 Month)</option>
                            <option value="Quarterly (3 Months)">Quarterly Pack (3 Months)</option>
                            <option value="Half-Yearly (6 Months)">Half-Yearly Pack (6 Months)</option>
                            <option value="Annual VIP (12 Months)">Annual VIP Pack (12 Months)</option>
                        </select>
                        <input type="text" id="gm-goal" placeholder="Fitness Goal (e.g. Weight Loss / Muscle Gain)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="gm-trainer" placeholder="Assigned Trainer (e.g. Coach Arjun)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="number" id="gm-fee" required value="1000" placeholder="Fee Paid (₹)" class="px-3 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent font-bold text-emerald-500">
                            <input type="date" id="gm-valid" required value="2026-12-30" class="px-3 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        </div>
                        <button type="submit" class="super-btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl">✅ Register Member</button>
                    </form>
                </div>

                <!-- सक्रिय मेंबर्स की सूची -->
                <div class="lg:col-span-2 glass-panel p-6 rounded-3xl overflow-x-auto">
                    <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
                        <h3 class="font-extrabold text-lg adaptive-title">🏋️ ${isHi ? 'जिम मेंबर्स व मेंबरशिप वैधता' : 'Gym Members & Validity Tracker'} (${filtered.length})</h3>
                        <input type="text" value="${gymSearchQuery}" oninput="gymSearchQuery=this.value; renderApp()" placeholder="Search member / trainer..." class="px-3 py-1.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent text-xs">
                    </div>

                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-300/40 dark:border-slate-800 adaptive-sub text-xs">
                                <th class="py-2.5">Member & Goal</th>
                                <th class="py-2.5">Plan & Trainer</th>
                                <th class="py-2.5">Valid Till</th>
                                <th class="py-2.5">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.map(m => {
                                const realIdx = gymMembersList.findIndex(x => x.id === m.id);
                                const waNum = m.mobile.replace(/\D/g, '');
                                return `
                                    <tr class="border-b border-slate-300/30 dark:border-slate-800/60">
                                        <td class="py-3.5">
                                            <div class="font-bold adaptive-title">${m.name}</div>
                                            <div class="text-xs adaptive-sub">📞 ${m.mobile} • 🎯 ${m.goal || 'General Fitness'}</div>
                                        </td>
                                        <td class="py-3.5">
                                            <span class="text-xs font-bold text-indigo-400">${m.plan}</span>
                                            <div class="text-[11px] adaptive-sub">Trainer: ${m.trainer || 'General'} • ₹${m.feePaid}</div>
                                        </td>
                                        <td class="py-3.5 text-xs">
                                            <div class="font-bold adaptive-title">📅 ${m.validTill}</div>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${m.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}">${m.status}</span>
                                        </td>
                                        <td class="py-3.5 flex flex-wrap gap-1.5">
                                            <a href="https://wa.me/${waNum.length === 10 ? '91' + waNum : waNum}?text=${encodeURIComponent(`Hello ${m.name}, your ${m.plan} at ${orgName} is valid till ${m.validTill}. Stay fit!`)}" target="_blank" class="super-btn bg-green-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">💬</a>
                                            <button onclick="renewGymMember(${realIdx})" title="Extend 30 Days" class="super-btn bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">🔄 Renew</button>
                                            <button onclick="gymMembersList.splice(${realIdx},1); saveGymProData(); renderApp()" class="super-btn bg-rose-500/20 text-rose-500 px-2 py-1.5 rounded-lg text-xs">🗑️</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function addNewGymMember(e) {
    e.preventDefault();
    gymMembersList.unshift({
        id: "GYM" + Math.floor(100 + Math.random() * 900),
        name: document.getElementById('gm-name').value.trim(),
        mobile: document.getElementById('gm-mobile').value.trim(),
        plan: document.getElementById('gm-plan').value,
        goal: document.getElementById('gm-goal').value.trim() || "Fitness",
        trainer: document.getElementById('gm-trainer').value.trim() || "Floor Trainer",
        feePaid: Number(document.getElementById('gm-fee').value || 0),
        validTill: document.getElementById('gm-valid').value,
        status: "Active"
    });
    saveGymProData();
    renderApp();
}

function renewGymMember(idx) {
    const extraFee = prompt(`Enter renewal fee for ${gymMembersList[idx].name} (₹):`, "1000");
    if (extraFee && !isNaN(extraFee)) {
        gymMembersList[idx].feePaid = Number(gymMembersList[idx].feePaid) + Number(extraFee);
        gymMembersList[idx].status = "Active";
        const d = new Date();
        d.setDate(d.getDate() + 30);
        gymMembersList[idx].validTill = d.toISOString().split('T')[0];
        saveGymProData();
        renderApp();
    }
}

function exportGymProExcel() {
    loadGymProData();
    let csv = "MemberID,Name,Mobile,Plan,FitnessGoal,Trainer,TotalFeePaid,ValidTill,Status\n";
    gymMembersList.forEach(m => { csv += `"${m.id}","${m.name}","${m.mobile}","${m.plan}","${m.goal}","${m.trainer}",${m.feePaid},"${m.validTill}","${m.status}"\n`; });
    downloadCSVFile(csv, `${orgName}_Gym_Members_Report.csv`);
}