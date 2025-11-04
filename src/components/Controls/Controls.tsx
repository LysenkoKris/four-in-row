import React from 'react';
import styles from './Controls.module.scss';

interface ControlsProps {
  onRestart: () => void;
  onResetScore: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onRestart, onResetScore }) => (
  <div className={styles.container}>
    <button className={styles.controlButton} onClick={onRestart}>
      Новая игра
    </button>
    <button className={styles.controlButton} onClick={onResetScore}>
      Сбросить счет
    </button>
  </div>
);
