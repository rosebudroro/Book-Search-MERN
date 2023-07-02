const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-_v -password')
                    .populate('savedBooks');
                return userData;
            }
            throw new AuthenticationError("Not Logged In!")
        }

    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { heartBook }, context) => {
            if (context.user) {
                const book = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: heartBook } },
                    { new: true }
                );
                return book;
            }
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const book = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return book;
            }
        },
    },
};

module.exports = resolvers;
