import type { PostConfirmationTriggerHandler } from "aws-lambda"
import { provisionUser } from "../../../lib/db/provision-user"

// Runs once when a user confirms their email: creates their SocialSync user, workspace and
// owner membership. Password resets also fire this trigger, so only handle sign-up.
export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") return event

  const attrs = event.request.userAttributes
  await provisionUser({
    email: attrs.email,
    cognitoSub: attrs.sub,
    firstName: attrs.given_name,
    lastName: attrs.family_name,
  })
  return event
}
