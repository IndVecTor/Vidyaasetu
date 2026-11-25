// =========================================================================
// VidyaSetu Super Admin: Multiplex Builder + Expiry Date Lock (superadmin.js)
// =========================================================================

const defaultColleges = [
    {
        slug: "adarsh",
        name: "Adarsh Vidya Mandir Inter College",
        category: "School / Inter College",
        city: "Azamgarh, UP",
        tagline: "Affiliated to UP Board • Excellence in Education",
        phone: "9876543210",
        logo: "",
        stamp: "",
        plan: "Pro Campus (₹6,999/Yr)",
        expiryDate: "2027-11-30",
        adminUser: "admin",
        adminPass: "123",
        active: true,
        powers: { allowAdmission: true, allowFees: true, allowPayroll: true, allowAccounts: true, allowLibrary: false, allowCoaching: false, allowGym: false, allowCompLab: false, allowNotices: true, allowAttendance: true, allowExams: true }
    },
    {
        slug: "gyanlib",
        name: "Gyan Ganga Digital Self-Study Library",
        category: "Self-Study Library",
        city: "Azamgarh, UP",
        tagline: "Peaceful AC Study Environment • 24x7 Wi-Fi",
        phone: "9876543211",
        logo: "",
        stamp: "",
        plan: "Starter Plan (₹3,999/Yr)",
        expiryDate: "2027-10-15",
        adminUser: "admin",
        adminPass: "123",
        active: true,
        powers: { allowAdmission: false, allowFees: true, allowPayroll: true, allowAccounts: true, allowLibrary: true, allowCoaching: false, allowGym: false, allowCompLab: false, allowNotices: true, allowAttendance: false, allowExams: false }
    },
    {
        slug: "ironfit",
        name: "IronPulse Gym & Fitness Club",
        category: "Gym / Fitness Club",
        city: "Lucknow, UP",
        tagline: "Transform Your Body • Certified Trainers",
        phone: "9876543212",
        logo: "",
        stamp: "",
        plan: "Starter Plan (₹3,999/Yr)",
        expiryDate: "2027-09-20",
        adminUser: "admin",
        adminPass: "123",
        active: true,
        powers: { allowAdmission: false, allowFees: false, allowPayroll: true, allowAccounts: true, allowLibrary: false, allowCoaching: false, allowGym: true, allowCompLab: false, allowNotices: true, allowAttendance: false, allowExams: false }
    }
];

let registeredColleges = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
let editingCollegeIdx = null;

function saveCollegesDB() {
    localStorage.setItem('vs_colleges_db', JSON.stringify(registeredColleges));
}

function autoApplyCategoryFeatures(cat) {
    const isLib = cat.includes('Library');
    const isCoach = cat.includes('Coaching');
    const isComp = cat.includes('Computer');
    const isGym = cat.includes('Gym');
    const isSchool = cat.includes('School') || cat.includes('College');

    document.getElementById('cp-adm').checked = isSchool || isCoach || isComp;
    document.getElementById('cp-fee').checked = isSchool || isCoach || isComp || isLib;
    document.getElementById('cp-pay').checked = true;
    document.getElementById('cp-acc').checked = true;
    document.getElementById('cp-lib').checked = isLib;
    document.getElementById('cp-coa').checked = isCoach || isComp;
    document.getElementById('cp-gym').checked = isGym;
    document.getElementById('cp-lab').checked = isComp;
    document.getElementById('cp-not').checked = true;
    document.getElementById('cp-att').checked = isSchool || isCoach || isComp;
    document.getElementById('cp-exm').checked = isSchool;
}

