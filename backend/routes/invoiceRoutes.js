const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const auth = require("../middleware/auth"); // ✅ use middleware


// Middleware for auth
function auth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}

// POST /api/invoices
router.post("/", auth, async (req, res) => {
  try {
    const invoice = new Invoice({
      userId: req.user.id,
      customer: req.body.customer,
      items: req.body.items,
      total: req.body.total
    });
    await invoice.save();
    res.json({ msg: "Invoice saved", invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/invoices
router.get("/", auth, async (req, res) => {
  try {
    const { filter } = req.query;
    let start, end;

    if (filter === "today") {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
    } else if (filter === "yesterday") {
      start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    }

    const query = { userId: req.user.id };
    if (start && end) query.createdAt = { $gte: start, $lte: end };

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example protected route
router.get("/protected", auth, (req, res) => {
  res.json({ message: "Only logged-in users can see this" });
});

module.exports = router;
