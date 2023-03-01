const typeDefs = `#graphql

	scalar DateTime

	# Types
	type Group {
		id: ID
		name: String
		ownerID: String
		lastEvent: DateTime
		users: [GroupUser]
	}
	type GroupUser {
		uid: String
		name: String
		isOwner: Boolean
	}

	# Group Input
	input GroupInput {
		name: String!
		ownerID: String!
		lastEvent: DateTime!
		users: [GroupUserInput]
	}
	input DeleteGroupInput {
		id: ID!
	}

	# GroupUser Input
	input GroupUserInput {
		uid: ID!
		name: String!
		isOwner: Boolean!
	}
	input DeleteGroupUserInput {
		id: ID!
	}
	input GroupUserNameInput {
		uid: ID!
		name: String!
	}

	# Queries
	type Query {
		hello: String
		# Group
		group(ID: ID!): Group
		allGroups: [Group]
		# Group User
		groupUser(ID: ID!, UID: ID!): GroupUser
		users: [GroupUser]
	}

	# Mutations
	type Mutation {
		# Group
		createGroup(group: GroupInput): Group!
		deleteGroup(ID: ID!): String!
		groupEvent(ID: ID!): Group
		# Group User
		createGroupUser(ID: ID!, user: GroupUserInput!): Group!
		deleteGroupUser(ID: ID!): String!
		setGroupUserName(ID: ID!, user: GroupUserNameInput!): Group!
	}

`;

export default typeDefs;
