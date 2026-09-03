const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherHub.tsx', 'utf8');

const injectionPoint = '<div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">';

const bannerHtml = `
        {/* Mentor Banner Image */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl">
          <img 
            src="/images/gallery/mentors-banner-new.jpg" 
            alt="Our Expert Guidance" 
            className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">`;

if (code.includes(injectionPoint)) {
    code = code.replace(injectionPoint, bannerHtml);
    fs.writeFileSync('src/components/TeacherHub.tsx', code, 'utf8');
    console.log('Injected banner into TeacherHub');
} else {
    console.log('Injection point not found in TeacherHub');
}
