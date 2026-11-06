
require("dotenv").config();

const dns = require("node:dns");

// Fix MongoDB Atlas DNS resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rate = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { Content, Review, Message } = require("./models");

const E = process.env;
const SECRET = E.JWT_SECRET || "change-me";

const app = express();

// Middleware
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: (E.CLIENT_URL || "http://localhost:3000")
      .split(",")
      .map((url) => url.trim()),
  })
);

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").slice(7);
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Async error handler
const w = (fn) => (req, res) =>
  fn(req, res).catch((error) => {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  });

// Helpers
const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const lim = (max) =>
  rate({
    windowMs: 15 * 60 * 1000,
    max,
  });

// ======================================
// AUTHENTICATION
// ======================================

app.post("/api/auth/login", lim(10), (req, res) => {
  const { username, password } = req.body || {};

  if (
    username === (E.ADMIN_USER || "sayyam") &&
    password === (E.ADMIN_PASS || "Sayyam@2026!")
  ) {
    return res.json({
      token: jwt.sign({ u: username }, SECRET, {
        expiresIn: "7d",
      }),
    });
  }

  res.status(401).json({
    error: "Wrong username or password",
  });
});

// ======================================
// CONTENT
// ======================================

// Get published content
app.get(
  "/api/content",
  w(async (req, res) => {
    const filter = {
      published: true,
      ...(req.query.type && { type: req.query.type }),
    };

    const data = await Content.find(filter).sort({
      createdAt: -1,
    });

    res.json(data);
  })
);

// Get all content (admin)
app.get(
  "/api/content/all",
  auth,
  w(async (req, res) => {
    const filter = req.query.type
      ? { type: req.query.type }
      : {};

    const data = await Content.find(filter).sort({
      createdAt: -1,
    });

    res.json(data);
  })
);

// Get single content
app.get(
  "/api/content/:type/:slug",
  w(async (req, res) => {
    const data = await Content.findOne({
      type: req.params.type,
      slug: req.params.slug,
      published: true,
    });

    if (!data) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    res.json(data);
  })
);

// Create content
app.post(
  "/api/content",
  auth,
  w(async (req, res) => {
    const body = req.body;

    let slug = slugify(body.title);
    let count = 1;

    while (
      await Content.exists({
        type: body.type,
        slug,
      })
    ) {
      slug = `${slugify(body.title)}-${++count}`;
    }

    const data = await Content.create({
      ...body,
      slug,
    });

    res.json(data);
  })
);

// Update content
app.put(
  "/api/content/:id",
  auth,
  w(async (req, res) => {
    const { slug, _id, ...body } = req.body;

    const data = await Content.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({
        error: "Content not found",
      });
    }

    res.json(data);
  })
);

// Delete content
app.delete(
  "/api/content/:id",
  auth,
  w(async (req, res) => {
    const data = await Content.findByIdAndDelete(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({
        error: "Content not found",
      });
    }

    res.json({ ok: true });
  })
);

// ======================================
// REVIEWS
// ======================================

// Get approved reviews
app.get(
  "/api/reviews",
  w(async (req, res) => {
    const data = await Review.find({
      approved: true,
      postSlug: req.query.postSlug || "",
    }).sort({
      createdAt: -1,
    });

    res.json(data);
  })
);

// Submit review
app.post(
  "/api/reviews",
  lim(5),
  w(async (req, res) => {
    const { name, rating, text, postSlug } = req.body || {};

    if (
      !name ||
      !text ||
      text.length < 5 ||
      !(rating >= 1 && rating <= 5)
    ) {
      return res.status(400).json({
        error: "Invalid",
      });
    }

    await Review.create({
      name: name.slice(0, 60),
      rating,
      text: text.slice(0, 800),
      postSlug: postSlug || "",
    });

    res.json({ ok: true });
  })
);

// Get all reviews (admin)
app.get(
  "/api/reviews/all",
  auth,
  w(async (req, res) => {
    const data = await Review.find().sort({
      createdAt: -1,
    });

    res.json(data);
  })
);

// Approve review
app.put(
  "/api/reviews/:id/approve",
  auth,
  w(async (req, res) => {
    const data = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    res.json(data);
  })
);

// Delete review
app.delete(
  "/api/reviews/:id",
  auth,
  w(async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  })
);

// ======================================
// CONTACT MESSAGES
// ======================================

// Submit contact form
app.post(
  "/api/contact",
  lim(5),
  w(async (req, res) => {
    const { name, email, subject, message } = req.body || {};

    if (
      !name ||
      !/^\S+@\S+\.\S+$/.test(email || "") ||
      !subject ||
      (message || "").length < 10
    ) {
      return res.status(400).json({
        error: "Invalid",
      });
    }

    await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.json({ ok: true });
  })
);

// Get messages (admin)
app.get(
  "/api/contact",
  auth,
  w(async (req, res) => {
    const data = await Message.find().sort({
      createdAt: -1,
    });

    res.json(data);
  })
);

// ======================================
// DATABASE CONNECTION
// ======================================

const PORT = E.PORT || 5000;

async function startServer() {
  try {
    if (!E.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(E.MONGODB_URI);

    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
