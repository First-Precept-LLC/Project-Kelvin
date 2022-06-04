import { VulcanDocument } from "@vulcanjs/schema";
import {
    CreateGraphqlModelOptionsServer,
    createGraphqlModelServer,
    VulcanGraphqlSchemaServer,
  } from "@vulcanjs/graphql/server";

import { createMongooseConnector } from "@vulcanjs/mongo";
import { Process } from "./process.server";
import { Step } from "./step.server";

export interface StepInstanceTypeServer extends VulcanDocument {
    name?: string;
    parentProcess?: string;
    parentStep?: string;
    status?: string;
    dueDate?: Date;
    description?: string;
    //TODO: add user?
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

    parentProcess: {
        type: String,
        relation: {
          fieldName: "process",
          kind: "hasOne",
          model: Process,
          typeName: "Processes",
        },
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
  
    },

    parentStep: {
        type: String,
        relation: {
          fieldName: "step",
          kind: "hasOne",
          model: Step,
          typeName: "Steps",
        },
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
  
    },

    dueDate: {
        type: Date,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },

    status: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },

    description: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    }
  };

  export const modelDef: CreateGraphqlModelOptionsServer = {
    name: "Process",
    graphql: {
      typeName: "Process",
      multiTypeName: "Processes",
    },
    schema,
    permissions: {
      canCreate: ["members"], 
      canUpdate: ["owners", "admins"],
      canDelete: ["owners", "admins"],
      canRead: ["members", "admins"],
    },
  };

  export const StepInstance = createGraphqlModelServer(modelDef);

  export const StepInstanceConnector = createMongooseConnector<StepInstanceTypeServer>(StepInstance);