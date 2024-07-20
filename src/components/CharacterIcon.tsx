import React from 'react';
import { Image as KonvaImage, Group, Rect } from 'react-konva';
import './CharacterIcon.css';

interface CharacterIconProps {
  characterImage: HTMLImageElement;
  characterPosition: { x: number; y: number };
  characterHealth: number;
  characterMaxHealth: number;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  highlight: boolean;
  isFading: boolean;
}

const CharacterIcon: React.FC<CharacterIconProps> = ({
  characterImage,
  characterPosition,
  characterHealth,
  characterMaxHealth,
  onClick,
  onDragStart,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
  highlight,
  isFading,
}) => {
  const healthBarWidth = 45;
  const healthPercentage = (characterHealth / characterMaxHealth) * 100;

  return (
    <Group
      x={characterPosition.x}
      y={characterPosition.y}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {highlight && <Rect width={45} height={45} stroke="red" strokeWidth={2} />}
      <Rect
        x={0}
        y={-10}
        width={healthBarWidth}
        height={5}
        fill="gray"
      />
      <Rect
        x={0}
        y={-10}
        width={(healthPercentage / 100) * healthBarWidth}
        height={5}
        fill="red"
      />
      <KonvaImage
        image={characterImage}
        width={45}
        height={45}
        className={isFading ? 'fading' : ''}
      />
    </Group>
  );
};

export default CharacterIcon;
