import React, { useState } from "react";
import jsPDF from "jspdf"; // install with: npm install jspdf
import "jspdf-autotable"; // install with: npm install jspdf-autotable
import autoTable from "jspdf-autotable";
import {
    Drawer,
    Box,
} from "@mui/material";
import DBSideMenu from "../components/DashboardSideMenu";
const drawerWidth = 240;

function InvoiceForm() {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([{ name: "", price: 0, qty: 1 }]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: 0, qty: 1 }]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ customer, items, total })
    });

    const data = await res.json();
    if (data.invoice) {
      alert("Invoice saved!");
      setSelectedInvoice(data.invoice); // open modal with saved invoice
    } else {
      alert("Error saving invoice");
    }
  };

  // PDF generator
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
          <form onSubmit={handleSubmit}>
            <h2>Create Invoice</h2>
            <input
              type="text"
              placeholder="Customer Name"
              onChange={(e) => setCustomer(e.target.value)}
            />
            {items.map((item, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Item Name"
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  onChange={(e) =>
                    handleItemChange(index, "price", parseFloat(e.target.value))
                  }
                />
                <input
                  type="number"
                  placeholder="Qty"
                  onChange={(e) =>
                    handleItemChange(index, "qty", parseInt(e.target.value))
                  }
                />
              </div>
            ))}
            <button type="button" onClick={addItem}>+ Add Item</button>
            <h3>Total: ₹{total}</h3>
            <button type="submit">Generate Invoice</button>
          </form>

          {/* Modal for generated invoice */}
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
              <h3>Invoice Preview</h3>
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

              <button onClick={() => downloadPDF(selectedInvoice)}>Download as PDF</button>
              <button onClick={() => window.print()}>Print</button>
              <button onClick={() => setSelectedInvoice(null)}>Close</button>
            </div>
          )}
        </div>
      </Box>
    </Box>

  );
}

export default InvoiceForm;
