// Load and display members when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadMembers();
  calculateStats();
  
  // Set up search functionality
  document.getElementById('searchMembers').addEventListener('input', filterMembers);
  document.getElementById('roleFilter').addEventListener('change', filterMembers);
  document.getElementById('statusFilter').addEventListener('change', filterMembers);
});

function loadMembers() {
  const members = JSON.parse(localStorage.getItem('members')) || [];
  displayMembers(members);
}

function displayMembers(membersToDisplay) {
  const grid = document.getElementById('membersGrid');
  
  if (membersToDisplay.length === 0) {
    grid.innerHTML = `
      <div class="no-members-message">
        <p>No members found. <a href="add-member.html">Add your first member</a> or <button onclick="loadSampleMembers()" class="btn-link">load sample data</button>.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = membersToDisplay.map(member => {
    const initials = getInitials(member.firstName, member.lastName);
    const committees = member.committees ? member.committees.split(',').map(c => c.trim()) : [];
    
    return `
      <div class="member-card" data-id="${member.id}">
        <div class="member-avatar">${initials}</div>
        <h3>${member.firstName} ${member.lastName}</h3>
        <p class="member-role">${member.role}</p>
        <div class="member-contact">
          <p>📧 ${member.email}</p>
          ${member.phone ? `<p>📱 ${member.phone}</p>` : ''}
        </div>
        ${member.major ? `<p class="member-major">${member.major}</p>` : ''}
        ${committees.length > 0 ? `
          <div class="member-tags">
            ${committees.slice(0, 2).map(c => `<span class="tag">${c}</span>`).join('')}
            ${committees.length > 2 ? `<span class="tag">+${committees.length - 2}</span>` : ''}
          </div>
        ` : ''}
        <span class="status-badge ${member.status.toLowerCase()}">${member.status}</span>
        <div class="member-actions">
          <button onclick="viewMember(${member.id})" class="btn-view">View Details</button>
          <button onclick="deleteMember(${member.id})" class="btn-delete">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function getInitials(firstName, lastName) {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

function filterMembers() {
  const searchTerm = document.getElementById('searchMembers').value.toLowerCase();
  const roleFilter = document.getElementById('roleFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  
  let members = JSON.parse(localStorage.getItem('members')) || [];
  
  // Apply filters
  members = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm) ||
      member.lastName.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  displayMembers(members);
}

function calculateStats() {
  const members = JSON.parse(localStorage.getItem('members')) || [];
  
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const boardMembers = members.filter(m => 
    ['President', 'Vice President', 'Treasurer', 'Secretary', 'Board Member'].includes(m.role)
  ).length;
  
  // Calculate new members (joined in last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const newMembers = members.filter(m => new Date(m.joinDate) >= ninetyDaysAgo).length;
  
  document.getElementById('totalMembers').textContent = totalMembers;
  document.getElementById('activeMembers').textContent = activeMembers;
  document.getElementById('boardMembers').textContent = boardMembers;
  document.getElementById('newThisSemester').textContent = newMembers;
}

function viewMember(id) {
  const members = JSON.parse(localStorage.getItem('members')) || [];
  const member = members.find(m => m.id === id);
  
  if (!member) return;
  
  // Create a modal or alert with member details
  const committees = member.committees ? member.committees : 'None';
  const skills = member.skills ? member.skills : 'None';
  const notes = member.notes ? member.notes : 'None';
  
  alert(`
Member Details:

Name: ${member.firstName} ${member.lastName}
Email: ${member.email}
Phone: ${member.phone || 'N/A'}
Role: ${member.role}
Status: ${member.status}
Major: ${member.major || 'N/A'}
Year: ${member.year || 'N/A'}
Join Date: ${formatDate(member.joinDate)}
Committees: ${committees}
Skills: ${skills}
Notes: ${notes}
  `);
}

function deleteMember(id) {
  if (confirm('Are you sure you want to delete this member?')) {
    let members = JSON.parse(localStorage.getItem('members')) || [];
    members = members.filter(m => m.id !== id);
    localStorage.setItem('members', JSON.stringify(members));
    
    loadMembers();
    calculateStats();
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function loadSampleMembers() {
  const sampleMembers = [
    {
    {
      id: Date.now() + 1,
      firstName: 'Robert',
      lastName: 'James',
      email: 'robert.james@University.edu',
      phone: '(123) 456-7890',
      role: 'Member',
      status: 'Active',
      major: 'Electrical Engineering',
      year: 'Freshman',
      joinDate: '2024-09-01',
      committees: 'Technical Projects',
      skills: 'Circuit Design, Arduino, Programming',
      notes: 'New member, very enthusiastic'
    },
    {
      id: Date.now() + 2,
      firstName: 'Ann',
      lastName: 'Anderson',
      email: 'ann.anderson@University.edu',
      phone: '(123) 456-7890',
      role: 'Board Member',
      status: 'Active',
      major: 'Civil Engineering',
      year: 'Senior',
      joinDate: '2023-08-25',
      committees: 'Community Outreach, Events',
      skills: 'Project Planning, Community Relations, Fundraising',
      notes: 'Strong community connections'
    },
    {
      id: Date.now() + 3,
      firstName: 'John',
      lastName: 'James',
      email: 'John.James@University.edu',
      phone: '(123) 456-7890',
      role: 'Member',
      status: 'Active',
      major: 'Information Systems',
      year: 'Sophomore',
      joinDate: '2024-01-15',
      committees: 'Technology, Website',
      skills: 'Web Development, HTML/CSS, Database Management',
      notes: 'Maintains organization website'
    },
    {
      id: Date.now() + 4,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'Jane.Doe@University.edu',
      phone: '',
      role: 'Member',
      status: 'Active',
      major: 'Psychology',
      year: 'Junior',
      joinDate: '2024-09-10',
      committees: 'Events, Social',
      skills: 'Event Coordination, People Skills',
      notes: 'Great at organizing social events'
    },
    {
      id: Date.now() + 5,
      firstName: 'John',
      lastName: 'Doe',
      email: 'John.Doe@University.edu',
      phone: '(123) 456-7890',
      role: 'Member',
      status: 'Inactive',
      major: 'Finance',
      year: 'Senior',
      joinDate: '2023-09-05',
      committees: '',
      skills: 'Financial Analysis',
      notes: 'Study abroad this semester'
    }
  ];
  
  localStorage.setItem('members', JSON.stringify(sampleMembers));
  loadMembers();
  calculateStats();
  alert('Sample member data loaded successfully!');
}

function clearMemberData() {
  if (confirm('This will delete ALL member data. Continue?')) {
    localStorage.removeItem('members');
    loadMembers();
    calculateStats();
  }
}
