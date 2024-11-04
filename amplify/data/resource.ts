import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// STEP 1: Define the schema for employee tasks
const schema = a.schema({
  EmployeeTask: a
    .model({
      employeeID: a.string(),
      employeeName: a.string(),
      taskDescription: a.string(),
      startDate: a.string(),
      endDate: a.string(),
      rating: a.string().optional(), // Optional field
      remarks: a.string().optional(), // Optional field
    }).authorization(allow => [allow.owner()]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

// STEP 2: Configure the data client with API key authorization
export const data = defineData({
  schema,
  authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    },
  },
});

// STEP 3: Connect this data client in your frontend to make CRUD operations
// Example in React:
// const client = generateClient<Schema>() // use this Data client for CRUDL requests
