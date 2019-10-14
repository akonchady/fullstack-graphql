// import db from './db/db';
/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your schema
 */

module.exports = {
  Query: {
    // context - shared context among all the resolvers
    // info - AST of the incoming query, useful for projection on DB queries
    // demo(_, args, context, info) {
    //   const { models } = context;
    //   models.Pet.findMany({});
    // },

    // pets(_, {input}, ctx)
    pets(_, args, ctx) {
      // return db;
        console.log('QUERY -> pet')
      const { input } = args;
      return ctx.models.Pet.findMany(input);
      // return [
      //   {
      //     id: "1",
      //     createdAt: "asdf",
      //     name: "fluffy",
      //     type: "dog"
      //   }
      // ];
    },
    pet(_, args, ctx) {
      const { input } = args;
        console.log('QUERY -> pet')
      return ctx.models.Pet.findOne(input);
    }
  },
  Pet: {
    // id(pet){
    //   return 3;
    // }
    owner(pet, __, ctx) {
      // ctx.models.User.findById(pet.user.id)
      console.log('PET -> owner')
      return ctx.models.User.findOne({});
    }
  },
  Mutation: {
    newPet(_, { input }, ctx) {
      return ctx.models.Pet.create(input);
    }
  },
  // Pet: {
  //   img(pet) {
  //     return pet.type === "DOG"
  //       ? "https://placedog.net/300/300"
  //       : "http://placekitten.com/300/300";
  //   }
  // },
  User: {
    // Field level resolvers
    // 1st argument -> User, since this under User field, the one that's resolved before this
    pets(user, { input }, ctx) {
      // return ctx.models.Pet.findMany({user: user.id})
      return ctx.models.Pet.findMany();
    }
  }
};
