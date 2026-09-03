const fs = require('fs');
const path = 'public/nfc.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Replace developer credit with LinkedIn link
html = html.replace(
  '<div style="text-align:center; font-size:11px; color:#64748b; margin-top:40px; margin-bottom: 20px;">Lead Architect: Shubranil Saha</div>',
  '<a href="https://www.linkedin.com/in/shubranil-saha-b463613b3?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" style="display:block; text-align:center; font-size:11px; color:#64748b; margin-top:40px; margin-bottom: 20px; text-decoration:none;">Lead Architect: Shubranil Saha</a>'
);

// 2. Replace the payment drawer
const oldPaymentDrawerRegex = /<!-- ══ PAYMENT DRAWER ══ -->\s*<div class="drawer" id="paymentDrawer">([\s\S]*?)<\/div>\s*(?=<!-- ══ INQUIRY DRAWER ══ -->)/g;
// NOTE: wait, the original html has emojis, the regex might fail if not careful. Let's just use string replace.
// Instead of full block, let's just replace UPI URLs and IDs, or replace the whole block dynamically.

// Let's replace the whole drawer string if we can match it.
const newPaymentDrawer = `<!-- ══ PAYMENT DRAWER ══ -->
  <div class="drawer" id="paymentDrawer" style="text-align: center;">
    <div class="drawer-handle"></div>
    <button class="close-btn" onclick="closeAll()">✕</button>
    
    <!-- Direct UPI Payment -->
    <div class="drawer-title" style="margin-top: 10px; margin-bottom: 5px;">Direct UPI Payment</div>
    <a href="upi://pay?pa=xprasenjit1992-1@okhdfcbank&pn=PEERLESS%20ACADEMY" class="btn-primary" style="margin: 15px auto; width: 100%; max-width: 300px; display: flex; justify-content: center; align-items: center; gap: 8px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      Pay via UPI App
    </a>

    <!-- Scan QR Code -->
    <div class="drawer-title" style="margin-top: 25px; margin-bottom: 5px;">Scan QR Code</div>
    <div class="drawer-sub" style="margin-bottom: 15px;">Scan to pay with any UPI app</div>
    
    <div style="background:#1e293b; padding:16px; border-radius:16px; display:inline-block; margin: 0 auto; width: 220px; height: 220px; border: 1px dashed #475569; position: relative; display: flex; justify-content: center; align-items: center;">
      <span style="color: #94a3b8; font-size: 13px;">[ QR Code Placeholder ]<br><br><small>(Google Pay QR asset goes here)</small></span>
    </div>
    
    <!-- UPI ID Text and Copy -->
    <div class="upi-box" style="margin-top:25px; max-width: 320px; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 13px; color: #94a3b8;">UPI ID: <span id="upiIdText" style="color: #f8fafc; font-weight: bold;">xprasenjit1992-1@okhdfcbank</span></div>
      <button class="copy-btn" onclick="copyUPI()" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        Copy to clipboard
      </button>
    </div>
  </div>
`;

// Let's use a simpler replace strategy for the drawer.
const startMarker = '<!-- ══ PAYMENT DRAWER ══ -->';
const endMarker = '<!-- ══ INQUIRY DRAWER ══ -->';
const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + newPaymentDrawer + html.substring(endIndex);
  fs.writeFileSync(path, html);
  console.log('Update completed successfully.');
} else {
  console.error('Could not find payment drawer markers.');
}
