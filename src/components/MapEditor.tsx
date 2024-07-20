import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect } from 'react-konva';
import './MapEditor.css';

const MapEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<number>(1);
  const [mapData, setMapData] = useState<any>({ grid: Array.from({ length: 40 }, () => Array(40).fill(null)) });
  const [mapId, setMapId] = useState<string | null>(id || null);
  const [mapName, setMapName] = useState<string>('');
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapId) return;
      try {
        const response = await axios.get(`/maps/${mapId}`);
        const data = response.data;
        console.log("Loaded map data:", data);
        let gridData;
        if (typeof data.grid === 'string') {
          gridData = JSON.parse(data.grid);
        } else if (Array.isArray(data.grid)) {
          gridData = data.grid;
        } else {
          throw new Error('Invalid grid data format');
        }
        setMapData({ ...data, grid: gridData });
        setMapName(data.name);
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };
    if (mapId) {
      loadMap();
    }
  }, [mapId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleBrushSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBrushSize(parseInt(event.target.value, 10));
  };

  const handleMapNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapName(event.target.value);
  };

  const getCellCoordinates = (pos: { x: number, y: number }) => {
    const stage = stageRef.current;
    const scale = stage.scaleX();
    const position = stage.position();
    const x = (pos.x - position.x) / scale;
    const y = (pos.y - position.y) / scale;
    return { x: Math.floor(x / 20), y: Math.floor(y / 20) };
  };

  const handleMouseDown = (event: any) => {
    if (isCtrlPressed && event.evt.button === 0) {
      stageRef.current.draggable(true);
      return;
    }
    const pos = getCellCoordinates(stageRef.current.getPointerPosition());
    isDrawing.current = true;
    updateCells(pos.y, pos.x);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    stageRef.current.draggable(false);
  };

  const handleMouseMove = (event: any) => {
    if (isDrawing.current && !isCtrlPressed) {
      const pos = getCellCoordinates(stageRef.current.getPointerPosition());
      updateCells(pos.y, pos.x);
    }
  };

  const updateCells = (row: number, col: number) => {
    if (!selectedTool) return;
    const newGrid = mapData.grid.map((r: any, i: number) =>
      r.map((cell: any, j: number) => {
        if (isInBrushArea(i, j, row, col)) {
          return selectedTool;
        }
        return cell;
      })
    );
    setMapData({ ...mapData, grid: newGrid });
  };

  const isInBrushArea = (i: number, j: number, row: number, col: number) => {
    const halfBrushSize = Math.floor(brushSize / 2);
    return (
      i >= row - halfBrushSize &&
      i <= row + halfBrushSize &&
      j >= col - halfBrushSize &&
      j <= col + halfBrushSize
    );
  };

  const clearCanvas = () => {
    const clearedGrid = Array.from({ length: 40 }, () => Array(40).fill(null));
    setMapData({ ...mapData, grid: clearedGrid });
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
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
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

  const handleSaveMap = async () => {
    try {
      const mapPayload = {
        name: mapName || 'New Map',
        grid: JSON.stringify(mapData.grid),
        objects: JSON.stringify(mapData.objects || {}),
        icons: JSON.stringify(mapData.icons || {}),
        textures: JSON.stringify(mapData.textures || {}),
      };

      if (mapId) {
        const response = await axios.put(`/maps/${mapId}`, mapPayload);
        console.log('Map updated:', response.data);
      } else {
        const response = await axios.post('/maps', mapPayload);
        console.log('Map saved:', response.data);
        setMapId(response.data.id);
        navigate(`/map-editor/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error saving map:', error);
    }
  };

  const handleSaveAsPNG = async () => {
    if (!mapId) {
      console.error('Save the map first');
      return;
    }
    try {
      const response = await axios.get(`/maps/${mapId}/png`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${mapName || 'map'}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error saving as PNG:', error);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.02;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div className="map-editor-container">
      <div className="tools-container">
        <button onClick={() => handleToolSelect('wall')}>Стена</button>
        <button onClick={() => handleToolSelect('floor')}>Пол</button>
        <button onClick={() => handleToolSelect('water')}>Вода</button>
        <button onClick={() => handleToolSelect('object')}>Объект</button>
        <button onClick={() => handleToolSelect('grass')}>Земля</button>
        <button onClick={() => handleToolSelect('tree')}>Дерево</button>
        <label htmlFor="brushSize">Размер китси:</label>
        <select id="brushSize" value={brushSize} onChange={handleBrushSizeChange}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <label htmlFor="mapName">Название карты:</label>
        <input id="mapName" value={mapName} onChange={handleMapNameChange} />
        <button onClick={clearCanvas}>Очистить карту</button>
        <button onClick={handleSaveMap}>Сохранить</button>
        <button onClick={handleSaveAsPNG}>Сохранить в PNG</button>
      </div>
      <div className="stage-container">
        <Stage
          width={800}
          height={800}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          ref={stageRef}
        >
          <Layer>{renderGrid()}</Layer>
        </Stage>
      </div>
    </div>
  );
};

export default MapEditor;
