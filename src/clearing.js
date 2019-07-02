const SERVICES = require('./services');

const RULE_DEFAULT = "ruledefault";

const fetch = require('node-fetch');

module.exports = {
async clearingRules( submission, filename) {
		filename = filename || ruledefault;
	return await fetch(SERVIES.ruleEngine+"/ruledefault", { method: 'POST', body: submission })
			.then((res) => res.json());
};
