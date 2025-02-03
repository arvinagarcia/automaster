document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const productList = document.querySelector(".product-list");
  const productLinks = Array.from(document.querySelectorAll(".product-list a"));

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    let hasResults = false;

    productList.innerHTML = "";

    productLinks.forEach(link => {
      const product = link.querySelector(".product");
      const productName = product.querySelector(".product-name").textContent.toLowerCase();

      if (productName.includes(searchTerm)) {
        link.style.display = "block";
        hasResults = true;
        productList.appendChild(link);
      } else {
        link.style.display = "none";
      }
    });

    if (!hasResults) {
      const noResultsMsg = document.createElement("p");
      noResultsMsg.textContent = "No products found.";
      noResultsMsg.style.fontSize = "14px";
      productList.appendChild(noResultsMsg);
    }
  });
});
