const SERVICES = require('./services');

const RULE_DEFAULT = 'ruledefault';

const fetch = require('node-fetch');
//
module.exports = {
	async clearingRules(submission, filename) {
		filename = filename || 'ruledefault';
		let res =  await fetch(SERVICES.ruleEngine + '/clearingrules/ruledefault', {
			method: 'POST',
			body: JSON.stringify(submission)
        });
        return await res.json();
	}
};
