const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            const userData = await User.findOne({ _id: context.user._id });
            return userData;
        },
    },
    Mutation: {
        loginUser: async(parent, { email, password }, context) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("User does not exist");
            };
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Wrong password, please try again');
            };
            const token = signToken(user);
            return { token, user };
        },
        addUser: async(parent, { name, email, password }, context) => {
            const user = await User.create({ name, email, password });
            const token = signToken(user);
            if (!user) {
                throw new AuthenticationError('There was an error creating your profile, please try again');
            }
            return { token, user };
        },
        saveBook: async(parent, { book } , context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: book }},
                    { new: true },
                );
                console.log(updatedUser);
                return updatedUser;
            }
            throw new AuthenticationError('Book could not be saved, please try again');
        },
        removeBook: async(parent, { bookId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } }},
                    { new: true },
                );
                console.log(updatedUser);
                return updatedUser;
            }
            throw new AuthenticationError("Error removing book, please try again");
        },
    },
};

module.exports = resolvers; 