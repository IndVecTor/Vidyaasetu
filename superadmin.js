// =========================================================================
// VidyaSetu Super Admin: Full Institute View, Auto-Plan & Excel Export (superadmin.js)
// =========================================================================

const defaultColleges = [
    {
        slug: "adarsh",
        name: "Adarsh Vidya Mandir Inter College",
        city: "Azamgarh, UP",
        logo: "",
        plan: "Pro Campus (₹6,999/Yr)",
        adminUser: "admin",
        adminPass: "123",
        active: true,
        powers: { allowAdmission: true, allowFees: true, allowPayroll: true, allowAccounts: true, allowLibrary: true, allowNotices: true, allowAttendance: true, allowExams: true }
    }
];

let registeredColleges = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
let editingCollegeIdx = null;

function saveCollegesDB() {
    localStorage.setItem('vs_colleges_db', JSON.stringify(registeredColleges));
}

function autoApplyPlanPowers(planValue) {
    const isStarter = planValue.includes('Starter');
    const isTrial = planValue.includes('Trial');
    document.getElementById('cp-adm').checked = true;
    document.getElementById('cp-fee').checked = true;
    document.getElementById('cp-lib').checked = true;
    document.getElementById('cp-not').checked = true;
    document.getElementById('cp-pay').checked = !isStarter;
    document.getElementById('cp-acc').checked = !isStarter;
    document.getElementById('cp-att').checked = !isStarter || isTrial;
    document.getElementById('cp-exm').checked = !isStarter || isTrial;
}

