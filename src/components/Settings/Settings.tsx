import React from 'react';
import styles from './Settings.module.scss';

interface SettingsProps {
  colsCount: number;
  rowsCount: number;
  winCount: number;
  onColsChange: (value: number) => void;
  onRowsChange: (value: number) => void;
  onWinCountChange: (value: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  colsCount,
  rowsCount,
  winCount,
  onColsChange,
  onRowsChange,
  onWinCountChange
}) => (
  <div className={styles.settingsContainer}>
    Для применения изменений необходимо начать новую игру
    <div className={styles.inputsRow}>
      <label className={styles.inputLabel}>
        Кол-во столбцов:
        <input
          type="number"
          min={4}
          max={20}
          value={colsCount}
          onChange={(e) => onColsChange(Number(e.target.value))}
          className={styles.numberInput}
        />
      </label>
      <label className={styles.inputLabel}>
        Кол-во рядов:
        <input
          type="number"
          min={4}
          max={20}
          value={rowsCount}
          onChange={(e) => onRowsChange(Number(e.target.value))}
          className={styles.numberInput}
        />
      </label>
      <label className={styles.inputLabel}>
        Кол-во фишек для победы:
        <input
          type="number"
          min={3}
          max={Math.min(colsCount, rowsCount)}
          value={winCount}
          onChange={(e) => onWinCountChange(Number(e.target.value))}
          className={styles.numberInput}
        />
      </label>
    </div>
  </div>
);