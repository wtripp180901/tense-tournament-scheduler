let players = JSON.parse(new URLSearchParams(window.location.search).get("names"));

console.log("Matches: "+((players.length * players.length) - players.length)/(2*(players.length/2)));

let rounds = getAllRounds();
let roundNumber = 0;
let scoreMap = new Map();

for(z = 0;z < players.length;z++){
	scoreMap.set(players[z],0);
}

function NextRound(){
	
	getScores();
	updateLeaderBoard();
	
	let bestRoundIndex;
	let bestRound;
	let bestScore = -1;
	for(i = 0;i < rounds.length;i++){
		let currentScore = score(rounds[i]);
		if(currentScore > bestScore){
			bestRoundIndex = i;
			bestRound = rounds[i];
			bestScore = currentScore;
		}
	}
	rounds.splice(bestRoundIndex,1);
	
	//TODO: order matches so players with lowest score are leftmost
	
	roundNumber++;
	makeRoundTables(bestRound);
	return bestRound;
}

function updateLeaderBoard(){
	players.sort(function(a,b){ return scoreMap.get(b) - scoreMap.get(a)});
	let previousRows = document.getElementsByClassName("leaderboardRow");
	
	for(j = previousRows.length-1;j >= 0;j--){
		previousRows[j].remove();
	}
	
	const leaderboard = document.getElementById("leaderboard");
	let currentRank = 1;
	for(i = 0;i < players.length;i++){
		
		let currentScore = scoreMap.get(players[i]);
		if(i > 0 && currentScore < scoreMap.get(players[i-1])){
			currentRank += 1;
		}
		
		let row = leaderboard.insertRow();
		row.setAttribute('class','leaderboardRow');
		row.insertCell().innerHTML = currentRank;
		row.insertCell().innerHTML = players[i];
		row.insertCell().innerHTML = currentScore;
	}
}

function getScores(){
	if(roundNumber > 0){
		for(i = 0;i < players.length;i++){
			scoreMap.set(players[i],scoreMap.get(players[i]) + parseInt(document.getElementById(players[i]+"Score"+roundNumber).value));
		}
	}
}

function score(matches){
	if(matches == null){
		return -1;
	}else{
	let score = 0;
	for(l = 0;l < matches.length;l++){
		let raw = scoreMap.get(matches[l].p1) - scoreMap.get(matches[l].p2);
		score += raw * raw;
	}
	return score;
	}
}

function getAllRounds(){
	let halfPlayLen = players.length/2;

	let playersCopy = JSON.parse(JSON.stringify(players));

	let playerTwos = playersCopy.splice(halfPlayLen,halfPlayLen);
	let playerOnes = playersCopy.splice(0,halfPlayLen);
	
	let roundlist = []
	
	for(i = 0;i < players.length - 1;i++){
		let currentRound = []
		for(l = 0;l < playerOnes.length;l++){
			currentRound.push({p1:playerOnes[l],p2:playerTwos[l]});
		}
		roundlist.push(currentRound);
		
		endValue = playerOnes[playerOnes.length - 1];
		for(j = playerOnes.length - 1;j > 1;j--){
			playerOnes[j] = playerOnes[j-1];
		}
		playerOnes[1] = playerTwos[0];
		for(k = 0;k < playerTwos.length - 1;k++){
			playerTwos[k] = playerTwos[k+1];
		}
		playerTwos[playerTwos.length-1] = endValue;
		
		
	}
	return roundlist;
}

function makeRoundTables(currentRounds){
	const parentTable = document.getElementById("matchTable");
	const row = parentTable.insertRow();
	let cells = []
	for(i = 0;i < currentRounds.length;i++){
		let currentCell = row.insertCell();
		let currentTable = document.createElement('table');
		
		let nameRow = currentTable.insertRow();
		nameRow.insertCell().innerHTML = currentRounds[i].p1;
		nameRow.insertCell().innerHTML = currentRounds[i].p2;
		
		let scoreRow = currentTable.insertRow();
		scoreRow.insertCell().innerHTML = "<input id=\""+currentRounds[i].p1+"Score"+roundNumber+"\"></input>";
		scoreRow.insertCell().innerHTML = "<input id=\""+currentRounds[i].p2+"Score"+roundNumber+"\"></input>";
		
		currentCell.appendChild(currentTable);
	}
	
}