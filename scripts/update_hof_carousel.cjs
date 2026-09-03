const fs = require('fs');
const path = 'public/nfc.html';
let html = fs.readFileSync(path, 'utf8');

const newCarouselHtml = `<!-- 🚀 HALL OF FAME CAROUSEL -->
      <div class="card fade-up d4" style="text-align: center; overflow: hidden; padding: 25px 0; margin-bottom: 20px;">
        <div class="card-label" style="text-align: center; margin-bottom: 20px; font-size: 14px;">🌟 Our Achievers</div>
        
        <style>
          .hof-slider {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            padding: 0 15px 15px 15px;
            gap: 15px;
            scrollbar-width: none; /* Firefox */
          }
          .hof-slider::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
          }
          .hof-slide {
            scroll-snap-align: center;
            flex: 0 0 100%;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.05);
          }
          .hof-slide img {
            width: 100%;
            height: auto;
            display: block;
            aspect-ratio: 1 / 1;
            object-fit: cover;
          }
          .swipe-indicator {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin-top: 5px;
          }
          .swipe-dot {
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
          }
          .swipe-dot.active {
            background: #f97316;
            width: 12px;
            border-radius: 4px;
          }
        </style>

        <div class="hof-slider" id="hofSlider">
          <div class="hof-slide">
            <img src="/images/toppers_2023.jpg" alt="10th Boards Toppers 2023">
          </div>
          <div class="hof-slide">
            <img src="/images/toppers_2025.jpg" alt="Achievers of Peerless Academy 2025">
          </div>
        </div>
        
        <div class="swipe-indicator">
          <div class="swipe-dot active" id="dot1"></div>
          <div class="swipe-dot" id="dot2"></div>
        </div>
        
        <script>
          const slider = document.getElementById('hofSlider');
          const dot1 = document.getElementById('dot1');
          const dot2 = document.getElementById('dot2');
          
          slider.addEventListener('scroll', () => {
            const scrollLeft = slider.scrollLeft;
            const width = slider.clientWidth;
            if (scrollLeft > width / 2) {
              dot1.classList.remove('active');
              dot2.classList.add('active');
            } else {
              dot2.classList.remove('active');
              dot1.classList.add('active');
            }
          });
        </script>
      </div>`;

const startMarker = '<!-- 🚀 ANTI-GRAVITY HALL OF FAME -->';
const endMarker = '<!-- ══ DEVELOPER CREDIT ══ -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + newCarouselHtml + '\n      ' + html.substring(endIndex);
  fs.writeFileSync(path, html);
  console.log('Update complete.');
} else {
  console.error('Could not find markers.');
}
