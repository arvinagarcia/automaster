// document.addEventListener("DOMContentLoaded", function () {
//   const searchInput = document.getElementById("search");
//   const productList = document.querySelector(".product-list");
//   const products = document.querySelectorAll(".product");

//   searchInput.addEventListener("input", function () {
//     const searchTerm = searchInput.value.toLowerCase();
//     let hasResults = false; // Track if any products are visible

//     products.forEach(product => {
//       const productName = product.querySelector(".product-name").textContent.toLowerCase();
      
//       if (productName.includes(searchTerm)) {
//         product.style.display = "block";
//         product.style.position = "relative"; // Keep it in the flow
//         hasResults = true;
//       } else {
//         product.style.display = "none";
//         product.style.position = "absolute"; // Remove from grid
//       }
//     });

//     // If no results, show a message
//     if (!hasResults) {
//       productList.innerHTML = `<p style="font-size: 14px">No products found.</p>`;
//     } else {
//       productList.innerHTML = ""; // Reset list
//       products.forEach(product => {
//         if (product.style.display !== "none") {
//           productList.appendChild(product); // Re-add only visible products
//         }
//       });
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const productList = document.querySelector(".product-list");
  const productLinks = Array.from(document.querySelectorAll(".product-list a")); // Store all <a> tags

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    let hasResults = false; // Track if any products are visible

    // Clear product list before appending filtered products
    productList.innerHTML = "";

    productLinks.forEach(link => {
      const product = link.querySelector(".product");
      const productName = product.querySelector(".product-name").textContent.toLowerCase();

      if (productName.includes(searchTerm)) {
        link.style.display = "block"; // Show matching product
        hasResults = true;
        productList.appendChild(link); // Append the entire <a> element
      } else {
        link.style.display = "none"; // Hide non-matching product
      }
    });

    // Show "No products found" message if there are no results
    if (!hasResults) {
      const noResultsMsg = document.createElement("p");
      noResultsMsg.textContent = "No products found.";
      noResultsMsg.style.fontSize = "14px";
      productList.appendChild(noResultsMsg);
    }
  });
});
