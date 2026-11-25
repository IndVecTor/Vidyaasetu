// =========================================================================
// VidyaSetu White-Label Self-Branding, Stamp/Signature & Backup (branding.js)
// =========================================================================

// सभी प्रिंट होने वाली रसीदों, मार्कशीट और सर्टिफिकेट के लिए संस्थान का आधिकारिक हेडर व मुहर
function getOfficialPrintHeaderHTML(docTitle) {
    const cityText = currentCollege ? currentCollege.city : "India";
    const tagline = (currentCollege && currentCollege.tagline) ? currentCollege.tagline : "Excellence in Education & Administration";
    const phoneText = (currentCollege && currentCollege.phone) ? ` • Ph: ${currentCollege.phone}` : "";
    const logoHtml = orgLogo
        ? `<img src="${orgLogo}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm">`
        : `<div class="w-16 h-16 rounded-xl bg-indigo-900 text-white flex items-center justify-center text-3xl font-bold">🏫</div>`;

    return `
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
            <div class="flex items-center gap-3.5">
                ${logoHtml}
                <div>
                    <div class="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">${tagline}</div>
                    <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">${orgName}</h2>
                    <p class="text-xs text-slate-600">${cityText}${phoneText}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="bg-slate-900 text-white px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wider">${docTitle}</div>
                <div class="text-[11px] text-slate-600 mt-1">Session: <strong>2026-27</strong></div>
            </div>
        </div>
    `;
}

function getOfficialPrintStampHTML(leftLabel = "Receiver / Student Sign", rightLabel = "Principal / Authorized Sign") {
    const stampImg = (currentCollege && currentCollege.stamp)
        ? `<img src="${currentCollege.stamp}" class="h-14 mx-auto object-contain mb-1">`
        : `<div class="h-10"></div>`;

    return `
        <div class="flex justify-between items-end mt-8 pt-4 border-t border-dashed border-slate-400 text-[11px] text-slate-700">
            <div>
                <div class="h-10"></div>
                <div class="border-t border-slate-600 pt-1 px-3">${leftLabel}</div>
            </div>
            <div class="text-center">
                ${stampImg}
                <div class="font-bold text-slate-900 border-t border-slate-900 pt-1 px-4">${rightLabel}</div>
            </div>
        </div>
        <div class="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400">
            <span>Digitally Verified Document • ${orgName}</span>
            <span>Technology Partner: <strong>VidyaSetu Cloud</strong></span>
        </div>
    `;
}

