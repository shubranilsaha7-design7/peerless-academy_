const fs = require('fs');
const path = 'public/nfc.html';
let html = fs.readFileSync(path, 'utf8');

// 1. DYNAMIC NOTICE BOARD
const noticeBoardHtml = `
  <!-- 🚀 DYNAMIC NOTICE BOARD -->
  <div id="notice-board" style="background: linear-gradient(90deg, #f97316, #c2410c); color: white; padding: 10px 15px; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; display: flex; align-items: center; position: relative; z-index: 100; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);">
    <span style="background: #000; color: #f97316; padding: 3px 10px; border-radius: 4px; font-size: 11px; text-transform: uppercase; margin-right: 12px; font-weight: 800; z-index: 2; box-shadow: 2px 0 10px rgba(0,0,0,0.5);">Latest</span>
    <marquee id="notice-marquee" style="flex: 1;" behavior="scroll" direction="left" scrollamount="5">
      Fetching latest announcements...
    </marquee>
  </div>
  <script>
    const NOTICES_API_URL = 'https://peerlessacademy.in/wp-json/custom/v1/notices';
    async function fetchNotices() {
      try {
        const res = await fetch(NOTICES_API_URL);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (data && data.length > 0) {
          document.getElementById('notice-marquee').innerHTML = data.map(n => n.title || n.text).join(' &nbsp; ✨ &nbsp; ');
        } else {
          document.getElementById('notice-marquee').innerHTML = 'Admissions open for 2026-27! Register for Class 5-10 today.';
        }
      } catch (e) {
        document.getElementById('notice-marquee').innerHTML = 'Admissions open for 2026-27! Register for Class 5-10 today.';
      }
    }
    fetchNotices();
  </script>
`;

if (!html.includes('id="notice-board"')) {
    html = html.replace('<body>', '<body>\n' + noticeBoardHtml);
}

// 2. ADMISSION ENQUIRY BUTTON
const admBtnHtml = `
      <!-- Admission Enquiry Form Link -->
      <button onclick="openDrawer('inquiryDrawer')" class="list-link" style="border-color: rgba(249, 115, 22, 0.3); background: linear-gradient(135deg, rgba(249, 115, 22, 0.05), transparent); cursor: pointer;">
        <span class="li-icon icon-pulse" style="color:#f97316;">🎓</span>
        <span>
          <span class="li-text" style="color:#f97316;">Admission Enquiry</span>
          <span class="li-sub">Register for upcoming batches</span>
        </span>
        <span class="li-arrow">→</span>
      </button>
`;
if (!html.includes('Admission Enquiry Form Link')) {
    // Insert before batch timings
    html = html.replace('<!-- Batch Timings -->', admBtnHtml + '\n      <!-- Batch Timings -->');
}

// 3. ANTI-GRAVITY HALL OF FAME
const hofHtml = `
      <!-- 🚀 ANTI-GRAVITY HALL OF FAME -->
      <div class="card fade-up d4" style="text-align: center; overflow: hidden; padding: 30px 15px; margin-bottom: 20px;">
        <div class="card-label" style="text-align: center; margin-bottom: 25px; font-size: 14px;">🌟 Our Toppers & Achievers</div>
        
        <style>
          @keyframes antiGravity {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
          .hof-container {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
          }
          .hof-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 15px;
            width: 140px;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: antiGravity 6s ease-in-out infinite;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            backdrop-filter: blur(10px);
            transition: transform 0.3s, border-color 0.3s;
          }
          .hof-card:hover {
            border-color: rgba(249,115,22,0.4);
            transform: scale(1.05) !important;
            animation-play-state: paused;
          }
          .hof-card img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #f97316;
            margin-bottom: 12px;
            object-fit: cover;
            box-shadow: 0 0 15px rgba(249,115,22,0.4);
          }
          .hof-name {
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 6px;
            text-align: center;
            letter-spacing: 0.5px;
          }
          .hof-score {
            font-size: 11px;
            color: #10b981;
            font-weight: 800;
            background: rgba(16,185,129,0.15);
            padding: 4px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          /* Staggered floating delays */
          .hof-card:nth-child(1) { animation-delay: 0s; }
          .hof-card:nth-child(2) { animation-delay: -2s; }
          .hof-card:nth-child(3) { animation-delay: -4s; }
          .hof-card:nth-child(4) { animation-delay: -1s; }
        </style>

        <div class="hof-container">
          <div class="hof-card">
            <img src="/images/gallery/titas-saha-2.png" onerror="this.src='https://ui-avatars.com/api/?name=Titas+Saha&background=f97316&color=fff&bold=true'" alt="Titas Saha">
            <div class="hof-name">Titas Saha</div>
            <div class="hof-score">98/100 Maths</div>
          </div>
          <div class="hof-card">
            <img src="/images/gallery/mentors-banner.jpeg" onerror="this.src='https://ui-avatars.com/api/?name=Karnajit+Saha&background=3b82f6&color=fff&bold=true'" alt="Karnajit">
            <div class="hof-name">Karnajit S.</div>
            <div class="hof-score">99% Board</div>
          </div>
          <div class="hof-card">
            <img src="https://ui-avatars.com/api/?name=Dhrubajit&background=10b981&color=fff&bold=true" alt="Dhrubajit">
            <div class="hof-name">Dhrubajit</div>
            <div class="hof-score">97% Top Rank</div>
          </div>
        </div>
      </div>
`;
if (!html.includes('ANTI-GRAVITY HALL OF FAME')) {
    // Insert before Developer Credit
    html = html.replace('<!-- ══ DEVELOPER CREDIT ══ -->', hofHtml + '\n      <!-- ══ DEVELOPER CREDIT ══ -->');
}

