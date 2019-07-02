const { ApolloServer, gql, PubSub } = require('apollo-server');
const fs = require('fs');
const persistSubmission = require('./persistence');
const PORT = process.env.PORT || 3000;
const { clearingRules } = require('./clearing');
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
	enum LOB {
		LIABILITY
		PROPERTY
	}

	enum STATUS {
		DONE
		PROGRESS
		MANUAL
	}

	enum PERIL {
		FIRE
		NAT_CAT
		TERRORISM
	}

	type RuleApplied {
		rule:String
		status:STATUS
	}

	input GeolocationInput {
		long: Float!
		lat: Float!
	}

	type GeoLocation {
		long: Float!
		lat: Float!
	}

	type Submission {
		id: ID!
		lob: LOB!
		country: String!
		insuredCompany: String!
		address: String!
		broker: String!
		peril: PERIL!
		rules:[RuleApplied]!
	}

	input SubmissionInput {
		lob: LOB!
		country: String!
		insuredCompany: String!
		address: String!
		broker: String!
		peril: PERIL!
	}

	type Subscription {
		clearingStatusChanged: Subscription
	}

	type Mutation {
		submission(submission: SubmissionInput): Submission
	}

	type Query {
		submissions: [Submission]
		getSubmission(id:ID!):Submission
		clearingRules(submission: SubmissionInput, filename: String): [String]
	}
`;

const CLEARING_STATUS_CHANGED = 'CLEARING_STATUS_CHANGED';
let db = [];

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
	Mutation: {
		submission: async (_, { submission }) => {
			let sub = persistSubmission(db, submission);
			let rules = await clearingRules(submission);
			console.log(rules);
			sub.rules = rules.map((r)=>{
				return {
					rule:r,
					status:'PROGRESS'
				}
			});
			return sub;
		}
	},
	Subscription: {
		clearingStatusChanged: {
			// Additional event labels can be passed to asyncIterator creation
			subscribe: () => pubsub.asyncIterator([ CLEARING_STATUS_CHANGED ])
		}
	},
	Query: {
		submissions: (_, {}) => {
			return db;
		},
		clearingRules: async (_, { submission, filename }) => {
			return await clearingRules(submission, filename);
		},
		getSubmission:(_,{id})=>{
			console.log(id);
			let res = db[id];
			console.log(res);
			return res;
		}
	}
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
	cors: {
		origin: '*', // <- allow request from all domains
		credentials: true
	},
	typeDefs,
	resolvers
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: PORT }).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
