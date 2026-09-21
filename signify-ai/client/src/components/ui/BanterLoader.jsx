import React from 'react';

/**
 * BanterLoader Component
 * Interactive animated 9-box loading indicator (Uiverse.io by Nawsome)
 * Styled with Signify AI's dark plum & blush rose palette tokens.
 */
export default function BanterLoader({ className = '', boxColor }) {
  const style = boxColor ? { '--loader-color': boxColor } : {};

  return (
    <div className={`banter-loader-container ${className}`} style={style}>
      <div className="banter-loader">
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
      </div>
    </div>
  );
}
