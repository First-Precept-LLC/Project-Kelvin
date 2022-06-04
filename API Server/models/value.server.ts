import { VulcanDocument } from "@vulcanjs/schema";
import {
    CreateGraphqlModelOptionsServer,
    createGraphqlModelServer,
    VulcanGraphqlSchemaServer,
  } from "@vulcanjs/graphql/server";

import { createMongooseConnector } from "@vulcanjs/mongo";


export interface ValueTypeServer extends VulcanDocument {
    title?: string;
    description?: string;
    icon?: string;
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

    //This name will be the value's graph field in uservotes.
    title: {
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

    description: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },

    //The public ID of the image, stored in Cloudinary. Supply a URL for imageUrl in the request, and it will automatically be uploaded, 
    //with the public ID of the uploaded image occupying this field.
    /*image: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"],
        onCreate: (self) => {
            console.log("go!");
            console.log(self);
            let resultId;
            cloudinary.v2.uploader.upload(self.document.imageUrl,
            { public_id: self.document.name }, 
            function(error, result) {
               console.log(result); 
               resultId =  result.public_id;
            });

            return resultId;

        },
    },

    imageUrl: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    },


    //Users who begin with stamps for this value. If unset, defaults to the creator. Comma-separated IDs.
    startSet: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    }*/

    //The icon out of a pregenerated list to use for this value
    icon: {
        type: String,
        optional: true,
        canRead: ["guests"],
        canCreate: ["members"]
    }
  };

  export const modelDef: CreateGraphqlModelOptionsServer = {
    name: "Value",
    graphql: {
      typeName: "Value",
      multiTypeName: "Values",
    },
    schema,
    permissions: {
      canCreate: ["members"], 
      canUpdate: ["owners", "admins"],
      canDelete: ["owners", "admins"],
      canRead: ["members", "admins"],
    },
  };

  export const Value = createGraphqlModelServer(modelDef);

  export const ValueConnector = createMongooseConnector<ValueTypeServer>(Value);