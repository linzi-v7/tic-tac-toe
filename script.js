const DisplayController = (function ()
{
    const gameContainer = document.querySelector(".game-container");
    const restartButton = document.querySelector('.action-buttons-area button');
    const activePlayerSpan = document.getElementById("active-player");


    gameContainer.addEventListener("click", function (event)
    {
        const clickedBox = event.target;
        const row = clickedBox.getAttribute("data-row");
        const col = clickedBox.getAttribute("data-column");

        const currentPlayer = GameController.getActivePlayer();
        currentPlayer.setChosenCell(row, col);
        GameController.playRound();
    });


    //Restarting the game
    restartButton.addEventListener("click", function () 
    {
        document.querySelector(".player-one-section").classList.remove("winner", "tie", "loser");
        document.querySelector(".player-two-section").classList.remove("winner", "tie", "loser");
        GameController.resetGame();
        DisplayController.displayBoard();
        updateActivePlayer();
    })

    // Update player names when inputs change
    document.getElementById("player1-name").addEventListener("change", function ()
    {
        GameController.getPlayers()[0].setName(this.value || "Player One");
        updateActivePlayer();
    });
    document.getElementById("player2-name").addEventListener("change", function ()
    {
        GameController.getPlayers()[1].setName(this.value || "Player Two");
        updateActivePlayer();
    });


    function displayBoard()
    {
        const currentBoard = GameBoard.getBoard();
        gameContainer.innerHTML = "";

        for (let i = 0; i < currentBoard.length; i++)
        {
            const row = currentBoard[i];
            for (let j = 0; j < row.length; j++)
            {
                const element = row[j];
                addBox(i, j, element);
            }
        }
    }

    function addBox(row, column, symbol)
    {
        const square = document.createElement("div");
        square.setAttribute("data-row", `${row}`);
        square.setAttribute("data-column", `${column}`);

        switch (symbol)
        {
            case 'x':
                square.innerText = "X";
                break;
            case 'o':
                square.innerText = "O";
                break;
            default:
                square.innerText = "";
                break;
        }

        gameContainer.appendChild(square);
    }


    function updateActivePlayer()
    {
        activePlayerSpan.innerText = GameController.getActivePlayer().getName();
    }


    return { displayBoard, updateActivePlayer };
})();

function createPlayer(name, symbol)
{
    let playerName = name;
    let wins = 0;
    let losses = 0;

    if (symbol !== 'x' && symbol !== 'o')
    {
        console.log("Invalid Symbol! Player Must Choose X or O");
        return;
    }

    const cell = [null, null];

    function setChosenCell(row, column)
    {
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

    function setName(newName)
    {
        playerName = newName;
    }

    function getName()
    {
        return playerName;
    }

    function addWin()
    {
        wins++;
    }

    function addLoss()
    {
        losses++;
    }

    function getWins()
    {
        return wins;
    }

    function getLosses()
    {
        return losses;
    }

    return { setChosenCell, getChosenCell, symbol, getName, setName, resetChosenCell, addWin, addLoss, getWins, getLosses };
}

const GameBoard = (function ()
{
    // 3x3 board for tic tac toe
    let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    let rowCounter = [0, 0, 0];
    let colCounter = [0, 0, 0];
    let diagCounter = [0, 0]; // [0] for diagonal, [1] for anti-diagonal

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

        if (row == column)
        {
            diagCounter[0] += increment;
        }

        if ((row + column) == 2)
        {
            diagCounter[1] += increment;
        }
    }

    function setCell(row, column, symbol)
    {
        if ((row > (board.length - 1)) ||
            (column > (board.length - 1)) ||
            (board[row][column] !== null))
        {
            return false;
        } else
        {
            board[row][column] = symbol;
            return true;
        }
    }

    function getBoard()
    {
        return board;
    }

    function resetBoard()
    {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        rowCounter = [0, 0, 0];
        colCounter = [0, 0, 0];
        diagCounter = [0, 0];

        setEndStatus(false);
    }

    function printBoard()
    {
        for (let index = 0; index < board.length; index++)
        {
            const row = board[index];
            let rowString = row.join(" | ");
            console.log(rowString);
            console.log("---------");
        }
    }

    function getRowCounter() { return rowCounter; }
    function getColCounter() { return colCounter; }
    function getDiagCounter() { return diagCounter; }


    return {
        getEndStatus, getBoard, setEndStatus, setCell, printBoard, updateCounter,
        getRowCounter, getColCounter, getDiagCounter, resetBoard
    };
})();

