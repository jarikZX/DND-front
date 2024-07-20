import React from 'react';
import { Image as KonvaImage, Group, Rect } from 'react-konva';
import useImage from 'use-image';
import { Monster } from '../types';
import { arrayBufferToBase64 } from '../utils';
import './MonsterIcon.css';

interface MonsterIconProps {
  monster: Monster;
  index: number;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: (e: any, index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  highlight: boolean;
}

const MonsterIcon: React.FC<MonsterIconProps> = ({
  monster,
  index,
  onClick,
  onDragStart,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
  highlight,
}) => {
  const healthBarWidth = 45;
  const healthPercentage = (monster.health / monster.maxHealth) * 100;
  const [image] = useImage(`data:image/png;base64,${arrayBufferToBase64(monster.icon.data)}`);

  return (
    <Group
      x={monster.positionX}
      y={monster.positionY}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={(e) => onDragEnd(e, index)}
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
        image={image}
        width={45}
        height={45}
        className={monster.isFading ? 'fading' : ''}
      />
    </Group>
  );
};

export default MonsterIcon;
