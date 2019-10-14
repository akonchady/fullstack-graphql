const gql = require("graphql-tag");
const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
  """
  do things here that show up in tools
  """ #  union Footwear = Sneaker | Boot
  enum ShoeType {
    JORDAN
    NIKE
    ADIDAS
  }

  type User {
    email: String!
    avatar: String
    #    friends: [User]!
    shoes: [Shoe]!
  }

  #  type Query {
  #    me: User!
  #    #    friends: [User]!
  #  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    sport: String
    user: User!
  }

  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    hasGrip: Boolean
    user: User!
  }

  input ShoesInput {
    brand: ShoeType
    size: Int
  }

  input NewShoeInput {
    brand: ShoeType!
    size: Int!
  }

  type Query {
    me: User!
    shoes(input: ShoesInput): [Shoe]!
  }

  type Mutation {
    newShoe(input: NewShoeInput!): Shoe!
  }
`;

const user = {
  id: 1,
  email: "yoda@masters.com",
  avatar: "http://yoda.png",
  // friends: []
  shoes: []
};

const shoes = [
    {
        brand: "NIKE",
        size: 12,
        sport: "basketbaall",
        user: 1
    },
    {
        brand: "ADIDAS",
        size: 14,
        hasGrip: true,
        user: 1
    }
];
const resolvers = {
  Query: {
    shoes(_, { input }) {
      return [
        {
          brand: "NIKE",
          size: 12,
          sport: "basketbaall",
          user: 1
        },
        {
          brand: "ADIDAS",
          size: 14,
          hasGrip: true,
          user: 1
        }
      ]; //.filter(shoe => shoe.brand === input.brand);
    },
    me() {
      return user;
    }
  },
  Mutation: {
    newShoe(_, { input }) {
      return input;
    }
  },
  User: {
    shoes(shoe) {
      return shoe;
    }
  },
  Shoe: {
    __resolveType(shoe) {
      if (shoe.sport) {
        return "Sneaker";
      }
      return "Boot";
    }
  },
  Sneaker: {
    user(shoe) {
      return user;
    }
  },
  Boot: {
    user(shoe) {
      return user;
    }
  }
  // Footwear: {
  //   __resolveType(shoe) {
  //     if (shoe.sport) {
  //       return "Sneaker";
  //     }
  //     return "Boot";
  //   }
  // }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const port = 4000;
server.listen(port).then(() => console.log(`on port ${port}`));
