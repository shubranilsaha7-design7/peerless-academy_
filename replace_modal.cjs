const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');

const newModalHtml = `
  <!-- ══ FOOLPROOF BATCH MODAL ══ -->
  <div id="batchModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 9999; justify-content: center; align-items: center; padding: 16px; flex-direction: column;">
    <!-- Glowing Border Wrapper -->
    <div style="position: relative; width: 100%; max-width: 400px; padding: 4px; border-radius: 20px; background: conic-gradient(#FF9933, #FFFFFF, #138808, #FFFFFF, #FF9933); animation: tricolorSpin 4s linear infinite; box-shadow: 0 0 30px rgba(255,153,51,0.4);">
      <!-- Inner Card -->
      <div style="background: #0f172a; border-radius: 16px; padding: 24px; color: #f8fafc; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; color: #FF9933;">📅 Batch Timings</h2>
          <button onclick="closeBatchModal()" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 14px; line-height: 1.5;">
          <p style="margin:0; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #FF9933;">
            <strong style="color:#FF9933; display:block; margin-bottom:4px;">Class V</strong>
            Thu (7-8:30 AM), Sun (10-11:30 AM), Mon (6:30-8 AM)
          </p>
          <p style="margin:0; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #FF9933;">
            <strong style="color:#FF9933; display:block; margin-bottom:4px;">Class VI</strong>
            Thu (7 AM), Sun (10 AM), Sat (3:30 PM)
          </p>
          <p style="margin:0; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #fff;">
            <strong style="color:#fff; display:block; margin-bottom:4px;">Class VII</strong>
            Mon (7-8:30 AM), Wed (7-8:30 AM), Sat (3:30-5 PM)
          </p>
          <p style="margin:0; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #fff;">
            <strong style="color:#fff; display:block; margin-bottom:4px;">Class VIII</strong>
            Sun (8:30-10 AM), Tue (6:45-8:30 AM), Thu (5:45-7:15 PM)
          </p>
          <p style="margin:0; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #138808;">
            <strong style="color:#138808; display:block; margin-bottom:4px;">Class IX</strong>
            Math (Sun 7-8:30 AM, Thu 7:15-8:45 PM)<br>
            Phy/Chem (Mon 5:30-7:15 PM Chem, Tue 5:30-7 PM Phy)<br>
            Bio (Sun 8:30-10 AM, Sat 6-7:30 PM)
          </p>
          <p style="margin:0; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #138808;">
            <strong style="color:#138808; display:block; margin-bottom:4px;">Class X</strong>
            Math (Wed 5:30-7 PM, Fri 7:30-9 PM, Sat 7-8:30 AM)<br>
            Phy/Chem (Mon 7-8:30 PM Chem, Sat 8:40-10 AM Phy)<br>
            Bio (Sun 7-8:30 AM, Sat 4-5:30 PM)
          </p>
        </div>
      </div>
    </div>
  </div>

  <script>
    function openBatchModal() {
      document.getElementById('batchModal').style.display = 'flex';
    }
    function closeBatchModal() {
      document.getElementById('batchModal').style.display = 'none';
    }
  </script>
`;

// Find and remove the old batch drawer
const batchStart = html.indexOf('<!-- ══ BATCH DRAWER (ANTI-GRAVITY) ══ -->');
if (batchStart !== -1) {
  // Let's find the closing </div> of the drawer. 
  // It's followed by <style>
  const styleStart = html.indexOf('<style>', batchStart);
  if (styleStart !== -1) {
    const styleEnd = html.indexOf('</style>', styleStart);
    if (styleEnd !== -1) {
      html = html.substring(0, batchStart) + html.substring(styleEnd + 8);
    }
  }
}

// Append new modal right before closing body tag
html = html.replace('</body>', newModalHtml + '\n</body>');

fs.writeFileSync('public/nfc.html', html, 'utf8');
console.log('Done!');
