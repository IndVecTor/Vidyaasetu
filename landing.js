// =========================================================================
// VidyaSetu Custom SVG Logo & Cyber-Grid Landing Page (landing.js)
// =========================================================================

function getVidyaSetuSVGLogo(size = 42) {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="vsGrad1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#4F46E5"/>
                    <stop offset="50%" stop-color="#7C3AED"/>
                    <stop offset="100%" stop-color="#06B6D4"/>
                </linearGradient>
                <linearGradient id="vsGold" x1="16" y1="10" x2="48" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FDE047"/>
                    <stop offset="100%" stop-color="#F59E0B"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#vsGrad1)"/>
            <!-- Graduation Cap Top -->
            <path d="M32 13L15 21L32 29L49 21L32 13Z" fill="url(#vsGold)"/>
            <path d="M22 25V31C22 33.5 26.5 35.5 32 35.5C37.5 35.5 42 33.5 42 31V25" stroke="#FEF08A" stroke-width="2.2" stroke-linecap="round"/>
            <!-- Digital Bridge Arch (Setu) -->
            <path d="M12 47C18 39 46 39 52 47" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M16 47V52M26 42.5V52M38 42.5V52M48 47V52" stroke="#A5F3FC" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `;
}

function renderVidyaSetuLandingPage() {
    const isHi = currentLang === 'hi';
    const isDark = document.documentElement.classList.contains('dark');
    const container = document.getElementById('landing-view');

    const multiplexCategories = [
        { icon: "🏫", title: isHi ? "स्कूल व इंटर कॉलेज" : "Schools & Inter Colleges", desc: isHi ? "एडमिशन, फीस रसीद, स्मार्ट हाज़िरी, मार्कशीट, TC और एडमिट कार्ड।" : "Admissions, fee receipts, smart attendance, report cards, TC & Admit Cards." },
        { icon: "🎓", title: isHi ? "डिग्री कॉलेज व संस्थान" : "Degree Colleges & Academies", desc: isHi ? "अपना लोगो व डिजिटल मुहर, स्टाफ पेरोल और रोल-नंबर स्टूडेंट पोर्टल।" : "White-label logo & digital stamp, staff payroll & student self-portal." },
        { icon: "📖", title: isHi ? "सेल्फ-स्टडी लाइब्रेरी" : "Self-Study Libraries", desc: isHi ? "A/C व Non-A/C ज़ोन, शिफ्ट-वार सीट बुकिंग, लॉकर और WhatsApp रिन्यूअल।" : "AC/Non-AC zones, shift-wise seat booking, lockers & WhatsApp renewals." },
        { icon: "💻", title: isHi ? "कोचिंग व कंप्यूटर लैब" : "Coaching & Computer Labs", desc: isHi ? "बैच टाइमिंग, PC-01 से PC-20 सिस्टम आवंटन और डिप्लोमा सर्टिफिकेट।" : "Batch timings, PC-by-PC lab allocation & instant diploma certificates." },
        { icon: "💪", title: isHi ? "जिम व फिटनेस क्लब" : "Gym & Fitness Clubs", desc: isHi ? "मंथली/तिमाही पैक, पर्सनल ट्रेनर आवंटन और एक्सपायरी WhatsApp अलर्ट।" : "Monthly/quarterly packs, personal trainer assignment & expiry alerts." },
        { icon: "🎨", title: isHi ? "100% White-Label ब्रांडिंग" : "100% White-Label Branding", desc: isHi ? "हर संस्थान का अपना लोगो, अपना कस्टम URL और हर रसीद पर अपनी मुहर।" : "Every client gets their own custom URL, logo & digital stamp on all slips." }
    ];

    container.innerHTML = `
        <div class="cyber-grid-bg min-h-screen">
            <!-- Top Navigation Bar -->
            <header class="sticky top-0 z-30 glass-panel border-b border-indigo-500/20 px-4 sm:px-8 py-3.5">
                <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
                    <div class="flex items-center gap-3">
                        <div class="shadow-lg rounded-2xl overflow-hidden">${getVidyaSetuSVGLogo(42)}</div>
                        <div>
                            <span class="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">VidyaSetu</span>
                            <span class="block text-[10px] adaptive-sub font-bold -mt-1">White-Label Multiplex ERP</span>
                        </div>
                    </div>

                    <nav class="hidden md:flex items-center gap-6 text-xs font-bold adaptive-sub">
                        <a href="#categories" class="hover:text-indigo-500 transition">${isHi ? 'मल्टीप्लेक्स समाधान' : 'Multiplex Solutions'}</a>
                        <a href="#pricing" class="hover:text-indigo-500 transition">${isHi ? 'प्राइसिंग प्लान' : 'Pricing Plans'}</a>
                        <a href="#subscribe" class="hover:text-indigo-500 transition">${isHi ? 'नया अकाउंट लें' : 'Get Subscription'}</a>
                        <a href="?college=adarsh" class="text-emerald-500 font-extrabold hover:underline">${isHi ? '🚀 लाइव कॉलेज डेमो' : '🚀 Live School Demo'}</a>
                        <a href="?college=gyanlib" class="text-cyan-500 font-extrabold hover:underline">${isHi ? '📖 लाइब्रेरी डेमो' : '📖 Library Demo'}</a>
                    </nav>

                    <div class="flex items-center gap-2.5">
                        <div onclick="toggleLanguage()" class="lang-pill-switch ${isHi ? 'is-hi' : ''}" title="Switch Language">
                            <div class="lang-pill-thumb"></div>
                            <span class="lang-pill-label ${!isHi ? 'text-white' : 'text-slate-400'}">EN</span>
                            <span class="lang-pill-label ${isHi ? 'text-white' : 'text-slate-400'}">हिं</span>
                        </div>
                        <div onclick="toggleTheme()" class="sky-theme-switch" title="Toggle Theme">
                            <div class="sky-theme-thumb">${isDark ? '🌙' : '☀️'}</div>
                        </div>
                        <a href="#subscribe" class="super-btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-extrabold shadow-lg">
                            ${isHi ? 'अभी जुड़ें' : 'Book Now'}
                        </a>
                    </div>
                </div>
            </header>

            <!-- Hero Section -->
            <section class="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-16 text-center tab-transition">
                <div class="mx-auto w-20 h-20 mb-5 shadow-2xl rounded-3xl overflow-hidden animate-bounce">${getVidyaSetuSVGLogo(80)}</div>
                <span class="inline-block bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-extrabold px-4 py-1.5 rounded-full mb-4">
                    ✨ ${isHi ? '100% White-Label — आपका अपना लोगो, आपकी अपनी मुहर, आपका अपना URL' : '100% White-Label — Your Own Logo, Your Digital Stamp & Custom URL'}
                </span>
                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto adaptive-title">
                    ${isHi ? 'हर संस्थान के लिए एक ही स्मार्ट क्लाउड इंजन — ' : 'One Unified Cloud OS for Every Institute — '}
                    <span class="bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">VidyaSetu</span>
                </h1>
                <p class="text-sm sm:text-base adaptive-sub max-w-2xl mx-auto mt-4">
                    ${isHi ? 'स्कूल, डिग्री कॉलेज, लाइब्रेरी, कंप्यूटर लैब, कोचिंग या जिम—हर बिज़नेस के लिए अलग मॉड्यूल। रसीद से लेकर सर्टिफिकेट तक हर जगह आपके संस्थान का लोगो और डिजिटल मुहर छपेगी।' : 'Dedicated modules for Schools, Colleges, Self-Study Libraries, Computer Labs, Coaching & Gyms. Every receipt, slip & certificate prints with your own brand logo & stamp.'}
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-4">
                    <a href="#subscribe" class="super-btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3.5 rounded-2xl text-sm font-extrabold shadow-xl shadow-indigo-500/30">
                        🚀 ${isHi ? 'अपना कस्टम पोर्टल बुक करें' : 'Get Your Custom Portal'}
                    </a>
                    <a href="?college=adarsh" class="super-btn glass-panel px-6 py-3.5 rounded-2xl text-sm font-extrabold adaptive-title">
                        🏫 ${isHi ? 'स्कूल पोर्टल डेमो' : 'School Demo'}
                    </a>
                    <a href="?college=ironfit" class="super-btn glass-panel px-6 py-3.5 rounded-2xl text-sm font-extrabold adaptive-title">
                        💪 ${isHi ? 'जिम पोर्टल डेमो' : 'Gym Demo'}
                    </a>
                </div>
            </section>

            <!-- Multiplex Categories Showcase -->
            <section id="categories" class="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <div class="text-center mb-10">
                    <h2 class="text-2xl sm:text-3xl font-extrabold adaptive-title">${isHi ? 'एक प्लेटफॉर्म, अनगिनत बिज़नेस समाधान' : 'Multiplex Architecture Built for Every Sector'}</h2>
                    <p class="text-xs sm:text-sm adaptive-sub mt-1">${isHi ? 'आपकी कैटेगरी के हिसाब से फीचर्स अपने आप बदल जाते हैं' : 'Dynamic modules tailored specifically to your organization type'}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${multiplexCategories.map(f => `
                        <div class="glass-panel super-tile p-6 rounded-3xl">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 text-2xl flex items-center justify-center mb-4">${f.icon}</div>
                            <h3 class="font-extrabold text-base mb-1.5 adaptive-title">${f.title}</h3>
                            <p class="text-xs adaptive-sub leading-relaxed">${f.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Pricing Section -->
            <section id="pricing" class="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <div class="text-center mb-10">
                    <h2 class="text-2xl sm:text-3xl font-extrabold adaptive-title">${isHi ? 'पारदर्शी एवं किफायती प्लान्स' : 'Simple & Transparent Pricing Plans'}</h2>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="glass-panel super-tile p-7 rounded-3xl flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-bold text-cyan-500 uppercase">Starter Plan</span>
                            <h3 class="text-xl font-extrabold mt-1 adaptive-title">${isHi ? 'कोचिंग, लाइब्रेरी व जिम' : 'Coaching, Library & Gym'}</h3>
                            <div class="text-3xl font-black mt-3 adaptive-title">₹3,999 <span class="text-xs font-normal adaptive-sub">/ Year</span></div>
                            <ul class="mt-5 space-y-2.5 text-xs adaptive-sub">
                                <li>✔ Custom URL + Your Logo & Stamp</li>
                                <li>✔ Library Seat / Gym Pack / Batch Manager</li>
                                <li>✔ WhatsApp Alerts & Clean Print Receipts</li>
                            </ul>
                        </div>
                        <button onclick="selectPlanForForm('Starter Plan (₹3,999/Yr)')" class="super-btn mt-6 w-full py-3 rounded-xl border border-cyan-500/40 text-cyan-500 hover:bg-cyan-600 hover:text-white text-xs font-extrabold">Select Starter Plan</button>
                    </div>

                    <div class="glass-panel super-tile p-7 rounded-3xl border-2 border-indigo-500 relative shadow-2xl flex flex-col justify-between">
                        <span class="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">Most Popular</span>
                        <div>
                            <span class="text-xs font-bold text-indigo-400 uppercase">Pro Campus</span>
                            <h3 class="text-xl font-extrabold mt-1 adaptive-title">${isHi ? 'प्राइवेट स्कूल (नर्सरी से 12वीं)' : 'Complete School ERP'}</h3>
                            <div class="text-3xl font-black mt-3 text-indigo-500">₹6,999 <span class="text-xs font-normal adaptive-sub">/ Year</span></div>
                            <ul class="mt-5 space-y-2.5 text-xs adaptive-sub">
                                <li>✔ Unlimited Students + Student Self-Login</li>
                                <li>✔ TC, Character Certificate, Admit Card & Marksheet</li>
                                <li>✔ Auto Staff Salary Slips + Date-Wise Fee Ledger</li>
                            </ul>
                        </div>
                        <button onclick="selectPlanForForm('Pro Campus (₹6,999/Yr)')" class="super-btn mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-lg">🚀 Select Pro Campus</button>
                    </div>

                    <div class="glass-panel super-tile p-7 rounded-3xl flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-bold text-purple-400 uppercase">Enterprise</span>
                            <h3 class="text-xl font-extrabold mt-1 adaptive-title">${isHi ? 'डिग्री कॉलेज व मल्टी-ब्रांच' : 'Degree Colleges & Institutions'}</h3>
                            <div class="text-3xl font-black mt-3 adaptive-title">₹11,999 <span class="text-xs font-normal adaptive-sub">/ Year</span></div>
                            <ul class="mt-5 space-y-2.5 text-xs adaptive-sub">
                                <li>✔ All Multiplex Modules Unlocked</li>
                                <li>✔ Custom Domain (.in) + Priority Support</li>
                                <li>✔ Unlimited Staff Logins & Full Backup</li>
                            </ul>
                        </div>
                        <button onclick="selectPlanForForm('Enterprise (₹11,999/Yr)')" class="super-btn mt-6 w-full py-3 rounded-xl border border-purple-500/40 text-purple-400 hover:bg-purple-600 hover:text-white text-xs font-extrabold">Select Enterprise</button>
                    </div>
                </div>
            </section>

            <!-- Subscription Form -->
            <section id="subscribe" class="max-w-4xl mx-auto px-4 sm:px-8 py-14">
                <div class="glass-panel p-7 sm:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl">
                    <div class="text-center mb-7">
                        <h2 class="text-2xl sm:text-3xl font-extrabold adaptive-title">${isHi ? 'नया सब्स्क्रिप्शन या फ्री डेमो बुक करें' : 'Book Your Custom White-Label Portal'}</h2>
                        <p class="text-xs adaptive-sub mt-1">${isHi ? 'फॉर्म भरते ही आपका विवरण हमारे मास्टर पैनल में पहुँच जाएगा' : 'Submit your details below to get your custom institute URL & admin credentials'}</p>
                    </div>

                    <form onsubmit="submitSubscriptionLead(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <input type="text" id="lead-org" required placeholder="Institute / Gym / Library Name *" class="px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="lead-person" required placeholder="Your Name & Designation *" class="px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="tel" id="lead-phone" required placeholder="WhatsApp Mobile Number *" class="px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <input type="text" id="lead-city" required placeholder="City / District *" class="px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <select id="lead-type" class="px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-bold">
                            <option value="School / Inter College">School / Inter College</option>
                            <option value="Degree College">Degree College</option>
                            <option value="Self-Study Library">Self-Study Library</option>
                            <option value="Coaching / Computer Lab">Coaching / Computer Lab</option>
                            <option value="Gym / Fitness Club">Gym / Fitness Club</option>
                        </select>
                        <select id="lead-plan" class="px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-bold">
                            <option value="Pro Campus (₹6,999/Yr)">Pro Campus (₹6,999/Yr)</option>
                            <option value="Starter Plan (₹3,999/Yr)">Starter Plan (₹3,999/Yr)</option>
                            <option value="Enterprise (₹11,999/Yr)">Enterprise (₹11,999/Yr)</option>
                        </select>
                        <input type="text" id="lead-note" placeholder="Any specific requirement (Optional)" class="sm:col-span-2 px-4 py-3 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                        <div class="sm:col-span-2 pt-2 flex flex-wrap gap-3">
                            <button type="submit" class="super-btn flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold py-3.5 rounded-xl shadow-xl">✅ Submit Request</button>
                            <a href="https://wa.me/918574210020?text=Hello%20Aman,%20I%20want%20VidyaSetu%20ERP%20for%20my%20institute." target="_blank" class="super-btn bg-emerald-600 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2">💬 Direct WhatsApp</a>
                        </div>
                    </form>
                    <div id="lead-success-msg" class="hidden mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center"></div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="border-t border-slate-300/30 dark:border-slate-800 py-8 px-4 text-center text-xs adaptive-sub">
                <div class="font-bold adaptive-title mb-1">VidyaSetu Multiplex Cloud ERP — Built by Aman Kumar</div>
                <div>Sales & Support: <strong>+91 8574210020</strong> • Azamgarh, Uttar Pradesh</div>
            </footer>
        </div>
    `;
}

function selectPlanForForm(planName) {
    document.getElementById('lead-plan').value = planName;
    document.getElementById('subscribe').scrollIntoView({ behavior: 'smooth' });
}

function submitSubscriptionLead(e) {
    e.preventDefault();
    const newLead = {
        id: "LEAD" + Date.now(),
        orgName: document.getElementById('lead-org').value.trim(),
        personName: document.getElementById('lead-person').value.trim(),
        phone: document.getElementById('lead-phone').value.trim(),
        city: document.getElementById('lead-city').value.trim(),
        type: document.getElementById('lead-type').value,
        plan: document.getElementById('lead-plan').value,
        note: document.getElementById('lead-note').value.trim(),
        date: new Date().toLocaleDateString('en-IN')
    };
    let leads = JSON.parse(localStorage.getItem('vs_subscription_leads')) || [];
    leads.unshift(newLead);
    localStorage.setItem('vs_subscription_leads', JSON.stringify(leads));

    const msgBox = document.getElementById('lead-success-msg');
    msgBox.innerText = `🎉 Thank you ${newLead.personName}! Request for "${newLead.orgName}" submitted successfully.`;
    msgBox.classList.remove('hidden');
    e.target.reset();
}