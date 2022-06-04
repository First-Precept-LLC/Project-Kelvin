import { VulcanDocument } from "@vulcanjs/schema";
import {
    CreateGraphqlModelOptionsServer,
    createGraphqlModelServer,
    VulcanGraphqlSchemaServer,
  } from "@vulcanjs/graphql/server";

import { createMongooseConnector } from "@vulcanjs/mongo";
import { Org } from "./org.server";


export interface ProjTypeServer extends VulcanDocument {
    name?: string;
    parentId?: string;
  }

  
  export const schema: VulcanGraphqlSchemaServer = {
    // _id, userId, and createdAT are basic field you may want to use in almost all schemas
    _id: {
      type: String,
      optional: true,
      canRead: ["guests"],
      canCreate: ["members"]
    },
    // userId is the _id of the owner of the document
    // Here, it guarantees that the user belongs to group "owners" for his own data
    userId: {
      type: String,
      optional: true,
      canRead: ["guests"],
      canCreate: ["members"]

    },

    name: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },


    createdAt: {
      type: Date,
      optional: true,
      canRead: ["admins"],
      onCreate: () => {
        return new Date();
      },
      canCreate: ["members"]

    },

    parent: {
        type: String,
        relation: {
          fieldName: "org",
          kind: "hasOne",
          model: Org,
          typeName: "Orgs",
        },
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
  
    },
  };

  export const modelDef: CreateGraphqlModelOptionsServer = {
    name: "Proj",
    graphql: {
      typeName: "Proj",
      multiTypeName: "Projs",
    },
    schema,
    permissions: {
      canCreate: ["members"], 
      canUpdate: ["owners", "admins"],
      canDelete: ["owners", "admins"],
      canRead: ["members", "admins"],
    },
  };

  export const Proj = createGraphqlModelServer(modelDef);

  export const ProjConnector = createMongooseConnector<ProjTypeServer>(Proj);