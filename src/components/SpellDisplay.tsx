import React, { useState } from 'react';
import { Group, Image as KonvaImage, Text as KonvaText, Rect as KonvaRect } from 'react-konva';
import { Spell } from '../types';
import './SpellDisplay.css';

interface SpellDisplayProps {
  spells: Spell[];
  positionX: number;
  positionY: number;
  visible: boolean;
  onSelectSpell: (spell: Spell) => void;
  selectedSpell: Spell | null;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const SpellDisplay: React.FC<SpellDisplayProps> = ({ spells, positionX, positionY, visible, onSelectSpell, selectedSpell }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
  });

  if (!visible) return null;

  const positions = [
    { offsetX: -25, offsetY: -60 },
    { offsetX: 25, offsetY: -60 },
    { offsetX: -25, offsetY: -110 },
    { offsetX: 25, offsetY: -110 },
  ];

  return (
    <Group x={positionX} y={positionY} visible={visible}>
      {spells.map((spell, index) => {
        const base64Flag = 'data:image/png;base64,';
        const imageStr = arrayBufferToBase64(spell.icon.data);
        const imageUrl = base64Flag + imageStr;

        const img = new Image();
        img.src = imageUrl;

        const pos = positions[index % positions.length] || { offsetX: 0, offsetY: 0 };

        return (
          <Group key={spell.id} onClick={() => onSelectSpell(spell)}>
            {selectedSpell && selectedSpell.id === spell.id && (
              <KonvaRect
                x={pos.offsetX - 5}
                y={pos.offsetY - 5}
                width={55}
                height={55}
                stroke="gold"
                strokeWidth={4}
              />
            )}
            <KonvaImage
              image={img}
              x={pos.offsetX}
              y={pos.offsetY}
              width={45}
              height={45}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                const mousePos = stage?.getPointerPosition();
                if (mousePos) {
                  setTooltip({
                    visible: true,
                    x: pos.offsetX,
                    y: pos.offsetY - 30,
                    text: `${spell.spellName}\nУрон: ${spell.power}`,
                  });
                }
              }}
              onMouseLeave={() => {
                setTooltip({ visible: false, x: 0, y: 0, text: '' });
              }}
            />
          </Group>
        );
      })}
      {tooltip.visible && (
        <Group x={tooltip.x} y={tooltip.y}>
          <KonvaRect
            width={100}
            height={40}
            fill="black"
            stroke="white"
            strokeWidth={0.5}
            cornerRadius={5}
          />
          <KonvaText
            text={tooltip.text}
            fontSize={15}
            padding={5}
            fill="white"
            width={100}
            align="center"
          />
        </Group>
      )}
    </Group>
  );
};

export default SpellDisplay;
