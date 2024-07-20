import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stage, Layer, Rect, Group, Line } from 'react-konva';
import './SessionInterface.css';
import MonsterSelection from './MonsterSelection';
import SpellDisplay from './SpellDisplay';
import CharacterIcon from './CharacterIcon';
import MonsterIcon from './MonsterIcon';
import useSessionData from '../hooks/useSessionData';
import { Monster, Spell } from '../types';
import { fetchSpellsForCharacter, fetchSpellsForMonster } from '../api';

const SessionInterface: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    session,
    error,
    mapData,
    character,
    characterPosition,
    characterImage,
    spawnedMonsters,
    loading,
    setCharacterPosition,
    setSpawnedMonsters,
  } = useSessionData(id);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [spellDisplayVisible, setSpellDisplayVisible] = useState(false);
  const [spellDisplayPosition, setSpellDisplayPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeEntity, setActiveEntity] = useState<{ type: 'character' | 'monster'; id: number } | null>(null);
  const [isMonsterSelectionOpen, setIsMonsterSelectionOpen] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [lineStart, setLineStart] = useState<{ x: number; y: number } | null>(null);
  const [lineEnd, setLineEnd] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<{ type: 'character' | 'monster'; id: number } | null>(null);
  const [turnQueue, setTurnQueue] = useState<(Monster | 'character')[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Monster | 'character' | null>(null);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const [battleFinishMessageVisible, setBattleFinishMessageVisible] = useState(false);
  const stageRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (character) {
      character.health = 30;
      character.maxHealth = 30;
    }
  }, [character]);

  useEffect(() => {
    if (isBattleStarted && turnQueue.length === 0) {
      const initialQueue: (Monster | 'character')[] = ['character', ...spawnedMonsters];
      const shuffledQueue = shuffleArray(initialQueue);
      setTurnQueue(shuffledQueue);
      setCurrentTurn(shuffledQueue[0]);
    }
  }, [isBattleStarted, character, spawnedMonsters]);

  useEffect(() => {
    if (isBattleStarted && !isBattleFinished) {
      checkBattleStatus();
    }
  }, [spawnedMonsters]);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleLeaveSession = async () => {
    try {
      await axios.delete(`/sessions/${id}`);
      navigate('/sessions');
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  };

  const handleCharacterDragStart = () => {
    setSpellDisplayVisible(false);
  };

  const handleCharacterDragEnd = (e: any) => {
    const { x, y } = e.target.position();
    setCharacterPosition({ x, y });
  };

  const handleMonsterDragStart = () => {
    setSpellDisplayVisible(false);
  };

  const handleMonsterDragEnd = (e: any, index: number) => {
    const { x, y } = e.target.position();
    const updatedMonsters = [...spawnedMonsters];
    updatedMonsters[index] = { ...updatedMonsters[index], positionX: x, positionY: y };
    setSpawnedMonsters(updatedMonsters);
  };

  const handleStageClick = (e: any) => {
    if (selectedMonster) {
      const stage = stageRef.current.getStage();
      const pointerPosition = stage.getPointerPosition();
      const newMonster = {
        ...selectedMonster,
        positionX: pointerPosition.x,
        positionY: pointerPosition.y,
        health: selectedMonster.health,
        maxHealth: selectedMonster.health,
      };
      setSpawnedMonsters([...spawnedMonsters, newMonster]);
      setSelectedMonster(null);
    }
  };

  const handleCharacterClick = async () => {
    if (character && currentTurn === 'character') {
      if (activeEntity && activeEntity.type === 'character' && activeEntity.id === character.id) {
        setSpellDisplayVisible(false);
        setActiveEntity(null);
      } else {
        try {
          const spellsData = await fetchSpellsForCharacter(character.id);
          setSpells(spellsData);
          setSpellDisplayPosition({ x: characterPosition.x, y: characterPosition.y });
          setSpellDisplayVisible(true);
          setActiveEntity({ type: 'character', id: character.id });
        } catch (error) {
          console.error('Error fetching character spells:', error);
        }
      }
    }
  };

  const handleMonsterClick = async (monsterId: number, positionX?: number, positionY?: number) => {
    if (currentTurn !== 'character' && (currentTurn as Monster)?.id !== monsterId) return;

    if (positionX === undefined || positionY === undefined) return;

    if (activeEntity && activeEntity.type === 'monster' && activeEntity.id === monsterId) {
      setSpellDisplayVisible(false);
      setActiveEntity(null);
    } else {
      try {
        const spellsData = await fetchSpellsForMonster(monsterId);
        setSpells(spellsData);
        setSpellDisplayPosition({ x: positionX, y: positionY });
        setSpellDisplayVisible(true);
        setActiveEntity({ type: 'monster', id: monsterId });
      } catch (error) {
        console.error('Error fetching monster spells:', error);
      }
    }
  };

  const handleSelectSpell = (spell: Spell) => {
    setSelectedSpell(spell);
    if (activeEntity) {
      if (activeEntity.type === 'character' && characterPosition) {
        setLineStart({ x: characterPosition.x + 22.5, y: characterPosition.y + 22.5 });
      } else if (activeEntity.type === 'monster') {
        const monster = spawnedMonsters.find(mon => mon.id === activeEntity.id);
        if (monster) {
          setLineStart({ x: monster.positionX + 22.5, y: monster.positionY + 22.5 });
        }
      }
    }
  };

  const handleTargetClick = (target: { type: 'character' | 'monster'; id: number }) => {
    if (selectedSpell) {
      if (target.type === 'character' && character) {
        character.health = Math.max(character.health - selectedSpell.power, 0);
        if (character.health === 0) {
          character.isFading = true;
          setTimeout(() => {
            character.isDead = true;
            setCharacterPosition({ x: -1000, y: -1000 });
          }, 3000);
        }
      } else if (target.type === 'monster') {
        const updatedMonsters = spawnedMonsters.map(monster => {
          if (monster.id === target.id) {
            const updatedHealth = Math.max(monster.health - selectedSpell.power, 0);
            if (updatedHealth === 0) {
              monster.isFading = true;
              setTimeout(() => {
                setSpawnedMonsters(prevMonsters => prevMonsters.filter(mon => mon.id !== monster.id));
                checkBattleStatus();
              }, 3000);
            }
            return { ...monster, health: updatedHealth };
          }
          return monster;
        });
        setSpawnedMonsters(updatedMonsters);
      }

      setSelectedSpell(null);
      setLineStart(null);
      setLineEnd(null);
      setHoveredTarget(null);
      nextTurn();
    }
  };

  const nextTurn = () => {
    if (spawnedMonsters.every(monster => monster.health <= 0)) {
      setIsBattleFinished(true);
      setBattleFinishMessageVisible(true);
      setTimeout(() => {
        setBattleFinishMessageVisible(false);
        setIsBattleStarted(false);
      }, 3000);
      return;
    }

    setTurnQueue(prevQueue => {
      const newQueue = [...prevQueue];
      const finishedTurn = newQueue.shift();
      newQueue.push(finishedTurn!);
      setCurrentTurn(newQueue[0]);
      return newQueue;
    });
  };

  const checkBattleStatus = () => {
    if (spawnedMonsters.every(monster => monster.health <= 0)) {
      setIsBattleFinished(true);
      setBattleFinishMessageVisible(true);
      setTimeout(() => {
        setBattleFinishMessageVisible(false);
        setIsBattleStarted(false);
      }, 3000);
    }
  };

  const handleMouseMove = (e: any) => {
    if (lineStart) {
      const stage = stageRef.current.getStage();
      const pointerPosition = stage.getPointerPosition();
      setLineEnd(pointerPosition);
    }
  };

  const handleMouseEnterTarget = (target: { type: 'character' | 'monster'; id: number }) => {
    if (selectedSpell) {
      setHoveredTarget(target);
    }
  };

  const handleMouseLeaveTarget = () => {
    setHoveredTarget(null);
  };

  const renderGrid = () => {
    const cellSize = 20;
    return mapData.grid.map((row: any, rowIndex: number) =>
      row.map((cell: any, colIndex: number) => (
        <Rect
          key={`${rowIndex}-${colIndex}`}
          x={colIndex * cellSize}
          y={rowIndex * cellSize}
          width={cellSize}
          height={cellSize}
          fill={getCellColor(cell)}
          stroke="black"
          className="grid-rect"
        />
      ))
    );
  };

  const getCellColor = (cell: string | null) => {
    switch (cell) {
      case 'wall':
        return '#b0b0b0';
      case 'floor':
        return '#8B4513';
      case 'water':
        return '#a0c0ff';
      case 'object':
        return '#ffdfba';
      case 'grass':
        return '#7CFC00';
      case 'tree':
        return '#228B22';
      default:
        return 'white';
    }
  };

  const handleSelectMonster = (monster: Monster) => {
    setSelectedMonster(monster);
    setIsMonsterSelectionOpen(false);
  };

  const startBattle = () => {
    setIsBattleStarted(true);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <p>Загрузка игры...</p>;
  }

  return (
    <div className="session-interface">
      <div className="session-header">
        <h1>{session.name}</h1>
        <p>{session.description}</p>
      </div>
      <div className="session-actions">
        {!isBattleStarted && (
          <button className="button-primary" onClick={startBattle}>Начать бой</button>
        )}
        {isBattleStarted && !isBattleFinished && (
          <h2 className="turn-indicator">Сейчас ходит: {currentTurn === 'character' ? 'Character' : (currentTurn as Monster)?.name}</h2>
        )}
        {isBattleFinished && battleFinishMessageVisible && (
          <h2 className="battle-finished">Бой завершён, все враги побеждены!</h2>
        )}
      </div>
      <div className="stage-container">
        <Stage width={800} height={800} ref={stageRef} onClick={handleStageClick} onMouseMove={handleMouseMove}>
          <Layer>{renderGrid()}</Layer>
          <Layer>
            {characterImage && !character.isDead && (
              <CharacterIcon
                characterImage={characterImage}
                characterPosition={characterPosition}
                characterHealth={character.health}
                characterMaxHealth={character.maxHealth}
                onClick={() => selectedSpell ? handleTargetClick({ type: 'character', id: character.id }) : handleCharacterClick()}
                onDragStart={handleCharacterDragStart}
                onDragEnd={handleCharacterDragEnd}
                onMouseEnter={() => handleMouseEnterTarget({ type: 'character', id: character.id })}
                onMouseLeave={handleMouseLeaveTarget}
                highlight={!!(hoveredTarget && hoveredTarget.type === 'character' && hoveredTarget.id === character.id)}
                isFading={character.isFading}
              />
            )}
            {spawnedMonsters.map((monster, index) => (
              <MonsterIcon
                key={index}
                monster={monster}
                index={index}
                onClick={() => selectedSpell ? handleTargetClick({ type: 'monster', id: monster.id }) : handleMonsterClick(monster.id, monster.positionX, monster.positionY)}
                onDragStart={handleMonsterDragStart}
                onDragEnd={handleMonsterDragEnd}
                onMouseEnter={() => handleMouseEnterTarget({ type: 'monster', id: monster.id })}
                onMouseLeave={handleMouseLeaveTarget}
                highlight={!!(hoveredTarget && hoveredTarget.type === 'monster' && hoveredTarget.id === monster.id)}
              />
            ))}
            {spellDisplayVisible && (
              <Group x={spellDisplayPosition.x} y={spellDisplayPosition.y}>
                <SpellDisplay
                  spells={spells}
                  positionX={0}
                  positionY={0}
                  visible={spellDisplayVisible}
                  onSelectSpell={handleSelectSpell}
                  selectedSpell={selectedSpell}
                />
              </Group>
            )}
            {lineStart && lineEnd && (
              <Line
                points={[lineStart.x, lineStart.y, lineEnd.x, lineEnd.y]}
                stroke="red"
                strokeWidth={2}
              />
            )}
          </Layer>
        </Stage>
      </div>
      <div className="session-footer">
        <button className="button-secondary" onClick={() => setIsMonsterSelectionOpen(true)}>Создать монстра</button>
        {isMonsterSelectionOpen && <MonsterSelection onSelectMonster={handleSelectMonster} />}
        <button className="button-danger" onClick={handleLeaveSession}>Покинуть игру</button>
      </div>
    </div>
  );
};

export default SessionInterface;
