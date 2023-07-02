const { gql } = require('apollo-server-express');
const { Book , User } = require('./')

const typeDefs = gql`
  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }

  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }

  type Book {
    bookID: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  input: bookInput {
    bookID: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  type: Auth {
    token: ID
    user: User
  },

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookInput: bookInput): User
    removeBook(bookInput: String!): User
  }
`;

module.exports = typeDefs;
