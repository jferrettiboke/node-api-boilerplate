import API from '../api';

const resolvers = {
  Query: {
    user(root, args, context) {
      const errors = [];

      return API.Auth.isAuthenticated(context.token)
        .then(() => (
          API.Users.findById(args.id)
            .then(user => ({
              errors,
              // eslint-disable-next-line no-underscore-dangle
              id: user._id,
              email: user.email
            }))
            .catch(() => {
              throw new Error('User not found.');
            })
        ))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });
            return { errors };
          }

          throw new Error(err);
        });
    }
  },
  Mutation: {
    signUp(root, args) {
      const errors = [];

      return API.Auth.signUp(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });
            return { errors };
          }

          throw new Error(err);
        });
    },
    signIn(root, args) {
      const errors = [];

      return API.Auth.signIn(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });
            return { errors };
          }

          throw new Error(err);
        });
    }
  }
};

export default resolvers;
