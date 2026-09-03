const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');

// 1. Fix Google Maps Link (assuming the string exists like https://maps.app.goo.gl/Peerless+Academy+Agartala)
html = html.replace(/https:\/\/maps\.app\.goo\.gl\/[^\"]+/g, 'https://www.google.com/maps/search/?api=1&query=Peerless+Academy+Indranagar+Agartala');

// 2. Fix Google Review Redirect
html = html.replace(/https:\/\/search\.google\.com\/local\/writereview\?placeid=ChIJ8_Wk4P24QzAR29o9V2H1_L0/g, 'https://g.page/r/CUSh6m5f99nNEBE/review');

// 3. Fix VCard logic
html = html.replace(/FN:Prasenjit Chakraborty/g, 'FN:Prasenjit Chakraborty\nN:Chakraborty;Prasenjit;;;');

// 4. Update Payment Drawer for QR Code Fallback
const newPaymentDrawer = `
  <!-- ══ PAYMENT DRAWER ══ -->
  <div class="drawer" id="paymentDrawer">
    <div class="drawer-handle"></div>
    <button class="close-btn" onclick="closeAll()">✕</button>
    <div class="drawer-title">💳 Secure Fee Payment</div>
    <div class="drawer-sub">Tap below to open UPI apps, or scan the QR code if you are on a desktop.</div>

    <a href="upi://pay?pa=8794130855@ybl&pn=Peerless%20Academy&cu=INR" class="btn-primary" style="margin-bottom:20px;">
      🚀 Open UPI App (GPay / PhonePe / Paytm)
    </a>

    <div style="text-align:center; margin-bottom: 10px; color: var(--text-muted); font-size: 13px;">Or scan with any UPI app:</div>
    <div style="background:#fff; padding:16px; border-radius:16px; display:inline-block; margin: 0 auto; width: 220px; height: 220px;">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=8794130855@ybl&pn=Peerless%20Academy&cu=INR" alt="UPI QR Code" style="width:100%; height:100%;">
    </div>
    
    <div class="upi-box" style="margin-top:20px;">
      <div class="upi-id" id="upiIdText">8794130855@ybl</div>
      <button class="copy-btn" onclick="copyUPI()">📋 Copy UPI ID</button>
    </div>
  </div>
`;

// use string match for accurate replacement
const paymentDrawerStart = html.indexOf('<!-- ══ PAYMENT DRAWER ══ -->');
const inquiryDrawerStart = html.indexOf('<!-- ══ INQUIRY DRAWER ══ -->');
if (paymentDrawerStart !== -1 && inquiryDrawerStart !== -1) {
  html = html.substring(0, paymentDrawerStart) + newPaymentDrawer + '\n\n  ' + html.substring(inquiryDrawerStart);
}

// 5. Fix Batch Timings Modal
const newBatchDrawerHtml = `
  <!-- ══ BATCH DRAWER (ANTI-GRAVITY) ══ -->
  <div class="drawer" id="batchDrawer" style="background: transparent; box-shadow: none; padding: 0; pointer-events: none;">
    <div style="pointer-events: auto; position: relative; border-radius: 32px 32px 0 0; padding: 4px; background: conic-gradient(#FF9933, #ffffff, #138808, #ffffff, #FF9933); animation: tricolorSpin 5s linear infinite; box-shadow: 0 -10px 40px rgba(255,153,51,0.3); max-height: 85vh; display: flex; flex-direction: column;">
      <div style="background: #07090e; border-radius: 28px 28px 0 0; padding: 36px 24px 48px; animation: modalFloat 4s ease-in-out infinite; overflow-y: auto; flex: 1;">
        <div class="drawer-handle"></div>
        <button class="close-btn" onclick="closeAll()">✕</button>
        <div class="drawer-title" style="color: #fff;">📅 Batch Timings</div>
        <div class="drawer-sub">Official Class Schedule</div>
        
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#FF9933;">Class V</strong><br><span style="font-size:13px; color:#ccc;">Thu (7-8:30 AM), Sun (10-11:30 AM), Mon (6:30-8 AM)</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#FF9933;">Class VI</strong><br><span style="font-size:13px; color:#ccc;">Thu (7 AM), Sun (10 AM), Sat (3:30 PM)</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#fff;">Class VII</strong><br><span style="font-size:13px; color:#ccc;">Mon (7-8:30 AM), Wed (7-8:30 AM), Sat (3:30-5 PM)</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#fff;">Class VIII</strong><br><span style="font-size:13px; color:#ccc;">Sun (8:30-10 AM), Tue (6:45-8:30 AM), Thu (5:45-7:15 PM)</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#138808;">Class IX</strong><br><span style="font-size:13px; color:#ccc;">Math: Sun 7-8:30 AM, Thu 7:15-8:45 PM<br>Phy/Chem: Mon 5:30-7:15 PM (Chem), Tue 5:30-7 PM (Phy)<br>Bio: Sun 8:30-10 AM, Sat 6-7:30 PM</span></div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px;"><strong style="color:#138808;">Class X</strong><br><span style="font-size:13px; color:#ccc;">Math: Wed 5:30-7 PM, Fri 7:30-9 PM, Sat 7-8:30 AM<br>Phy/Chem: Mon 7-8:30 PM (Chem), Sat 8:40-10 AM (Phy)<br>Bio: Sun 7-8:30 AM, Sat 4-5:30 PM</span></div>
        </div>
      </div>
    </div>
  </div>
`;

// Extract and replace Batch drawer carefully
const batchDrawerStart = html.indexOf('<!-- ══ BATCH DRAWER');
const styleTagStart = html.indexOf('<style>', batchDrawerStart);

if (batchDrawerStart !== -1 && styleTagStart !== -1) {
  html = html.substring(0, batchDrawerStart) + newBatchDrawerHtml + '\n\n' + html.substring(styleTagStart);
} else {
  console.log("Could not find batch drawer boundaries exactly, attempting fallback.");
}

fs.writeFileSync('public/nfc.html', html, 'utf8');
console.log('Update script completed successfully.');
