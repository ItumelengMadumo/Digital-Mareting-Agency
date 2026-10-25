import { defineFunction } from "@aws-amplify/backend"

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  // Lives in the auth stack because Cognito invokes it as a trigger.
  resourceGroupName: "auth",
  timeoutSeconds: 15,
})
