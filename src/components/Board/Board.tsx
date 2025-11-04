import React from 'react';
import styles from './Board.module.scss';

interface BoardProps {
  arr: string[][];
  getSIM: (col: number) => void;
  isWinnerStep: (row: number, col: number) => boolean;
  hoverCol: number | null;
  setHoverCol: (col: number | null) => void;
  colsCount: number;
  nextPlayer: string;
  winner?: string | null;
}

export const Board: React.FC<BoardProps> = ({
  arr,
  getSIM,
  isWinnerStep,
  hoverCol,
  setHoverCol,
  colsCount,
  nextPlayer,
  winner
}) => (
  <div className={styles.boardRoot}>
    <div className={styles.boardHeader}>
      {Array(colsCount).fill(0).map((_, idx) => (
        <div
          key={idx}
          className={styles.headerCell}
          onMouseEnter={() => setHoverCol(idx)}
          onClick={() => getSIM(idx)}
        >
          {hoverCol === idx && !winner && (
            <div
              className={
                nextPlayer === 'player_1'
                  ? styles.headerDiscPlayer1
                  : styles.headerDiscPlayer2
              }
            />
          )}
        </div>
      ))}
    </div>
    <div
      className={styles.boardMain}
      style={{ maxWidth: colsCount * 46 }}
    >
      {arr.map((column, colIndex) => (
        <div
          key={colIndex}
          className={styles.column}
          onClick={() => getSIM(colIndex)}
          onMouseEnter={() => setHoverCol(colIndex)}
        >
          {column.map((row, rowIndex) => {
            const isWinner = isWinnerStep(rowIndex, colIndex);
            return (
              <div
                key={rowIndex}
                className={[
                  styles.cell,
                  row === 'player_1'
                    ? styles.cellPlayer1
                    : row === 'player_2'
                    ? styles.cellPlayer2
                    : styles.cellEmpty,
                  isWinner
                    ? row === 'player_1'
                        ? styles.winnerPulsePlayer1
                        : styles.winnerPulsePlayer2
                    : ''
                ].join(' ')}
              />
            );
          })}
        </div>
      ))}
    </div>
  </div>
);
