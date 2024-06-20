let inventoryData; 
document.addEventListener('DOMContentLoaded', function() {
    inventoryData = [
      //jeans
     { item: 'Blue Denim', price: 310, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='bluedenim.jpg' },
        { item: 'Denim Classic', price: 200, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='classicdenim.jpg' },
        { item: 'Ripped Skinny Jeans', price: 250, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='rippedskinny.jpg' },
        { item: 'Ash Black Stretchable', price: 250, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='ashstretchable.jpg' },
       //T-shirt
       { item: 'Jordan White', price: 230, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='jordanwhite.png' },
        { item: 'PH Shirt', price: 280, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='phshirt.jpg' },
        { item: 'Hugo Boss', price: 250, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='hugoboss.jpg' },
        { item: 'Cool Shirt', price: 250, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='cool.jpg' },
       //sando
       { item: 'Black Sando', price: 120, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='black.jpg'},
        { item: 'White Sando', price: 120, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='white.jpg' },
        { item: 'Combi Line', price: 140, quantity: 5, sizes: ['Small', 'Medium', 'Large'],image: src='combiline.jpg'  },
        { item: 'Robe Sando', price: 250, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='robe.jpg' },
       //perfume
       { item: 'Secret Garden', price: 310, quantity: 5, sizes: ['Small', 'Medium', 'Large'],image: src='secret.jpg'  },
        { item: 'Chanel', price: 700, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='chanel.jpg' },
        { item: "Victoria's Secret", price: 950, quantity: 5, sizes: ['Small', 'Medium', 'Large'],image: src='victoria.jpg' },
        { item: 'Versace', price: 650, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='versace.jpg' },
       //toys
       { item: 'Buzz', price: 800, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='buzz.jpg'  },
        { item: 'Mega Car Toy', price: 1200, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='car.jpg'  },
        { item: 'Smarty Dog', price: 1250, quantity: 5, sizes: ['Small', 'Medium', 'Large'], image: src='smarty.jpg'  },
        { item: 'Aquishe Fidgets', price: 250, quantity: 3, sizes: ['Small', 'Medium', 'Large', 'XL'], image: src='fidget.jpg'  },
       
    ];
    const inventoryContainer = document.getElementById('inventoryContainer');
    const tablesCount = 5;
    const itemsPerTable = 4;
    const tableNames = ['Jeans', 'T-Shirt', 'Perfume', 'Sando', 'Toys'];
    
    for (let i = 0; i < tablesCount; i++) {
      const table = document.createElement('table');
      table.innerHTML = `
        <caption>${tableNames[i]}</caption>
        <thead>
          <tr>
            <th>Item</th>
            <th>Image</th>
            <th>Price (PHP)</th>
            <th>Quantity Available</th>
            <th>Size</th>
            <th>Add to Cart</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="inventory-${i}">
        </tbody>
      `;
      inventoryContainer.appendChild(table);
    }
  
    inventoryData.forEach((item, index) => {
      const tableIndex = Math.floor(index / itemsPerTable);
      const tableBody = document.getElementById(`inventory-${tableIndex}`);
      const row = document.createElement('tr');
      const sizeOptions = item.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
      row.innerHTML = `
        <td>${item.item}</td>
        <td><img src="${item.image}" alt="${item.item}" class="item-image"></td>
        <td>₱${item.price.toFixed(2)}</td>
        <td id="${item.item}-quantity">${item.quantity}</td>
        <td>
          <select id="${item.item}-size">
            ${sizeOptions}
          </select>
        </td>
        <td><button onclick="addToCart('${item.item}', ${item.price}, ${item.quantity}, '${item.item}-size')">Add to Cart</button></td>
        <td><input type="number" id="${item.item}-input" min="1" value="0"></td>
        <td><button onclick="removeFromInventory('${item.item}')">Remove</button></td>
        <td><button onclick="showAddQuantityForm('${item.item}')">Add Quantity</button></td>
      `;
      tableBody.appendChild(row);
    });
  
    document.getElementById('paymentForm').addEventListener('submit', function(event) {
      event.preventDefault();
      processPayment();
    });
  
    document.getElementById('addItemForm').addEventListener('submit', function(event) {
      event.preventDefault();
      addStockItem();
    });
  
    document.querySelectorAll('input[name="discount"]').forEach(radio => {
      radio.addEventListener('change', updateTotalAmount);
    });
  });
  
  let cart = [];
  
  function addToCart(item, price, maxQuantity, sizeId) {
    console.log("Adding item to cart:", item);
    const quantityInput = document.getElementById(`${item}-input`);
    const sizeSelect = document.getElementById(sizeId);
    const quantity = parseInt(quantityInput.value);
    const selectedSize = sizeSelect.value;
    const availableQuantity = parseInt(document.getElementById(`${item}-quantity`).innerText);
  
    console.log("Quantity:", quantity);
    console.log("Available Quantity:", availableQuantity);
  
    if (quantity > 0 && quantity <= availableQuantity) {
      cart.push({ item, price, quantity, size: selectedSize });
      updateInventoryQuantity(item, availableQuantity - quantity);
      console.log("Cart:", cart); // Check the cart array after adding the item
      updateCartDisplay();
      updateTotalAmount();
    } else {
      alert('Insufficient quantity');
    }
  }
  
  function updateInventoryQuantity(item, newQuantity) {
    // Ensure inventoryData is defined before using it
    if (!inventoryData) {
      console.error("inventoryData is not defined.");
      return;
    }
  
    const itemData = inventoryData.find(data => data.item === item);
    if (itemData) {
      document.getElementById(`${item}-quantity`).innerText = newQuantity;
      itemData.quantity = newQuantity;
    } else {
      console.error(`Item ${item} not found in inventoryData.`);
    }
  }

  function removeFromInventory(item) {
    const row = document.querySelector(`#inventoryContainer tr td:contains('${item}')`).parentElement;
    row.remove();
  }
  
  function showAddQuantityForm(item) {
    const quantityToAdd = prompt('Enter quantity to add:', '0');
    if (quantityToAdd !== null && !isNaN(quantityToAdd) && parseInt(quantityToAdd) > 0) {
      const currentQuantity = parseInt(document.getElementById(`${item}-quantity`).innerText);
      const newQuantity = currentQuantity + parseInt(quantityToAdd);
      updateInventoryQuantity(item, newQuantity);
    } else {
      alert('Invalid quantity');
    }
  }
  
  function showAddStockForm() {
    document.getElementById('addStockForm').style.display = 'block';
  }
  
  function addStockItem() {
    const itemName = document.getElementById('itemName').value;
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
    const itemSize = document.getElementById('itemSize').value;
    const itemImage = document.getElementById('itemImageInput').files[0];
  
    const newItem = {
      item: itemName,
      price: itemPrice,
      quantity: itemQuantity,
      sizes: [itemSize],
      image: URL.createObjectURL(itemImage)
    };
  
    inventoryData.push(newItem);
    addNewItemToInventory(newItem);
  
    document.getElementById('addItemForm').reset();
    document.getElementById('addStockForm').style.display = 'none';
  }
  
  function addNewItemToInventory(newItem) {
    const tableIndex = Math.floor(inventoryData.length / 4);
    const tableBody = document.getElementById(`inventory-${tableIndex}`);
    const row = document.createElement('tr');
    const sizeOptions = newItem.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
    row.innerHTML = `
      <td>${newItem.item}</td>
      <td><img src="${newItem.image}" alt="${newItem.item}" class="item-image"></td>
      <td>₱${newItem.price.toFixed(2)}</td>
      <td id="${newItem.item}-quantity">${newItem.quantity}</td>
      <td>
        <select id="${newItem.item}-size">
          ${sizeOptions}
        </select>
      </td>
      <td><button onclick="addToCart('${newItem.item}', ${newItem.price}, ${newItem.quantity}, '${newItem.item}-size')">Add to Cart</button></td>
      <td><input type="number" id="${newItem.item}-input" min="1" value="1"></td>
      <td><button onclick="removeFromInventory('${newItem.item}')">Remove</button></td>
      <td><button onclick="showAddQuantityForm('${newItem.item}')">Add Quantity</button></td>
    `;
    tableBody.appendChild(row);
  }
  
  function updateCartDisplay() {
    const selectedItemsList = document.getElementById('selectedItems');
    selectedItemsList.innerHTML = ''; // Clear previous content
    const ul = document.createElement('ul');
    cart.forEach(cartItem => {
      const li = document.createElement('li');
      li.textContent = `${cartItem.item} - Size: ${cartItem.size} - Quantity: ${cartItem.quantity} - Total: ₱${(cartItem.price * cartItem.quantity).toFixed(2)}`;
      ul.appendChild(li);
    });
    selectedItemsList.appendChild(ul);
  }
  
  function updateTotalAmount() {
    const totalAmount = cart.reduce((total, cartItem) => total + (cartItem.price * cartItem.quantity), 0);
    document.getElementById('totalAmount').innerText = `Total Amount: ₱${totalAmount.toFixed(2)}`;
  
    const discount = parseFloat(document.querySelector('input[name="discount"]:checked').value);
    const discountedAmount = totalAmount * (1 - discount / 100);
    document.getElementById('discountedAmount').innerText = `Discounted Amount: ₱${discountedAmount.toFixed(2)}`;
  }
  
  function processPayment() {
    const cashAmount = parseFloat(document.getElementById('cash').value);
    const discountedAmount = parseFloat(document.getElementById('discountedAmount').innerText.replace('Discounted Amount: ₱', ''));
  
    if (cashAmount >= discountedAmount) {
      const change = cashAmount - discountedAmount;
      document.getElementById('change').innerText = `Change: ₱${change.toFixed(2)}`;
      alert('Payment successful!\n\n' + generateReceipt()); // Display receipt after successful payment
      resetUI();
      cart = [];
      updateCartDisplay();
      updateTotalAmount();
    } else {
      alert('Insufficient cash amount.');
    }
  }
  
  function resetUI() {
    cart = [];
    updateCartDisplay();
    updateTotalAmount();
    document.getElementById('cash').value = '';
    document.getElementById('change').innerText = '';
    document.getElementById('paymentForm').reset();
    document.querySelector('input[name="discount"][value="0"]').checked = true;
  }
  
  function generateReceipt() {
    let receipt = "Receipt:\n";
    let totalAmount = 0;
    
    cart.forEach((cartItem) => {
      const itemTotal = cartItem.price * cartItem.quantity;
      receipt += `${cartItem.item} - ${cartItem.size} - Quantity: ${cartItem.quantity} - ₱${itemTotal.toFixed(2)}\n`;
      totalAmount += itemTotal;
    });
    const cashAmount = parseFloat(document.getElementById('cash').value);
    const discount = parseFloat(document.querySelector('input[name="discount"]:checked').value);
    const discountedAmount = totalAmount * (1 - discount / 100);
    const change = Math.abs(discountedAmount - cashAmount);
    receipt += `\nTotal Amount: ₱${totalAmount.toFixed(2)}\n`;
    receipt += `Discounted Amount: ₱${discountedAmount.toFixed(2)}\n`;
    receipt += `\nChange: ₱${change.toFixed(2)}`;
  
    return receipt;
  }