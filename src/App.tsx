import { useState, useEffect } from 'react'
import './App.css';
import { validator } from './utils/utils';
import { Settings } from './components/Settings/Settings';
import { Controls } from './components/Controls/Controls';
import { Board } from './components/Board/Board';


function App() {
  const [colsCount, setColsCount] = useState<number>(
    Number(localStorage.getItem('colsCount')) || 7
  );
  const [rowsCount, setRowsCount] = useState<number>(
    Number(localStorage.getItem('rowsCount')) || 6
  );
  const [winCount, setWinCount] = useState<number>(
    Number(localStorage.getItem('winCount')) || 4
  );

  const createBoard = (cols: number, rows: number) => 
    Array(cols).fill(null).map(() => Array(rows).fill(null));

  const [arr, setArr] = useState<string[][]>(
    JSON.parse(localStorage.getItem('arr')) || createBoard(colsCount, rowsCount)
  );

  const [nextPlayer, setNextPlayer] = useState<string>(
    JSON.parse(localStorage.getItem('next')) || 'player_1'
  );
  const [winner, setWinner] = useState<string | null>(null);
  const [steps, setSteps] = useState<number[]>([]);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [winnerSteps, setWinnerSteps] = useState<number[][]>(
    JSON.parse(localStorage.getItem('winnerSteps')) || []
  );
  const [scorePlayer1, setScorePlayer1] = useState<number>(
    JSON.parse(localStorage.getItem('scorePlayer1') || '0')
  );
  const [scorePlayer2, setScorePlayer2] = useState<number>(
    JSON.parse(localStorage.getItem('scorePlayer2') || '0')
  );
  const [hasCountedWin, setHasCountedWin] = useState<boolean>(false);

  const [validatorRes, setValidatorRes] = useState({});

  useEffect(() => {
    localStorage.setItem('arr', JSON.stringify(arr));
    localStorage.setItem('next', JSON.stringify(nextPlayer));
    localStorage.setItem('winnerSteps', JSON.stringify(winnerSteps));
    localStorage.setItem('colsCount', JSON.stringify(colsCount));
    localStorage.setItem('rowsCount', JSON.stringify(rowsCount));
    localStorage.setItem('winCount', JSON.stringify(winCount));
    const result = checkWinner(arr);
    if (colsCount === 7 && rowsCount === 6 && winCount === 4) { console.log(validator(steps)) }
    if (result) {
      setWinner(result);
    } else if (steps.length === colsCount * rowsCount) {
      setWinner('draw');
    }
  }, [arr, colsCount, rowsCount, winCount]);

  useEffect(() => {
    if (winner && winner !== 'draw' && hasCountedWin) {
      if (winner === 'player_1') {
        setScorePlayer1(prev => {
          const newScore = prev + 1;
          localStorage.setItem('scorePlayer1', JSON.stringify(newScore));
          return newScore;
        });
      } else if (winner === 'player_2') {
        setScorePlayer2(prev => {
          const newScore = prev + 1;
          localStorage.setItem('scorePlayer2', JSON.stringify(newScore));
          return newScore;
        });
      }
      setHasCountedWin(false);
    }
  }, [winner, hasCountedWin]);

  function getSIM(col: number) {
    if (winner) return;
    setArr(prev => {
      const newArr = prev.map(row => [...row]);
      for (let i = newArr[col].length - 1; i >= 0; i--) {
        if (newArr[col][i] === null) {
          newArr[col][i] = nextPlayer;
          setNextPlayer(prev => (prev === 'player_1' ? 'player_2' : 'player_1'));
          setSteps(prev => [...prev, col]);
          return newArr;
        }
      }
      return prev;
    });
  }

  function checkWinner(arr: (string | null)[][]): string | null {
    const cols = arr.length;
    const rows = arr[0].length;
    const n = winCount;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const player = arr[col][row];
        if (!player) continue;

        if (col + n - 1 < cols) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (arr[col + k][row] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            const winningSteps = [];
            for(let k=0; k < n; k++) {
              winningSteps.push([row, col + k]);
            }
            setWinnerSteps(winningSteps);
            return player;
          }
        }

        if (row + n - 1 < rows) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (arr[col][row + k] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            const winningSteps = [];
            for(let k=0; k < n; k++) {
              winningSteps.push([row + k, col]);
            }
            setWinnerSteps(winningSteps);
            return player;
          }
        }

        if (col + n - 1 < cols && row + n - 1 < rows) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (arr[col + k][row + k] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            const winningSteps = [];
            for(let k=0; k < n; k++) {
              winningSteps.push([row + k, col + k]);
            }
            setWinnerSteps(winningSteps);
            return player;
          }
        }

        if (col - (n - 1) >= 0 && row + n - 1 < rows) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (arr[col - k][row + k] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            const winningSteps = [];
            for(let k=0; k < n; k++) {
              winningSteps.push([row + k, col - k]);
            }
            setWinnerSteps(winningSteps);
            return player;
          }
        }
      }
    }
    return null;
  }

  function restart(resetScores = false) {
    setSteps([]);
    setArr(createBoard(colsCount, rowsCount));
    setNextPlayer('player_1');
    setWinner(null);
    setWinnerSteps([]);
    setHasCountedWin(true);
    if (resetScores) {
      setScorePlayer1(0);
      setScorePlayer2(0);
      localStorage.setItem('scorePlayer1', '0');
      localStorage.setItem('scorePlayer2', '0');
    }
  }

  const isWinnerStep = (row: number, col: number) => {
    return winnerSteps.some(
      ([winnerRow, winnerCol]) => winnerRow === row && winnerCol === col
    );
  };

  return (
    <>
      <Settings
        colsCount={colsCount}
        rowsCount={rowsCount}
        winCount={winCount}
        onColsChange={setColsCount}
        onRowsChange={setRowsCount}
        onWinCountChange={setWinCount}
      />

      <div className="resultContainer">
        {winner && winner !== 'draw'
          ? `Победитель ${winner === 'player_1' ? 'Игрок 1' : 'Игрок 2'}`
          : winner === 'draw'
          ? 'Ничья'
          : 'Идет игра...'}
        
      </div>
      <span className="info">Вывод результата работы validator(но только при стандартных настройках доски!) в console dev tools</span>
     
      <div className="scoreboard">
        <span className={`score ${nextPlayer === 'player_1' ? 'activePlayer' : ''}`}>
          <span className="playerCircle player1Circle" />
          Игрок 1 - {scorePlayer1}
        </span>
        <span className={`score ${nextPlayer === 'player_2' ? 'activePlayer' : ''}`}>
          <span className="playerCircle player2Circle" />
          Игрок 2 - {scorePlayer2}
        </span>
      </div>

      <Board
        arr={arr}
        getSIM={getSIM}
        isWinnerStep={isWinnerStep}
        hoverCol={hoverCol}
        setHoverCol={setHoverCol}
        colsCount={colsCount}
        nextPlayer={nextPlayer}
        winner={winner}
      />

      <Controls onRestart={() => restart()} onResetScore={() => restart(true)} />
    </>
  );
}

export default App;