// 1. सुपर एडमिन: कॉलेज क्रिएटर + Full Institute View लॉन्चर + Excel Export
function renderSuperAdminColleges() {
    const isHi = currentLang === 'hi';
    const editCol = editingCollegeIdx !== null ? registeredColleges[editingCollegeIdx] : null;
    const baseUrl = window.location.origin + window.location.pathname;

    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- बायां: नया कॉलेज व केवल 1 Admin Login बनाने का फॉर्म -->
            <div class="glass-panel p-6 rounded-2xl border ${editCol ? 'border-amber-500/50' : 'border-purple-500/40'} h-fit">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-extrabold text-lg ${editCol ? 'text-amber-400' : 'text-purple-400'}">
                        ${editCol ? (isHi ? '✏️ संस्थान प्रोफ़ाइल एडिट करें' : '✏️ Edit Institute Profile') : (isHi ? '🏫 नया संस्थान जोड़ें (1 Admin ID)' : '🏫 Add New Institute (1 Admin ID)')}
                    </h3>
                    ${editCol ? `<button onclick="editingCollegeIdx=null; renderApp()" class="text-xs text-rose-400 underline">Cancel</button>` : ''}
                </div>

                <form onsubmit="saveCollegeProfile(event)" class="space-y-3 text-sm">
                    <div>
                        <label class="text-[11px] font-bold text-slate-400">${isHi ? 'संस्थान / कॉलेज का नाम *' : 'Institute / College Name *'}</label>
                        <input type="text" id="col-name" required value="${editCol ? editCol.name : ''}" placeholder="e.g. Sunrise Degree College" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    </div>

                    <div>
                        <label class="text-[11px] font-bold text-indigo-400">${isHi ? 'कस्टम URL स्लग *' : 'Custom URL Slug *'}</label>
                        <div class="flex items-center mt-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                            <span class="px-2.5 text-[11px] text-slate-500">?college=</span>
                            <input type="text" id="col-slug" required value="${editCol ? editCol.slug : ''}" placeholder="sunrise" ${editCol ? 'readonly' : ''} class="w-full py-2.5 px-2 bg-transparent text-emerald-400 font-bold outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-[11px] text-slate-400">${isHi ? 'शहर / जिला' : 'City / District'}</label>
                            <input type="text" id="col-city" value="${editCol ? editCol.city : ''}" placeholder="Azamgarh" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] font-bold text-emerald-400">${isHi ? 'प्लान चुनें *' : 'Select Plan *'}</label>
                            <select id="col-plan" onchange="autoApplyPlanPowers(this.value)" class="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold">
                                <option value="Pro Campus (₹6,999/Yr)" ${editCol && editCol.plan.includes('Pro') ? 'selected' : ''}>Pro Campus (₹6,999/Yr)</option>
                                <option value="Starter Plan (₹3,999/Yr)" ${editCol && editCol.plan.includes('Starter') ? 'selected' : ''}>Starter Plan (₹3,999/Yr)</option>
                                <option value="Enterprise (₹11,999/Yr)" ${editCol && editCol.plan.includes('Enterprise') ? 'selected' : ''}>Enterprise (₹11,999/Yr)</option>
                                <option value="7-Day Free Trial" ${editCol && editCol.plan.includes('Trial') ? 'selected' : ''}>7-Day Free Trial</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-[11px] text-slate-400">${isHi ? 'मुख्य Admin ID *' : 'Master Admin ID *'}</label>
                            <input type="text" id="col-admin-user" required value="${editCol ? editCol.adminUser : 'admin'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400">${isHi ? 'पासवर्ड *' : 'Master Password *'}</label>
                            <input type="text" id="col-admin-pass" required value="${editCol ? editCol.adminPass : '123'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                    </div>

                    <div>
                        <label class="text-[11px] text-slate-400">${isHi ? 'संस्थान लोगो अपलोड करें' : 'Upload Institute Logo'}</label>
                        <input type="file" id="col-logo-file" accept="image/*" class="w-full mt-1 text-xs">
                    </div>

                    <div class="text-[11px] font-bold text-slate-400 pt-1">${isHi ? 'सक्रिय मॉड्यूल (आप कभी भी बदल सकते हैं):' : 'Enabled Modules:'}</div>
                    <div class="grid grid-cols-2 gap-1.5 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-adm" ${!editCol || editCol.powers.allowAdmission ? 'checked' : ''}> Admission</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-fee" ${!editCol || editCol.powers.allowFees ? 'checked' : ''}> Fees & WhatsApp</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-pay" ${!editCol || editCol.powers.allowPayroll ? 'checked' : ''}> Staff Payroll</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-acc" ${!editCol || editCol.powers.allowAccounts ? 'checked' : ''}> Accounts</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-lib" ${!editCol || editCol.powers.allowLibrary ? 'checked' : ''}> Library</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-not" ${!editCol || editCol.powers.allowNotices ? 'checked' : ''}> Notices</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-att" ${!editCol || editCol.powers.allowAttendance ? 'checked' : ''}> Attendance</label>
                        <label class="flex items-center gap-1.5"><input type="checkbox" id="cp-exm" ${!editCol || editCol.powers.allowExams ? 'checked' : ''}> Exams & ID</label>
                    </div>

                    <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl shadow-lg">
                        ${editCol ? (isHi ? '💾 बदलाव सेव करें' : '💾 Update Institute') : (isHi ? '🚀 संस्थान व कस्टम लिंक बनाएं' : '🚀 Create Institute & Custom URL')}
                    </button>
                </form>
            </div>

            <!-- दायां: पंजीकृत संस्थानों की सूची + Full Institute View बटन + Excel Export -->
            <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div class="flex flex-wrap justify-between items-center gap-2">
                    <h3 class="font-bold text-lg">${isHi ? '🏫 पंजीकृत संस्थान (क्लिक करके पूरा पैनल खोलें)' : '🏫 Registered Institutes (Click to Manage Full Panel)'} (${registeredColleges.length})</h3>
                    <button onclick="exportCollegesExcel()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow">
                        📥 ${isHi ? 'Excel डाउनलोड' : 'Export Excel'}
                    </button>
                </div>

                ${registeredColleges.map((c, idx) => {
                    const customLink = `${baseUrl}?college=${c.slug}`;
                    return `
                        <div class="p-4 rounded-2xl border ${c.active ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50' : 'border-rose-500/40 bg-rose-950/20'} transition space-y-3">
                            <div class="flex flex-wrap justify-between items-start gap-2">
                                <div class="flex items-center gap-3 cursor-pointer" onclick="enterSuperAdminInstituteView('${c.slug}')">
                                    <div class="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                                        ${c.logo ? `<img src="${c.logo}" class="w-full h-full object-cover">` : '🏫'}
                                    </div>
                                    <div>
                                        <div class="font-extrabold text-base text-indigo-300 hover:underline">${c.name} ↗</div>
                                        <div class="text-xs text-slate-400">${c.city} • <span class="text-emerald-400 font-semibold">${c.plan}</span></div>
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                                    ${c.active ? '● Active' : '✖ Suspended'}
                                </span>
                            </div>

                            <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                                <a href="?college=${c.slug}" target="_blank" class="text-cyan-400 font-mono truncate hover:underline">${customLink}</a>
                                <button onclick="navigator.clipboard.writeText('${customLink}'); alert('Institute URL Copied!')" class="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0">📋 Copy URL</button>
                            </div>

                            <div class="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
                                <span class="text-slate-400">Admin ID: <strong class="text-emerald-400">${c.adminUser}</strong> | Pass: <strong class="text-amber-400">${c.adminPass}</strong></span>
                                <div class="flex flex-wrap gap-1.5">
                                    <button onclick="enterSuperAdminInstituteView('${c.slug}')" class="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg font-extrabold shadow">
                                        👁️ ${isHi ? 'पूरा संस्थान खोलें (Full Access)' : 'Open Full Institute View'}
                                    </button>
                                    <button onclick="editingCollegeIdx=${idx}; renderApp()" class="bg-amber-500/20 text-amber-300 px-2.5 py-1.5 rounded-lg font-bold">✏️ Edit</button>
                                    <button onclick="registeredColleges[${idx}].active=!registeredColleges[${idx}].active; saveCollegesDB(); renderApp()" class="bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg font-bold">
                                        ${c.active ? 'Suspend' : 'Activate'}
                                    </button>
                                    ${c.slug !== 'adarsh' ? `<button onclick="registeredColleges.splice(${idx},1); saveCollegesDB(); renderApp()" class="bg-rose-500/20 text-rose-400 px-2.5 py-1.5 rounded-lg font-bold">🗑️</button>` : ''}
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

    const fileInput = document.getElementById('col-logo-file');
    const existingLogo = editingCollegeIdx !== null ? registeredColleges[editingCollegeIdx].logo : "";

    const finalizeSave = (logoData) => {
        const colObj = {
            slug: rawSlug,
            name: document.getElementById('col-name').value.trim(),
            city: document.getElementById('col-city').value.trim() || "India",
            plan: document.getElementById('col-plan').value,
            adminUser: document.getElementById('col-admin-user').value.trim(),
            adminPass: document.getElementById('col-admin-pass').value.trim(),
            logo: logoData,
            active: editingCollegeIdx !== null ? registeredColleges[editingCollegeIdx].active : true,
            powers: {
                allowAdmission: document.getElementById('cp-adm').checked,
                allowFees: document.getElementById('cp-fee').checked,
                allowPayroll: document.getElementById('cp-pay').checked,
                allowAccounts: document.getElementById('cp-acc').checked,
                allowLibrary: document.getElementById('cp-lib').checked,
                allowNotices: document.getElementById('cp-not').checked,
                allowAttendance: document.getElementById('cp-att').checked,
                allowExams: document.getElementById('cp-exm').checked
            }
        };

        if (editingCollegeIdx !== null) {
            registeredColleges[editingCollegeIdx] = colObj;
            editingCollegeIdx = null;
        } else {
            if (registeredColleges.some(c => c.slug === rawSlug)) {
                alert("This URL slug is already used!");
                return;
            }
            registeredColleges.unshift(colObj);
        }
        saveCollegesDB();
        renderApp();
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => finalizeSave(ev.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        finalizeSave(existingLogo);
    }
}

// 2. Leads Inbox + Excel Export
function renderSubscriptionLeadsInbox() {
    const isHi = currentLang === 'hi';
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];

    return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                <div>
                    <h3 class="font-extrabold text-xl text-emerald-400">${isHi ? '📩 नया सब्स्क्रिप्शन व इंक्वायरी डेटा' : '📩 Subscription & Demo Requests Inbox'}</h3>
                    <p class="text-xs text-slate-400 mt-0.5">${isHi ? 'मुख्य होमपेज से प्राप्त सभी आवेदनों की सूची' : 'All institute inquiries submitted from the home page'}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-extrabold">${leads.length} Leads</span>
                    <button onclick="exportLeadsExcel()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow">
                        📥 ${isHi ? 'Excel डाउनलोड' : 'Export Excel'}
                    </button>
                </div>
            </div>

            ${leads.length === 0 ? `
                <div class="p-8 text-center text-slate-400 text-sm border border-dashed border-slate-800 rounded-2xl">
                    ${isHi ? 'अभी तक कोई नया फॉर्म सबमिट नहीं हुआ है।' : 'No subscription inquiries received yet.'}
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${leads.map((l, idx) => `
                        <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-2">
                            <div class="flex justify-between items-start">
                                <div>
                                    <span class="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">${l.type} • ${l.date}</span>
                                    <h4 class="font-extrabold text-base mt-1">${l.orgName}</h4>
                                </div>
                                <button onclick="deleteLead(${idx})" class="text-xs text-rose-400">🗑️</button>
                            </div>
                            <div class="text-xs text-slate-300 space-y-1">
                                <div>👤 <strong>${l.personName}</strong> (${l.city})</div>
                                <div>📞 <strong>${l.phone}</strong> • 💎 <span class="text-emerald-400 font-bold">${l.plan}</span></div>
                                ${l.note ? `<div class="text-slate-400 italic">"${l.note}"</div>` : ''} </div> <div class="pt-2 flex gap-2"> <a href="https://wa.me/91${l.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Namaste ${l.personName}, thank you for requesting VidyaSetu ERP (${l.plan}) for${l.orgName}.`)}" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                    💬 WhatsApp
                                </a>
                                <button onclick="quickConvertLeadToCollege(${idx})" class="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                    ⚡ Create Institute URL
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}

function deleteLead(idx) {
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    leads.splice(idx, 1);
    localStorage.setItem('vs_subscription_leads', JSON.stringify(leads));
    renderApp();
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
        document.getElementById('col-plan').value = lead.plan;
        autoApplyPlanPowers(lead.plan);
        document.getElementById('col-slug').value = lead.orgName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    }, 50);
}

// Super Admin Excel Exports
function exportCollegesExcel() {
    let csv = "Slug,Institute Name,City,Plan,Admin ID,Admin Password,Status\n";
    registeredColleges.forEach(c => {
        csv += `"${c.slug}","${c.name}","${c.city}","${c.plan}","${c.adminUser}","${c.adminPass}","${c.active ? 'Active' : 'Suspended'}"\n`;
    });
    downloadCSVFile(csv, "VidyaSetu_All_Institutes.csv");
}

function exportLeadsExcel() {
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    let csv = "Date,Institute Name,Contact Person,Phone,City,Type,Plan,Note\n";
    leads.forEach(l => {
        csv += `"${l.date}","${l.orgName}","${l.personName}","${l.phone}","${l.city}","${l.type}","${l.plan}","${l.note || ''}"\n`;
    });
    downloadCSVFile(csv, "VidyaSetu_Subscription_Leads.csv");
}