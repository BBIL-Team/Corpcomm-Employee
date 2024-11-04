import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* Define the data model */
const schema = a.schema({
  Task: a
    .model({
      employeeName: a.string(),
      taskDescription: a.string(),
      startDate: a.string(), // assuming dates are stored as strings; change to a.date() if needed
      endDate: a.string(),
      rating: a.string(),
      remarks: a.string(),
      }).authorization(allow => [allow.owner()]),
});

/* Define the schema type */
export type Schema = ClientSchema<typeof schema>;

/* Define the data configuration */
export const data = defineData({
  schema,
  authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    //apiKeyAuthorizationMode: {
      //expiresInDays: 30,
    },
  },
});
