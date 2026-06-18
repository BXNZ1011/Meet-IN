// ====================================
// Meet-IN Application
// Main JavaScript File
// ====================================

class MeetingScheduler {
  constructor() {
    this.meetings = [];
    this.wardrobe = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFromLocalStorage();
  }

  setupEventListeners() {
    // Meeting Form
    const meetingForm = document.getElementById('meetingForm');
    if (meetingForm) {
      meetingForm.addEventListener('submit', (e) => this.handleMeetingSubmit(e));
    }

    // Upload Box
    const uploadBox = document.getElementById('uploadBox');
    if (uploadBox) {
      uploadBox.addEventListener('click', () => this.triggerFileUpload());
      uploadBox.addEventListener('dragover', (e) => this.handleDragOver(e));
      uploadBox.addEventListener('drop', (e) => this.handleDrop(e));
    }

    // Generate Outfit Button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateOutfit());
    }
  }

  // ====================================
  // Meeting Functions
  // ====================================

  handleMeetingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const meeting = {
      id: Date.now(),
      title: form.children[0].value,
      attendees: form.children[1].value,
      date: form.children[2].value,
      suggestedTimes: this.getSuggestedTimes(),
    };

    this.meetings.push(meeting);
    this.displayMeetingResults(meeting);
    this.saveToLocalStorage();
    form.reset();
  }

  getSuggestedTimes() {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour}:00 - ${hour + 1}:00`);
    }
    return times.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  displayMeetingResults(meeting) {
    const resultsDiv = document.getElementById('meetingResults');
    const html = `
      <div class="result-item">
        <h3>${meeting.title}</h3>
        <p><strong>Attendees:</strong> ${meeting.attendees}</p>
        <p><strong>Date:</strong> ${meeting.date}</p>
        <p><strong>Suggested Times:</strong></p>
        <ul>
          ${meeting.suggestedTimes.map((time) => `<li>${time}</li>`).join('')}
        </ul>
      </div>
    `;
    resultsDiv.innerHTML += html;
  }

  // ====================================
  // Wardrobe Functions
  // ====================================

  triggerFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => this.handleFileSelect(e);
    input.click();
  }

  handleDragOver(e) {
    e.preventDefault();
    e.target.style.background = '#e8f0ff';
  }

  handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    this.handleFileSelect({ target: { files } });
  }

  handleFileSelect(e) {
    const files = e.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.addWardrobeItem(event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  addWardrobeItem(image, name) {
    const item = {
      id: Date.now(),
      image,
      name,
      category: this.categorizeClothing(name),
    };
    this.wardrobe.push(item);
    this.displayWardrobeItem(item);
    this.saveToLocalStorage();
  }

  categorizeClothing(name) {
    const categories = {
      shirt: ['shirt', 'top', 'blouse'],
      pants: ['pants', 'jeans', 'trousers'],
      dress: ['dress', 'gown'],
      shoes: ['shoe', 'sneaker', 'boot', 'heel'],
      jacket: ['jacket', 'coat', 'blazer'],
      accessories: ['hat', 'scarf', 'bag', 'accessory'],
    };

    const lowerName = name.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerName.includes(keyword))) {
        return category;
      }
    }
    return 'other';
  }

  displayWardrobeItem(item) {
    const wardrobeDiv = document.getElementById('wardrobeItems');
    const html = `
      <div class="outfit-card">
        <img src="${item.image}" alt="${item.name}" style="max-width: 100%; height: auto; border-radius: 5px;">
        <p><strong>${item.name}</strong></p>
        <p style="font-size: 0.9rem; color: #666;">${item.category}</p>
      </div>
    `;
    wardrobeDiv.innerHTML += html;
  }

  // ====================================
  // Outfit Generation
  // ====================================

  generateOutfit() {
    if (this.wardrobe.length < 3) {
      alert('Please upload at least 3 clothing items first!');
      return;
    }

    const outfit = [];
    const categories = ['shirt', 'pants', 'shoes'];

    for (const category of categories) {
      const items = this.wardrobe.filter((item) => item.category === category);
      if (items.length > 0) {
        outfit.push(items[Math.floor(Math.random() * items.length)]);
      }
    }

    if (outfit.length > 0) {
      this.displayGeneratedOutfit(outfit);
    }
  }

  displayGeneratedOutfit(outfit) {
    const resultDiv = document.getElementById('outfitResult');
    const html = `
      <div class="outfit-card" style="grid-column: 1 / -1;">
        <h3>Your Generated Outfit</h3>
        <div style="display: grid; grid-template-columns: repeat(${outfit.length}, 1fr); gap: 1rem; margin-top: 1rem;">
          ${outfit
            .map(
              (item) => `
            <div>
              <img src="${item.image}" alt="${item.name}" style="max-width: 100%; height: auto; border-radius: 5px;">
              <p>${item.name}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
    resultDiv.innerHTML = html;
  }

  // ====================================
  // Local Storage
  // ====================================

  saveToLocalStorage() {
    localStorage.setItem('meetings', JSON.stringify(this.meetings));
    localStorage.setItem('wardrobe', JSON.stringify(this.wardrobe));
  }

  loadFromLocalStorage() {
    const meetings = localStorage.getItem('meetings');
    const wardrobe = localStorage.getItem('wardrobe');

    if (meetings) {
      this.meetings = JSON.parse(meetings);
    }
    if (wardrobe) {
      this.wardrobe = JSON.parse(wardrobe);
      this.wardrobe.forEach((item) => this.displayWardrobeItem(item));
    }
  }
}

// ====================================
// Initialize App
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  new MeetingScheduler();
});
