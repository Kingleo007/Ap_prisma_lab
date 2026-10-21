const express = require("express");
const router = express.Router();
const prisma = require("../db");

// POST /posts
router.post("/", async (req, res) => {
  try {
    const { imageUrl, caption, location } = req.body;
    const post = await prisma.post.create({data: {imageUrl: imageUrl, caption: caption, location: location}});
    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --------------------------------------------------
// Advanced Prisma Queries
// --------------------------------------------------

// Search posts by caption or location
// Example:
// GET /posts/search?caption=travel
// GET /posts/search?location=delhi
// Search posts by caption or location
router.get("/search", async (req, res) => {
  // TODO:
  // Implement contains
  // mode: insensitive
  try {
    const { caption, location } = req.query;
    const posts = await prisma.post.findMany({
      where: {
        OR: [{caption: {contains: caption || "", mode: "insensitive",},},
          {location: {contains: location || "", mode: "insensitive",},},]
        },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Filter posts by ID range
// Example:
// GET /posts/filter/range?min=5&max=20
router.get("/filter/range", async (req, res) => {
  // TODO:
  // Implement gte and lte
  try {
    const { min, max } = req.query;
    const posts = await prisma.post.findMany({
      where: {id: {gte: Number(min),lte: Number(max)}}
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// GET /posts/filter/date
router.get("/filter/date", async (req, res) => {
  // TODO:
  // Implement gt with Date
  try {
    const { after } = req.query;
    const posts = await prisma.post.findMany({
      where: {createdAt: {gt: new Date(after)}}
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sort posts
// Example:
// GET /posts/sort?field=id&order=desc
router.get("/sort", async (req, res) => {
  // TODO:
  // Implement orderBy
  try {
    const { field, order } = req.query;
    const posts = await prisma.post.findMany({
      orderBy: {[field]: order}
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pagination
// Example:
// GET /posts/pagination?page=2&limit=5
router.get("/pagination", async (req, res) => {
  // TODO:
  // Implement skip and take
  try {
    const { page, limit } = req.query;
    const posts = await prisma.post.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /posts/:id
router.get("/:id", async (req, res) => {
  // TODO: Fetch single post
  try {
    const id = Number(req.params.id);
    const post = await prisma.post.findUnique({
      where: {id: id}
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PATCH /posts/:id
router.patch("/:id", async (req, res) => {
  // TODO: Update post
  try {
    const id = Number(req.params.id);
    const { imageUrl, caption, location } = req.body;
    const post = await prisma.post.update({
      where: {id: id},
      data: {imageUrl: imageUrl,caption: caption,location: location}
    });
    res.status(200).json(post);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: error.message });
  }
});


// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
  // TODO: Delete post
  try {
    const id = Number(req.params.id);
    const post = await prisma.post.delete({
      where: {id: id}
    });
    res.status(200).json({message: "Post deleted successfully",post: post});
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;