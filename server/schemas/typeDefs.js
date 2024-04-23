// Define the `Query` and `Mutation` types


const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }


  
  type Query {
    users:[User]!
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String]!, description: String!, bookId: String!, image: String!, link: String!, title: String!): User
    removeBook(bookId: String!): User
  }
`

module.exports = typeDefs;
