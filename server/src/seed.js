
require("dotenv").config();

const dns = require("node:dns");

// Fix MongoDB Atlas DNS resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const { Content } = require("./models");

// ======================================
// PROJECTS
// ======================================

const P = [
  [
    "Smart City Reporting System",
    "YOLOv8, Python, OpenCV, ASP.NET Core, C#, SQL Server",
    "Computer vision system that identifies and manages city issues.",
  ],
  [
    "Construction Management System",
    "MERN, React, Node.js, MongoDB",
    "Platform for construction operations, reporting and management.",
  ],
  [
    "Nexora AI Commerce",
    "Next.js, Sanity, Clerk, AI, n8n",
    "E-commerce with AI analytics and customer support.",
  ],
  [
    "SmartProcure AI",
    "Python, FastAPI, SQLAlchemy, React",
    "Invoice processing, analytics and document management.",
  ],
  [
    "Nova Mart",
    "Next.js, Node.js, AI, n8n",
    "E-commerce with an AI shopping assistant.",
  ],
  [
    "Sitar Traders",
    "WordPress, WooCommerce, Elementor",
    "Online store with ordering and WhatsApp communication.",
  ],
];

// ======================================
// CERTIFICATES
// ======================================

const C = [
  ["Machine Learning with Python", "IBM", "1XWSC22MFQ7W"],
  ["Introduction to Cloud Computing", "IBM", "BFBK7WCJICA9"],
  ["Intro to AI Engineering", "Scrimba", "HTHU8OS9SL1E"],
  ["Build RAG Applications: Get Started", "IBM", "2T2OHU1ST5T1"],
  ["Develop Generative AI Applications", "IBM", "4OBKIF3MEAG3"],
  ["Python for Data Science and AI", "IBM", "RM8NVDZGC13B"],
  ["Introduction to Software Engineering", "IBM", "XDKNUCTNJJFU"],
  ["Node.js and Express.js Foundations", "LearnKartS", "0OYB0YFFV6E4"],
  ["Neural Networks and Deep Learning", "DeepLearning.AI", "VGSFR8MN7BHT"],
  ["Databases and SQL for Data Science", "IBM", "PZHVD8J5GLNQ"],
  ["Practical Prompt Engineering with AI", "Chegg Skills", "3GR1SAY98OZ9"],
  ["Modeling Software Systems using UML", "HKUST", "BX75JLV7IYZ1"],
  ["Agile Project Management", "Google", "87L789E5M526"],
  ["Create Branching Strategies", "Coursera", "2MLJPYG2LQUK"],
  ["Foundations of Project Management", "Google", "WMJ6SKC8H96Z"],
  ["Introduction to AI", "Coursera", "3PQWD4IW1Y4Y"],
  ["Google Ads for Beginners", "Coursera", "QPQ83L92TCUS"],
  ["CCNA: Networking Basics", "Logical Operations", "3VFTPPDJVJG7"],
  ["Probability and Statistics for ML", "DeepLearning.AI", "46KWX0E36SJ4"],
  ["AI and ML Algorithms and Techniques", "Microsoft", "2979AEH6IL5X"],
  ["Crash Course on Python", "Google", "ZTPCOFNY08SA"],
];

// ======================================
// SKILLS
// ======================================

const S = {
  Frontend:
    "React, Next.js, TypeScript, JavaScript, Tailwind CSS",

  Backend:
    "Node.js, Express.js, Python, FastAPI, REST APIs",

  Databases:
    "MongoDB, SQL Server, PostgreSQL",

  "AI and ML":
    "Machine Learning, Generative AI, LLMs, RAG, AI Agents",

  Tools:
    "Git, GitHub, Postman, n8n, WordPress, Vercel, Firebase",
};

// ======================================
// ARTICLES
// ======================================

const A = [
  [
    "blog",
    "How to Hire a Full Stack AI Engineer in Pakistan",
    "A practical guide for startups hiring a full stack AI engineer or MERN stack developer in Pakistan.",
    `## Why Pakistan

Pakistan has a fast-growing pool of full stack developers who work with React, Next.js, Node.js and AI tools at competitive rates.

## What to look for

Check for shipped projects, clear communication and experience with REST APIs, databases and deployment. For AI work, ask about RAG, LLM integration and automation.

## How I can help

I build web apps, AI chatbots and SaaS products for clients worldwide. Contact me to discuss your project.`,
    "hire full stack developer Pakistan, MERN stack developer Islamabad",
  ],
  [
    "article",
    "Building a RAG Chatbot with Next.js, Node.js and MongoDB",
    "Step-by-step overview of building a retrieval-augmented generation chatbot for your business.",
    `## What is RAG

Retrieval-augmented generation lets a language model answer using your own documents instead of guessing.

## Architecture

Split documents into chunks, create embeddings, store them in a vector index, retrieve the closest chunks for each question and pass them to the model with the question.

## Stack

Next.js for the interface, Node.js and Express for the API, MongoDB for data and an LLM API for answers.`,
    "RAG chatbot development, AI chatbot Next.js",
  ],
];

// ======================================
// HELPERS
// ======================================

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ======================================
// SEED DATABASE
// ======================================

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully!");

    const existingCount = await Content.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Database already contains ${existingCount} content records.`
      );

      console.log("Skipping seed to prevent duplicate records.");

      return;
    }

    const projects = P.map((p) => ({
      type: "project",
      title: p[0],
      slug: slugify(p[0]),
      excerpt: p[2],
      tags: p[1].split(", "),
      published: true,
    }));

    const certificates = C.map((c) => ({
      type: "certificate",
      title: c[0],
      slug: slugify(c[0]),
      meta: c[1],
      verify:
        "https://www.coursera.org/account/accomplishments/verify/" +
        c[2],
      published: true,
    }));

    const skills = Object.entries(S).map(([title, value]) => ({
      type: "skill",
      title,
      slug: slugify(title),
      tags: value.split(", "),
      published: true,
    }));

    const articles = A.map((a) => ({
      type: a[0],
      title: a[1],
      slug: slugify(a[1]),
      excerpt: a[2],
      body: a[3],
      tags: a[4].split(", "),
      published: true,
    }));

    const allContent = [
      ...projects,
      ...certificates,
      ...skills,
      ...articles,
    ];

    await Content.insertMany(allContent);

    console.log(
      `Successfully seeded ${allContent.length} records!`
    );

    console.log("Projects:", projects.length);
    console.log("Certificates:", certificates.length);
    console.log("Skills:", skills.length);
    console.log("Articles:", articles.length);
  } catch (error) {
    console.error("Database Seeding Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
