import { jsPDF } from "jspdf";
import { formatINR } from "./cart";
import type { Order } from "./types";

export function downloadInvoice(order: Order) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.text("ALIGNO", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.setFont("helvetica", "normal");
  doc.text("Aligno Wellness Pvt. Ltd.", 14, 27);
  doc.text("hello@aligno.in  |  +91 98000 11122", 14, 32);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice #${order.id}`, 150, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 196, 27, { align: "right" });
  doc.text(`Status: ${order.status}`, 196, 32, { align: "right" });

  doc.setDrawColor(212, 175, 55);
  doc.line(14, 38, 196, 38);

  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 46);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer.fullName, 14, 52);
  doc.text(order.customer.email, 14, 57);
  doc.text(order.customer.phone, 14, 62);
  const addr = `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;
  doc.text(doc.splitTextToSize(addr, 90), 14, 67);

  doc.setFont("helvetica", "bold");
  doc.text("Payment:", 130, 46);
  doc.setFont("helvetica", "normal");
  doc.text(order.paymentMethod, 130, 52);

  let y = 92;
  doc.setFillColor(35, 40, 45);
  doc.rect(14, y - 6, 182, 8, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.text("Item", 16, y);
  doc.text("Qty", 130, y, { align: "right" });
  doc.text("Price", 160, y, { align: "right" });
  doc.text("Total", 194, y, { align: "right" });
  doc.setTextColor(20);
  doc.setFont("helvetica", "normal");

  y += 8;
  order.items.forEach((it) => {
    const name = it.name + (it.size ? ` (${it.size})` : "");
    doc.text(doc.splitTextToSize(name, 110), 16, y);
    doc.text(String(it.qty), 130, y, { align: "right" });
    doc.text(formatINR(it.price), 160, y, { align: "right" });
    doc.text(formatINR(it.price * it.qty), 194, y, { align: "right" });
    y += 8;
  });

  y += 4;
  doc.line(120, y, 196, y);
  y += 6;
  const row = (label: string, val: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, 130, y);
    doc.text(val, 194, y, { align: "right" });
    y += 6;
  };
  row("Subtotal", formatINR(order.subtotal));
  row("Discount", `- ${formatINR(order.discount)}`);
  row("Shipping", formatINR(order.shipping));
  row("GST (5%)", formatINR(order.gst));
  doc.setDrawColor(212, 175, 55);
  doc.line(120, y, 196, y);
  y += 6;
  row("Total", formatINR(order.total), true);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Thank you for choosing Aligno. Move better. Live aligned.", 105, 285, { align: "center" });
  doc.save(`aligno-invoice-${order.id}.pdf`);
}