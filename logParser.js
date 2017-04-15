const argvParser = require('minimist');
const fs = require('fs');
const WordTable = require('word-table');

const argv = argvParser(process.argv.slice(2));
const p = '\\[%{DATA:time}\\] ' + 
		'%{WORD:winStatus} ' + 
		'Побед: %{INT:wins} ' + 
		'Поражений: %{INT:looses} ' + 
		'WinStreak: %{INT:winStreak} ' + 
		'LooseStreak: %{INT:looseStreak} ' +
		'Всего сыграно игр: %{INT:games} ' + 
		'Максимальный WinStreak: %{INT:maxWinStreak} ' + 
		'Максимальный LooseStreak: %{INT:maxLooseStreak} ' + 
		'WinRate: %{WORD:winRate}';
var dataArray = [];

fs.readFile(argv.path, 'utf8', (err, data) => {
	const logsArray = data.split('\n\r');
	const patterns = require('node-grok').loadDefaultSync();
	const pattern = patterns.createPattern(p);
	logsArray.forEach((item, i) => {
		dataArray.push(pattern.parseSync(item));
	});

	var header = ['Win Status', 'Total Wins', 'Total Looses', 'Games', 'WinRate', 'WinStreak', 'LooseStreak'];
	var body = [];
	dataArray.forEach((item, i) => {
		if (item !== null) {
			var array = [item.winStatus, item.wins, item.looses, item.games, item.winRate + ' %', item.maxWinStreak, item.maxLooseStreak];
			body.push(array);
		}
	});
	const wt = new WordTable(header, body);
	console.log(wt.string());
});
