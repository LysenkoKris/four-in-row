type Step = [number, number];

interface StepInfo {
  player_1: Step[];
  player_2: Step[];
  board_state: 'waiting' | 'pending' | 'win' | 'draw';
  winner?: {
    who: 'player_1' | 'player_2';
    positions: Step[];
  };
}

export function validator (steps: number[]): Record<string, StepInfo> {
  const cols = 7;
  const rows = 6;
  const n = 4;
  const board = Array(cols).fill(null).map(() => Array(rows).fill(null));

  const results: Record<string, StepInfo> = {};

  const playerPositions = {
    player_1: [] as Step[],
    player_2: [] as Step[],
  };

  function checkWinner() {
    
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const player = board[col][row];
        if (!player) continue;

        if (col + n - 1 < cols) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (board[col + k][row] !== player) {
              win = false;
              break;
            }
          }
          if (win)
            return {
              who: player,
              positions: new Array(n).fill(0).map((_, k) => [row, col + k] as Step),
            };
        }

        if (row + n - 1 < rows) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (board[col][row + k] !== player) {
              win = false;
              break;
            }
          }
          if (win)
            return {
              who: player,
              positions: new Array(n).fill(0).map((_, k) => [row + k, col] as Step),
            };
        }

        if (col + n - 1 < cols && row + n - 1 < rows) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (board[col + k][row + k] !== player) {
              win = false;
              break;
            }
          }
          if (win)
            return {
              who: player,
              positions: new Array(n).fill(0).map((_, k) => [row + k, col + k] as Step),
            };
        }

        if (col - (n - 1) >= 0 && row + n - 1 < rows) {
          let win = true;
          for (let k = 1; k < n; k++) {
            if (board[col - k][row + k] !== player) {
              win = false;
              break;
            }
          }
          if (win)
            return {
              who: player,
              positions: new Array(n).fill(0).map((_, k) => [row + k, col - k] as Step),
            };
        }
      }
    }
    return null;
  }

  results['step_0'] = { player_1: [], player_2: [], board_state: 'waiting' };

  for (let i = 0; i < steps.length; i++) {
    const player = i % 2 === 0 ? 'player_1' : 'player_2';
    const col = steps[i];

    let placedRow = -1;
    for (let row = rows - 1; row >= 0; row--) {
      if (board[col][row] === null) {
        board[col][row] = player;
        placedRow = row;
        playerPositions[player].push([placedRow, col]);
        break;
      }
    }

    const stepKey = `step_${i + 1}`;

    const winner = checkWinner();
    if (winner) {
      results[stepKey] = {
        player_1: [...playerPositions.player_1],
        player_2: [...playerPositions.player_2],
        board_state: 'win',
        winner: winner,
      };
      break;
    }

    const isFull = board.every(col => col.every(cell => cell !== null));
    if (isFull) {
      results[stepKey] = {
        player_1: [...playerPositions.player_1],
        player_2: [...playerPositions.player_2],
        board_state: 'draw',
      };
      break;
    }

    results[stepKey] = {
      player_1: [...playerPositions.player_1],
      player_2: [...playerPositions.player_2],
      board_state: 'pending',
    };
  }
  return results;
}