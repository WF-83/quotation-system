function updateSummary() {
    // Parts calculations
    const partsRows = document.querySelectorAll('#parts-table tbody tr');
    let totalPartsCost = 0;
    let totalPriceAfterMarkup = 0;

    partsRows.forEach(row => {
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        const markup = parseFloat(row.querySelector('.markup-input').value) / 100 || 0;
        const quantity = parseInt(row.querySelector('.quantity').value) || 1;

        // Calculate Price After Markup
        const priceAfterMarkup = (price + price * markup) * quantity;
        row.querySelector('.price-after-markup').value = priceAfterMarkup.toFixed(2);

        totalPartsCost += price * quantity;
        totalPriceAfterMarkup += priceAfterMarkup;
    });

    const totalMarkupPrice = totalPriceAfterMarkup - totalPartsCost;
    const markupMargin = (totalMarkupPrice / totalPartsCost) * 100 || 0;

    // Update Parts Summary
    document.getElementById('total-parts-cost').textContent = totalPartsCost.toFixed(2);
    document.getElementById('total-markup-price').textContent = `${totalMarkupPrice.toFixed(2)} (${markupMargin.toFixed(2)}% Margin)`;
    document.getElementById('total-price-after-markup').textContent = totalPriceAfterMarkup.toFixed(2);

    // Labor and Discount calculations
    const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const laborDiscount = laborCost * (discountPercent / 100);
    const laborIncome = laborCost - laborDiscount;

    // Code Optimization Services calculations
    const optimizationRows = document.querySelectorAll('#optimization-services-table tbody tr');
    let totalOptimizationCost = 0;

    optimizationRows.forEach(row => {
        const price = parseFloat(row.querySelector('.optimization-price-input').value) || 0;
        totalOptimizationCost += price;
    });

    const cosDiscount = totalOptimizationCost * (discountPercent / 100);
    const cosIncome = totalOptimizationCost - cosDiscount;

    // Discounts for parts
    const partsDiscount = totalPriceAfterMarkup * (discountPercent / 100);
    const profitOnParts = totalMarkupPrice - partsDiscount;

    // Grand Total
    const grandTotal = totalPriceAfterMarkup + laborIncome + cosIncome - partsDiscount;

    // Update Impact Insights
    document.getElementById('total-margin-price').textContent = totalMarkupPrice.toFixed(2);
    document.getElementById('parts-discount').textContent = partsDiscount.toFixed(2);
    document.getElementById('profit-parts').textContent = profitOnParts.toFixed(2);
    document.getElementById('labor-charge').textContent = laborCost.toFixed(2);
    document.getElementById('labor-discount').textContent = laborDiscount.toFixed(2);
    document.getElementById('labor-income').textContent = laborIncome.toFixed(2);
    document.getElementById('cos-charge').textContent = totalOptimizationCost.toFixed(2);
    document.getElementById('cos-discount').textContent = cosDiscount.toFixed(2);
    document.getElementById('cos-income').textContent = cosIncome.toFixed(2);

    // Update Summary
    document.getElementById('summary-parts-cost').textContent = totalPartsCost.toFixed(2);
    document.getElementById('summary-profit-parts').textContent = profitOnParts.toFixed(2);
    document.getElementById('summary-labor-income').textContent = laborIncome.toFixed(2);
    document.getElementById('summary-optimization-income').textContent = cosIncome.toFixed(2);
    document.getElementById('summary-grand-total').textContent = grandTotal.toFixed(2);

    // Toggle Impact Insights visibility
    const impactSection = document.getElementById('impact-insights');
    impactSection.style.display = discountPercent > 0 ? 'block' : 'none';
}

// Add row for Parts
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

    // Attach event listeners for the new row
    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateSummary);
    });
});

// Add row for Code Optimization Services
document.getElementById('add-optimization-row').addEventListener('click', () => {
    const table = document.querySelector('#optimization-services-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="optimization-part-details" placeholder="Enter service details"></td>
        <td><input type="number" class="optimization-price-input" placeholder="0.00"></td>
    `;
    table.appendChild(newRow);

    // Attach event listeners for the new row
    newRow.querySelector('.optimization-price-input').addEventListener('input', updateSummary);
});

// Attach event listeners to existing inputs
document.querySelectorAll('#parts-table tbody tr').forEach(row => {
    row.querySelectorAll('input').forEach(input => input.addEventListener('input', updateSummary));
});
document.getElementById('laborCost').addEventListener('input', updateSummary);
document.getElementById('discountPercent').addEventListener('input', updateSummary);

// Initial calculation
updateSummary();
