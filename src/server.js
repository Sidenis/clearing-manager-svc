const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const persistSubmission = require('./persistence');
const PORT = process.env.PORT || 3000;

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`

	input GeolocationInput {
		long: Float!
		lat: Float!
	}


	type GeoLoaction {
		long: Float!
		lat: Float!
	}
	type Submission {
		id: ID!
    lob: Int! 
    country: String! 
    insured: String!
    geolocation: GeoLoaction!
	}

  input SubmissionInput{
    lob: Int! 
    country: String! 
    insured: String!
    geolocation: GeolocationInput
  }

  type Mutation{
    submission(submission: SubmissionInput): Submission
  }

	type Query {
    submissions:[Submission]
  }
`;

let db = [];

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Mutation:{
    submission: (_, { submission }) => {
      let sub  = persistSubmission(db,submission);
			return sub
		}
  },
	Query: {
    submissions:(_,{})=>{
      console.log(db);
      return db;
    }
	}
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: PORT }).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});