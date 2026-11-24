// =========================================================================
// VidyaSetu Super Admin Analytics Dashboard Module (superanalytics.js)
// =========================================================================

function renderSuperAnalyticsDashboard() {
    const isHi = currentLang === 'hi';
    const allColleges = JSON.parse(localStorage.getItem('vs_colleges_db')) || defaultColleges;
    const allLeads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];

    const activeCols = allColleges.filter(c => c.active).length;
    const suspendedCols = allColleges.length - activeCols;

    // राजस्व (Revenue) गणना
    let estRevenue = 0;
    allColleges.forEach(c => {
        if (c.plan.includes('11,999')) estRevenue += 11999;
        else if (c.plan.includes('3,999')) estRevenue += 3999;
        else estRevenue += 6999; // Pro Campus डिफ़ॉल्ट
    });

    // Leads कन्वर्ज़न प्रतिशत
    const totalPipeline = allLeads.length + allColleges.length;
    const conversionRate = totalPipeline > 0 ? Math.round((allColleges.length / totalPipeline) * 100) : 100;

    return `
        <!-- हीरो एनालिटिक्स बैनर -->
        <div class="stagger-1 relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-600 p-6 sm:p-8 text-white shadow-2xl mb-6">
            <div class="relative z-10 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <span class="inline-block bg-white/20 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                        👑 VidyaSetu Central Business Intelligence
                    </span>
                    <h1 class="text-2xl sm:text-3xl font-black tracking-tight">
                        ${isHi ? 'सुपर एडमिन बिज़नेस एनालिटिक्स' : 'Super Admin Business Analytics'}
                    </h1>
                    <p class="text-xs sm:text-sm text-indigo-100 mt-1">
                        ${isHi ? 'कुल कमाई, सक्रिय कॉलेज, नए Leads और सिस्टम प्रदर्शन का लाइव विश्लेषण' : 'Real-time revenue, active client institutes, lead conversion & platform growth'}
                    </p>
                </div>
                <div class="flex gap-2">
                    <button onclick="switchTab('super_colleges')" class="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition transform hover:scale-105">
                        ${isHi ? '+ नया कॉलेज URL बनाएं' : '+ Add New College'}
                    </button>
                </div>
            </div>
            <div class="absolute -right-12 -bottom-12 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <!-- 4 मुख्य बिज़नेस मेट्रिक कार्ड्स -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="stagger-1 glass-panel p-5 rounded-2xl border border-emerald-500/30">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">${isHi ? 'कुल वार्षिक राजस्व (Revenue)' : 'Annual Recurring Revenue'}</span>
                    <span class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">💎</span>
                </div>
                <div class="text-3xl font-black mt-2 text-emerald-400">₹${estRevenue.toLocaleString('en-IN')}</div>
                <div class="text-[11px] text-emerald-300/80 mt-2 font-semibold">
                    ${isHi ? '↑ सभी सक्रिय प्लान्स से कुल आय' : '↑ Active Subscriptions Value'}
                </div>
            </div>

            <div class="stagger-2 glass-panel p-5 rounded-2xl border border-indigo-500/30">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">${isHi ? 'पंजीकृत कॉलेज व स्कूल' : 'Registered Institutes'}</span>
                    <span class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">🏫</span>
                </div>
                <div class="text-3xl font-black mt-2">${allColleges.length} <span class="text-xs font-bold text-emerald-400">(${activeCols} Active)</span></div>
                <div class="text-[11px] text-rose-400 mt-2 font-semibold">
                    ${suspendedCols > 0 ? `${suspendedCols} Suspended` : (isHi ? 'सभी पोर्टल सुचारू रूप से चालू' : 'All portals running smoothly')}
                </div>
            </div>

            <div class="stagger-3 glass-panel p-5 rounded-2xl border border-amber-500/30">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">${isHi ? 'नए सब्स्क्रिप्शन Leads' : 'Incoming Form Leads'}</span>
                    <span class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">📩</span>
                </div>
                <div class="text-3xl font-black mt-2 text-amber-400">${allLeads.length}</div>
                <div class="text-[11px] text-slate-400 mt-2">
                    ${isHi ? 'कन्वर्ज़न दर:' : 'Conversion Rate:'} <strong class="text-cyan-400">${conversionRate}%</strong>
                </div>
            </div>

            <div class="stagger-4 glass-panel p-5 rounded-2xl border border-cyan-500/30">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">${isHi ? 'अनुमानित छात्र रीच' : 'Platform Student Reach'}</span>
                    <span class="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg">👨‍🎓</span>
                </div>
                <div class="text-3xl font-black mt-2 text-cyan-400">${(allColleges.length * 450).toLocaleString('en-IN')}+</div>
                <div class="text-[11px] text-slate-400 mt-2">
                    ${isHi ? 'क्लाउड सर्वर स्थिति: 99.9% Online' : 'Cloud Server Status: 99.9% Online'}
                </div>
            </div>
        </div>

        <!-- मध्य भाग: प्लान लोकप्रियता बार + हालिया सक्रिय कॉलेज -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 class="font-bold text-base">${isHi ? '📊 प्लान बिक्री विश्लेषण' : '📊 Plan Popularity Breakdown'}</h3>
                
                <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                        <span>Pro Campus (₹6,999/Yr)</span>
                        <span class="text-indigo-400">65%</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div class="animate-bar bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style="width: 65%"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                        <span>Starter Coaching/Library (₹3,999/Yr)</span>
                        <span class="text-cyan-400">25%</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div class="animate-bar bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full" style="width: 25%"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                        <span>Enterprise College (₹11,999/Yr)</span>
                        <span class="text-amber-400">10%</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div class="animate-bar bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style="width: 10%"></div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-base">${isHi ? '🏫 क्लाइंट संस्थान व सब्सक्रिप्शन स्थिति' : '🏫 Client Institutes & Renewal Status'}</h3>
                    <button onclick="switchTab('super_leads')" class="text-xs text-emerald-400 font-bold hover:underline">
                        ${isHi ? 'सभी Leads देखें →' : 'View All Leads →'}
                    </button>
                </div>
                <div class="space-y-3">
                    ${allColleges.map(c => `
                        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap justify-between items-center gap-2">
                            <div>
                                <div class="font-bold text-sm">${c.name} <span class="text-xs text-slate-400">(${c.city})</span></div>
                                <div class="text-xs text-indigo-400 font-semibold">${c.plan} • URL: <span class="font-mono text-cyan-400">?college=${c.slug}</span></div>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[11px] font-bold ${c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                                ${c.active ? (isHi ? '✔ सक्रिय (Valid till 2027)' : '✔ Active (2026-27)') : '✖ Suspended'}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}