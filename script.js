
function createPlayer(name, symbol)
{
    const playerName = name;

    if (symbol !== 'x' && symbol !== 'o')
    {
        console.log("Invalid Token! Player Must Choose X or O");
        return;
    }

    const cell = [null, null]

    function makeMove()
    {
        alert("Enter row and column of the cell you would like to choose (0-based)");
        let row = prompt("Enter Row");
        let column = prompt("Enter Column")
        cell[0] = row;
        cell[1] = column;
    }

    function getChosenCell()
    {
        return cell;
    }
    function resetChosenCell()
    {
        cell[0] = null;
        cell[1] = null;
    }

    return { makeMove, getChosenCell, symbol, playerName, resetChosenCell }
}



const GameBoard = (function ()
{

    //3x3 board for tic tac toe
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const rowCounter = [0, 0, 0];
    const colCounter = [0, 0, 0];
    const diagCounter = [0, 0]; //[0] for diagonal, [1] for anti-diagonal

    let isEnd = false;

    function setEndStatus(bool) 
    {
        isEnd = bool;
    }

    function getEndStatus()
    {
        return isEnd;
    }

    function updateCounter(row, column, symbol)
    {

        const increment = symbol === 'x' ? 1 : -1;

        rowCounter[row] += increment;
        colCounter[column] += increment;
        console.log(row + column)

        //update main diagonal counter
        if (row == column)
        {
            console.log("main diag");
            diagCounter[0] += increment;
        }

        //update antidiagonal counter
        if ((row + column) == 2) 
        {
            console.log("here");
            diagCounter[1] += increment;
        }

    }

    function setCell(row, column, symbol)
    {
        //check if cell is valid and not taken
        if ((row > (board.length - 1)) ||
            (column > (board.length - 1)) ||
            (board[row][column] !== null))
        {
            return false;
        }
        else
        {
            board[row][column] = symbol;
            return true;
        }
    }

    function getBoard()
    {
        return board;
    }

    function printBoard()
    {
        for (let index = 0; index < board.length; index++)
        {
            const row = board[index];

            let rowString = row.join(" | ");
            console.log(rowString)
            console.log("---------");

        }
    }

    return { getEndStatus, getBoard, setEndStatus, setCell, printBoard, updateCounter, rowCounter, colCounter, diagCounter }
})();

const GameController = (function ()
{
    const players = [
        createPlayer("Player One", 'x'),
        createPlayer("Player Two", 'o')
    ];

    let activePlayer = players[0];
    let moveCount = 0; // Track number of moves

    function switchActivePlayer()
    {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function playRound()
    {
        GameBoard.printBoard();
        console.log(`Active Player: ${activePlayer.playerName}`);

        activePlayer.makeMove();
        const chosenCell = activePlayer.getChosenCell();
        const row = Number(chosenCell[0]);
        const column = Number(chosenCell[1]);

        if (row === null || column === null || isNaN(row) || isNaN(column))
        {
            console.log("Invalid move! Try again.");
            return;
        }

        if (!GameBoard.setCell(row, column, activePlayer.symbol))
        {
            console.log("Cell is already taken! Choose another one.");
            return;
        }

        GameBoard.updateCounter(row, column, activePlayer.symbol);
        moveCount++; // Increment move counter

        const result = checkWin(row, column);

        if (result === 1)
        {
            GameBoard.printBoard();
            console.log("Player One (X) Wins!");
            GameBoard.setEndStatus(true);

        }
        else if (result === 2)
        {
            GameBoard.printBoard();
            console.log("Player Two (O) Wins!");
            GameBoard.setEndStatus(true);
        }
        else if (moveCount >= 7 && checkEarlyTie())
        {
            GameBoard.printBoard();
            console.log("It's a tie! No possible wins left.");
            GameBoard.setEndStatus(true);
        }
        else
        {
            switchActivePlayer();
        }

        activePlayer.resetChosenCell();
    }

    function checkWin(row, column)
    {
        if (
            GameBoard.rowCounter[row] === 3 ||
            GameBoard.colCounter[column] === 3 ||
            GameBoard.diagCounter[0] === 3 ||
            GameBoard.diagCounter[1] === 3
        )
        {
            return 1; // X wins
        } else if (
            GameBoard.rowCounter[row] === -3 ||
            GameBoard.colCounter[column] === -3 ||
            GameBoard.diagCounter[0] === -3 ||
            GameBoard.diagCounter[1] === -3
        )
        {
            return 2; // O wins
        }

        return 0; // No winner yet
    }

    function checkEarlyTie()
    {
        // If no row, column, or diagonal can reach ±3, it's an early tie
        return !GameBoard.rowCounter.some(val => Math.abs(val) + (3 - moveCount / 2) >= 3) &&
            !GameBoard.colCounter.some(val => Math.abs(val) + (3 - moveCount / 2) >= 3) &&
            !(Math.abs(GameBoard.diagCounter[0]) + (3 - moveCount / 2) >= 3) &&
            !(Math.abs(GameBoard.diagCounter[1]) + (3 - moveCount / 2) >= 3);
    }

    return { playRound };
})();



while (GameBoard.getEndStatus() == false)
{
    GameController.playRound();

}