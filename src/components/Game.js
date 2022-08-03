import React, { useCallback } from "react";

export default function Game() {

    const [allSeasonsAvailable, setAllSeasonsAvailable] = React.useState([])

    const [score, setScore] = React.useState(0)

    const [highScore, setHighScore] = React.useState(0)

    const [firstClub, setFirstClub] = React.useState({})

    const [secondClub, setSecondClub] = React.useState({})

    // const getRandomClub = React.useCallback(() => {
    //     const randomSeasonIndex = Math.floor(Math.random() * allSeasonsAvailable.length)
    //     const season = allSeasonsAvailable[randomSeasonIndex]
    //     const url = `https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=${season}`

    //     async function findClub() {
    //         const res = await fetch(url)
    //         const data = await res.json()            

    //         console.log(data)           
    //     }

    //     findClub()
    // }, [allSeasonsAvailable])

    React.useEffect(() => {
        function generateSeason() {
            const ri = Math.floor(Math.random() * allSeasonsAvailable.length)
            const s = allSeasonsAvailable[ri]
            return s            
        }

        function generateClubIndex() {
            const idx = Math.floor(Math.random() * 20)
            return idx
        }

        async function getRandomClub(season, clubIndex, clubToSet) {
            const url = `https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=${season}&sort=asc`
            const res = await fetch(url)
            const data = await res.json()

            const club = data.data.standings[clubIndex]

            //console.log(club)

            if(clubToSet === 1) {
                setFirstClub({
                    ...club,
                    season: season,
                    position: clubIndex + 1
                })
            }
            else if(clubToSet === 2) {
                setSecondClub({
                    ...club,
                    season: season,
                    position: clubIndex + 1
                })
            }           
        }

        if(allSeasonsAvailable && allSeasonsAvailable.length) {
            for(let i = 1; i <= 2; i++) {
                getRandomClub(generateSeason(), generateClubIndex(), i)
            }           
        }      

    }, [allSeasonsAvailable])

    React.useEffect(() => {
        async function getAllSeasonsAvailable() {
            const res = await fetch("https://api-football-standings.azharimm.site/leagues/eng.1/seasons")
            const data = await res.json()            

            const seasons = data.data.seasons.map(seasonItem => seasonItem.year)
            setAllSeasonsAvailable(seasons)
        }

        getAllSeasonsAvailable()        
    }, [])

    console.log(firstClub)
    console.log(secondClub)

       


    return (
        <main>
            
        </main>
    )   
}