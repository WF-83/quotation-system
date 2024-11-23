const { jsPDF } = window.jspdf;

// Attach dynamic calculations for "Price After Markup"
function attachDynamicCalculation(row) {
    const priceInput = row.querySelector('.price-input');
    const markupInput = row.querySelector('.markup-input');
    const quantityInput = row.querySelector('.quantity');
    const priceAfterMarkup = row.querySelector('.price-after-markup');

    const calculatePrice = () => {
        const price = parseFloat(priceInput.value) || 0;
        const markup = parseFloat(markupInput.value) / 100 || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        priceAfterMarkup.value = ((price + price * markup) * quantity).toFixed(2);
    };

    priceInput.addEventListener('input', calculatePrice);
    markupInput.addEventListener('input', calculatePrice);
    quantityInput.addEventListener('input', calculatePrice);
}

// Attach dynamic calculations for the initial row
const initialRow = document.querySelector('#parts-table tbody tr');
if (initialRow) {
    attachDynamicCalculation(initialRow);
}

// Add dynamic rows with event bindings
document.getElementById('add-row').addEventListener('click', () => {
    const table = document.querySelector('#parts-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="part-details" placeholder="Enter part details"></td>
        <td><input type="number" class="price-input" placeholder="0.00"></td>
        <td><input type="number" class="quantity" value="1"></td>
        <td><input type="number" class="markup-input" placeholder="0"></td>
        <td><input type="text" class="price-after-markup" readonly></td>
    `;
    table.appendChild(newRow);
    attachDynamicCalculation(newRow);
});

// Preview quotation details
document.getElementById('preview-quotation').addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value;
    const carModel = document.getElementById('carModel').value;
    const carRegistration = document.getElementById('carRegistration').value;
    const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    const rows = document.querySelectorAll('#parts-table tbody tr');
    const parts = Array.from(rows).map(row => ({
        partDetails: row.querySelector('.part-details').value,
        price: parseFloat(row.querySelector('.price-input').value) || 0,
        quantity: parseInt(row.querySelector('.quantity').value) || 1,
        markup: parseFloat(row.querySelector('.markup-input').value) || 0,
        priceAfterMarkup: parseFloat(row.querySelector('.price-after-markup').value) || 0,
    }));

    const partsTotal = parts.reduce((total, part) => total + part.priceAfterMarkup, 0);
    const discountAmount = (discount / 100) * partsTotal;
    const grandTotal = partsTotal + laborCost - discountAmount;

    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = `
        <h3>Quotation Preview</h3>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Car Model:</strong> ${carModel}</p>
        <p><strong>Car Registration:</strong> ${carRegistration}</p>
        <table>
            <thead>
                <tr>
                    <th>Part Details</th>
                    <th>Supplier Price (RM)</th>
                    <th>Quantity</th>
                    <th>Markup (%)</th>
                    <th>Price After Markup (RM)</th>
                </tr>
            </thead>
            <tbody>
                ${parts.map(part => `
                    <tr>
                        <td>${part.partDetails}</td>
                        <td>${part.price.toFixed(2)}</td>
                        <td>${part.quantity}</td>
                        <td>${part.markup}</td>
                        <td>${part.priceAfterMarkup.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p><strong>Parts Total:</strong> RM ${partsTotal.toFixed(2)}</p>
        <p><strong>Labor Cost:</strong> RM ${laborCost.toFixed(2)}</p>
        <p><strong>Discount:</strong> ${discount}% (RM ${discountAmount.toFixed(2)})</p>
        <p><strong>Grand Total:</strong> RM ${grandTotal.toFixed(2)}</p>
    `;
});

// Generate PDF
document.getElementById('generate-pdf').addEventListener('click', () => {
    const doc = new jsPDF();

    // Fetch input values
    const customerName = document.getElementById('customerName').value;
    const carModel = document.getElementById('carModel').value;
    const carRegistration = document.getElementById('carRegistration').value;
    const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    const rows = document.querySelectorAll('#parts-table tbody tr');
    const parts = Array.from(rows).map(row => ({
        partDetails: row.querySelector('.part-details').value,
        price: parseFloat(row.querySelector('.price-input').value) || 0,
        quantity: parseInt(row.querySelector('.quantity').value) || 1,
        markup: parseFloat(row.querySelector('.markup-input').value) || 0,
        priceAfterMarkup: parseFloat(row.querySelector('.price-after-markup').value) || 0,
    }));

    // Calculate totals
    const partsTotal = parts.reduce((total, part) => total + part.priceAfterMarkup, 0);
    const discountAmount = (discount / 100) * partsTotal;
    const grandTotal = partsTotal + laborCost - discountAmount;

    // PDF Content
    doc.setFontSize(16);
    doc.text("Quotation", 10, 10);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName}`, 10, 20);
    doc.text(`Car Model: ${carModel}`, 10, 30);
    doc.text(`Car Registration: ${carRegistration}`, 10, 40);

    // Parts table
    let yPosition = 50;
    doc.text("Parts Details:", 10, yPosition);
    yPosition += 10;

    parts.forEach(part => {
        doc.text(
            `Part: ${part.partDetails}, Supplier Price: RM ${part.price.toFixed(2)}, Quantity: ${part.quantity}, Markup: ${part.markup}%, Price After Markup: RM ${part.priceAfterMarkup.toFixed(2)}`,
            10,
            yPosition
        );
        yPosition += 10;
    });

    // Summary
    yPosition += 10;
    doc.text(`Parts Total: RM ${partsTotal.toFixed(2)}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Labor Cost: RM ${laborCost.toFixed(2)}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Discount: ${discount}% (RM ${discountAmount.toFixed(2)})`, 10, yPosition);
    yPosition += 10;
    doc.text(`Grand Total: RM ${grandTotal.toFixed(2)}`, 10, yPosition);

    // Save the PDF
    doc.save('quotation.pdf');
});
