
import React from 'react';
import CharacterForm from './CharacterForm';

const CreateCharacter: React.FC = () => {
  return (
    <div className="create-character">
      <h1>Создать персонажа</h1>
      <CharacterForm />
    </div>
  );
};

export default CreateCharacter;
