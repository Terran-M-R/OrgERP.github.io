// Load and display transactions when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadTransactions();
  calculateTotals();
  displayCategoryBreakdown();
});

function loadTransactions(filterType = 'all') {
  // Get transactions from localStorage
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  const tbody = document.getElementById('transactionsBody');
  
  if (transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px;">
          No transactions recorded yet. <a href="submit-expense.html">Submit an expense</a> or <a href="add-income.html">record income</a>
        </td>
      </tr>
    `;
    return;
  }

  // Filter transactions
  let filtered = transactions;
  if (filterType !== 'all') {
    filtered = transactions.filter(t => t.type === filterType);
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Build table rows
  tbody.innerHTML = filtered.map(transaction => {
    const isIncome = transaction.type === 'income';
    const typeLabel = isIncome ? '📈 Income' : '📉 Expense';
    const amountClass = isIncome ? 'amount-positive' : 'amount-negative';
    
    return `
      <tr>
        <td>${formatDate(transaction.date)}</td>
        <td>${typeLabel}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td class="${amountClass}">$${transaction.amount.toFixed(2)}</td>
        <td><span class="status-badge ${transaction.status.toLowerCase().replace(' ', '-')}">${transaction.status}</span></td>
        <td>
          ${!isIncome && transaction.status === 'Pending' ? 
            `<button onclick="approveTransaction(${transaction.id})" class="action-btn-small">Approve</button>` : 
            ''}
          <button onclick="deleteTransaction(${transaction.id})" class="action-btn-small delete">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function calculateTotals() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  // Calculate total income
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate total expenses (approved only)
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate net balance
  const netBalance = totalIncome - totalExpenses;
  
  // Count pending expenses
  const pendingCount = transactions.filter(t => t.type === 'expense' && t.status === 'Pending').length;
  
  // Update display
  document.getElementById('totalIncome').textContent = `$${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById('totalExpenses').textContent = `$${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById('netBalance').textContent = `$${netBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById('pendingCount').textContent = pendingCount;
  
  // Color code net balance
  const balanceElement = document.getElementById('netBalance');
  if (netBalance > 0) {
    balanceElement.style.color = '#28a745';
  } else if (netBalance < 0) {
    balanceElement.style.color = '#dc3545';
  }
}

function displayCategoryBreakdown() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'Approved');
  
  // Group by category
  const categoryTotals = {};
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });
  
  const breakdownDiv = document.getElementById('categoryBreakdown');
  
  if (Object.keys(categoryTotals).length === 0) {
    breakdownDiv.innerHTML = '<p style="text-align: center; color: #666;">No approved expenses yet</p>';
    return;
  }
  
  // Calculate total for percentages
  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  // Create category bars
  breakdownDiv.innerHTML = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => {
      const percentage = (amount / total * 100).toFixed(1);
      return `
        <div class="category-item">
          <div class="category-header">
            <span class="category-name">${category}</span>
            <span class="category-amount">$${amount.toFixed(2)} (${percentage}%)</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }).join('');
}

function approveTransaction(id) {
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  const transaction = transactions.find(t => t.id === id);
  if (transaction) {
    transaction.status = 'Approved';
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    loadTransactions();
    calculateTotals();
    displayCategoryBreakdown();
  }
}

function deleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    loadTransactions();
    calculateTotals();
    displayCategoryBreakdown();
  }
}

