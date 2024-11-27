const { jsPDF } = window.jspdf;

// Attach dynamic calculations for Parts Details
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

        updateSummary();
    };

    priceInput.addEventListener('input', calculatePrice);
    markupInput.addEventListener('input', calculatePrice);
    quantityInput.addEventListener('input', calculatePrice);
}

// Attach dynamic calculations for the initial Parts row
attachDynamicCalculation(document.querySelector('#parts-table tbody tr'));

// Add new rows for Parts Details
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

// Add new rows for Code Optimization Services
document.getElementById('add-optimization-row').addEventListener('click', () => {
    const table = document.querySelector('#optimization-services-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="optimization-part-details" placeholder="Enter service details"></td>
        <td><input type="number" class="optimization-price-input" placeholder="0.00"></td>
    `;
    table.appendChild(newRow);
});

// Update summary calculations
function updateSummary() {
    const partsRows = document.querySelectorAll('#parts-table tbody tr');
    let totalPartsCost = 0;
    let totalPriceAfterMarkup = 0;

    partsRows.forEach(row => {
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        const markup = parseFloat(row.querySelector('.markup-input').value) / 100 || 0;
        const quantity = parseInt(row.querySelector('.quantity').value) || 1;

        totalPartsCost += price * quantity;
        totalPriceAfterMarkup += (price + price * markup) * quantity;
    });

    const optimizationRows = document.querySelectorAll('#optimization-services-table tbody tr');
    let totalOptimizationCost = 0;

    optimizationRows.forEach(row => {
        const price = parseFloat(row.querySelector('.optimization-price-input').value) || 0;
        totalOptimizationCost += price;
    });

    const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
    const grandTotal = totalPriceAfterMarkup + laborCost + totalOptimizationCost;

    document.getElementById('summary-parts-cost').textContent = totalPartsCost.toFixed(2);
    document.getElementById('summary-profit-parts').textContent = (totalPriceAfterMarkup - totalPartsCost).toFixed(2);
    document.getElementById('summary-optimization-cost').textContent = totalOptimizationCost.toFixed(2);
    document.getElementById('summary-labor-income').textContent = laborCost.toFixed(2);
    document.getElementById('summary-grand-total').textContent = grandTotal.toFixed(2);
}

// Attach update event listeners
document.getElementById('laborCost').addEventListener('input', updateSummary);

// Trigger initial update
updateSummary();
