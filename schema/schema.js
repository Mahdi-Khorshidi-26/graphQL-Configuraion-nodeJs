// const { query } = require("express");
const graphQL = require("graphql");
// const _ = require("lodash");
const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphQL;

// const users = [
//   { id: "23", firstName: "mahdi", age: 20 },
//   { id: "47", firstName: "ali", age: 25 },
// ];

const UserType = new GraphQLObjectType({
  name: "users",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    companyId: { type: GraphQLString },
  },
});

const CompanyType = new GraphQLObjectType({
  name: "companies",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3001/users/${args.id}`)
          .then((resp) => resp.data);
      },
    },
    companies: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3001/companies/${args.id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