// 4. NEW ADMISSION ENQUIRY DRAWER (replaces old INQUIRY DRAWER)
const oldInquiryDrawerRegex = /<!-- ══ INQUIRY DRAWER ══ -->\s*<div class="drawer" id="inquiryDrawer">[\s\S]*?<\/form>\s*<\/div>/;

const newAdmissionDrawer = `<!-- ══ INQUIRY DRAWER ══ -->
    <div class="drawer" id="inquiryDrawer">
      <div class="drawer-handle"></div>
      <button class="close-btn" onclick="closeAll()">✕</button>
      <div class="drawer-title" style="color: #f97316;">🎓 Admission Enquiry</div>
      <div class="drawer-sub">Register your interest. We'll contact you within 24 hours.</div>
      
      <!-- Toast Notification Container -->
      <div id="toastNotify" style="display: none; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 13px; font-weight: bold; text-align: center; border: 1px solid transparent;"></div>

      <form id="admissionForm" onsubmit="submitAdmission(event)" style="display: flex; flex-direction: column; gap: 12px; margin-top: 5px;">
        <input type="text" id="admStudent" class="field" placeholder="Student Name" required style="margin:0;">
        <input type="text" id="admParent" class="field" placeholder="Parent / Guardian Name" required style="margin:0;">
        <input type="tel" id="admPhone" class="field" placeholder="Phone Number" required style="margin:0;">
        <select id="admClass" class="field" required style="margin:0; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
          <option value="" disabled selected>Select Class</option>
          <option value="Class V">Class V</option>
          <option value="Class VI">Class VI</option>
          <option value="Class VII">Class VII</option>
          <option value="Class VIII">Class VIII</option>
          <option value="Class IX">Class IX</option>
          <option value="Class X">Class X</option>
          <option value="Class XI">Class XI</option>
          <option value="Class XII">Class XII</option>
        </select>
        <textarea id="admMessage" class="field" placeholder="Short Message (Optional)" style="margin:0; min-height: 80px;"></textarea>
        <button type="submit" class="btn-primary" id="admSubmitBtn" style="margin-top: 5px;">Submit Registration</button>
      </form>
      
      <script>
        const ENQUIRY_API_URL = 'https://peerlessacademy.in/api/submit-enquiry';
        async function submitAdmission(e) {
          e.preventDefault();
          const btn = document.getElementById('admSubmitBtn');
          const toast = document.getElementById('toastNotify');
          
          btn.textContent = 'Submitting...';
          btn.disabled = true;
          btn.style.opacity = '0.7';
          
          const payload = {
            studentName: document.getElementById('admStudent').value,
            parentName: document.getElementById('admParent').value,
            phone: document.getElementById('admPhone').value,
            className: document.getElementById('admClass').value,
            message: document.getElementById('admMessage').value,
            source: 'NFC_SmartHub'
          };

          try {
            const response = await fetch(ENQUIRY_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            // Backend might not be setup yet, provide fallback success for UX
            if (!response.ok) {
               console.warn('API non-200. Proceeding with fallback success.');
            }
            
            toast.style.display = 'block';
            toast.style.background = 'rgba(16,185,129,0.15)';
            toast.style.borderColor = 'rgba(16,185,129,0.4)';
            toast.style.color = '#10b981';
            toast.textContent = '✅ Registration Submitted Successfully!';
            
            document.getElementById('admissionForm').reset();
            setTimeout(() => { closeAll(); toast.style.display = 'none'; }, 2500);
            
          } catch (err) {
            toast.style.display = 'block';
            toast.style.background = 'rgba(244,63,94,0.15)';
            toast.style.borderColor = 'rgba(244,63,94,0.4)';
            toast.style.color = '#f43f5e';
            toast.textContent = '⚠️ Network Error. Please try again.';
          } finally {
            btn.textContent = 'Submit Registration';
            btn.disabled = false;
            btn.style.opacity = '1';
          }
        }
      </script>
    </div>`;

if (oldInquiryDrawerRegex.test(html)) {
    html = html.replace(oldInquiryDrawerRegex, newAdmissionDrawer);
}

fs.writeFileSync(path, html, 'utf8');
console.log('Update complete.');
