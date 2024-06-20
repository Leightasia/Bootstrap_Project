function calculateTotal() {
  var checkboxes = document.querySelectorAll('.item-checkbox:checked');
  var total = 0;
  var selectedItems = [];
  checkboxes.forEach(function(checkbox) {
      var price = parseFloat(checkbox.dataset.price);
      var quantity = parseInt(checkbox.parentNode.querySelector('.quantity').value);
      total += price * quantity;
      if (quantity > 0) {
          selectedItems.push(checkbox.dataset.name + ' x ' + quantity+ " = " +(price*quantity));
      }
  });
  var totalDisplay = '<h3> Total: <span style="color:red;">P' + total.toFixed(2)+'</span>'+'</h3>';
  if (selectedItems.length > 0) {
      totalDisplay += '<br><br>Selected Items: <br><br>' + selectedItems.join('<br>  ');
  }
  var childWindow = window.open('', '_blank', 'width=400,height=400');
  childWindow.document.write('<h1 style="text-align:center;">BSR Receipt</h1><p>' + totalDisplay + '</p>');
}