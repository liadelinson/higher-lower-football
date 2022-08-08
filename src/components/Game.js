import React from "react"
import ClubCard from "./ClubCard"

export default function Game() {

    const [allSeasonsAvailable, setAllSeasonsAvailable] = React.useState([])

    const [allStandings, setAllStandings] = React.useState({})

    const [score, setScore] = React.useState(0)

    const [highScore, setHighScore] = React.useState(0)

    const [firstClub, setFirstClub] = React.useState({})

    const [secondClub, setSecondClub] = React.useState({})


    const generateSeason = React.useCallback(() => {
        const ri = Math.floor(Math.random() * allSeasonsAvailable.length)
        const s = allSeasonsAvailable[ri]
        return s 
    }, [allSeasonsAvailable])

    const generateClubIndex = React.useCallback(() => {
        const idx = Math.floor(Math.random() * 20)
        return idx
    }, [])

    const getRandomClub = React.useCallback(() => {
        const season = generateSeason()
        const clubIndex = generateClubIndex()
        
        if(!allStandings || !Object.keys(allStandings).length)
        {
            return {}
        }

        const club = allStandings[season].standings[clubIndex]
        const seasonDisplay = allStandings[season].seasonDisplay

        const clubObject = {
            ...club,
            season: season,
            seasonDisplay: seasonDisplay,
            position: clubIndex + 1
        }       

        return clubObject

    }, [allStandings, generateSeason, generateClubIndex])

    const getAllStandings = React.useCallback(async () => {
        try {            
            const urls = allSeasonsAvailable.map((season) =>
                `https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=${season}&sort=asc`)
            
            const requests = urls.map((url) => fetch(url))
            const responses = await Promise.all(requests)
            const errors = responses.filter((response) => !response.ok);

            if (errors.length > 0) {
                throw errors.map((response) => Error(response.statusText));
            }

            const json = responses.map((response) => response.json());
            const data = await Promise.all(json);           

            const allStandingsObject = data.reduce((obj, item) => ({...obj, [item.data.season]: item.data}), {})
            
            setAllStandings(allStandingsObject)
        }
        catch(errors) {
            errors.forEach((error) => console.error(error));
        }            
    }, [allSeasonsAvailable])


    const firstRandomClub = React.useCallback(() => {
        setFirstClub(getRandomClub())
    }, [getRandomClub])

    const secondRandomClub = React.useCallback(() => {
        setSecondClub(getRandomClub())
    }, [getRandomClub])


    React.useEffect(() => {
        if(allStandings && Object.keys(allStandings).length) {
            firstRandomClub()
            secondRandomClub()   
        }

    }, [allStandings, firstRandomClub, secondRandomClub])


    React.useEffect(() => {
        if(allSeasonsAvailable && allSeasonsAvailable.length) {
            getAllStandings()                                        
        }      

    }, [allSeasonsAvailable, getAllStandings])

    React.useEffect(() => {
        async function getAllSeasonsAvailable() {
            const res = await fetch("https://api-football-standings.azharimm.site/leagues/eng.1/seasons")
            const data = await res.json()            

            let seasons = data.data.seasons.map(seasonItem => seasonItem.year)

            //filtering seasons array so all seasons should be complete

            const currentTime = new Date()
            const year = currentTime.getFullYear()
            const month = currentTime.getMonth() + 1

            if(month <= 6)
            {
                //the most recent complete season is year-2/year-1
                seasons = seasons.filter(season => season < year - 1)
            }
            else
            {
                //the most recent complete season is year-1/year
                seasons = seasons.filter(season => season < year)
            }            
            
            setAllSeasonsAvailable(seasons)
        }

        getAllSeasonsAvailable()        
    }, [])

    //console.log(firstClub)
    //console.log(secondClub)


    const showClubCards = firstClub && secondClub && Object.keys(firstClub).length > 0 && Object.keys(secondClub).length > 0
    
    function handleChange(event) {
        let isLowerBtn = true
        const {id} = event.target        
        if(id === "btnHigher")
        {
            isLowerBtn = false
        }

        let realSolution = 1
        if(firstClub.position > secondClub.position) {
            //second club got better position
            realSolution = 2
        }
        else if(firstClub.position < secondClub.position) {
            //second club got worse position
            realSolution = 0
        }
        
        if((isLowerBtn && realSolution <= 1) || (!isLowerBtn && realSolution >= 1))
        {
            //if the user is correct          

            setScore((prevScore) => {
                if(highScore === prevScore)
                {
                    setHighScore(prevHighScore => prevHighScore + 1)
                }                
                return prevScore + 1
            })

            setFirstClub(secondClub)
            secondRandomClub()           
        }
        else 
        {
            //if the user is incorrect

            setScore(0)

            firstRandomClub()
            secondRandomClub()
        }
    }

    return (
        <main>
            {
                showClubCards &&
                <div className="game--clubCards">
                    <ClubCard club={firstClub} isFirst={true} handleChange={handleChange}/>
                    <ClubCard club={secondClub} isFirst={false} handleChange={handleChange}/>
                </div>
            }

            <div className="game--scores">
                <h2 className="game--highscore">High Score: {highScore}</h2>
                <h2 className="game--score">Score: {score}</h2>
            </div>           
        </main>
    )   
}