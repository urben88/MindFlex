import { GameId, UserCache, ExerciseTemplate } from "../types";

export const recommenderService = {
  suggestNextActivity: (cache: UserCache, allGames: GameId[], allExercises: ExerciseTemplate[]) => {
    // Strategy: Prioritize games with fewest plays or lowest accuracy
    const stats = cache.gameStats;
    
    const sortedGames = [...allGames].sort((a, b) => {
      const statA = stats[a];
      const statB = stats[b];
      
      // Weight 1: Play count (lower is better for suggestion)
      const playWeight = (statA.plays - statB.plays) * 2;
      
      // Weight 2: Time since last played (older is better)
      const timeWeight = (statA.lastPlayed - statB.lastPlayed) * -0.00000001; 

      return playWeight + timeWeight;
    });

    // Pick top candidate or random if new
    const recommendedGame = sortedGames[0];
    
    // Pick random exercise
    const recommendedExercise = allExercises[Math.floor(Math.random() * allExercises.length)];

    return {
      game: recommendedGame,
      exercise: recommendedExercise
    };
  }
};