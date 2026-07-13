import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({
  id: "QuickTicket",
});

// User Created
const SyncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    await User.create({
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      image: image_url,
    });

    console.log("✅ User Created");
  }
);

// User Deleted
const SyncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);

    console.log("🗑 User Deleted");
  }
);

// User Updated
const SyncUserUpdation = inngest.createFunction(
  { id: "sync-user-updation" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    await User.findByIdAndUpdate(id, {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      image: image_url,
    });

    console.log("✏ User Updated");
  }
);

export const functions = [
  SyncUserCreation,
  SyncUserDeletion,
  SyncUserUpdation,
];