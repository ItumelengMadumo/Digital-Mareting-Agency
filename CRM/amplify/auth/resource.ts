import { defineAuth } from "@aws-amplify/backend"
import { postConfirmation } from "./post-confirmation/resource"

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Your SocialSync verification code",
      verificationEmailBody: (createCode) => `Welcome to SocialSync! Your verification code is ${createCode()}.`,
    },
  },
  userAttributes: {
    givenName: { required: true, mutable: true },
    familyName: { required: true, mutable: true },
  },
  triggers: { postConfirmation },
})
