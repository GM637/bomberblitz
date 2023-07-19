import React from 'react';

const KeyboardControlsInfo = () => {
  const styles = {
    position: 'fixed',
    bottom: '2rem',
    left: '24px',
    fontSize: '1.5rem',
    color: '#ddd',
    marginTop: '-2rem',
    textAlign: 'center',
    textShadow: '-0.2rem 0.2rem 0px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={styles}>
      <h4>ARROW KEYS - move | C - drop 💣</h4>
    </div>
  );
};

export default KeyboardControlsInfo;
