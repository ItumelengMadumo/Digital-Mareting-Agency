import { defineStorage } from "@aws-amplify/backend"

// Post media (photos and videos). Each signed-in user reads and writes their own folder.
export const storage = defineStorage({
  name: "socialsyncMedia",
  access: (allow) => ({
    "media/{entity_id}/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
})
