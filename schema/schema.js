// const { query } = require("express");
const graphQL = require("graphql");
// const _ = require("lodash");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphQL;

// const users = [
//   { id: "23", firstName: "mahdi", age: 20 },
//   { id: "47", firstName: "ali", age: 25 },
// ];

const CompanyType = new GraphQLObjectType({
  name: "companies",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
    user: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3001/company/${parentValue.id}?_embed=users`)
          .then((resp) => resp.data)
          .then((data) => data.users);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "users",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3001/company/${parentValue.companyId}`)
          .then((resp) => resp.data);
      },
    },
  }),
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
          .get(`http://localhost:3001/company/${args.id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios
          .post(`http://localhost:3001/users`, { firstName, age, companyId })
          .then((resp) => resp.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3001/users/${args.id}`)
          .then((resp) => resp.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3001/users/${args.id}`, args)
          .then((resp) => resp.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
