// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User' };

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Handle form submission
document.getElementById('incomeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const income = {
    id: Date.now(),
    type: 'income',
    date: document.getElementById('date').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    amount: parseFloat(document.getElementById('amount').value),
    payer: document.getElementById('payer').value,
    paymentMethod: document.getElementById('paymentMethod').value,
    notes: document.getElementById('notes').value,
    status: 'Received',
    recordedBy: currentUser.name,
    recordedDate: new Date().toISOString()
  };

  // Get existing transactions from localStorage
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  // Add new income to array
  transactions.push(income);

  // Save back to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Show success message
  document.getElementById('successMessage').style.display = 'block';

  // Reset form
  document.getElementById('incomeForm').reset();
  document.getElementById('date').valueAsDate = new Date();

  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = 'budget-dashboard.html';
  }, 2000);
});
