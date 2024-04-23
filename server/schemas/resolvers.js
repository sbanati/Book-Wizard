const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () =>{
            return User.find().populate('savedBooks');
          },
    
        
         // Resolver for "me" query
         me: async (parent, args, context) => {
          
            if (context.user) {
              // Retrieve user data from the database based on the context
              const userData = await User.findOne({ _id: context.user._id }).populate("savedBooks"); // populate book 
              // return userData
              return userData; 
            }
            // Throw an auth error if the user is not logged in
            throw new AuthenticationError("Not logged in");
          },
    },
    
    Mutation: {
         // Resolver for login mutation
        login: async (parent, { email, password }) => {
        console.log(email, password);
        // Find user by email in the database, throw an auth error if no user is found with the given email
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("Incorrect credentials");
        }
        // Check if the password is correct for the user, throw an auth error if the password is incorrect
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }
        // generate a token for the authenticated user
        const token = signToken(user);
        // return the token and the user data
        return { token, user };
      },

        // Resolver for addUser mutation
        addUser: async (parent, { username, email, password }) => {
        // Create a new user in the database with given username, email and password
        const user = await User.create({ username, email, password });
        // Generate a token for the newly created user
        const token = signToken(user);
        // return the token and the user data
        return { token, user };
      },

      saveBook: async (parent, { bookId, authors, title, description, image, link }, context) => {
        try {
          // Check if the user is authenticated
          if (context.user) {
            // Update the user document in the database to save the book 
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { savedBooks: { bookId, authors, title, description, image, link } } },
              { new: true, runValidators: true }
            );
            
            return updatedUser; // Return the updated user document
          } else {
            throw new AuthenticationError("You need to be logged in!");
          }
        } catch (error) {
          console.error(error);
          throw new Error("Unable to save book.");
        }
      },
      
      removeBook: async (parent, { bookId }, context) => {
        try {
          // Check if the user is authenticated
          if (context.user) {
            // Update the user document in the database to remove the book with the specified bookId
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            );
      
            return updatedUser; // Return the updated user document
          } else {
            throw new AuthenticationError("You need to be logged in!");
          }
        } catch (error) {
          console.error(error);
          throw new Error("Unable to remove book.");
        }
      },
    },
};

module.exports = resolvers;