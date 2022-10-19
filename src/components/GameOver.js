import React from "react"

export default function GameOver(props) {

    function gameOverClubDetails(club) {
        let details = `${club.team.name}'s position in ${club.seasonDisplay}: ${club.position}`
        details += `${club.position === 1 ? 'st' :
                    club.position === 2 ? 'nd' :
                    club.position === 3 ? 'rd' : 'th'}`
        
        return details
    }

    return (
        <div className="gameOver">
            <h1 className="gameOver--title">Game Over</h1>                    
            <h2 className="gameOver--score">Score: {props.score}</h2>
            <div
                className="game--mainButton"                
                onClick={props.handlePlayAgain}
            >
                Play Again
            </div>
            <div
                className="game--mainButton"                
                onClick={props.handleReturnToMenu}
            >
                Main Menu
            </div>

            <h4 className="gameOver--clubDetails">
                {gameOverClubDetails(props.firstClub)}
            </h4>
            <h4 className="gameOver--clubDetails">
                {gameOverClubDetails(props.secondClub)}
            </h4>
        </div>
    )
}