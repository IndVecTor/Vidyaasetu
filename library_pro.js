// =========================================================================
// VidyaSetu Dedicated Multiplex Module: Self-Study Library Pro (library_pro.js)
// =========================================================================

const defaultLibrarySeats = Array.from({ length: 24 }, (_, i) => {
    const no = i + 1;
    const zone = no <= 12 ? "AC Zone" : "Non-AC Zone";
    if (no === 1) return { seatNo: no, zone, status: "booked", memberName: "Aarav Sharma", mobile: "9876543210", shift: "Full Day (6AM-10PM)", lockerNo: "L-01", monthlyFee: 1000, validTill: "2026-12-15" };
    if (no === 3) return { seatNo: no, zone, status: "booked", memberName: "Priya Singh", mobile: "9876543213", shift: "Morning (6AM-2PM)", lockerNo: "L-04", monthlyFee: 600, validTill: "2026-11-28" };
    if (no === 14) return { seatNo: no, zone, status: "booked", memberName: "Rohan Yadav", mobile: "9876543212", shift: "Evening (2PM-10PM)", lockerNo: "None", monthlyFee: 500, validTill: "2026-12-05" };
    return { seatNo: no, zone, status: "available", memberName: "", mobile: "", shift: "", lockerNo: "None", monthlyFee: 0, validTill: "" };
});

let libSeatsPro = [];
let selectedLibZone = "ALL";
let activeSeatModalIdx = null;

function loadLibraryProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'lib_pro';
    libSeatsPro = JSON.parse(localStorage.getItem(key)) || JSON.parse(JSON.stringify(defaultLibrarySeats));
}

function saveLibraryProData() {
    const key = (typeof storagePrefix !== 'undefined' ? storagePrefix : 'vs_data_default_') + 'lib_pro';
    localStorage.setItem(key, JSON.stringify(libSeatsPro));
}