function filterTransactions(type) {
  document.getElementById('filterType').value = type;
  loadTransactions(type);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function loadSampleData() {
  const sampleData = [
    // Income
    {
      id: Date.now() + 1,
      type: 'income',
      date: '2025-09-15',
      description: 'Fall 2025 Member Dues',
      category: 'Member Dues',
      amount: 1500.00,
      payer: 'Chapter Members (30 members × $50)',
      paymentMethod: 'Venmo/CashApp',
      notes: 'Collected during first general body meeting',
      status: 'Received',
      recordedBy: 'Treasurer',
      recordedDate: new Date().toISOString()
    },
    {
      id: Date.now() + 2,
      type: 'income',
      date: '2025-10-05',
      description: 'Bake Sale Fundraiser',
      category: 'Fundraising Events',
      amount: 385.50,
      payer: 'Student Body',
      paymentMethod: 'Cash',
      notes: 'Held during homecoming week',
      status: 'Received',
      recordedBy: 'Treasurer',
      recordedDate: new Date().toISOString()
    },
    {
      id: Date.now() + 3,
      type: 'income',
      date: '2025-10-12',
      description: 'Dell Technologies Sponsorship',
      category: 'Corporate Sponsorship',
      amount: 2000.00,
      payer: 'Dell Technologies',
      paymentMethod: 'Check',
      notes: 'Annual corporate sponsorship for chapter activities',
      status: 'Received',
      recordedBy: 'President',
      recordedDate: new Date().toISOString()
    },
    // Expenses - Conference Related
    {
      id: Date.now() + 4,
      type: 'expense',
      date: '2025-10-15',
      description: 'NSBE Region V Conference Registration - 8 Members',
      category: 'Conference Expenses',
      subcategory: 'Conference Registration',
      vendor: 'NSBE National',
      amount: 800.00,
      paymentMethod: 'Chapter Funds',
      relatedEvent: 'NSBE Region V Fall Conference',
      notes: '8 members attending × $100 registration fee',
      status: 'Approved',
      submittedBy: 'Vice President',
      submittedDate: new Date().toISOString()
    },
    {
      id: Date.now() + 5,
      type: 'expense',
      date: '2025-11-10',
      description: 'Hotel Rooms for Conference (Nov 20-23)',
      category: 'Conference Expenses',
      subcategory: 'Hotel Accommodation',
      vendor: 'Houston Marriott',
      amount: 960.00,
      paymentMethod: 'Credit Card',
      relatedEvent: 'NSBE Region V Fall Conference',
      notes: '4 rooms × 3 nights × $80/night',
      status: 'Pending',
      submittedBy: 'Treasurer',
      submittedDate: new Date().toISOString()
    },
    {
      id: Date.now() + 6,
      type: 'expense',
      date: '2025-11-15',
      description: 'Van Rental for Conference Transportation',
      category: 'Conference Expenses',
      subcategory: 'Transportation',
      vendor: 'Enterprise Rent-A-Car',
      amount: 320.00,
      paymentMethod: 'Chapter Funds',
      relatedEvent: 'NSBE Region V Fall Conference',
      notes: '15-passenger van for 4 days',
      status: 'Pending',
      submittedBy: 'Secretary',
      submittedDate: new Date().toISOString()
    },
    // Other Expenses
    {
      id: Date.now() + 7,
      type: 'expense',
      date: '2025-10-08',
      description: 'Room Rental for General Body Meeting',
      category: 'Event Hosting',
      subcategory: 'Room Rental',
      vendor: 'UTSA Student Union',
      amount: 150.00,
      paymentMethod: 'University Account',
      relatedEvent: 'October General Body Meeting',
      notes: 'Ballroom rental for 3 hours',
      status: 'Approved',
      submittedBy: 'Event Coordinator',
      submittedDate: new Date().toISOString()
    },
    {
      id: Date.now() + 8,
      type: 'expense',
      date: '2025-10-20',
      description: 'Pizza for Study Session',
      category: 'Social Events',
      subcategory: 'Food & Catering',
      vendor: "Domino's Pizza",
      amount: 85.00,
      paymentMethod: 'Cash',
      relatedEvent: 'Midterm Study Session',
      notes: '10 pizzas for study session attendees',
      status: 'Approved',
      submittedBy: 'Social Chair',
      submittedDate: new Date().toISOString()
    },
    {
      id: Date.now() + 9,
      type: 'expense',
      date: '2025-09-28',
      description: 'Marketing Materials for Recruitment',
      category: 'Marketing & Outreach',
      subcategory: 'Supplies',
      vendor: 'FedEx Office',
      amount: 125.00,
      paymentMethod: 'Chapter Funds',
      relatedEvent: 'Fall Recruitment Week',
      notes: 'Flyers, posters, and business cards',
      status: 'Approved',
      submittedBy: 'Marketing Chair',
      submittedDate: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('transactions', JSON.stringify(sampleData));
  loadTransactions();
  calculateTotals();
  displayCategoryBreakdown();
  alert('Sample data loaded! You can now see realistic transactions for a student organization.');
}

function clearAllData() {
  if (confirm('This will delete ALL transaction data. Continue?')) {
    localStorage.removeItem('transactions');
    loadTransactions();
    calculateTotals();
    displayCategoryBreakdown();
  }
}
