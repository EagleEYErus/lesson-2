const argvParser = require('minimist');
const fs = require('fs');
const readline = require('readline');

const argv = argvParser(process.argv.slice(2));
var maxWinStreak = 0,
	maxLooseStreak = 0, 
 	wins = 0,
 	looses = 0,
 	games = 0,
 	winStreak = 0,
 	looseStreak = 0,
 	wins = 0,
 	looses = 0;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const game = name => {

	const gameEnum = {
		HEADS: 1,
		TAILS: 2
	};

	const resultEnum = {
		WIN: 1,
		LOOSE: 0,
		ERROR: -1
	};

	const number = random(1, 3);

	switch(name) {
		case 'Орел':
			if (number === gameEnum.HEADS) {
				return resultEnum.WIN;
			} else {
				return resultEnum.LOOSE;
			}
		case 'Решка':
			if (number === gameEnum.TAILS) {
				return resultEnum.WIN;
			} else {
				return resultEnum.LOOSE;
			}
		case 'exit':
			rl.close();
			break;
		default: 
			return resultEnum.ERROR;
	}
}

var writeLog = isWin => {

	log = '[' + new Date().toLocaleString() + '] ';

	if (isWin) {
		log += 'Победа';
	} else {
		log += 'Поражение';
	}

	log += ' Побед: ' + wins + 
		' Поражений: ' + looses +  
		' WinStreak: ' + winStreak +  
		' LooseStreak: ' + looseStreak  +
		' Всего сыграно игр: ' + games +
		' Максимальный WinStreak: ' + maxWinStreak +
		' Максимальный LooseStreak: ' + maxLooseStreak + 
		' WinRate: ' + Math.round((wins/games)*100) + '\n\r';

	fs.appendFile(argv.path, log, err => {
		if (err) console.log(err.message);
	});
};

rl.on('line', cmd => {
	const result = game(cmd);
	
	if (result === 1) {
		
		games++;
		winStreak++;
		wins++;
		if (maxLooseStreak < looseStreak) maxLooseStreak = looseStreak;
		looseStreak = 0;

		console.log('Вы победили!');
		writeLog(1);
	} else if (result === 0) {
		
		games++;
		looseStreak++;
		looses++;
		if (maxWinStreak < winStreak) maxWinStreak = winStreak;
		winStreak = 0;
		
		console.log('Вы проиграли!');
		writeLog(0);
	} else if (result === -1 ) console.log('Неккоректный запрос');
});
