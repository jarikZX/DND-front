import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MapList.css'; 
const MapList: React.FC = () => {
  const navigate = useNavigate();
  const [maps, setMaps] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await axios.get('/maps');
        setMaps(response.data);
      } catch (error) {
        console.error('Error fetching maps:', error);
      }
    };
    fetchMaps();
  }, []);

  const handleEdit = (mapId: string) => {
    navigate(`/map-editor/${mapId}`);
  };

  const handleDelete = async (mapId: string) => {
    try {
      await axios.delete(`/maps/${mapId}`);
      setMaps(maps.filter(map => map.id !== mapId));
    } catch (error) {
      console.error('Error deleting map:', error);
    }
  };

  return (
    <div className="map-list-container">
      <h1>Карты</h1>
      <button className="button-primary" onClick={() => navigate('/map-editor')}>Создать новую карту</button>
      <ul className="map-list">
        {maps.map(map => (
          <li key={map.id} className="map-item">
            <span className="map-name">{map.name}</span>
            <div className="map-actions">
              <button className="button-secondary" onClick={() => handleEdit(map.id)}>Обновить карту</button>
              <button className="button-secondary" onClick={() => handleDelete(map.id)}>Удалить карту</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapList;
