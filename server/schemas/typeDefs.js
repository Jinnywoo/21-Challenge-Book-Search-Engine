const { gql } = require('apollo-server-express');


const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        boookCount: Int
        savedBooks: [Book]!
    }
    type Query {
        me: User
    }
    type Auth {
        token: ID
        user: User
    }
    type Mutation {
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: savedBookInput): User
        removeBook(bookId: String!): User
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
        
    }
    input saveBookInput {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
`;

module.exports = typeDefs;