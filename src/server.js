import express from "express";
import { config } from "./config/config.js";
import { favouritesTable } from "./db/schema.js";
import { db } from "./index.js";
import { desc, eq } from "drizzle-orm";
import { cronJob } from "./config/cron.js";
const PORT = config.port;

if(config.nodeEnv === "production") cronJob.start();

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.post("/api/favourites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title || !image || !cookTime || !servings) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const favourite = await db
      .insert(favouritesTable)
      .values({ userId, recipeId, title, image, cookTime, servings })
      .returning();
    res
      .status(201)
      .json({
        success: true,
        message: "Favourite added successfully",
        data: favourite[0],
      });
  } catch (error) {
    console.log("Error adding favourite: ", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add favourite" });
  }
});

app.delete("/api/favourites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const favourite = await db
      .delete(favouritesTable)
      .where(
        eq(favouritesTable.userId, userId),
        eq(favouritesTable.recipeId, parseInt(recipeId))
      );
    res
      .status(200)
      .json({ success: true, message: "Favourite deleted successfully" });
  } catch (error) {
    console.log("Error deleting favourite: ", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete favourite" });
  }
});

app.get("/api/favourites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const favourites = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userId))
      .orderBy(desc(favouritesTable.createdAt));
    res
      .status(200)
      .json({
        success: true,
        message: "Favourites fetched successfully",
        data: favourites,
      });
  } catch (error) {
    console.log("Error getting favourites: ", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get favourites" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
