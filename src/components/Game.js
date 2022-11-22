import React from "react"
import GameMenu from "./GameMenu"
import GameClubCards from "./GameClubCards"
import GameScores from "./GameScores"
import GameOver from "./GameOver"

export default function Game() {

    const [allLeagues, setAllLeagues] = React.useState([])

    const [allSeasonsAvailablePerLeague, setAllSeasonsAvailablePerLeague] = React.useState({})

    const [allStandingsPerLeague, setAllStandingsPerLeague] = React.useState({})

    const [selectedLeague, setSelectedLeague] = React.useState("eng.1")

    const [isRandomLeague, setIsRandomLeague] = React.useState(false)

    const [score, setScore] = React.useState(0)

    const [highScore, setHighScore] = React.useState(0)

    const [firstClub, setFirstClub] = React.useState({})

    const [secondClub, setSecondClub] = React.useState({})

    const [inGameMode, setInGameMode] = React.useState(0)



    const generateSeason = React.useCallback((leagueId) => {        
        const ri = Math.floor(Math.random() * allSeasonsAvailablePerLeague[leagueId].length)
        const s = allSeasonsAvailablePerLeague[leagueId][ri]        
        return s 
    }, [allSeasonsAvailablePerLeague])

    const generateClubIndex = React.useCallback((numOfClubs) => {
        const idx = Math.floor(Math.random() * numOfClubs)
        return idx
    }, [])

    const getRandomClub = React.useCallback((leagueId) => {      
        
        const season = generateSeason(leagueId)
        const clubIndex = generateClubIndex(allStandingsPerLeague[leagueId][season].standings.length)
        
        if(!allStandingsPerLeague[leagueId] || !Object.keys(allStandingsPerLeague[leagueId]).length)
        {
            return {}
        }        

        const club = allStandingsPerLeague[leagueId][season].standings[clubIndex]
        const seasonDisplay = allStandingsPerLeague[leagueId][season].seasonDisplay

        const clubObject = {
            ...club,
            season: season,
            seasonDisplay: seasonDisplay,
            position: clubIndex + 1
        }       

        return clubObject

    }, [allStandingsPerLeague, generateSeason, generateClubIndex])

    const firstRandomClub = React.useCallback(() => {        
        setFirstClub(getRandomClub(selectedLeague))
    }, [selectedLeague, getRandomClub])

    const secondRandomClub = React.useCallback(() => {
        setSecondClub(getRandomClub(selectedLeague))
    }, [selectedLeague, getRandomClub])


    

    const getAllStandings = React.useCallback(async () => {       

        let allStandingsPerLeagueObject = {}

        let allUrls = []        
        
        let leagueNameToLeagueId = {
            "English Premier League": "eng.1",
            "Spanish LaLiga": "esp.1",
            "German Bundesliga": "ger.1",
            "Italian Serie A": "ita.1",
            "French Ligue 1": "fra.1"
        }

        for(const [leagueId, allSeasonsAvailable] of Object.entries(allSeasonsAvailablePerLeague))
        {
            const leagueUrls = allSeasonsAvailable.map((season) =>
            `https://api-football-standings.azharimm.dev/leagues/${leagueId}/standings?season=${season}&sort=asc`)                
            
            allUrls.push(...leagueUrls)                            
        }

        // allUrls.push(`https://api-football-standings.azharimm.dev/leagues/eng.1/standings?season=1990&sort=asc`)

        const requests = allUrls.map((url) => fetch(url))
        const responses = await Promise.all(requests)
        
        const errors = responses.filter((response) => !response.ok)
        errors.forEach((error) => console.error(error.statusText))
                 

        const json = responses.map((response) => response.json())
        const data = await Promise.all(json)
        
        console.log(data)

        for(let leagueId of Object.keys(allSeasonsAvailablePerLeague))
        {
            allStandingsPerLeagueObject[leagueId] = {}
        }            

        for(let i = 0; i < data.length; i++)
        {
            if(data[i].status)
            {
                let leagueId = leagueNameToLeagueId[data[i].data.name]
                allStandingsPerLeagueObject[leagueId][data[i].data.season] = data[i].data            
            }                
        }
        
        console.log(allStandingsPerLeagueObject)
        
        setAllStandingsPerLeague(allStandingsPerLeagueObject)       
                  
    }, [allSeasonsAvailablePerLeague])  


    React.useEffect(() => {
        if(allSeasonsAvailablePerLeague && Object.keys(allSeasonsAvailablePerLeague).length) {
            getAllStandings()                                        
        }      

    }, [allSeasonsAvailablePerLeague, getAllStandings])

    React.useEffect(() => {
        async function getAllSeasonsAvailablePerLeague() {

            let allSeasons = {}            

            const allUrls = allLeagues.map((league) => `https://api-football-standings.azharimm.dev/leagues/${league.id}/seasons`)

            const requests = allUrls.map((url) => fetch(url))
            const responses = await Promise.all(requests)                      

            const json = responses.map((response) => response.json())
            const data = await Promise.all(json)           

            let allLeaguesSeasons = data.map((leagueSeasons) => leagueSeasons.data.seasons.map(seasonItem => seasonItem.year))
            
            const currentTime = new Date()
            const year = currentTime.getFullYear()
            const month = currentTime.getMonth() + 1

            //filtering seasons array so all seasons should be complete 
            allLeaguesSeasons = allLeaguesSeasons.map((leagueSeasons) => 
                                                       leagueSeasons.filter(season => month <= 6 ? season < year - 1 : season < year))                                                  

            for(let i = 0; i < allLeagues.length; i++)
            {
                let curLeagueId = allLeagues[i].id
                allSeasons[curLeagueId] = allLeaguesSeasons[i]               

                // fix for French league    
                if(curLeagueId === "fra.1")
                {                    
                    const badSeasons = [2000, 2001]
                    allSeasons[curLeagueId] = allSeasons[curLeagueId].filter(season => !badSeasons.includes(season))
                }
            }            
            
            setAllSeasonsAvailablePerLeague(allSeasons)            
        }
        getAllSeasonsAvailablePerLeague()
             
    }, [allLeagues])

    React.useEffect(() => {
        async function getAllLeagues() {
            const res = await fetch("https://api-football-standings.azharimm.dev/leagues")
            const data = await res.json()

            const relevantLeaguesIds = ["eng.1", "esp.1", "ger.1", "ita.1", "fra.1"]

            const relevantLeagues = data.data
                                    .filter(league => relevantLeaguesIds.includes(league.id))
                                    .sort((a, b) => relevantLeaguesIds.indexOf(a.id) - relevantLeaguesIds.indexOf(b.id))                          
            
            setAllLeagues(relevantLeagues)                      
        }

        getAllLeagues()
    }, [])
    
    /*

    React.useEffect(() => {
        if(allStandingsPerLeague && Object.keys(allStandingsPerLeague).length) {
            firstRandomClub()
            secondRandomClub()   
        }

    }, [allStandingsPerLeague, firstRandomClub, secondRandomClub])

    */


    /*
    React.useEffect(() => {
        if(firstClub && secondClub && Object.keys(firstClub).length > 0 && Object.keys(secondClub).length > 0) {
            setInGameMode((prevInGameMode) => ((prevInGameMode !== 1) ? 1 : prevInGameMode))
        }    

    }, [firstClub, secondClub])
    */

    function selectALeague(event) {
        let id = ""

        if(event.target.className !== "leagueCard")
        {
            id = event.target.parentNode.id
        }
        else
        {
            id = event.target.id
        }

        if(allLeagues.some((league) => league.id === id))
        {
            setSelectedLeague(id)
        } 

    }


    function handleStartGame() {

        /*
        if(firstClub && secondClub && Object.keys(firstClub).length > 0 && Object.keys(secondClub).length > 0) {
            setInGameMode(1)
        }
        */

        firstRandomClub()
        secondRandomClub()
            

        setInGameMode(1)        
    }

    
    
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
            setInGameMode(2)            
        }
    }

    function handlePlayAgain() {
        setScore(0)   

        firstRandomClub()
        secondRandomClub() 

        setInGameMode(1)            
    }

    function handleReturnToMenu() {
        setScore(0)

        setInGameMode(0)
    }

    

    return (
        <main className="game">
            {
                (inGameMode === 0) &&
                <GameMenu
                 allLeagues={allLeagues}
                 allStandingsPerLeague={allStandingsPerLeague}
                 selectedLeague={selectedLeague}
                 selectALeague = {selectALeague} 
                 handleStartGame={handleStartGame}
                />
            }
            {
                (inGameMode === 1) &&
                <div className="game--gameOn">                    
                    <GameClubCards
                     firstClub={firstClub}
                     secondClub={secondClub}
                     handleChange={handleChange}
                    />

                    <GameScores 
                     highScore={highScore}
                     score={score}
                    />                 
                </div>
            }
            {
                (inGameMode === 2) &&                
                <GameOver 
                 firstClub={firstClub}
                 secondClub={secondClub}
                 score={score}
                 handlePlayAgain={handlePlayAgain}
                 handleReturnToMenu={handleReturnToMenu}
                />               
            }
                       
        </main>
    )   
}