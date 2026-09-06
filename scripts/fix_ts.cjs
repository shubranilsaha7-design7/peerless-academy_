const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationLab.tsx', 'utf8');

content = content.replace(
  `beamRef.current.material.opacity = polarization ? 0.3 + Math.sin(clock.elapsedTime * 5) * 0.1 : 0.8;`,
  `if (beamRef.current.material instanceof THREE.Material) { (beamRef.current.material as THREE.MeshStandardMaterial).opacity = polarization ? 0.3 + Math.sin(clock.elapsedTime * 5) * 0.1 : 0.8; }`
);

content = content.replace(
  `aortaRef.current.material.color.setHex(0xeab308); // Calcified yellow`,
  `if (aortaRef.current.material instanceof THREE.Material) { (aortaRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xeab308); } // Calcified yellow`
);

content = content.replace(
  `aortaRef.current.material.color.setHex(0xef4444); // Normal red`,
  `if (aortaRef.current.material instanceof THREE.Material) { (aortaRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xef4444); } // Normal red`
);

fs.writeFileSync('src/components/SimulationLab.tsx', content);
