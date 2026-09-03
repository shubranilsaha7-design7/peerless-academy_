const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');

// 1. Name correction
html = html.replace(/Prasenjit Debnath/g, 'Prasenjit Chakraborty');

// 2. Trademark badge
html = html.replace('Systems Online &amp; Verified', 'EDUCATIONAL HUB &copy; ESTD. 2016');

// 3. Email Link Fix
html = html.replace(
  '<button onclick="open(\'inquiryDrawer\')" class="qa-btn">',
  '<a href="mailto:info@peerlessacademy.in" class="qa-btn">'
);
html = html.replace(
  '          <div class="qa-icon">✉️</div>\n          <span class="qa-label">Email</span>\n        </button>',
  '          <div class="qa-icon">✉️</div>\n          <span class="qa-label">Email</span>\n        </a>'
);

// 4. Quick Links Reorganization (Insert Batch Timings)
const batchTimingsBtn = `
      <!-- Batch Timings -->
      <button onclick="open('batchDrawer')" class="list-link" style="border: none; background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), transparent); width: 100%; cursor: pointer;">
        <span class="li-icon" style="color:#60a5fa;">📅</span>
        <span>
          <span class="li-text" style="color:#60a5fa;">Batch Timings</span>
          <span class="li-sub">View Class 5-10 schedules</span>
        </span>
        <span class="li-arrow">›</span>
      </button>
`;
html = html.replace(
  '      <!-- Instagram - Correctly wired -->',
  batchTimingsBtn + '\n      <!-- Instagram - Correctly wired -->'
);

// 5. CBT Direct Link
html = html.replace('href="/cbt"', 'href="https://peerlessacademy.in/cbt"');

// 6. FAB Update (Share -> Install)
html = html.replace(
  '<button class="fab" onclick="shareHub()">\n    <span class="fab-icon">🔗</span>\n    <span>Share Profile</span>\n  </button>',
  '<button class="fab" onclick="installApp()">\n    <span class="fab-icon" style="animation:none;">📱</span>\n    <span>Install App</span>\n  </button>'
);

// 7. Developer Credit
html = html.replace(
  '    <!-- ══ SMART REVIEW ROUTING ══ -->',
  '    <!-- ══ DEVELOPER CREDIT ══ -->\n    <div style="text-align:center; font-size:11px; color:#64748b; margin-top:40px; margin-bottom: 20px;">Lead Architect: Shubranil Saha</div>\n\n    <!-- ══ SMART REVIEW ROUTING ══ -->'
);

// 8. Add Batch Drawer and PWA logic (Append before </body>)
const batchDrawerHtml = `
  <!-- ══ BATCH DRAWER (ANTI-GRAVITY) ══ -->
  <div class="drawer" id="batchDrawer" style="background: transparent; box-shadow: none; padding: 0;">
    <div style="position: relative; border-radius: 32px 32px 0 0; padding: 4px; background: conic-gradient(#FF9933, #ffffff, #138808, #ffffff, #FF9933); animation: tricolorSpin 5s linear infinite; box-shadow: 0 -10px 40px rgba(255,153,51,0.3);">
      <div style="background: rgba(9,12,18,0.97); border-radius: 28px 28px 0 0; padding: 36px 24px 48px; animation: modalFloat 4s ease-in-out infinite;">
        <div class="drawer-handle"></div>
        <button class="close-btn" onclick="closeAll()">✕</button>
        <div class="drawer-title" style="color: #fff;">📅 Batch Timings</div>
        <div class="drawer-sub">Official Class Schedule</div>
        
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#FF9933;">[Class 5]</strong><br><span style="font-size:13px; color:#ccc;">Thu 7-8:30 AM, Sun 10-11:30 AM, Mon 6:30-8 AM</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#FF9933;">[Class 6]</strong><br><span style="font-size:13px; color:#ccc;">Thu 7 AM, Sun 10 AM, Sat 3:30 PM</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#fff;">[Class 7]</strong><br><span style="font-size:13px; color:#ccc;">Mon 7-8:30 AM, Wed 7-8:30 AM, Sat 3:30-5 PM</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#fff;">[Class 8]</strong><br><span style="font-size:13px; color:#ccc;">Sun 8:30-10 AM, Tue 6:45-8:30 AM, Thu 5:45-7:15 PM</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#138808;">[Class 9]</strong><br><span style="font-size:13px; color:#ccc;">Math: Sun 7-8:30 AM, Thu 7:15-8:45 PM<br>Phy/Chem: Mon 5:30-7:15 PM (Chem), Tue 5:30-7 PM (Phy)<br>Bio: Sun 8:30-10 AM, Sat 6-7:30 PM</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#138808;">[Class 10]</strong><br><span style="font-size:13px; color:#ccc;">Math: Wed 5:30-7 PM, Fri 7:30-9 PM, Sat 7-8:30 AM<br>Phy/Chem: Mon 7-8:30 PM (Chem), Sat 8:40-10 AM (Phy)<br>Bio: Sun 7-8:30 AM, Sat 4-5:30 PM</span></div>
        </div>
      </div>
    </div>
  </div>

  <style>
    @keyframes modalFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  </style>

  <script>
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    async function installApp() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else {
        alert("App installation is not supported on this browser, or the app is already installed.");
      }
    }
  </script>
</body>
`;

html = html.replace('</body>', batchDrawerHtml);

fs.writeFileSync('public/nfc.html', html);
console.log('Update script completed.');