function renderSuperAdminColleges() {
    const isHi = currentLang === 'hi';
    const editCol = editingCollegeIdx !== null ? registeredColleges[editingCollegeIdx] : null;
    const baseUrl = window.location.origin + window.location.pathname;

    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="glass-panel p-6 rounded-3xl border ${editCol ? 'border-amber-500/50' : 'border-purple-500/40'} h-fit">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-extrabold text-lg ${editCol ? 'text-amber-400' : 'text-purple-400'}">
                        ${editCol ? '✏️ Edit Institute & Expiry' : '🏢 Create Multiplex Institute'}
                    </h3>
                    ${editCol ? `<button onclick="editingCollegeIdx=null; renderApp()" class="text-xs text-rose-400 underline">Cancel</button>` : ''}
                </div>

                <form onsubmit="saveCollegeProfile(event)" class="space-y-3 text-sm">
                    <div>
                        <label class="text-[11px] font-bold text-cyan-400">Select Business Category *</label>
                        <select id="col-category" onchange="autoApplyCategoryFeatures(this.value)" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 font-bold text-indigo-300">
                            <option value="School / Inter College" ${editCol && editCol.category === 'School / Inter College' ? 'selected' : ''}>🏫 School / Inter College</option>
                            <option value="Degree College / University" ${editCol && editCol.category === 'Degree College / University' ? 'selected' : ''}>🎓 Degree College / University</option>
                            <option value="Self-Study Library" ${editCol && editCol.category === 'Self-Study Library' ? 'selected' : ''}>📖 Self-Study Library</option>
                            <option value="Coaching Institute" ${editCol && editCol.category === 'Coaching Institute' ? 'selected' : ''}>📚 Coaching Institute</option>
                            <option value="Computer Lab / Training Center" ${editCol && editCol.category === 'Computer Lab / Training Center' ? 'selected' : ''}>🖥️ Computer Lab & Training</option>
                            <option value="Gym / Fitness Club" ${editCol && editCol.category === 'Gym / Fitness Club' ? 'selected' : ''}>💪 Gym / Fitness Club</option>
                        </select>
                    </div>

                    <input type="text" id="col-name" required value="${editCol ? editCol.name : ''}" placeholder="Institute / Club Name *" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white">

                    <div class="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <span class="px-2.5 text-[11px] text-slate-500">?college=</span>
                        <input type="text" id="col-slug" required value="${editCol ? editCol.slug : ''}" placeholder="url-slug" ${editCol ? 'readonly' : ''} class="w-full py-2.5 px-2 bg-transparent text-emerald-400 font-bold outline-none">
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" id="col-city" value="${editCol ? editCol.city : ''}" placeholder="City / District" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white">
                        <select id="col-plan" class="px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-emerald-400">
                            <option value="Pro Campus (₹6,999/Yr)" ${editCol && editCol.plan.includes('Pro') ? 'selected' : ''}>Pro (₹6,999/Yr)</option>
                            <option value="Starter Plan (₹3,999/Yr)" ${editCol && editCol.plan.includes('Starter') ? 'selected' : ''}>Starter (₹3,999/Yr)</option>
                            <option value="Enterprise (₹11,999/Yr)" ${editCol && editCol.plan.includes('Enterprise') ? 'selected' : ''}>Enterprise (₹11,999/Yr)</option>
                        </select>
                    </div>

                    <!-- Subscription Expiry Date Lock -->
                    <div>
                        <label class="text-[11px] font-bold text-rose-400">Subscription Expiry Date (Auto-Lock Date) *</label>
                        <input type="date" id="col-expiry" required value="${editCol && editCol.expiryDate ? editCol.expiryDate : '2027-11-30'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-rose-500/40 bg-slate-900 text-amber-300 font-bold">
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" id="col-admin-user" required value="${editCol ? editCol.adminUser : 'admin'}" placeholder="Admin ID *" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white">
                        <input type="text" id="col-admin-pass" required value="${editCol ? editCol.adminPass : '123'}" placeholder="Password *" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white">
                    </div>

                    <div class="grid grid-cols-2 gap-1.5 text-xs bg-slate-900/70 text-slate-200 p-3 rounded-xl border border-slate-800">
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-adm" ${!editCol || editCol.powers.allowAdmission ? 'checked' : ''}> Admission</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-fee" ${!editCol || editCol.powers.allowFees ? 'checked' : ''}> Fees & Slip</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-lib" ${editCol && editCol.powers.allowLibrary ? 'checked' : ''}> 📖 Library Pro</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-coa" ${editCol && editCol.powers.allowCoaching ? 'checked' : ''}> 💻 Coaching Pro</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-gym" ${editCol && editCol.powers.allowGym ? 'checked' : ''}> 💪 Gym Pro</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-lab" ${editCol && editCol.powers.allowCompLab ? 'checked' : ''}> 🖥️ Computer Lab</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-pay" ${!editCol || editCol.powers.allowPayroll ? 'checked' : ''}> Staff & Payroll</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-acc" ${!editCol || editCol.powers.allowAccounts ? 'checked' : ''}> Accounts</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-not" ${!editCol || editCol.powers.allowNotices ? 'checked' : ''}> Notices</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-att" ${!editCol || editCol.powers.allowAttendance ? 'checked' : ''}> Attendance</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-exm" ${!editCol || editCol.powers.allowExams ? 'checked' : ''}> Exams & TC</label>
                    </div>

                    <button type="submit" class="super-btn w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl shadow-lg">
                        ${editCol ? '💾 Update Institute' : '🚀 Create Custom URL'}
                    </button>
                </form>
            </div>

            <div class="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
                <div class="flex flex-wrap justify-between items-center gap-2">
                    <h3 class="font-bold text-lg adaptive-title">🏢 All Category Institutes (${registeredColleges.length})</h3>
                    <button onclick="exportCollegesExcel()" class="super-btn bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold">📥 Export Excel</button>
                </div>

                ${registeredColleges.map((c, idx) => {
                    const customLink = `${baseUrl}?college=${c.slug}`;
                    const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                    return `
                        <div class="super-tile p-4 rounded-2xl border ${c.active && !isExpired ? 'border-indigo-500/25' : 'border-rose-500/50'} space-y-3">
                            <div class="flex flex-wrap justify-between items-start gap-2">
                                <div class="flex items-center gap-3 cursor-pointer" onclick="enterSuperAdminInstituteView('${c.slug}')">
                                    <div class="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                                        ${c.logo ? `<img src="${c.logo}" class="w-full h-full object-cover">` : '🏢'}
                                    </div>
                                    <div>
                                        <span class="text-[10px] font-extrabold bg-cyan-500/15 text-cyan-500 px-2 py-0.5 rounded-full">${c.category || 'Institute'}</span>
                                        <div class="font-extrabold text-base adaptive-title hover:text-indigo-400 mt-0.5">${c.name} ↗</div>
                                        <div class="text-xs adaptive-sub">${c.city} • <span class="text-emerald-500 font-semibold">${c.plan}</span> • <span class="text-amber-400 font-bold">Valid Till: ${c.expiryDate || '2027-11-30'}</span></div>
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${!c.active || isExpired ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}">
                                    ${isExpired ? '⏰ Expired' : (c.active ? '● Active' : '✖ Suspended')}
                                </span>
                            </div>

                            <div class="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                                <a href="?college=${c.slug}" target="_blank" class="text-cyan-400 font-mono truncate hover:underline">${customLink}</a>
                                <button onclick="navigator.clipboard.writeText('${customLink}'); alert('URL Copied!')" class="super-btn bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0">📋 Copy URL</button>
                            </div>

                            <div class="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
                                <span class="adaptive-sub">Admin: <strong class="text-emerald-500">${c.adminUser}</strong> | Pass: <strong class="text-amber-500">${c.adminPass}</strong></span>
                                <div class="flex flex-wrap gap-1.5">
                                    <button onclick="enterSuperAdminInstituteView('${c.slug}')" class="super-btn bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-3.5 py-1.5 rounded-lg font-extrabold">👁️ Open Full View</button>
                                    <button onclick="editingCollegeIdx=${idx}; renderApp()" class="super-btn bg-amber-500/20 text-amber-500 px-2.5 py-1.5 rounded-lg font-bold">✏️ Edit</button>
                                    <button onclick="registeredColleges[${idx}].active=!registeredColleges[${idx}].active; saveCollegesDB(); renderApp()" class="super-btn bg-slate-500/20 adaptive-title px-2.5 py-1.5 rounded-lg font-bold">${c.active ? 'Suspend' : 'Activate'}</button>
                                    ${c.slug !== 'adarsh' ? `<button onclick="registeredColleges.splice(${idx},1); saveCollegesDB(); renderApp()" class="super-btn bg-rose-500/20 text-rose-500 px-2.5 py-1.5 rounded-lg font-bold">🗑️</button>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function saveCollegeProfile(e) {
    e.preventDefault();
    const rawSlug = document.getElementById('col-slug').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!rawSlug) { alert("Please enter a valid URL slug!"); return; }

    const existing = editingCollegeIdx !== null ? registeredColleges[editingCollegeIdx] : {};
    const colObj = {
        slug: rawSlug,
        category: document.getElementById('col-category').value,
        name: document.getElementById('col-name').value.trim(),
        city: document.getElementById('col-city').value.trim() || "India",
        tagline: existing.tagline || "",
        phone: existing.phone || "",
        plan: document.getElementById('col-plan').value,
        expiryDate: document.getElementById('col-expiry').value,
        adminUser: document.getElementById('col-admin-user').value.trim(),
        adminPass: document.getElementById('col-admin-pass').value.trim(),
        logo: existing.logo || "",
        stamp: existing.stamp || "",
        active: editingCollegeIdx !== null ? existing.active : true,
        powers: {
            allowAdmission: document.getElementById('cp-adm').checked,
            allowFees: document.getElementById('cp-fee').checked,
            allowLibrary: document.getElementById('cp-lib').checked,
            allowCoaching: document.getElementById('cp-coa').checked,
            allowGym: document.getElementById('cp-gym').checked,
            allowCompLab: document.getElementById('cp-lab').checked,
            allowPayroll: document.getElementById('cp-pay').checked,
            allowAccounts: document.getElementById('cp-acc').checked,
            allowNotices: document.getElementById('cp-not').checked,
            allowAttendance: document.getElementById('cp-att').checked,
            allowExams: document.getElementById('cp-exm').checked
        }
    };

    if (editingCollegeIdx !== null) {
        registeredColleges[editingCollegeIdx] = colObj;
        editingCollegeIdx = null;
    } else {
        if (registeredColleges.some(c => c.slug === rawSlug)) { alert("URL slug already exists!"); return; }
        registeredColleges.unshift(colObj);
    }
    saveCollegesDB();
    renderApp();
}

function renderSubscriptionLeadsInbox() {
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    return `
        <div class="glass-panel p-6 rounded-3xl">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                <h3 class="font-extrabold text-xl text-emerald-500">📩 Subscription & Demo Inquiries (${leads.length})</h3>
                <button onclick="exportLeadsExcel()" class="super-btn bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold">📥 Export Excel</button>
            </div>
            ${leads.length === 0 ? `<p class="text-sm adaptive-sub">No leads received yet.</p>` : `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${leads.map((l, idx) => `
                        <div class="super-tile p-5 rounded-2xl border border-indigo-500/20 space-y-2">
                            <span class="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">${l.type} • ${l.date}</span>
                            <h4 class="font-extrabold text-base adaptive-title">${l.orgName}</h4>
                            <div class="text-xs adaptive-sub">👤 <strong>${l.personName}</strong> (${l.city}) • 📞 ${l.phone}</div>
                            <div class="pt-2 flex gap-2">
                                <a href="https://wa.me/91${l.phone.replace(/\D/g,'')}" target="_blank" class="super-btn bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">💬 WhatsApp</a>
                                <button onclick="quickConvertLeadToCollege(${idx})" class="super-btn bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">⚡ Create URL</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}

function quickConvertLeadToCollege(idx) {
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    const lead = leads[idx];
    if (!lead) return;
    activeTab = 'super_colleges';
    renderApp();
    setTimeout(() => {
        document.getElementById('col-name').value = lead.orgName;
        document.getElementById('col-city').value = lead.city;
        document.getElementById('col-slug').value = lead.orgName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    }, 50);
}

function exportCollegesExcel() {
    let csv = "Slug,Category,Name,City,Plan,ExpiryDate,AdminID,AdminPass,Status\n";
    registeredColleges.forEach(c => { csv += `"${c.slug}","${c.category}","${c.name}","${c.city}","${c.plan}","${c.expiryDate || ''}","${c.adminUser}","${c.adminPass}","${c.active ? 'Active' : 'Suspended'}"\n`; });
    downloadCSVFile(csv, "VidyaSetu_All_Institutes.csv");
}
function exportLeadsExcel() {
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    let csv = "Date,OrgName,Person,Phone,City,Type,Plan\n";
    leads.forEach(l => { csv += `"${l.date}","${l.orgName}","${l.personName}","${l.phone}","${l.city}","${l.type}","${l.plan}"\n`; });
    downloadCSVFile(csv, "VidyaSetu_Leads.csv");
}