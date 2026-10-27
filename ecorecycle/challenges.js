document.addEventListener("DOMContentLoaded", () => {
  const itemsData = [
    { id: 1, name: "Eco Bag Standard", category: "Bag", price: 1500, available: true },
    { id: 2, name: "Glass Recycler Box", category: "Box", price: 3500, available: true },
    { id: 3, name: "Sorting Bins Trio", category: "Bins", price: 8900, available: true },
    { id: 4, name: "Compost Bin Pro", category: "Compost", price: 6200, available: false },
    { id: 5, name: "Bamboo Utensil Kit", category: "Kit", price: 2000, available: true },
    { id: 6, name: "Recycled Paper Pack", category: "Paper", price: 1200, available: true },
    { id: 7, name: "Battery Storage Jar", category: "Jar", price: 900, available: true },
    { id: 8, name: "Eco Cleaner Liquid", category: "Liquid", price: 2500, available: true },
    { id: 9, name: "Organic Waste Box", category: "Box", price: 4100, available: false },
    { id: 10, name: "Reusable Straw Set", category: "Kit", price: 1100, available: true }
  ];

  const container = document.getElementById("configurator-list");
  const totalEl = document.getElementById("total-budget");
  const searchInput = document.getElementById("search-item");

  function render(filterText = "") {
    if (!container) return;
    container.innerHTML = "";

    let filtered = itemsData.filter(item => 
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      container.innerHTML = `<p class="text-danger p-3">No items found matching your search.</p>`;
      if (totalEl) totalEl.textContent = "0";
      return;
    }

    let calculatedTotal = 0;

    for (let item of filtered) {
      calculatedTotal += item.price;
      const card = document.createElement("div");
      card.className = "col-md-4 mb-3";
      card.innerHTML = `
        <div class="box p-3">
          <h5>${item.name}</h5>
          <p class="mb-1 text-muted">Category: ${item.category}</p>
          <p class="fw-bold text-success">${item.price} KZT</p>
          <span class="badge ${item.available ? 'bg-success' : 'bg-secondary'}">
            ${item.available ? 'Available' : 'Restricted/Blocked'}
          </span>
        </div>
      `;
      container.appendChild(card);
    }

    if (totalEl) {
      totalEl.textContent = calculatedTotal;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      render(e.target.value);
    });
  }

  render();
});