const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AiRoadmapArchitect.tsx', 'utf8');

code = code.replace(
  /setRoadmap\(JSON\.parse\(result\.response\.text\(\)\)\);/,
  `let text = result.response.text();
      text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      setRoadmap(JSON.parse(text));`
);

fs.writeFileSync('src/components/dashboard/AiRoadmapArchitect.tsx', code);
