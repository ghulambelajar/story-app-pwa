import { openDB } from "idb";
import CONFIG from "../config";
const DATABASE_NAME = "my-story-app-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "bookmarked-stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: "id",
    });
  },
});

const StoryDatabase = {
  async putStory(story) {
    if (!story.id) {
      throw new Error("Cerita harus memiliki ID.");
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async getStory(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async deleteStory(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default StoryDatabase;
