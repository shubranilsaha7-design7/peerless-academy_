const fs = require('fs');
const path = 'public/nfc.html';
let html = fs.readFileSync(path, 'utf8');

const newPaymentDrawer = `<!-- ══ PAYMENT DRAWER ══ -->
  <div class="drawer" id="paymentDrawer" style="text-align: center; background: rgba(15,23,42,0.95); backdrop-filter: blur(16px);">
    <div class="drawer-handle"></div>
    <button class="close-btn" onclick="closeAll()">✕</button>
    
    <!-- Animated Header -->
    <div class="drawer-title" style="margin-top: 10px; margin-bottom: 5px; background: linear-gradient(90deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Secure UPI Payment</div>
    <div class="drawer-sub" style="margin-bottom: 20px;">Zero redirect fails. 100% Secure.</div>
    
    <!-- Direct UPI Payment with Pulse -->
    <style>
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      .btn-upi {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 16px;
        padding: 16px;
        font-size: 16px;
        font-weight: 800;
        text-decoration: none;
        animation: pulseGlow 2s infinite;
        transition: transform 0.2s;
      }
      .btn-upi:active { transform: scale(0.95); }
      @keyframes floatQR {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    </style>
    <a href="upi://pay?pa=xprasenjit1992-1@okhdfcbank&pn=PEERLESS%20ACADEMY&cu=INR" class="btn-upi" style="margin: 0 auto; width: 100%; max-width: 280px; display: flex; justify-content: center; align-items: center; gap: 10px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      Pay via UPI App
    </a>

    <!-- Divider -->
    <div style="display: flex; align-items: center; margin: 25px auto; max-width: 280px; color: #475569; font-size: 12px; font-weight: bold; text-transform: uppercase;">
      <div style="flex: 1; height: 1px; background: #334155;"></div>
      <div style="padding: 0 10px;">OR SCAN QR</div>
      <div style="flex: 1; height: 1px; background: #334155;"></div>
    </div>
    
    <!-- Scan QR Code -->
    <div style="background: white; padding:12px; border-radius: 20px; display:inline-block; margin: 0 auto; width: 220px; height: 220px; position: relative; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.2); animation: floatQR 4s ease-in-out infinite;">
      <img src="/images/peerless_qr.png" alt="Peerless Academy QR Code" style="width:100%; height:100%; border-radius: 12px; object-fit: contain;">
    </div>
    
    <!-- UPI ID Text and Copy -->
    <div class="upi-box" style="margin-top:25px; max-width: 320px; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 13px; color: #94a3b8;">UPI ID: <span id="upiIdText" style="color: #f8fafc; font-weight: bold;">xprasenjit1992-1@okhdfcbank</span></div>
      <button class="copy-btn" onclick="copyUPI()" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: #f8fafc; font-weight: 600; cursor: pointer; transition: all 0.2s;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        Copy to clipboard
      </button>
    </div>
  </div>`;

const startMarker = '<!-- ══ PAYMENT DRAWER ══ -->';
const endMarker = '<!-- ══ INQUIRY DRAWER ══ -->';
const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + newPaymentDrawer + '\n  ' + html.substring(endIndex);
  fs.writeFileSync(path, html);
  console.log('Update completed successfully.');
} else {
  console.error('Could not find payment drawer markers.');
}