function renderLibraryProModule() {
    loadLibraryProData();
    const isHi = currentLang === 'hi';

    const totalSeats = libSeatsPro.length;
    const bookedCount = libSeatsPro.filter(s => s.status === 'booked').length;
    const acBooked = libSeatsPro.filter(s => s.zone === 'AC Zone' && s.status === 'booked').length;
    const monthlyLibRevenue = libSeatsPro.reduce((sum, s) => sum + Number(s.monthlyFee || 0), 0);

    const filteredSeats = selectedLibZone === "ALL" ? libSeatsPro : libSeatsPro.filter(s => s.zone === selectedLibZone);

    return `
        <div class="space-y-6">
            <!-- Library Analytics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass-panel super-tile p-5 rounded-2xl border border-indigo-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'कुल लाइब्रेरी सीटें' : 'Total Library Seats'}</span>
                    <div class="text-3xl font-black text-indigo-500 mt-1">${bookedCount} <span class="text-sm font-normal adaptive-sub">/ ${totalSeats}</span></div>
                    <div class="text-[11px] text-emerald-500 font-bold mt-1">${totalSeats - bookedCount} ${isHi ? 'सीटें खाली हैं' : 'Seats Available'}</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-cyan-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'A/C ज़ोन बुकिंग' : 'AC Zone Occupancy'}</span>
                    <div class="text-3xl font-black text-cyan-500 mt-1">${acBooked} <span class="text-sm font-normal adaptive-sub">/ 12</span></div>
                    <div class="text-[11px] adaptive-sub mt-1">Premium Cabin Seats</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-emerald-500/30">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'मासिक सीट राजस्व' : 'Monthly Seat Revenue'}</span>
                    <div class="text-3xl font-black text-emerald-500 mt-1">₹${monthlyLibRevenue.toLocaleString('en-IN')}</div>
                    <div class="text-[11px] adaptive-sub mt-1">Active Shift Subscriptions</div>
                </div>
                <div class="glass-panel super-tile p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
                    <span class="text-xs font-bold adaptive-sub">${isHi ? 'लाइब्रेरी रिपोर्ट व सीट जोड़ें' : 'Manage Seats & Export'}</span>
                    <div class="flex gap-2 mt-2">
                        <button onclick="addExtraLibrarySeat()" class="super-btn flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold">+ Add Seat</button>
                        <button onclick="exportLibraryProExcel()" class="super-btn flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">📥 Excel</button>
                    </div>
                </div>
            </div>

            <!-- Zone Filter + Visual Seat Map -->
            <div class="glass-panel p-6 rounded-3xl">
                <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
                    <div>
                        <h3 class="font-extrabold text-xl adaptive-title">🪑 ${isHi ? 'शिफ्ट-वार लाइब्रेरी सीट मैप व लॉकर' : 'Shift-Wise Library Seat Map & Lockers'}</h3>
                        <p class="text-xs adaptive-sub">${isHi ? 'किसी भी सीट पर क्लिक करके बुकिंग करें, रिन्यूअल WhatsApp भेजें या ID कार्ड प्रिंट करें' : 'Click any seat to book shift, assign locker, send WhatsApp reminder or print ID'}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="selectedLibZone='ALL'; renderApp()" class="super-btn px-3.5 py-1.5 rounded-xl text-xs font-bold ${selectedLibZone === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}">All (${totalSeats})</button>
                        <button onclick="selectedLibZone='AC Zone'; renderApp()" class="super-btn px-3.5 py-1.5 rounded-xl text-xs font-bold ${selectedLibZone === 'AC Zone' ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}">❄️ AC Zone</button>
                        <button onclick="selectedLibZone='Non-AC Zone'; renderApp()" class="super-btn px-3.5 py-1.5 rounded-xl text-xs font-bold ${selectedLibZone === 'Non-AC Zone' ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}">🌀 Non-AC</button>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    ${filteredSeats.map(seat => {
                        const realIdx = libSeatsPro.findIndex(x => x.seatNo === seat.seatNo);
                        const isBooked = seat.status === 'booked';
                        return `
                            <div onclick="openLibrarySeatModal(${realIdx})" class="super-tile cursor-pointer p-4 rounded-2xl border-2 ${isBooked ? 'border-rose-500/50 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/5'}">
                                <div class="flex justify-between items-center">
                                    <span class="font-black text-sm adaptive-title">#${seat.seatNo}</span>
                                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full ${seat.zone === 'AC Zone' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'}">${seat.zone === 'AC Zone' ? '❄️ AC' : 'Non-AC'}</span>
                                </div>
                                <div class="mt-2 font-bold text-xs truncate ${isBooked ? 'text-rose-400' : 'text-emerald-500'}">
                                    ${isBooked ? seat.memberName : (isHi ? '+ सीट खाली है' : '+ Available')}
                                </div>
                                ${isBooked ? `
                                    <div class="text-[10px] adaptive-sub mt-0.5 truncate">⏰ ${seat.shift}</div>
                                    <div class="text-[10px] text-indigo-400 font-bold mt-0.5">🔐 Locker: ${seat.lockerNo} • ₹${seat.monthlyFee}</div>
                                ` : `<div class="text-[10px] adaptive-sub mt-1">Click to Allot</div>`}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="lib-modal-area"></div>
        </div>
    `;
}

function openLibrarySeatModal(idx) {
    const seat = libSeatsPro[idx];
    const isHi = currentLang === 'hi';
    const isBooked = seat.status === 'booked';

    document.getElementById('lib-modal-area').innerHTML = `
        <div class="glass-panel p-6 rounded-3xl border-2 border-indigo-500/60 max-w-xl mx-auto shadow-2xl tab-transition">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-extrabold text-lg adaptive-title">🪑 Seat #${seat.seatNo} (${seat.zone}) — ${isBooked ? 'Manage Booking' : 'New Shift Booking'}</h3>
                <button onclick="document.getElementById('lib-modal-area').innerHTML=''" class="text-xs text-rose-400 underline">Close</button>
            </div>

            <form onsubmit="saveLibrarySeatBooking(event, ${idx})" class="space-y-3 text-xs sm:text-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="text-[11px] font-bold adaptive-sub">Member Name *</label>
                        <input type="text" id="lb-name" required value="${seat.memberName}" placeholder="Student / Aspirant Name" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                    </div>
                    <div>
                        <label class="text-[11px] font-bold adaptive-sub">WhatsApp Mobile *</label>
                        <input type="tel" id="lb-mobile" required value="${seat.mobile}" placeholder="9876543210" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                    </div>
                    <div>
                        <label class="text-[11px] font-bold adaptive-sub">Select Shift Timing</label>
                        <select id="lb-shift" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-bold">
                            <option value="Full Day (6AM-10PM)" ${seat.shift.includes('Full') ? 'selected' : ''}>Full Day (6AM - 10PM)</option>
                            <option value="Morning (6AM-2PM)" ${seat.shift.includes('Morning') ? 'selected' : ''}>Morning Shift (6AM - 2PM)</option>
                            <option value="Evening (2PM-10PM)" ${seat.shift.includes('Evening') ? 'selected' : ''}>Evening Shift (2PM - 10PM)</option>
                            <option value="Night Shift (10PM-6AM)" ${seat.shift.includes('Night') ? 'selected' : ''}>Night Owl Shift (10PM - 6AM)</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[11px] font-bold adaptive-sub">Locker Number (Optional)</label>
                        <input type="text" id="lb-locker" value="${seat.lockerNo !== 'None' ? seat.lockerNo : ''}" placeholder="e.g. L-05" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                    </div>
                    <div>
                        <label class="text-[11px] font-bold adaptive-sub">Monthly Fee (₹)</label>
                        <input type="number" id="lb-fee" required value="${seat.monthlyFee || 800}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent font-bold text-emerald-500">
                    </div>
                    <div>
                        <label class="text-[11px] font-bold adaptive-sub">Valid Till Date</label>
                        <input type="date" id="lb-valid" value="${seat.validTill || '2026-12-30'}" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-400/40 dark:border-slate-700 bg-transparent">
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 pt-2">
                    <button type="submit" class="super-btn flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl">💾 Save Booking</button>
                    ${isBooked ? `
                        <a href="https://wa.me/91${seat.mobile.replace(/\D/g,'')}?text=${encodeURIComponent(`Hello ${seat.memberName}, your Seat #${seat.seatNo} (${seat.shift}) at ${orgName} is valid till ${seat.validTill}. Monthly Fee: ₹${seat.monthlyFee}.`)}" target="_blank" class="super-btn bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold">💬 WhatsApp</a>
                        <button type="button" onclick="vacateLibrarySeat(${idx})" class="super-btn bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold">🗑️ Vacate Seat</button>
                    ` : ''}
                </div>
            </form>
        </div>
    `;
    document.getElementById('lib-modal-area').scrollIntoView({ behavior: 'smooth' });
}

function saveLibrarySeatBooking(e, idx) {
    e.preventDefault();
    libSeatsPro[idx].status = "booked";
    libSeatsPro[idx].memberName = document.getElementById('lb-name').value.trim();
    libSeatsPro[idx].mobile = document.getElementById('lb-mobile').value.trim();
    libSeatsPro[idx].shift = document.getElementById('lb-shift').value;
    libSeatsPro[idx].lockerNo = document.getElementById('lb-locker').value.trim() || "None";
    libSeatsPro[idx].monthlyFee = Number(document.getElementById('lb-fee').value);
    libSeatsPro[idx].validTill = document.getElementById('lb-valid').value;
    saveLibraryProData();
    renderApp();
}

function vacateLibrarySeat(idx) {
    libSeatsPro[idx].status = "available";
    libSeatsPro[idx].memberName = "";
    libSeatsPro[idx].mobile = "";
    libSeatsPro[idx].shift = "";
    libSeatsPro[idx].lockerNo = "None";
    libSeatsPro[idx].monthlyFee = 0;
    libSeatsPro[idx].validTill = "";
    saveLibraryProData();
    renderApp();
}

function addExtraLibrarySeat() {
    const nextNo = libSeatsPro.length + 1;
    const zone = confirm("Is this an AC Zone seat? (OK = AC Zone, Cancel = Non-AC Zone)") ? "AC Zone" : "Non-AC Zone";
    libSeatsPro.push({ seatNo: nextNo, zone, status: "available", memberName: "", mobile: "", shift: "", lockerNo: "None", monthlyFee: 0, validTill: "" });
    saveLibraryProData();
    renderApp();
}

function exportLibraryProExcel() {
    loadLibraryProData();
    let csv = "SeatNo,Zone,Status,MemberName,Mobile,Shift,LockerNo,MonthlyFee,ValidTill\n";
    libSeatsPro.forEach(s => {
        csv += `${s.seatNo},"${s.zone}","${s.status}","${s.memberName}","${s.mobile}","${s.shift}","${s.lockerNo}",${s.monthlyFee},"${s.validTill}"\n`;
    });
    downloadCSVFile(csv, `${orgName}_Library_Seats_Report.csv`);
}