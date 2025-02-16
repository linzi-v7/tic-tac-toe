




const Gameboard = (function ()
{

    //3x3 board for tic tac toe
    //future improvement: let board dynamic to allow bigger grids like 4x4
    const board = [
        [null, null, null]
        [null, null, null]
        [null, null, null]
    ];

    let isEnd = false;

    function setEndStatus(bool) 
    {
        isEnd = bool;
    }

    function getBoard()
    {
        return board;
    }

    function setCell(row, column, value)
    {
        if ((row > (board.length - 1)) ||
            (column > (board.length - 1)) ||
            (board[row][column] === null))
        {
            return false;
        }
        else
        {
            board[row][column] = value;
            return true;
        }
    }

    return { getBoard, setEndStatus, setCell }
})();