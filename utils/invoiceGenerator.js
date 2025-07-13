const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (invoice, order, user, filePath) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.moveDown();

  // Invoice Details
  doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`);
  doc.text(`Customer: ${user.username} (${user.email})`);
  doc.moveDown();

  // Order Summary
  doc.text(`Order ID: ${order.id}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Order Status: ${order.status}`);
  doc.text(`Total Amount: $${order.totalAmount.toFixed(2)}`);

  doc.end();
};

module.exports = generateInvoicePDF;
