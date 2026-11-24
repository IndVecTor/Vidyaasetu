// =========================================================================
// VidyaSetu Super Admin: Auto-Plan, Custom Posts & A-to-Z Deep Control (superadmin.js)
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
        customPosts: ["Vice Principal", "Office Clerk", "Senior Teacher", "Accountant", "Librarian", "Exam Controller"],
        powers: { allowAdmission: true, allowFees: true, allowPayroll: true, allowAccounts: true, allowLibrary: true, allowNotices: true, allowAttendance: true, allowExams: true }
    }
];

let registeredColleges = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
let editingCollegeIdx = null;
let deepControlCollegeIdx = null; // किसी भी कॉलेज के A-to-Z अंदरूनी कंट्रोल के लिए

function saveCollegesDB() {
    localStorage.setItem('vs_colleges_db', JSON.stringify(registeredColleges));
}

// प्लान चुनते ही अपने आप फीचर्स (Checkboxes) सेट करना
function autoApplyPlanPowers(planValue) {
    const isStarter = planValue.includes('Starter');
    const isTrial = planValue.includes('Trial');
    // Starter में केवल मुख्य बेसिक फीचर्स चालू होंगे; Pro और Enterprise में सब कुछ चालू होगा
    document.getElementById('cp-adm').checked = true;
    document.getElementById('cp-fee').checked = true;
    document.getElementById('cp-lib').checked = true;
    document.getElementById('cp-not').checked = true;

    document.getElementById('cp-pay').checked = !isStarter;
    document.getElementById('cp-acc').checked = !isStarter;
    document.getElementById('cp-att').checked = !isStarter || isTrial;
    document.getElementById('cp-exm').checked = !isStarter || isTrial;
}

