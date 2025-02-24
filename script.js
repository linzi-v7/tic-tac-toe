
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

        //cast to integer to be able to inter antidiag condition
        row = Number(row);
        column = Number(column);

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

    function switchActivePlayer()
    {
        if (activePlayer === players[0])
        {
            activePlayer = players[1];
        }
        else
        {
            activePlayer = players[0];
        }
    }

    function playRound()
    {
        GameBoard.printBoard();
        console.log(`Active Player ${activePlayer.playerName}`);
        activePlayer.makeMove(); //need to loop until player makes valid choice (not used or null input)
        const chosenCell = activePlayer.getChosenCell();
        console.log(chosenCell);
        const row = chosenCell[0];
        const column = chosenCell[1];
        if (row === null || column === null)
        {
            console.log("Cell Cant Be Null!");
        }
        GameBoard.setCell(row, column, activePlayer.symbol)
        GameBoard.updateCounter(row, column, activePlayer.symbol);
        activePlayer.resetChosenCell();
        console.log(" ")
        GameBoard.printBoard();

        checkWin(row, column);

        switchActivePlayer();

    }


    function checkWin(row, column)
    {
        if (
            GameBoard.rowCounter[row] == 3 ||
            GameBoard.colCounter[column] == 3 ||
            GameBoard.diagCounter[0] == 3 ||
            GameBoard.diagCounter[1] == 3
        )
        {
            console.log("here");
            GameBoard.setEndStatus(true);
            return 1; //X won
        }
        else if (
            GameBoard.rowCounter[row] == -3 ||
            GameBoard.colCounter[column] == -3 ||
            GameBoard.diagCounter[0] == -3 ||
            GameBoard.diagCounter[1] == -3
        )
        {
            GameBoard.setEndStatus(true);
            return 2; //O won
        }

        return 0;
    }

    return { playRound }

})();


while (GameBoard.getEndStatus() == false)
{
    GameController.playRound();

}