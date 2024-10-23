import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Book {
    bookId: ID!
    title: String!
    authors: [String!]!
    description: String
    image: String
    link: String
  }

  type User {
    _id: ID!            # Ensure _id is used instead of userId
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]!
  }

  input BookInput {
    bookId: ID!
    authors: [String!]!
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
    singleUser(_id: ID!): User  # Keep _id for consistency
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

export default typeDefs;
