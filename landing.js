// =========================================================================
// VidyaSetu Official Landing Page & Subscription Form Module (landing.js)
// =========================================================================

function renderVidyaSetuLandingPage() {
    const isHi = currentLang === 'hi';
    const isDark = document.documentElement.classList.contains('dark');
    const container = document.getElementById('landing-view');

    const features = [
        { icon: "💰", title: isHi ? "स्मार्ट फीस व 1-क्लिक WhatsApp" : "Smart Fees & 1-Click WhatsApp", desc: isHi ? "ऑटोमैटिक फीस रसीद, बकाया ट्रैकिंग और अभिभावकों को एक क्लिक में WhatsApp रिमाइंडर।" : "Automated fee receipts, pending balance alerts, and 1-click WhatsApp reminders to parents." },
        { icon: "🔐", title: isHi ? "डायनामिक रोल व पावर कंट्रोल" : "Dynamic Role & Power Control", desc: isHi ? "प्रिंसिपल तय करें कि क्लर्क, टीचर या लाइब्रेरियन के साइडबार में कौन-से विकल्प दिखेंगे।" : "Principals control exact sidebar modules visible to clerks, teachers, and librarians." },
        { icon: "✅", title: isHi ? "स्मार्ट उपस्थिति रजिस्टर" : "Smart Attendance System", desc: isHi ? "कक्षा-वार P/A/L/H हाज़िरी और अनुपस्थित छात्रों के घर तुरंत WhatsApp सूचना।" : "Class-wise P/A/L/H register with remarks and instant absent alerts to parents." },
        { icon: "💳", title: isHi ? "ऑटोमैटिक टीचर सैलरी स्लिप" : "Auto Staff Payroll & Slips", desc: isHi ? "शिक्षकों की छुट्टियाँ गिनकर अपने आप शुद्ध वेतन की गणना और प्रिंटेबल सैलरी स्लिप।" : "Auto-calculate net payable salary after leave deductions and print official slips." },
        { icon: "📝", title: isHi ? "1-क्लिक मार्कशीट व ID कार्ड" : "1-Click Marksheets & ID Cards", desc: isHi ? "नंबर डालते ही प्रतिशत व डिवीज़न के साथ सुंदर अंकपत्र और संस्थान लोगो वाला ID कार्ड।" : "Instant report cards with percentage calculation and branded student ID cards." },
        { icon: "🪑", title: isHi ? "लाइब्रेरी सीट व खर्च ट्रैकर" : "Library Seats & Accounts", desc: isHi ? "सेल्फ-स्टडी लाइब्रेरी की विज़ुअल सीट बुकिंग और रोज़ की आमदनी-खर्च का शुद्ध हिसाब।" : "Visual seat booking for self-study libraries alongside daily income & expense ledger." }
    ];

    container.innerHTML = `
        <!-- Top Navigation Bar -->
        <header class="sticky top-0 z-30 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5">
            <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center text-xl shadow-lg">🌉</div>
                    <div>
                        <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">VidyaSetu</span>
                        <span class="block text-[10px] text-slate-400 font-semibold -mt-1">Smart Institute ERP</span>
                    </div>
                </div>

                <nav class="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <a href="#features" class="hover:text-indigo-400 transition">${isHi ? 'फीचर्स' : 'Features'}</a>
                    <a href="#pricing" class="hover:text-indigo-400 transition">${isHi ? 'प्राइसिंग प्लान' : 'Pricing Plans'}</a>
                    <a href="#subscribe" class="hover:text-indigo-400 transition">${isHi ? 'सब्स्क्रिप्शन लें' : 'Get Subscription'}</a>
                    <a href="?college=adarsh" class="text-emerald-400 hover:underline">${isHi ? '🚀 लाइव कॉलेज डेमो देखें' : '🚀 Live College Demo'}</a>
                </nav>

                <!-- Animated Pill Language & Sky Theme Controls -->
                <div class="flex items-center gap-2.5">
                    <div onclick="toggleLanguage()" class="lang-pill-switch ${isHi ? 'is-hi' : ''}" title="Switch Language">
                        <div class="lang-pill-thumb"></div>
                        <span class="lang-pill-label ${!isHi ? 'text-white' : 'text-slate-400'}">EN</span>
                        <span class="lang-pill-label ${isHi ? 'text-white' : 'text-slate-400'}">हिं</span>
                    </div>
                    <div onclick="toggleTheme()" class="sky-theme-switch" title="Toggle Theme">
                        <div class="sky-theme-thumb">${isDark ? '🌙' : '☀️'}</div>
                    </div>
                    <a href="#subscribe" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-extrabold shadow-lg hover:scale-105 transition">
                        ${isHi ? 'अभी जुड़ें' : 'Book Now'}
                    </a>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-16 text-center tab-transition">
            <span class="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-extrabold px-4 py-1.5 rounded-full mb-4">
                🌉 ${isHi ? 'स्कूल • डिग्री कॉलेज • कोचिंग • सेल्फ-स्टडी लाइब्रेरी' : 'Schools • Degree Colleges • Coaching • Libraries'}
            </span>
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                ${isHi ? 'अपने पूरे संस्थान को बनाएं 100% डिजिटल — ' : 'Digitize Your Entire Institute with '}
                <span class="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">VidyaSetu ERP</span>
            </h1>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-4">
                ${isHi ? 'अपने कॉलेज या स्कूल के नाम का अलग कस्टम URL पाएं। फीस रसीद, WhatsApp रिमाइंडर, स्मार्ट अटेंडेंस, मार्कशीट और टीचर सैलरी स्लिप—सब कुछ एक ही क्लाउड प्लेटफॉर्म पर।' : 'Get your own dedicated institute URL & branding. Manage fees, WhatsApp alerts, smart attendance, report cards, and staff payroll in one unified cloud platform.'}
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-4">
                <a href="#subscribe" class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-3.5 rounded-2xl text-sm font-extrabold shadow-xl shadow-indigo-500/30 transition transform hover:scale-105">
                    🚀 ${isHi ? 'नया सब्स्क्रिप्शन / फ्री डेमो बुक करें' : 'Get Subscription / Free Demo'}
                </a>
                <a href="?college=adarsh" class="glass-panel border border-slate-300 dark:border-slate-700 px-7 py-3.5 rounded-2xl text-sm font-extrabold hover:border-indigo-500 transition">
                    🏫 ${isHi ? 'सैंपल कॉलेज पोर्टल चलाकर देखें' : 'Try Sample College Portal'}
                </a>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div class="text-center mb-10">
                <h2 class="text-2xl sm:text-3xl font-extrabold">${isHi ? 'VidyaSetu क्यों चुनें?' : 'Powerful Features Built for Modern Institutes'}</h2>
                <p class="text-xs sm:text-sm text-slate-400 mt-1">${isHi ? 'हर विभाग के काम को आसान और पारदर्शी बनाने वाले आधुनिक टूल्स' : 'Everything you need to automate daily administration without heavy paperwork'}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${features.map(f => `
                    <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50">
                        <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 text-2xl flex items-center justify-center mb-4">${f.icon}</div>
                        <h3 class="font-bold text-base mb-1.5">${f.title}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${f.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Pricing Plans Section -->
        <section id="pricing" class="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div class="text-center mb-10">
                <h2 class="text-2xl sm:text-3xl font-extrabold">${isHi ? 'पारदर्शी एवं किफायती प्लान्स' : 'Simple & Transparent Pricing Plans'}</h2>
                <p class="text-xs sm:text-sm text-slate-400 mt-1">${isHi ? 'अपने संस्थान के आकार के अनुसार सही प्लान चुनें' : 'Choose the plan that best fits your school, college, or library'}</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Starter Plan -->
                <div class="glass-panel p-7 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-bold text-cyan-400 uppercase">Starter Plan</span>
                        <h3 class="text-xl font-extrabold mt-1">${isHi ? 'कोचिंग एवं लाइब्रेरी' : 'Coaching & Library'}</h3>
                        <div class="text-3xl font-black mt-3">₹3,999 <span class="text-xs font-normal text-slate-400">/ ${isHi ? 'वर्ष' : 'Year'}</span></div>
                        <ul class="mt-5 space-y-2.5 text-xs text-slate-400">
                            <li>✔ ${isHi ? '200 छात्रों / सीटों तक का रिकॉर्ड' : 'Up to 200 Students / Library Seats'}</li>
                            <li>✔ ${isHi ? 'संस्थान का अपना कस्टम URL व लोगो' : 'Custom Institute URL & Logo'}</li>
                            <li>✔ ${isHi ? 'फीस रसीद व WhatsApp रिमाइंडर' : 'Fee Receipts & WhatsApp Alerts'}</li>
                            <li>✔ ${isHi ? 'डिजिटल नोटिस बोर्ड' : 'Digital Notice Board'}</li>
                        </ul>
                    </div>
                    <button onclick="selectPlanForForm('Starter Plan (₹3,999/Yr)')" class="mt-6 w-full py-3 rounded-xl border border-cyan-500/40 text-cyan-400 hover:bg-cyan-600 hover:text-white text-xs font-extrabold transition">
                        ${isHi ? 'यह प्लान चुनें' : 'Select Starter Plan'}
                    </button>
                </div>

                <!-- Pro Campus Plan (Popular) -->
                <div class="glass-panel p-7 rounded-3xl border-2 border-indigo-500 relative shadow-2xl shadow-indigo-500/20 flex flex-col justify-between">
                    <span class="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                        ${isHi ? 'सबसे लोकप्रिय' : 'Most Popular'}
                    </span>
                    <div>
                        <span class="text-xs font-bold text-indigo-400 uppercase">Pro Campus</span>
                        <h3 class="text-xl font-extrabold mt-1">${isHi ? 'प्राइवेट स्कूल (नर्सरी से 12वीं)' : 'Complete School ERP'}</h3>
                        <div class="text-3xl font-black mt-3 text-indigo-400">₹6,999 <span class="text-xs font-normal text-slate-400">/ ${isHi ? 'वर्ष' : 'Year'}</span></div>
                        <ul class="mt-5 space-y-2.5 text-xs text-slate-300">
                            <li>✔ <strong>${isHi ? 'असीमित छात्र (Unlimited Students)' : 'Unlimited Student Records'}</strong></li>
                            <li>✔ ${isHi ? 'स्मार्ट अटेंडेंस + मार्कशीट + ID कार्ड' : 'Smart Attendance + Report Cards + ID'}</li>
                            <li>✔ ${isHi ? 'ऑटोमैटिक टीचर सैलरी स्लिप (Payroll)' : 'Auto Staff Payroll & Salary Slips'}</li>
                            <li>✔ ${isHi ? '5 अलग स्टाफ यूज़र लॉगिन व पावर कंट्रोल' : '5 Custom Staff User Logins'}</li>
                            <li>✔ ${isHi ? 'आमदनी-खर्च अकाउंट्स व Excel बैकअप' : 'Income-Expense Ledger & Excel Export'}</li>
                        </ul>
                    </div>
                    <button onclick="selectPlanForForm('Pro Campus (₹6,999/Yr)')" class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-lg hover:scale-[1.02] transition">
                        ${isHi ? '🚀 Pro Campus चुनें' : '🚀 Select Pro Campus'}
                    </button>
                </div>

                <!-- Enterprise Plan -->
                <div class="glass-panel p-7 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-bold text-purple-400 uppercase">Enterprise</span>
                        <h3 class="text-xl font-extrabold mt-1">${isHi ? 'डिग्री कॉलेज व बड़े संस्थान' : 'Colleges & Multi-Branch'}</h3>
                        <div class="text-3xl font-black mt-3">₹11,999 <span class="text-xs font-normal text-slate-400">/ ${isHi ? 'वर्ष' : 'Year'}</span></div>
                        <ul class="mt-5 space-y-2.5 text-xs text-slate-400">
                            <li>✔ ${isHi ? 'असीमित छात्र व असीमित स्टाफ लॉगिन' : 'Unlimited Students & Staff Logins'}</li>
                            <li>✔ ${isHi ? 'कस्टम URL + निजी डोमेन (.in) सपोर्ट' : 'Custom URL + Custom Domain (.in) Support'}</li>
                            <li>✔ ${isHi ? 'सभी मॉड्यूल (फीस, सैलरी, लाइब्रेरी, परीक्षा)' : 'All Modules Unlocked'}</li>
                            <li>✔ ${isHi ? 'प्राथमिकता व्हाट्सएप व फोन सपोर्ट' : 'Priority Dedicated Support'}</li>
                        </ul>
                    </div>
                    <button onclick="selectPlanForForm('Enterprise (₹11,999/Yr)')" class="mt-6 w-full py-3 rounded-xl border border-purple-500/40 text-purple-400 hover:bg-purple-600 hover:text-white text-xs font-extrabold transition">
                        ${isHi ? 'Enterprise चुनें' : 'Select Enterprise'}
                    </button>
                </div>
            </div>
        </section>

        <!-- Subscription & Contact Form Section -->
        <section id="subscribe" class="max-w-4xl mx-auto px-4 sm:px-8 py-14">
            <div class="glass-panel p-7 sm:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl">
                <div class="text-center mb-7">
                    <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">${isHi ? 'नया अकाउंट प्राप्त करें' : 'Start Your Digital Journey'}</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold mt-1">${isHi ? 'सब्स्क्रिप्शन या फ्री डेमो के लिए फॉर्म भरें' : 'Request Subscription or Free Live Demo'}</h2>
                    <p class="text-xs text-slate-400 mt-1">${isHi ? 'आपका विवरण सीधे हमारी टीम के पास पहुँचेगा और 2 घंटे में आपके कॉलेज का कस्टम लिंक तैयार कर दिया जाएगा' : 'Submit your details below. Our team will set up your custom institute URL & credentials shortly.'}</p>
                </div>

                <form onsubmit="submitSubscriptionLead(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'संस्थान / कॉलेज का नाम *' : 'Institute / College Name *'}</label>
                        <input type="text" id="lead-org" required placeholder="${isHi ? 'जैसे: सरस्वती विद्या मंदिर' : 'e.g. Saraswati Vidya Mandir'}" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'आपका नाम व पद *' : 'Your Name & Designation *'}</label>
                        <input type="text" id="lead-person" required placeholder="${isHi ? 'जैसे: डॉ. रमेश सिंह (प्रिंसिपल)' : 'e.g. Dr. Ramesh Singh (Principal)'}" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'व्हाट्सएप मोबाइल नंबर *' : 'WhatsApp Mobile Number *'}</label>
                        <input type="tel" id="lead-phone" required placeholder="9876543210" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'शहर / जिला *' : 'City / District *'}</label>
                        <input type="text" id="lead-city" required placeholder="${isHi ? 'जैसे: आज़मगढ़, उत्तर प्रदेश' : 'e.g. Azamgarh, UP'}" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'संस्थान का प्रकार' : 'Institute Type'}</label>
                        <select id="lead-type" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                            <option value="School">School (नर्सरी से 12वीं)</option>
                            <option value="Degree College">Degree College / Mahavidyalaya</option>
                            <option value="Coaching Institute">Coaching / Computer Center</option>
                            <option value="Self-Study Library">Self-Study Library</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'पसंदीदा प्लान' : 'Preferred Plan'}</label>
                        <select id="lead-plan" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                            <option value="Pro Campus (₹6,999/Yr)">Pro Campus (₹6,999/Yr)</option>
                            <option value="Starter Plan (₹3,999/Yr)">Starter Plan (₹3,999/Yr)</option>
                            <option value="Enterprise (₹11,999/Yr)">Enterprise (₹11,999/Yr)</option>
                            <option value="7-Day Free Trial">7-Day Free Trial Demo</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-slate-400 mb-1">${isHi ? 'कोई विशेष आवश्यकता (वैकल्पिक)' : 'Additional Requirements (Optional)'}</label>
                        <input type="text" id="lead-note" placeholder="${isHi ? 'जैसे: हमें 500 छात्रों का डेटा और कस्टम डोमेन चाहिए' : 'e.g. Need data import for 500 students'}" class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90">
                    </div>
                    <div class="sm:col-span-2 pt-2 flex flex-wrap gap-3">
                        <button type="submit" class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-xl shadow-xl transition">
                            ${isHi ? '✅ आवेदन सबमिट करें' : '✅ Submit Request'}
                        </button>
                        <a href="https://wa.me/918574210020?text=Hello%20Aman,%20I%20want%20VidyaSetu%20ERP%20subscription%20for%20my%20institute." target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-xl transition flex items-center justify-center gap-2">
                            💬 ${isHi ? 'सीधे WhatsApp करें' : 'Direct WhatsApp'}
                        </a>
                    </div>
                </form>
                <div id="lead-success-msg" class="hidden mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center"></div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
            <div class="font-bold text-slate-300 mb-1">🌉 VidyaSetu ERP — Complete Digital Education Infrastructure</div>
            <div>Sales & Support: <strong>Aman Kumar (+91 8574210020)</strong> • Azamgarh, Uttar Pradesh</div>
        </footer>
    `;
}

function selectPlanForForm(planName) {
    document.getElementById('lead-plan').value = planName;
    document.getElementById('subscribe').scrollIntoView({ behavior: 'smooth' });
}

function submitSubscriptionLead(e) {
    e.preventDefault();
    const isHi = currentLang === 'hi';
    const newLead = {
        id: "LEAD" + Date.now(),
        orgName: document.getElementById('lead-org').value.trim(),
        personName: document.getElementById('lead-person').value.trim(),
        phone: document.getElementById('lead-phone').value.trim(),
        city: document.getElementById('lead-city').value.trim(),
        type: document.getElementById('lead-type').value,
        plan: document.getElementById('lead-plan').value,
        note: document.getElementById('lead-note').value.trim(),
        date: new Date().toLocaleDateString('en-IN'),
        status: "New"
    };

    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    leads.unshift(newLead);
    localStorage.setItem('vs_subscription_leads', JSON.stringify(leads));

    const msgBox = document.getElementById('lead-success-msg');
    msgBox.innerText = isHi
        ? `🎉 धन्यवाद ${newLead.personName}! "${newLead.orgName}" के लिए आपका आवेदन प्राप्त हो गया है। हमारी टीम शीघ्र ही आपसे संपर्क करेगी।`
        : `🎉 Thank you ${newLead.personName}! Your subscription request for "${newLead.orgName}" has been received. We will contact you shortly.`;
    msgBox.classList.remove('hidden');
    e.target.reset();
}