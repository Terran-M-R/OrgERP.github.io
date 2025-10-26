// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User' };

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const expense = {
    id: Date.now(),
    type: 'expense',
    date: document.getElementById('date').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    subcategory: document.getElementById('subcategory').value,
    vendor: document.getElementById('vendor').value,
    amount: parseFloat(document.getElementById('amount').value),
    paymentMethod: document.getElementById('paymentMethod').value,
    relatedEvent: document.getElementById('relatedEvent').value,
    notes: document.getElementById('notes').value,
    status: 'Pending',
    submittedBy: currentUser.name,
    submittedDate: new Date().toISOString()
  };

  // Get existing transactions from localStorage
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
