import React from 'react';
import './BattleLog.css';

interface Props {
  battleLog: string[];
}

const BattleLog: React.FC<Props> = ({ battleLog }) => {
  return (
    <div>
      <h3>Battle Log</h3>
      <ul>
        {battleLog.map((entry, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: entry }} />
        ))}
      </ul>
    </div>
  );
}

export default BattleLog;
