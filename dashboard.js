// =========================================================
// हाई-टेक विज़ुअल डैशबोर्ड मॉड्यूल (dashboard.js)
// =========================================================

function renderHighTechDashboard() {
    const totalStudents = students.length;
    const totalExpected = students.reduce((s, x) => s + Number(x.totalFee), 0);
    const totalCollected = students.reduce((s, x) => s + Number(x.paidFee), 0);
    const totalDue = totalExpected - totalCollected;
    const feePercent = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    const totalExpense = expenses.reduce((s, x) => s + Number(x.amount), 0);
    const netProfit = totalCollected - totalExpense;

    const presentStudents = students.filter(s => s.attendance === "उपस्थित").length;
    const attPercent = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

    const bookedSeats = librarySeats.filter(s => s.status === 'booked').length;
    const seatPercent = Math.round((bookedSeats / librarySeats.length) * 100);

    return `
        <!-- टॉप वेलकम हीरो बैनर -->
        <div class="stagger-1 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-6 sm:p-8 text-white shadow-2xl mb-6">
            <div class="relative z-10 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <span class="inline-block bg-white/20 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                        ✨ लाइव कमांड सेंटर • सत्र 2026-27
                    </span>
                    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        स्वागत है, ${loggedUser.name}
                    </h1>
                    <p class="text-xs sm:text-sm text-indigo-100 mt-1">
                        ${orgName} का रियल-टाइम प्रदर्शन, वित्तीय स्थिति और दैनिक गतिविधि
                    </p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="exportCSV()" class="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition transform hover:scale-105">
                        📥 Excel रिपोर्ट डाउनलोड
                    </button>
                </div>
            </div>
            <!-- सजावटी गोले -->
            <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <!-- 4 मुख्य विज़ुअल मेट्रिक कार्ड्स (Animated Staggered Cards) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- कार्ड 1: छात्र व उपस्थिति -->
            <div class="stagger-1 glass-panel p-5 rounded-2xl border border-indigo-500/25">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">कुल छात्र एवं हाज़िरी</span>
                    <span class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">👨‍🎓</span>
                </div>
                <div class="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">${totalStudents} <span class="text-xs font-semibold text-emerald-400">(${attPercent}% आज उपस्थित)</span></div>
                <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div class="animate-bar bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style="width: ${attPercent}%"></div>
                </div>
            </div>

            <!-- कार्ड 2: कुल जमा फीस -->
            <div class="stagger-2 glass-panel p-5 rounded-2xl border border-emerald-500/25">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">कुल फीस संग्रह</span>
                    <span class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">💰</span>
                </div>
                <div class="text-3xl font-extrabold mt-2 text-emerald-400">₹${totalCollected.toLocaleString('hi-IN')}</div>
                <div class="flex justify-between text-[11px] text-slate-400 mt-2">
                    <span>वसूली: ${feePercent}%</span>
                    <span class="text-rose-400 font-semibold">बकाया: ₹${totalDue.toLocaleString('hi-IN')}</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div class="animate-bar bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style="width: ${feePercent}%"></div>
                </div>
            </div>

            <!-- कार्ड 3: शुद्ध मुनाफा (Net Balance) -->
            <div class="stagger-3 glass-panel p-5 rounded-2xl border border-cyan-500/25">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">शुद्ध बचत (Net Profit)</span>
                    <span class="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg">📈</span>
                </div>
                <div class="text-3xl font-extrabold mt-2 ${netProfit >= 0 ? 'text-cyan-400' : 'text-rose-400'}">₹${netProfit.toLocaleString('hi-IN')}</div>
                <div class="text-[11px] text-slate-400 mt-3">
                    कुल खर्च: <span class="text-rose-400 font-bold">₹${totalExpense.toLocaleString('hi-IN')}</span>
                </div>
            </div>

            <!-- कार्ड 4: लाइब्रेरी सीट मीटर -->
            <div class="stagger-4 glass-panel p-5 rounded-2xl border border-amber-500/25">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">लाइब्रेरी सीट बुकिंग</span>
                    <span class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">🪑</span>
                </div>
                <div class="text-3xl font-extrabold mt-2 text-amber-400">${bookedSeats} <span class="text-sm text-slate-400">/ ${librarySeats.length}</span></div>
                <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div class="animate-bar bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style="width: ${seatPercent}%"></div>
                </div>
            </div>
        </div>

        <!-- मध्य भाग: वित्तीय तुलना चार्ट + नवीनतम नोटिस बोर्ड -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- बायां 2 कॉलम: त्वरित एक्शन व बकाया फीस अलर्ट -->
            <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 class="font-bold text-base mb-4 flex items-center gap-2">
                    <span>⚡</span> त्वरित कार्य एवं बकाया फीस सूची
                </h3>
                <div class="space-y-3">
                    ${students.filter(s => s.totalFee - s.paidFee > 0).map((s, idx) => {
                        const due = s.totalFee - s.paidFee;
                        const realIdx = students.findIndex(st => st.id === s.id);
                        return `
                            <div class="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex flex-wrap justify-between items-center gap-2">
                                <div>
                                    <div class="font-bold text-sm">${s.name} <span class="text-xs text-slate-400">(${s.class})</span></div>
                                    <div class="text-xs text-rose-400 font-semibold">बकाया शुल्क: ₹${due.toLocaleString('hi-IN')}</div>
                                </div>
                                <button onclick="sendWhatsAppReminder(${realIdx})" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                    💬 WhatsApp रिमाइंडर भेजें
                                </button>
                            </div>
                        `;
                    }).join('') || '<p class="text-xs text-emerald-400">🎉 सभी छात्रों की फीस पूरी तरह जमा है!</p>'}
                </div>
            </div>

            <!-- दायां 1 कॉलम: लाइव नोटिस बोर्ड -->
            <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 class="font-bold text-base mb-4 flex items-center gap-2">
                    <span>📢</span> ताज़ा सूचना पट्ट
                </h3>
                <div class="space-y-3">
                    ${notices.map(n => `
                        <div class="p-3.5 rounded-xl bg-amber-500/10 border-l-4 ${n.urgent ? 'border-rose-500' : 'border-amber-500'}">
                            <div class="text-[10px] text-slate-400">${n.date}</div>
                            <div class="font-bold text-xs mt-0.5">${n.title}</div>
                            <p class="text-[11px] text-slate-500 dark:text-slate-300 mt-1">${n.body}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}