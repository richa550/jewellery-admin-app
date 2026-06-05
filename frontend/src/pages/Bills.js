import React, { useState, useEffect } from "react";
import jsPDF from "jspdf"; // install with: npm install jspdf
import "jspdf-autotable"; // install with: npm install jspdf-autotable
import autoTable from "jspdf-autotable";
import {
  Drawer,
  Box,
} from "@mui/material";
import DBSideMenu from "../components/DashboardSideMenu";
const drawerWidth = 240;

function Bills() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/invoices?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setInvoices(data);
    };
    fetchInvoices();
  }, [filter]);

  // Generate PDF
  // Generate PDF with header, footer, and styling
  const downloadPDF = (invoice) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Jewellery App Invoice", 14, 20);

    // Customer + Date
    doc.setFontSize(12);
    doc.text(`Customer: ${invoice.customer}`, 14, 30);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 36);

    // Items Table
    const tableData = invoice.items.map((item) => [
      item.name,
      `₹${item.price}`,
      item.qty,
      `₹${item.price * item.qty}`
    ]);

    autoTable(doc, {
      head: [["Item", "Price", "Qty", "Subtotal"]],
      body: tableData,
      startY: 50,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Total
    doc.setFontSize(14);
    doc.text(`Total: ₹${invoice.total}`, 14, doc.lastAutoTable.finalY + 15);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, 285);

    doc.save(`invoice_${invoice._id}.pdf`);
  };



  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          flexGrow: 1,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <DBSideMenu />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <div>
          <h2>All Bills</h2>
          <div>
            <button onClick={() => setFilter("today")}>Today</button>
            <button onClick={() => setFilter("yesterday")}>Yesterday</button>
            <button onClick={() => setFilter("all")}>All</button>
          </div>

          {/* Table format */}
          <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Total (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{new Date(inv.createdAt).toLocaleString()}</td>
                  <td>{inv.customer}</td>
                  <td>{inv.total}</td>
                  <td>
                    <button onClick={() => setSelectedInvoice(inv)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for invoice details */}
          {selectedInvoice && (
            <div
              style={{
                position: "fixed",
                top: "20%",
                left: "30%",
                background: "#fff",
                border: "1px solid #ccc",
                padding: "20px",
                zIndex: 1000
              }}
            >
              <h3>Invoice Details</h3>
              <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
              <p><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}</p>
              <table border="1" cellPadding="5" style={{ marginTop: "10px", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Total: ₹{selectedInvoice.total}</h4>

              {/* PDF Download Button */}
              <button onClick={() => downloadPDF(selectedInvoice)}>Download as PDF</button>
              <button onClick={() => setSelectedInvoice(null)}>Close</button>
            </div>
          )}
        </div>
      </Box>
    </Box>

  );
}

export default Bills;
