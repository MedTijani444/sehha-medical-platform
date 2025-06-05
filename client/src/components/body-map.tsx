import React from 'react';

interface BodyMapProps {
  selectedAreas: string[];
  onSelectionChange: (areas: string[]) => void;
  className?: string;
}

interface BodyPart {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'circle' | 'ellipse' | 'rect';
}

const bodyParts: BodyPart[] = [
  // Head and Face
  { id: 'tete', name: 'Tête', x: 185, y: 30, width: 80, height: 80, shape: 'circle' },
  { id: 'front', name: 'Front', x: 175, y: 40, width: 100, height: 30, shape: 'ellipse' },
  { id: 'yeux', name: 'Yeux', x: 180, y: 55, width: 90, height: 15, shape: 'ellipse' },
  { id: 'nez', name: 'Nez', x: 215, y: 70, width: 20, height: 15, shape: 'ellipse' },
  { id: 'bouche', name: 'Bouche', x: 205, y: 85, width: 40, height: 10, shape: 'ellipse' },
  { id: 'oreilles', name: 'Oreilles', x: 160, y: 60, width: 20, height: 30, shape: 'ellipse' },

  // Neck and Torso
  { id: 'cou', name: 'Cou', x: 210, y: 110, width: 30, height: 25, shape: 'rect' },
  { id: 'epaules', name: 'Épaules', x: 150, y: 130, width: 150, height: 25, shape: 'ellipse' },
  { id: 'poitrine', name: 'Poitrine', x: 180, y: 155, width: 90, height: 60, shape: 'ellipse' },
  { id: 'abdomen', name: 'Abdomen', x: 185, y: 215, width: 80, height: 70, shape: 'ellipse' },
  { id: 'dos', name: 'Dos', x: 185, y: 155, width: 80, height: 130, shape: 'ellipse' },

  // Arms
  { id: 'bras_gauche', name: 'Bras gauche', x: 120, y: 155, width: 35, height: 80, shape: 'ellipse' },
  { id: 'bras_droit', name: 'Bras droit', x: 295, y: 155, width: 35, height: 80, shape: 'ellipse' },
  { id: 'coude_gauche', name: 'Coude gauche', x: 125, y: 235, width: 25, height: 25, shape: 'circle' },
  { id: 'coude_droit', name: 'Coude droit', x: 300, y: 235, width: 25, height: 25, shape: 'circle' },
  { id: 'avant_bras_gauche', name: 'Avant-bras gauche', x: 115, y: 260, width: 35, height: 80, shape: 'ellipse' },
  { id: 'avant_bras_droit', name: 'Avant-bras droit', x: 300, y: 260, width: 35, height: 80, shape: 'ellipse' },
  { id: 'poignet_gauche', name: 'Poignet gauche', x: 125, y: 340, width: 15, height: 15, shape: 'circle' },
  { id: 'poignet_droit', name: 'Poignet droit', x: 310, y: 340, width: 15, height: 15, shape: 'circle' },
  { id: 'main_gauche', name: 'Main gauche', x: 110, y: 355, width: 40, height: 50, shape: 'ellipse' },
  { id: 'main_droite', name: 'Main droite', x: 300, y: 355, width: 40, height: 50, shape: 'ellipse' },

  // Lower body
  { id: 'hanche', name: 'Hanche', x: 185, y: 285, width: 80, height: 40, shape: 'ellipse' },
  { id: 'cuisse_gauche', name: 'Cuisse gauche', x: 165, y: 325, width: 40, height: 90, shape: 'ellipse' },
  { id: 'cuisse_droite', name: 'Cuisse droite', x: 245, y: 325, width: 40, height: 90, shape: 'ellipse' },
  { id: 'genou_gauche', name: 'Genou gauche', x: 175, y: 415, width: 20, height: 20, shape: 'circle' },
  { id: 'genou_droit', name: 'Genou droit', x: 255, y: 415, width: 20, height: 20, shape: 'circle' },
  { id: 'mollet_gauche', name: 'Mollet gauche', x: 165, y: 435, width: 35, height: 80, shape: 'ellipse' },
  { id: 'mollet_droit', name: 'Mollet droit', x: 250, y: 435, width: 35, height: 80, shape: 'ellipse' },
  { id: 'cheville_gauche', name: 'Cheville gauche', x: 175, y: 515, width: 15, height: 15, shape: 'circle' },
  { id: 'cheville_droite', name: 'Cheville droite', x: 260, y: 515, width: 15, height: 15, shape: 'circle' },
  { id: 'pied_gauche', name: 'Pied gauche', x: 155, y: 530, width: 50, height: 25, shape: 'ellipse' },
  { id: 'pied_droit', name: 'Pied droit', x: 245, y: 530, width: 50, height: 25, shape: 'ellipse' },
];

