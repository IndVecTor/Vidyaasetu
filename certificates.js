// =========================================================================
// VidyaSetu Official Certificates & Admit Card Generator (certificates.js)
// =========================================================================

function renderCertificatesModule() {
    const isHi = currentLang === 'hi';

    return `
        <div class="space-y-6">
            <div class="glass-panel p-6 rounded-3xl">
                <div class="mb-5">
                    <h3 class="font-extrabold text-xl adaptive-title">📜 ${isHi ? 'आधिकारिक प्रमाण पत्र व प्रवेश पत्र जनरेटर' : 'Official TC, Character Certificate & Admit Card Generator'}</h3>
                    <p class="text-xs adaptive-sub">${isHi ? 'किसी भी छात्र के सामने बटन दबाएं — आपके संस्थान के लोगो और डिजिटल मुहर के साथ प्रिंट-रेडी डॉक्यूमेंट तैयार हो जाएगा' : 'Generate print-ready documents with your Institute Logo & Official Digital Stamp'}</p>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-300/40 dark:border-slate-800 adaptive-sub text-xs">
                                <th class="py-2.5">Roll & Student Name</th>
                                <th class="py-2.5">Father Name & Class</th>
                                <th class="py-2.5">Generate Official Print Document</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map((s, idx) => `
                                <tr class="border-b border-slate-300/30 dark:border-slate-800/60">
                                    <td class="py-3.5 font-bold adaptive-title">${s.roll} • ${s.name}</td>
                                    <td class="py-3.5 text-xs adaptive-sub">${s.father} • <strong>${s.class}</strong></td>
                                    <td class="py-3.5 flex flex-wrap gap-2">
                                        <button onclick="generateAdmitCard(${idx})" class="super-btn bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">🎫 Admit Card</button>
                                        <button onclick="generateTransferCertificate(${idx})" class="super-btn bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">📄 Transfer Certificate (TC)</button>
                                        <button onclick="generateCharacterCertificate(${idx})" class="super-btn bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">🏅 Character Certificate</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="cert-print-preview"></div>
        </div>
    `;
}

function generateAdmitCard(idx) {
    const s = students[idx];
    const html = `
        <div class="bg-white text-slate-900 p-7 rounded-2xl border-2 border-slate-900 max-w-2xl mx-auto shadow-2xl">
            ${getOfficialPrintHeaderHTML("EXAMINATION ADMIT CARD")}
            <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-300 mb-4">
                <div><strong>Candidate Name:</strong> ${s.name}</div>
                <div><strong>Roll Number:</strong> <span class="text-sm font-black text-indigo-800">${s.roll}</span></div>
                <div><strong>Father's Name:</strong> ${s.father}</div>
                <div><strong>Class / Course:</strong> ${s.class}</div>
                <div><strong>Exam Center:</strong> ${orgName} Main Campus</div>
                <div><strong>Reporting Time:</strong> 09:30 AM Sharp</div>
            </div>
            <table class="w-full border border-slate-900 text-xs mb-4">
                <tr class="bg-slate-200 border-b border-slate-900"><th class="p-2 text-left">Subject</th><th class="p-2 text-left">Exam Date</th><th class="p-2 text-left">Shift</th></tr>
                <tr class="border-b"><td class="p-2 font-bold">Hindi / Language</td><td class="p-2">10 Dec 2026</td><td class="p-2">Morning (10 AM - 1 PM)</td></tr>
                <tr class="border-b"><td class="p-2 font-bold">English</td><td class="p-2">12 Dec 2026</td><td class="p-2">Morning (10 AM - 1 PM)</td></tr>
                <tr class="border-b"><td class="p-2 font-bold">Mathematics</td><td class="p-2">14 Dec 2026</td><td class="p-2">Morning (10 AM - 1 PM)</td></tr>
                <tr><td class="p-2 font-bold">Science / Core Subject</td><td class="p-2">16 Dec 2026</td><td class="p-2">Morning (10 AM - 1 PM)</td></tr>
            </table>
            ${getOfficialPrintStampHTML("Candidate Signature", "Controller of Exams / Principal")}
        </div>
    `;
    renderCertPreviewBox(html);
}

function generateTransferCertificate(idx) {
    const s = students[idx];
    const tcNo = "TC-" + Math.floor(1000 + Math.random() * 9000);
    const html = `
        <div class="bg-white text-slate-900 p-8 rounded-2xl border-2 border-slate-900 max-w-2xl mx-auto shadow-2xl">
            ${getOfficialPrintHeaderHTML("TRANSFER CERTIFICATE (T.C.)")}
            <div class="flex justify-between text-xs font-bold mb-4">
                <span>TC Serial No: ${tcNo}</span>
                <span>Student ID: ${s.id}</span>
                <span>Issue Date: ${new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <div class="space-y-2.5 text-xs sm:text-sm leading-relaxed border border-slate-300 p-5 rounded-xl bg-slate-50">
                <p>1. Name of Student: <strong>${s.name}</strong></p>
                <p>2. Father's / Guardian's Name: <strong>${s.father}</strong></p>
                <p>3. Class in which studying: <strong>${s.class}</strong> (Roll No: <strong>${s.roll}</strong>)</p>
                <p>4. Whether all institute dues/fees have been cleared: <strong>${s.totalFee - s.paidFee <= 0 ? 'Yes, Fully Cleared' : 'Pending'}</strong></p>
                <p>5. General Conduct & Behaviour: <strong>Good / Satisfactory</strong></p>
                <p>6. Reason for leaving the institution: <strong>On Guardian's Request / Higher Studies</strong></p>
            </div>
            ${getOfficialPrintStampHTML("Prepared By (Clerk)", "Principal Signature & Seal")}
        </div>
    `;
    renderCertPreviewBox(html);
}

function generateCharacterCertificate(idx) {
    const s = students[idx];
    const html = `
        <div class="bg-white text-slate-900 p-8 rounded-2xl border-4 border-double border-slate-900 max-w-2xl mx-auto shadow-2xl">
            ${getOfficialPrintHeaderHTML("CHARACTER CERTIFICATE")}
            <div class="my-6 text-sm leading-loose text-justify px-2">
                This is to certify that <strong>${s.name}</strong>, Son/Daughter of <strong>Shri ${s.father}</strong>, has been a bonafide regular student of this institution in <strong>${s.class}</strong> (Roll No: <strong>${s.roll}</strong>) during the academic session <strong>2026-27</strong>.
                <br><br>
                To the best of my knowledge and institutional records, he/she bears a <strong>Good Moral Character</strong> and has not taken part in any activity subversive to discipline. I wish him/her every success in future endeavors.
            </div>
            ${getOfficialPrintStampHTML("Date: " + new Date().toLocaleDateString('en-IN'), "Principal / Head of Institution")}
        </div>
    `;
    renderCertPreviewBox(html);
}

function renderCertPreviewBox(html) {
    document.getElementById('print-only-container').innerHTML = html;
    document.getElementById('cert-print-preview').innerHTML = `
        <div class="space-y-4 tab-transition">
            ${html}
            <div class="no-print text-center flex justify-center gap-3">
                <button onclick="window.print()" class="super-btn bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-lg">🖨️ Print Official Document</button>
                <button onclick="document.getElementById('cert-print-preview').innerHTML=''" class="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold">Close</button>
            </div>
        </div>
    `;
    document.getElementById('cert-print-preview').scrollIntoView({ behavior: 'smooth' });
}