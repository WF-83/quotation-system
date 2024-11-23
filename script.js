const { jsPDF } = window.jspdf;

// Add a new row to the parts table
document.getElementById('add-row').addEventListener('click', () => {
    const table = document.getElementById('parts-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="text" name="part-details[]" required></td>
        <td><input type="number" name="part-price[]" required></td>
        <td><input type="number" name="markup[]" required></td>
    `;
});

// Handle form submission and generate PDF
document.getElementById('quotation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.target);
    const customerName = formData.get('customer-name');
    const carModel = formData.get('car-model');
    const carRegistration = formData.get('car-registration');
    const laborCost = parseFloat(formData.get('labor-cost')) || 0;

    // Collect parts data
    const parts = formData.getAll('part-details[]').map((_, i) => {
        const price = parseFloat(formData.getAll('part-price[]')[i]);
        const markup = parseFloat(formData.getAll('markup[]')[i]) / 100;
        const total = price + (price * markup);
        return { details: formData.getAll('part-details[]')[i], price, markup, total };
    });

    const totalParts = parts.reduce((sum, part) => sum + part.total, 0);
    const totalQuotation = totalParts + laborCost;

    // Generate PDF using jsPDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Car Workshop Quotation', 10, 10);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName}`, 10, 20);
    doc.text(`Car Model: ${carModel}`, 10, 30);
    doc.text(`Car Registration: ${carRegistration}`, 10, 40);

    doc.text('Parts Details:', 10, 50);
    let yPosition = 60;
    parts.forEach((part, index) => {
        doc.text(
            `${index + 1}. ${part.details} - Price: RM${part.price.toFixed(2)}, Markup: ${(
                part.markup * 100
            ).toFixed(0)}%, Total: RM${part.total.toFixed(2)}`,
            10,
            yPosition
        );
        yPosition += 10;
    });

    doc.text(`Labor Cost: RM${laborCost.toFixed(2)}`, 10, yPosition + 10);
    doc.text(`Total Quotation: RM${totalQuotation.toFixed(2)}`, 10, yPosition + 20);

    // Save the PDF
    doc.save(`quotation_${customerName.replace(/\s+/g, '_')}.pdf`);
});