const GameController = (function ()
{
    const players = [
        createPlayer(document.getElementById("player1-name").value || "Player One", 'x'),
        createPlayer(document.getElementById("player2-name").value || "Player Two", 'o')
    ];

    let activePlayer = players[0];
    let moveCount = 0;
    let gameResult = -1;

    function switchActivePlayer()
    {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function getActivePlayer()
    {
        return activePlayer;
    }

    function playRound()
    {
        if (GameBoard.getEndStatus() === true)
        {
            console.log(GameBoard.getEndStatus());
            alert("Game Ended! Press Restart To Continue!");
            return;
        }

        DisplayController.displayBoard();
        console.log(`Active Player: ${activePlayer.getName()}`);

        const chosenCell = activePlayer.getChosenCell();
        const row = Number(chosenCell[0]);
        const column = Number(chosenCell[1]);

        if (row === null || column === null || isNaN(row) || isNaN(column))
        {
            alert("Invalid move! Try again.");
            return;
        }

        if (!GameBoard.setCell(row, column, activePlayer.symbol))
        {
            alert("Cell is already taken! Choose another one.");
            return;
        }

        GameBoard.updateCounter(row, column, activePlayer.symbol);
        moveCount++;

        DisplayController.displayBoard();
        gameResult = checkWin(row, column);


        if (gameResult === 1) // X wins
        {
            players[0].addWin();
            document.querySelector(".player-one-section").classList.add("winner");
            document.querySelector(".player-two-section").classList.add("loser");
            document.getElementById("player1-status").innerText = "Winner! Wins: " + players[0].getWins();
            document.querySelector(".game-status").innerText = players[0].getName() + " Won!";
            GameBoard.setEndStatus(true);
        }
        else if (gameResult === 2) // O wins
        {
            players[1].addWin();
            document.querySelector(".player-two-section").classList.add("winner");
            document.querySelector(".player-one-section").classList.add("loser");
            document.getElementById("player2-status").innerText = "Winner! Wins: " + players[1].getWins();
            document.querySelector(".game-status").innerText = players[1].getName() + " Won!";
            GameBoard.setEndStatus(true);
        }
        else if (moveCount >= 7 && checkEarlyTie()) // tie
        {
            alert("It's a tie! No possible wins left.");
            document.querySelector(".player-one-section").classList.add("tie");
            document.querySelector(".player-two-section").classList.add("tie");
            document.getElementById("active-player").innerText = "It's a tie!";
            GameBoard.setEndStatus(true);
        }

        else //continue game
        {
            switchActivePlayer();
        }

        activePlayer.resetChosenCell();
        DisplayController.updateActivePlayer();
    }

    function checkWin(row, column)
    {
        if (
            GameBoard.getRowCounter()[row] === 3 ||
            GameBoard.getColCounter()[column] === 3 ||
            GameBoard.getDiagCounter()[0] === 3 ||
            GameBoard.getDiagCounter()[1] === 3
        )
        {
            return 1; // X wins
        } else if (
            GameBoard.getRowCounter()[row] === -3 ||
            GameBoard.getColCounter()[column] === -3 ||
            GameBoard.getDiagCounter()[0] === -3 ||
            GameBoard.getDiagCounter()[1] === -3
        )
        {
            return 2; // O wins
        }
        return 0;
    }

    function checkEarlyTie()
    {
        return !GameBoard.getRowCounter().some(val => Math.abs(val) + (3 - moveCount / 2) >= 3) &&
            !GameBoard.getColCounter().some(val => Math.abs(val) + (3 - moveCount / 2) >= 3) &&
            !(Math.abs(GameBoard.getDiagCounter()[0]) + (3 - moveCount / 2) >= 3) &&
            !(Math.abs(GameBoard.getDiagCounter()[1]) + (3 - moveCount / 2) >= 3);
    }

    function getPlayers()
    {
        return players;
    }

    function resetGame()
    {
        GameBoard.resetBoard();
        activePlayer = players[0];
        moveCount = 0;
        DisplayController.displayBoard();
        gameResult = -1;
    }

    return { playRound, getActivePlayer, getPlayers, resetGame };
})();

// Initial render and active player display update
DisplayController.displayBoard();
DisplayController.updateActivePlayer();


