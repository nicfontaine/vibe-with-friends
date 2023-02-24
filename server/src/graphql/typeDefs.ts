const typeDefs = `#graphql

	scalar DateTime

	# Types
	type Group {
		id: String
		ownerID: String
		lastEvent: DateTime
	}

	type GroupUser {
		name: String
		isOwner: Boolean
	}

	# Inputs
	input CreateGroupInput {
		id: ID!
		ownerID: String!
		lastEvent: DateTime!
	}
	input DeleteGroupInput {
		id: ID!
	}

	input AddGroupUserInput {
		id: ID!
		uid: ID!
		name: String!
		isOwner: Boolean!
	}

	input DeleteGroupUserInput {
		id: ID!
		uid: ID!
	}

	input SetGroupUserNameInput {
		id: String!
		uid: ID!
		name: String!
	}

	# Queries
	type Query {
		hello: String
		group(ID: ID!): Group!
		deleteGroup(ID: ID!): Int!
	}

	# Mutations
	type Mutation {
		createGroup(createGroupInput: CreateGroupInput): Group!
	}

`;

export default typeDefs;