export default function BodyMap({ selectedAreas, onSelectionChange, className }: BodyMapProps) {
  const handleBodyPartClick = (bodyPartId: string) => {
    onSelectionChange([bodyPartId]);
  };

  const isSelected = (bodyPartId: string) => selectedAreas.includes(bodyPartId);

  const renderBodyPart = (part: BodyPart) => {
    const selected = isSelected(part.id);
    const fillColor = selected ? '#ef4444' : '#fbbf24';
    const strokeColor = selected ? '#dc2626' : '#f59e0b';
    const opacity = selected ? 0.8 : 0.6;

    const commonProps = {
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
      opacity: opacity,
      style: { cursor: 'pointer' },
      onClick: () => handleBodyPartClick(part.id),
      className: 'transition-all duration-200 hover:opacity-90 hover:stroke-width-3'
    };

    if (part.shape === 'circle') {
      return (
        <circle
          key={part.id}
          cx={part.x + part.width / 2}
          cy={part.y + part.height / 2}
          r={part.width / 2}
          {...commonProps}
        />
      );
    } else if (part.shape === 'ellipse') {
      return (
        <ellipse
          key={part.id}
          cx={part.x + part.width / 2}
          cy={part.y + part.height / 2}
          rx={part.width / 2}
          ry={part.height / 2}
          {...commonProps}
        />
      );
    } else {
      return (
        <rect
          key={part.id}
          x={part.x}
          y={part.y}
          width={part.width}
          height={part.height}
          rx={5}
          {...commonProps}
        />
      );
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative w-full max-w-md mx-auto bg-gradient-to-b from-blue-50 to-white rounded-xl p-6 shadow-lg border">
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
          Sélectionnez la zone concernée
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Cliquez sur la partie du corps où vous ressentez les symptômes
        </p>
        
        <svg
          viewBox="0 0 450 580"
          className="w-full h-auto mx-auto"
          style={{ maxHeight: '600px' }}
        >
          {/* Background figure outline */}
          <g>
            {/* Head outline */}
            <ellipse cx="225" cy="70" rx="45" ry="50" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Body outline */}
            <ellipse cx="225" cy="200" rx="50" ry="80" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
            <ellipse cx="225" cy="320" rx="45" ry="60" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Arms outline */}
            <ellipse cx="137" cy="190" rx="20" ry="50" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="313" cy="190" rx="20" ry="50" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="125" cy="290" rx="18" ry="45" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="325" cy="290" rx="18" ry="45" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            
            {/* Legs outline */}
            <ellipse cx="195" cy="430" rx="25" ry="70" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="255" cy="430" rx="25" ry="70" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="190" cy="520" rx="20" ry="45" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="260" cy="520" rx="20" ry="45" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Clickable body parts */}
          {bodyParts.map(renderBodyPart)}
        </svg>

        {selectedAreas.length > 0 && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Zone sélectionnée: {bodyParts.find(part => part.id === selectedAreas[0])?.name}
            </p>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>💡 Conseil: Cliquez directement sur la zone douloureuse pour une sélection précise</p>
        </div>
      </div>
    </div>
  );
}