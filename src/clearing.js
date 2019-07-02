const SERVICES = require('./services');

const RULE_DEFAULT = "ruledefault";

const fetch = require('node-fetch');

module.exports = {
	clearingRules(filename) {
		filename = filename || ruledefault;
		fetch(SERVIES.ruleEngine+"/ruledefault", { method: 'POST', body: 'a=1' })
			.then((res) => res.json()) // expecting a json response
			.then((json) => console.log(json));
	}
};