// 1. सुपर एडमिन: कॉलेज मैनेजर + A-to-Z डीप कंट्रोल
function renderSuperAdminColleges() {
    const isHi = currentLang === 'hi';

    // यदि सुपर एडमिन ने किसी कॉलेज का "A-to-Z Deep Control" खोला है
    if (deepControlCollegeIdx !== null) {
        return renderDeepCollegeControlPanel(deepControlCollegeIdx);
    }

    const editCol = editingCollegeIdx !== null ? registeredColleges[editingCollegeIdx] : null;
    const baseUrl = window.location.origin + window.location.pathname;

    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- नया कॉलेज प्रोफ़ाइल व कस्टम URL क्रिएटर -->
            <div class="glass-panel p-6 rounded-2xl border ${editCol ? 'border-amber-500/50' : 'border-purple-500/40'} h-fit">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-extrabold text-lg ${editCol ? 'text-amber-400' : 'text-purple-400'}">
                        ${editCol ? (isHi ? '✏️ कॉलेज प्रोफ़ाइल एडिट करें' : '✏️ Edit College Profile') : (isHi ? '🏫 नया कॉलेज व कस्टम URL बनाएं' : '🏫 Create College & Custom URL')}
                    </h3>
                    ${editCol ? `<button onclick="editingCollegeIdx=null; renderApp()" class="text-xs text-rose-400 underline">Cancel</button>` : ''}
                </div>

                <form onsubmit="saveCollegeProfile(event)" class="space-y-3 text-sm">
                    <div>
                        <label class="text-[11px] font-bold text-slate-400">${isHi ? 'संस्थान / कॉलेज का नाम *' : 'College / School Name *'}</label>
                        <input type="text" id="col-name" required value="${editCol ? editCol.name : ''}" placeholder="e.g. Sunrise Degree College" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900">
                    </div>

                    <div>
                        <label class="text-[11px] font-bold text-indigo-400">${isHi ? 'कस्टम URL स्लग (अंग्रेज़ी छोटे अक्षर) *' : 'Custom URL Slug *'}</label>
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
                            <label class="text-[11px] font-bold text-emerald-400">${isHi ? 'प्लान चुनें (Auto-Features) *' : 'Select Plan (Auto-Features) *'}</label>
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
                            <label class="text-[11px] text-slate-400">${isHi ? 'प्रिंसिपल Admin ID *' : 'Admin Username *'}</label>
                            <input type="text" id="col-admin-user" required value="${editCol ? editCol.adminUser : 'admin'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-400">${isHi ? 'पासवर्ड *' : 'Admin Password *'}</label>
                            <input type="text" id="col-admin-pass" required value="${editCol ? editCol.adminPass : '123'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                    </div>

                    <div>
                        <label class="text-[11px] text-slate-400">${isHi ? 'संस्थान के कस्टम पद (कॉमा से अलग लिखें)' : 'Default Custom Posts (Comma separated)'}</label>
                        <input type="text" id="col-posts" value="${editCol && editCol.customPosts ? editCol.customPosts.join(', ') : 'Vice Principal, Office Clerk, Teacher, Accountant, Librarian'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs">
                    </div>

                    <div>
                        <label class="text-[11px] text-slate-400">${isHi ? 'कॉलेज लोगो अपलोड करें' : 'Upload College Logo'}</label>
                        <input type="file" id="col-logo-file" accept="image/*" class="w-full mt-1 text-xs">
                    </div>

                    <div class="text-[11px] font-bold text-slate-400 pt-1">${isHi ? 'सक्रिय मॉड्यूल (प्लान से ऑटो-सेट, आप बदल भी सकते हैं):' : 'Active Modules (Auto-set by plan, customizable):'}</div>
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
                        ${editCol ? (isHi ? '💾 बदलाव सेव करें' : '💾 Update College') : (isHi ? '🚀 कस्टम कॉलेज लिंक तैयार करें' : '🚀 Generate Custom College URL')}
                    </button>
                </form>
            </div>

            <!-- पंजीकृत कॉलेजों की सूची -->
            <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 class="font-bold text-lg">${isHi ? '🏫 पंजीकृत कॉलेज व A-to-Z मास्टर कंट्रोल' : '🏫 Registered Colleges & A-to-Z Control'} (${registeredColleges.length})</h3>
                ${registeredColleges.map((c, idx) => {
                    const customLink = `${baseUrl}?college=${c.slug}`;
                    return `
                        <div class="p-4 rounded-2xl border ${c.active ? 'border-slate-800 bg-slate-900/50' : 'border-rose-500/40 bg-rose-950/20'} space-y-2.5">
                            <div class="flex flex-wrap justify-between items-start gap-2">
                                <div class="flex items-center gap-3">
                                    <div class="w-11 h-11 rounded-xl bg-indigo-600/20 flex items-center justify-center text-xl overflow-hidden shrink-0">
                                        ${c.logo ? `<img src="${c.logo}" class="w-full h-full object-cover">` : '🏫'}
                                    </div>
                                    <div>
                                        <div class="font-bold text-base">${c.name}</div>
                                        <div class="text-xs text-slate-400">${c.city} • <span class="text-indigo-400 font-semibold">${c.plan}</span></div>
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                                    ${c.active ? '● Active' : '✖ Suspended'}
                                </span>
                            </div>

                            <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                                <a href="?college=${c.slug}" target="_blank" class="text-cyan-400 font-mono truncate hover:underline">${customLink}</a>
                                <button onclick="navigator.clipboard.writeText('${customLink}'); alert('URL Copied!')" class="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0">📋 Copy URL</button>
                            </div>

                            <div class="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
                                <span class="text-slate-400">Admin: <strong class="text-emerald-400">${c.adminUser}</strong> | Pass: <strong class="text-amber-400">${c.adminPass}</strong></span>
                                <div class="flex flex-wrap gap-1.5">
                                    <button onclick="deepControlCollegeIdx=${idx}; renderApp()" class="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-extrabold shadow">
                                        🛠️ ${isHi ? 'A-to-Z अंदरूनी कंट्रोल' : 'A-to-Z Deep Control'}
                                    </button>
                                    <button onclick="editingCollegeIdx=${idx}; renderApp()" class="bg-amber-500/20 text-amber-300 px-2.5 py-1.5 rounded-lg font-bold">✏️ Edit</button>
                                    <button onclick="registeredColleges[${idx}].active=!registeredColleges[${idx}].active; saveCollegesDB(); renderApp()" class="bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg font-bold">
                                        ${c.active ? 'Suspend' : 'Activate'}
                                    </button>
                                    ${c.slug !== 'adarsh' ? `<button onclick="registeredColleges.splice(${idx},1); saveCollegesDB(); renderApp()" class="bg-rose-500/20 text-rose-400 px-2 py-1.5 rounded-lg font-bold">🗑️</button>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// =========================================================================
// सुपर एडमिन का A-to-Z डीप कंट्रोल पैनल (किसी भी कॉलेज के पद, यूज़र व डेटा बदलने के लिए)
// =========================================================================
function renderDeepCollegeControlPanel(colIdx) {
    const isHi = currentLang === 'hi';
    const col = registeredColleges[colIdx];
    const colPrefix = `vs_data_${col.slug}_`;
    const colUsers = JSON.parse(localStorage.getItem(colPrefix + 'users')) || defaultUsers;
    const posts = col.customPosts || ["Vice Principal", "Office Clerk", "Teacher", "Accountant", "Librarian"];

    return `
        <div class="space-y-6 tab-transition">
            <!-- टॉप बैक बार -->
            <div class="glass-panel p-5 rounded-2xl border border-cyan-500/40 flex flex-wrap justify-between items-center gap-3">
                <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">Super Admin A-to-Z Deep Control</span>
                    <h2 class="text-xl font-black">${col.name} <span class="text-xs text-slate-400 font-normal">(?college=${col.slug})</span></h2>
                </div>
                <button onclick="deepControlCollegeIdx=null; renderApp()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold">
                    ← ${isHi ? 'सभी कॉलेजों की सूची पर लौटें' : 'Back to Colleges List'}
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- 1. इस कॉलेज के कस्टम पद (Custom Posts) प्रबंधन -->
                <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 class="font-bold text-base text-purple-400">${isHi ? '🏷️ इस संस्थान के कस्टम पद (Custom Posts)' : '🏷️ Custom Staff Posts / Designations'}</h3>
                    <p class="text-xs text-slate-400">${isHi ? 'यहाँ जो पद जोड़ेंगे, वही इस कॉलेज के यूज़र बनाते समय ड्रॉपडाउन में दिखेंगे' : 'These posts will appear in the dropdown when creating staff logins for this institute'}</p>
                    
                    <form onsubmit="superAddCustomPost(event, ${colIdx})" class="flex gap-2">
                        <input type="text" id="super-new-post" required placeholder="${isHi ? 'नया पद लिखें (जैसे: Exam Controller)' : 'New post name (e.g. Bus Incharge)'}" class="flex-1 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs">
                        <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Add</button>
                    </form>

                    <div class="flex flex-wrap gap-2 pt-2">
                        ${posts.map((p, pIdx) => `
                            <span class="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                                ${p}
                                <button onclick="superDeleteCustomPost(${colIdx}, ${pIdx})" class="text-rose-400 hover:text-rose-300">✖</button>
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- 2. इस कॉलेज के अंदर नया स्टाफ यूज़र बनाएं या हटाएं -->
                <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 class="font-bold text-base text-emerald-400">${isHi ? '🔐 इस कॉलेज का नया स्टाफ यूज़र बनाएं' : '🔐 Create Staff User Inside This College'}</h3>
                    <form onsubmit="superCreateCollegeUser(event, ${colIdx})" class="space-y-2.5 text-xs">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="sc-name" required placeholder="Staff Name *" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                            <select id="sc-post" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 font-bold text-indigo-300">
                                ${posts.map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="sc-user" required placeholder="Username *" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                            <input type="text" id="sc-pass" required placeholder="Password *" class="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900">
                        </div>
                        <div class="grid grid-cols-3 gap-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-dash" checked> Dashboard</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-stu"> Admission</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-fee"> Fees</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-pay"> Payroll</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-acc"> Accounts</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-lib"> Library</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-not" checked> Notices</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-att"> Attendance</label>
                            <label class="flex items-center gap-1"><input type="checkbox" id="scp-exm"> Exams</label>
                        </div>
                        <button type="submit" class="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl">✅ Add Staff User to ${col.slug}</button>
                    </form>
                </div>
            </div>

            <!-- 3. इस कॉलेज के सभी मौजूदा स्टाफ यूज़र्स की सूची -->
            <div class="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-base mb-3">${isHi ? `👥 ${col.name} के सक्रिय स्टाफ लॉगिन (${colUsers.length})` : `👥 Active Staff Logins in ${col.name} (${colUsers.length})`}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${colUsers.map((u, uIdx) => `
                        <div class="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs">
                            <div>
                                <div class="font-bold text-sm">${u.name} <span class="text-indigo-400">(${u.roleLabel})</span></div>
                                <div class="text-slate-400 mt-0.5">ID: <strong class="text-emerald-400">${u.username}</strong> | Pass: <strong class="text-amber-400">${u.password}</strong></div>
                            </div>
                            <button onclick="superDeleteCollegeUser(${colIdx}, ${uIdx})" class="bg-rose-500/20 text-rose-400 px-2.5 py-1.5 rounded-lg font-bold">🗑️</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function superAddCustomPost(e, colIdx) {
    e.preventDefault();
    const val = document.getElementById('super-new-post').value.trim();
    if (!val) return;
    if (!registeredColleges[colIdx].customPosts) registeredColleges[colIdx].customPosts = [];
    if (!registeredColleges[colIdx].customPosts.includes(val)) {
        registeredColleges[colIdx].customPosts.push(val);
        saveCollegesDB();
    }
    renderApp();
}

function superDeleteCustomPost(colIdx, pIdx) {
    registeredColleges[colIdx].customPosts.splice(pIdx, 1);
    saveCollegesDB();
    renderApp();
}

function superCreateCollegeUser(e, colIdx) {
    e.preventDefault();
    const col = registeredColleges[colIdx];
    const colPrefix = `vs_data_${col.slug}_`;
    let colUsers = JSON.parse(localStorage.getItem(colPrefix + 'users')) || defaultUsers;

    colUsers.unshift({
        id: "USR" + Date.now(),
        name: document.getElementById('sc-name').value.trim(),
        roleLabel: document.getElementById('sc-post').value,
        username: document.getElementById('sc-user').value.trim(),
        password: document.getElementById('sc-pass').value.trim(),
        powers: {
            dashboard: document.getElementById('scp-dash').checked,
            students: document.getElementById('scp-stu').checked,
            fees: document.getElementById('scp-fee').checked,
            payroll: document.getElementById('scp-pay').checked,
            accounts: document.getElementById('scp-acc').checked,
            library: document.getElementById('scp-lib').checked,
            notices: document.getElementById('scp-not').checked,
            attendance: document.getElementById('scp-att').checked,
            exams: document.getElementById('scp-exm').checked
        }
    });

    localStorage.setItem(colPrefix + 'users', JSON.stringify(colUsers));
    renderApp();
}

function superDeleteCollegeUser(colIdx, uIdx) {
    const col = registeredColleges[colIdx];
    const colPrefix = `vs_data_${col.slug}_`;
    let colUsers = JSON.parse(localStorage.getItem(colPrefix + 'users')) || defaultUsers;
    colUsers.splice(uIdx, 1);
    localStorage.setItem(colPrefix + 'users', JSON.stringify(colUsers));
    renderApp();
}

function saveCollegeProfile(e) {
    e.preventDefault();
    const rawSlug = document.getElementById('col-slug').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!rawSlug) { alert("Please enter a valid URL slug!"); return; }

    const postsRaw = document.getElementById('col-posts').value;
    const postsArr = postsRaw.split(',').map(s => s.trim()).filter(Boolean);

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
            customPosts: postsArr.length > 0 ? postsArr : ["Vice Principal", "Office Clerk", "Teacher"],
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

// 2. Leads Inbox
function renderSubscriptionLeadsInbox() {
    const isHi = currentLang === 'hi';
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];

    return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-5">
                <div>
                    <h3 class="font-extrabold text-xl text-emerald-400">${isHi ? '📩 नया सब्स्क्रिप्शन व इंक्वायरी डेटा' : '📩 Subscription & Demo Requests Inbox'}</h3>
                    <p class="text-xs text-slate-400 mt-0.5">${isHi ? 'मुख्य होमपेज से प्राप्त सभी आवेदनों की सूची' : 'All institute inquiries submitted from the home page'}</p>
                </div>
                <span class="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold">${leads.length} Leads</span>
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
                                ${l.note ? `<div class="text-slate-400 italic">"${l.note}"</div>` : ''}
                            </div>
                            <div class="pt-2 flex gap-2">
                                <a href="https://wa.me/91${l.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Namaste ${l.personName}, thank you for requesting VidyaSetu ERP (${l.plan}) for ${l.orgName}.`)}" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                    💬 WhatsApp
                                </a>
                                <button onclick="quickConvertLeadToCollege(${idx})" class="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                    ⚡ Create College URL
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