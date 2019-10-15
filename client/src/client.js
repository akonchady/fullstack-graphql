import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";

/**
 * Create a new apollo client and export as default
 */

const typeDefs = gql`
  extend type User {
    age: Int
  }

  extend type Pet {
    isVaccinated: Boolean
  }
`;

const resolvers = {
  User: {
    age() {
      return 35;
    }
  },
  Pet: {
    isVaccinated() {
      if (Math.random() < 0.5) {
        return true;
      }
      return false;
    }
  }
};

const http = new HttpLink({ uri: "http://localhost:4000/" });
const delay = setContext(
  request =>
    new Promise((success, fail) => {
      setTimeout(() => {
        success();
      }, 800);
    })
);

const cache = new InMemoryCache();

const link = ApolloLink.from([delay, http]);

const client = new ApolloClient({
  link,
  cache,
  resolvers,
  typeDefs
});

// const query = gql`
//     {
//         characters {
//             results {
//                 id
//                 name
//             }
//         }
//     }
// `
// client.query({query}).then(result => console.log(result));

export default client;
