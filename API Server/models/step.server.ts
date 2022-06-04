import { VulcanDocument } from "@vulcanjs/schema";
import {
    CreateGraphqlModelOptionsServer,
    createGraphqlModelServer,
    VulcanGraphqlSchemaServer,
  } from "@vulcanjs/graphql/server";

import { createMongooseConnector } from "@vulcanjs/mongo";
import { ProcessTemplate } from "./process_template.server";

export interface StepTypeServer extends VulcanDocument {
    name?: string;
    parentProcessTemplate?: string;
    estimatedDuration?: number;
    description?: string;
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

    parentProcessTemplate: {
        type: String,
        relation: {
          fieldName: "processTemplate",
          kind: "hasOne",
          model: ProcessTemplate,
          typeName: "ProcessTemplates",
        },
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
  
    },

    estimatedDuration: {
        type: Number,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },

    description: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },
  };

  export const modelDef: CreateGraphqlModelOptionsServer = {
    name: "Step",
    graphql: {
      typeName: "Step",
      multiTypeName: "Steps",
    },
    schema,
    permissions: {
      canCreate: ["members"], 
      canUpdate: ["owners", "admins"],
      canDelete: ["owners", "admins"],
      canRead: ["members", "admins"],
    },
  };

  export const Step = createGraphqlModelServer(modelDef);

  export const StepConnector = createMongooseConnector<StepTypeServer>(Step);