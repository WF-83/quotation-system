const { jsPDF } = window.jspdf;

// Attach dynamic calculations for "Price After Markup"
function attachDynamicCalculation(row) {
    const priceInput = row.querySelector('.price-input');
    const markupInput = row.querySelector('.markup-input');
    const priceAfterMarkup = row.querySelector('.price-after-markup');

    const calculatePrice = () => {
        const price = parseFloat(priceInput.value) || 0;
        const markup = parseFloat(markupInput.value) / 100 || 0;
        priceAfterMarkup.value = (price + price * markup).toFixed(2);
    };

    priceInput.addEventListener('input', calculatePrice);
    markupInput.addEventListener('input', calculatePrice);
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
        markup: parseFloat(row.querySelector('.markup-input').value) || 0,
        priceAfterMarkup: row.querySelector('.price-after-markup').value,
    }));

    console.log('Customer Information:', { customerName, carModel, carRegistration });
    console.log('Parts:', parts);
    console.log('Labor Cost:', laborCost, 'Discount:', discount);
    alert('Preview logged in console.');
});

// Generate PDF
document.getElementById('generate-pdf').addEventListener('click', () => {
    const doc = new jsPDF();
    doc.text('Quotation PDF Placeholder', 10, 10);
    doc.save('quotation.pdf');
});
