const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');

const injectionPoint = `          });
        </script>
      </div>`;

const mentorsHtml = `

      <!-- 🌟 MENTORS BANNER -->
      <div class="card fade-up d4" style="text-align: center; overflow: hidden; padding: 15px; margin-bottom: 20px;">
        <div class="card-label" style="text-align: center; margin-bottom: 15px; font-size: 14px;">👨‍🏫 Our Expert Mentors</div>
        <div style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <img src="/images/gallery/mentors-banner-new.jpg" alt="Our Expert Guidance" style="width: 100%; height: auto; display: block;">
        </div>
      </div>
`;

if (html.includes(injectionPoint)) {
    html = html.replace(injectionPoint, injectionPoint + mentorsHtml);
    fs.writeFileSync('public/nfc.html', html, 'utf8');
    console.log('Mentors banner added to nfc.html');
} else {
    console.log('Injection point not found');
}
