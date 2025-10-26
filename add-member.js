// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Admin' };

// Set today's date as default for join date
document.getElementById('joinDate').valueAsDate = new Date();

// Handle form submission
document.getElementById('memberForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const member = {
    id: Date.now(),
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    role: document.getElementById('role').value,
    status: document.getElementById('status').value,
    major: document.getElementById('major').value,
    year: document.getElementById('year').value,
    joinDate: document.getElementById('joinDate').value,
    committees: document.getElementById('committees').value,
    skills: document.getElementById('skills').value,
    notes: document.getElementById('notes').value,
    addedBy: currentUser.name,
    addedDate: new Date().toISOString()
  };

  // Get existing members from localStorage
  let members = JSON.parse(localStorage.getItem('members')) || [];

  // Add new member to array
  members.push(member);

  // Save back to localStorage
  localStorage.setItem('members', JSON.stringify(members));

  // Show success message
  document.getElementById('successMessage').style.display = 'block';

  // Reset form
  document.getElementById('memberForm').reset();
  document.getElementById('joinDate').valueAsDate = new Date();

  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = 'members.html';
  }, 2000);
});
