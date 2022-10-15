import React from "react"

export default function GameScores(props) {

    return (
        <div className="gameScores">
            <h2 className="gameScores--highscore">High Score: {props.highScore}</h2>
            <h2 className="gameScores--score">Score: {props.score}</h2>
        </div>
    )
}