// संस्थान के एडमिन के लिए अपना Logo, Stamp, पता व Full Backup/Restore करने का डैशबोर्ड
function renderInstituteBrandingModule() {
    const isHi = currentLang === 'hi';
    const col = currentCollege || {};

    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- 1. White-Label Logo, Stamp & Institute Details -->
                <div class="glass-panel p-6 rounded-3xl space-y-4">
                    <div>
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">100% White-Label Branding</span>
                        <h3 class="font-extrabold text-xl adaptive-title">${isHi ? '🎨 अपने संस्थान का लोगो, मुहर और विवरण सेट करें' : '🎨 Institute Logo, Stamp & Print Header'}</h3>
                        <p class="text-xs adaptive-sub mt-0.5">${isHi ? 'यहाँ अपलोड किया गया लोगो और डिजिटल मुहर आपकी हर रसीद, सैलरी स्लिप, मार्कशीट और सर्टिफिकेट पर छपेगी।' : 'Your uploaded Logo & Digital Stamp will automatically appear on every Receipt, Salary Slip, Marksheet & Certificate.'}</p>
                    </div>

                    <form onsubmit="saveInstituteSelfBranding(event)" class="space-y-3 text-xs sm:text-sm">
                        <div>
                            <label class="text-[11px] font-bold adaptive-sub">${isHi ? 'संस्थान का नाम (Print Header Name)' : 'Institute Name'}</label>
                            <input type="text" id="sb-name" required value="${col.name || orgName}" class="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent font-bold">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[11px] font-bold adaptive-sub">${isHi ? 'टैगलाइन / एफिलिएशन' : 'Tagline / Affiliation'}</label>
                                <input type="text" id="sb-tagline" value="${col.tagline || ''}" placeholder="Affiliated to UP Board / CBSE" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                            </div>
                            <div>
                                <label class="text-[11px] font-bold adaptive-sub">${isHi ? 'संपर्क मोबाइल नं.' : 'Office Contact No.'}</label>
                                <input type="text" id="sb-phone" value="${col.phone || ''}" placeholder="9876543210" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="text-[11px] font-bold adaptive-sub">${isHi ? 'पूरा पता (Address)' : 'Full Address'}</label>
                            <input type="text" id="sb-city" value="${col.city || ''}" placeholder="City, District, State" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div class="p-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
                                <label class="text-[11px] font-extrabold text-indigo-400 block mb-1">🏫 ${isHi ? 'संस्थान का लोगो (Logo)' : 'Upload Institute Logo'}</label>
                                <input type="file" id="sb-logo-input" accept="image/*" class="w-full text-xs">
                                ${col.logo ? `<img src="${col.logo}" class="w-14 h-14 object-cover rounded-xl mt-2 border">` : ''}
                            </div>
                            <div class="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                                <label class="text-[11px] font-extrabold text-emerald-400 block mb-1">✍️ ${isHi ? 'डिजिटल मुहर व हस्ताक्षर (Stamp)' : 'Upload Stamp / Signature'}</label>
                                <input type="file" id="sb-stamp-input" accept="image/*" class="w-full text-xs">
                                ${col.stamp ? `<img src="${col.stamp}" class="h-14 object-contain mt-2 bg-white rounded-lg p-1">` : ''}
                            </div>
                        </div>

                        <button type="submit" class="super-btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold py-3 rounded-xl shadow-lg">
                            💾 ${isHi ? 'अपना लोगो और मुहर सेव करें' : 'Save White-Label Branding'}
                        </button>
                    </form>
                </div>

                <!-- 2. Live Print Preview + Full JSON Data Backup & Restore -->
                <div class="space-y-6">
                    <div class="glass-panel p-6 rounded-3xl">
                        <h4 class="font-bold text-sm text-cyan-400 mb-3">👁️ ${isHi ? 'लाइव रसीद हेडर व मुहर प्रीव्यू' : 'Live Print Header & Stamp Preview'}</h4>
                        <div class="bg-white text-slate-900 p-4 rounded-2xl border-2 border-slate-800 shadow">
                            ${getOfficialPrintHeaderHTML("SAMPLE PREVIEW")}
                            ${getOfficialPrintStampHTML("Student / Receiver", "Principal / Authorized Sign")}
                        </div>
                    </div>

                    <!-- One-Click Full JSON Backup & Restore -->
                    <div class="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-3">
                        <h4 class="font-extrabold text-base text-amber-400">🛡️ ${isHi ? 'डेटा सुरक्षा कवच (Full Backup & Restore)' : 'Data Protection: Full Backup & Restore'}</h4>
                        <p class="text-xs adaptive-sub">${isHi ? 'अपने पूरे संस्थान (छात्र, फीस, स्टाफ, रसीदें) का बैकअप फ़ाइल डाउनलोड करें या पुराने बैकअप से डेटा वापस लाएं।' : 'Download a complete backup file of your institute or restore from a previous backup.'}</p>
                        <div class="flex flex-wrap gap-3 pt-1">
                            <button onclick="downloadFullInstituteBackup()" class="super-btn flex-1 bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-xs font-extrabold">
                                💾 ${isHi ? 'पूरा डेटा बैकअप डाउनलोड (.json)' : 'Download Full Backup (.json)'}
                            </button>
                            <label class="super-btn flex-1 bg-amber-600 text-white py-2.5 px-4 rounded-xl text-xs font-extrabold text-center cursor-pointer">
                                📤 ${isHi ? 'बैकअप रीस्टोर करें' : 'Restore Backup File'}
                                <input type="file" accept=".json" onchange="restoreFullInstituteBackup(event)" class="hidden">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function saveInstituteSelfBranding(e) {
    e.preventDefault();
    if (!currentCollege) return;

    const newName = document.getElementById('sb-name').value.trim();
    const newTagline = document.getElementById('sb-tagline').value.trim();
    const newPhone = document.getElementById('sb-phone').value.trim();
    const newCity = document.getElementById('sb-city').value.trim();

    const logoFile = document.getElementById('sb-logo-input').files[0];
    const stampFile = document.getElementById('sb-stamp-input').files[0];

    const readAsDataURL = (file) => new Promise((resolve) => {
        if (!file) return resolve(null);
        const r = new FileReader();
        r.onload = ev => resolve(ev.target.result);
        r.readAsDataURL(file);
    });

    Promise.all([readAsDataURL(logoFile), readAsDataURL(stampFile)]).then(([logoData, stampData]) => {
        currentCollege.name = newName || currentCollege.name;
        currentCollege.tagline = newTagline;
        currentCollege.phone = newPhone;
        currentCollege.city = newCity || currentCollege.city;
        if (logoData) currentCollege.logo = logoData;
        if (stampData) currentCollege.stamp = stampData;

        orgName = currentCollege.name;
        orgLogo = currentCollege.logo || "";

        let allCols = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
        const cIdx = allCols.findIndex(c => c.slug === currentCollege.slug);
        if (cIdx !== -1) {
            allCols[cIdx] = currentCollege;
            localStorage.setItem('vs_colleges_db', JSON.stringify(allCols));
        }

        document.getElementById('topbar-org-title').innerText = orgName;
        if (orgLogo) document.getElementById('topbar-logo-box').innerHTML = `<img src="${orgLogo}" class="w-full h-full object-cover">`;

        alert(currentLang === 'hi' ? "✅ आपके संस्थान का लोगो, मुहर और विवरण हर रसीद व स्लिप पर अपडेट हो गया है!" : "✅ Institute Logo, Stamp & Branding saved across all receipts & slips!");
        renderApp();
    });
}

function downloadFullInstituteBackup() {
    const backupPayload = {
        institute: currentCollege,
        students: students,
        staff: typeof staffList !== 'undefined' ? staffList : [],
        expenses: expenses,
        notices: notices,
        library: typeof libSeatsPro !== 'undefined' ? libSeatsPro : [],
        coaching: typeof coachingBatches !== 'undefined' ? coachingBatches : [],
        gym: typeof gymMembersList !== 'undefined' ? gymMembersList : [],
        complab: typeof labPCList !== 'undefined' ? labPCList : [],
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${orgName.replace(/\s+/g, '_')}_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

function restoreFullInstituteBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.students) { students = data.students; saveData(); }
            if (data.expenses) { expenses = data.expenses; saveData(); }
            if (data.notices) { notices = data.notices; saveData(); }
            if (data.staff && typeof saveStaffData === 'function') { staffList = data.staff; saveStaffData(); }
            if (data.library && typeof saveLibraryProData === 'function') { libSeatsPro = data.library; saveLibraryProData(); }
            if (data.coaching && typeof saveCoachingProData === 'function') { coachingBatches = data.coaching; saveCoachingProData(); }
            if (data.gym && typeof saveGymProData === 'function') { gymMembersList = data.gym; saveGymProData(); }
            if (data.complab && typeof saveCompLabProData === 'function') { labPCList = data.complab; saveCompLabProData(); }
            alert("✅ Full Institute Data Restored Successfully!");
            renderApp();
        } catch (err) {
            alert("❌ Invalid Backup File!");
        }
    };
    reader.readAsText(file);
}