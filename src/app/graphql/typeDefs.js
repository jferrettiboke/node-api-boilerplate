const typeDefs = [/* GraphQL */`
  type Auth {
    token: String
    errors: [Error]
  }

  type Error {
    key: String
    value: String
  }

  type User {
    id: String!
    email: String!
    errors: [Error]
  }

  type Query {
    # Fetch a user.
    user(id: String!): User
  }

  type Mutation {
    # Sign up method.
    signUp(email: String!, password: String!): Auth
    # Sign in method.
    signIn(email: String!, password: String!): Auth
  }

  schema {
    query: Query
    mutation: Mutation
  }
`];

export default typeDefs;
