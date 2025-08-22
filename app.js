// File path configuration
const fileConfig = {
  basePath: './data/',
  fileExtensions: {
    subject: '.pdf',
    correction: '.pdf',
    repartition: '.xlsx'
  },
  folderNames: {
    subject: 'sujet',
    correction: 'corrige', 
    repartition: 'repartition'
  }
};

// Function to generate file paths
function getFilePath(ue, type, year = null) {
  // Trouver l'UE dans les données pour obtenir le bon numéro
  const ueData = appData.ueList.find(u => u.id === ue);
  if (!ueData) {
    console.error('UE not found:', ue);
    return null;
  }
  
  const ueName = `UE${ueData.number}`;  // "UE1", "UE6", etc.
  const folder = fileConfig.folderNames[type];
  
  if (type === 'repartition') {
    return `${fileConfig.basePath}${ueName}/${folder}/repartition_${ue.toLowerCase()}.xlsx`;
  } else {
    const extension = fileConfig.fileExtensions[type];
    const filePath = `${fileConfig.basePath}${ueName}/${folder}/${year}${extension}`;
    console.log('Generated path:', filePath); // Debug
    return filePath;
  }
}

// File availability checking
async function checkFileAvailability() {
  const availability = {};
  
  for (const ue of appData.ueList) {
    availability[ue.id] = {
      years: {},
      repartition: false
    };
    
    // Check each year
    for (const year of appData.years) {
      availability[ue.id].years[year] = {
        subject: await fileExists(getFilePath(ue.id, 'subject', year)),
        correction: await fileExists(getFilePath(ue.id, 'correction', year))
      };
    }
    
    // Check repartition file
    availability[ue.id].repartition = await fileExists(getFilePath(ue.id, 'repartition'));
  }
  
  return availability;
}

async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Updated PDF click handlers
function handlePdfClick(ue, type, year) {
  const filePath = getFilePath(ue, type, year);
  
  // Check if file exists and open it
  fetch(filePath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        window.open(filePath, '_blank');
      } else {
        showNotification('Fichier non disponible', 'error');
      }
    })
    .catch(() => {
      showNotification('Fichier non trouvé', 'error');
    });
}

// Application Data from JSON
const appData = {
  programInfo: {
    title: "DCG - Diplôme de Comptabilité et de Gestion",
    description: "Formation complète en comptabilité et gestion",
    totalCredits: 180,
    duration: "3 années"
  },
  ueList: [
    {
      id: "ue1",
      number: 1,
      name: "Introduction au droit",
      credits: 12,
      duration: "150h",
      color: "#3B82F6",
      description: "Principes généraux du droit, sources du droit, organisation judiciaire"
    },
    {
      id: "ue2", 
      number: 2,
      name: "Droit des sociétés",
      credits: 12,
      duration: "150h", 
      color: "#8B5CF6",
      description: "Création, fonctionnement et évolution des sociétés"
    },
    {
      id: "ue3",
      number: 3, 
      name: "Droit social",
      credits: 12,
      duration: "150h",
      color: "#10B981",
      description: "Relations individuelles et collectives de travail"
    },
    {
      id: "ue4",
      number: 4,
      name: "Droit fiscal", 
      credits: 12,
      duration: "150h",
      color: "#F59E0B",
      description: "Fiscalité des entreprises et des particuliers"
    },
    {
      id: "ue5",
      number: 5,
      name: "Économie",
      credits: 16,
      duration: "200h",
      color: "#EF4444", 
      description: "Économie générale et économie d'entreprise"
    },
    {
      id: "ue6",
      number: 6,
      name: "Finance d'entreprise",
      credits: 12,
      duration: "150h",
      color: "#E91E63",
      description: "Diagnostic financier, investissement, financement, trésorerie"
    },
    {
      id: "ue7",
      number: 7,
      name: "Management", 
      credits: 14,
      duration: "175h",
      color: "#06B6D4",
      description: "Théories des organisations, management stratégique et opérationnel"
    },
    {
      id: "ue8",
      number: 8,
      name: "Système d'information de gestion",
      credits: 12,
      duration: "150h",
      color: "#84CC16",
      description: "Systèmes d'information, bases de données, progiciels"
    },
    {
      id: "ue9",
      number: 9,
      name: "Introduction à la comptabilité",
      credits: 14,
      duration: "175h", 
      color: "#F97316",
      description: "Mécanisme et technique comptables, documents de synthèse"
    },
    {
      id: "ue10",
      number: 10,
      name: "Comptabilité approfondie",
      credits: 12,
      duration: "150h",
      color: "#A855F7",
      description: "Opérations complexes, consolidation, comptabilité spécialisée"
    },
    {
      id: "ue11",
      number: 11, 
      name: "Contrôle de gestion",
      credits: 14,
      duration: "175h",
      color: "#EC4899",
      description: "Calculs et analyse des coûts, gestion budgétaire, tableau de bord"
    },
    {
      id: "ue12",
      number: 12,
      name: "Anglais des affaires",
      credits: 12,
      duration: "150h",
      color: "#14B8A6", 
      description: "Communication professionnelle en anglais"
    },
    {
      id: "ue13",
      number: 13,
      name: "Relations professionnelles",
      credits: 12,
      duration: "150h",
      color: "#6366F1",
      description: "Stage professionnel et rapport de stage"
    }
  ],
  years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
  ueTopics: {
    ue6: [
      {
        name: "La valeur",
        distribution: "2008 - 3 / 2010 - 2 / 2011 - 3 / 2014 - 3 / 2015 - 2 / 2017 - 2 / 2019 - 3"
      },
      {
        name: "Diagnostic financier", 
        distribution: "1 de chaque année"
      },
      {
        name: "La politique d'investissement",
        distribution: "2009 - 2 / 2011 - 2 / 2012 - 2 / 2013 - 2 / 2014 - 2 / 2018 - 2 / 2020 - 3"
      },
      {
        name: "La politique de financement",
        distribution: "2008 - 2 / 2013 - 3 / 2016 - 2 / 2019 - 2"
      },
      {
        name: "La gestion de la trésorerie", 
        distribution: "2009 - 3 / 2010 - 3 / 2012 - 3 / 2015 - 3 / 2016 - 3 / 2017 - 3 / 2018 - 3 / 2020 - 2"
      }
    ],
    ue1: [
      {
        name: "Introduction générale au droit",
        distribution: "2008 - 1 / 2010 - 1 / 2012 - 1 / 2014 - 1 / 2016 - 1 / 2018 - 1 / 2020 - 1"
      },
      {
        name: "Les personnes et les biens", 
        distribution: "2009 - 2 / 2011 - 2 / 2013 - 2 / 2015 - 2 / 2017 - 2 / 2019 - 2"
      },
      {
        name: "L'entreprise et les contrats",
        distribution: "2008 - 3 / 2010 - 3 / 2012 - 3 / 2014 - 3 / 2016 - 3 / 2018 - 3 / 2020 - 3"
      }
    ],
    ue9: [
      {
        name: "Introduction à la comptabilité",
        distribution: "2008 - 1 / 2009 - 1 / 2010 - 1 / 2011 - 1 / 2012 - 1 / 2013 - 1 / 2014 - 1"
      },
      {
        name: "La méthode comptable", 
        distribution: "2015 - 2 / 2016 - 2 / 2017 - 2 / 2018 - 2 / 2019 - 2 / 2020 - 2"
      },
      {
        name: "Analyse comptable des opérations courantes",
        distribution: "2008 - 3 / 2009 - 3 / 2010 - 3 / 2011 - 3 / 2012 - 3 / 2013 - 3 / 2014 - 3"
      },
      {
        name: "Travaux d'inventaire",
        distribution: "2015 - 4 / 2016 - 4 / 2017 - 4 / 2018 - 4 / 2019 - 4 / 2020 - 4"
      }
    ]
  },
  examStats: {
    totalExams: 169,
    availableYears: 13,
    totalUE: 13,
    lastUpdate: "2025"
  }
};

// Global file availability state
let fileAvailability = {};

// Generate years data for all UE
function generateYearsData() {
  return appData.years.map(year => ({
    year: year,
    hasSubject: true,
    hasCorrection: true
  }));
}

// Generate sample topics for UE without specific data
function generateSampleTopics(ueId) {
  const sampleTopicsMap = {
    ue2: [
      { name: "Constitution des sociétés", distribution: "2008 - 1 / 2010 - 1 / 2012 - 2 / 2014 - 1 / 2016 - 2 / 2018 - 1" },
      { name: "Fonctionnement des sociétés", distribution: "2009 - 2 / 2011 - 3 / 2013 - 2 / 2015 - 3 / 2017 - 2 / 2019 - 3" },
      { name: "Évolution des sociétés", distribution: "2008 - 3 / 2010 - 2 / 2012 - 1 / 2014 - 3 / 2016 - 1 / 2020 - 2" }
    ],
    ue3: [
      { name: "Relations individuelles", distribution: "2008 - 1 / 2009 - 1 / 2011 - 2 / 2013 - 1 / 2015 - 2 / 2017 - 1 / 2019 - 2" },
      { name: "Relations collectives", distribution: "2010 - 2 / 2012 - 3 / 2014 - 2 / 2016 - 3 / 2018 - 3 / 2020 - 3" }
    ],
    ue4: [
      { name: "Fiscalité des entreprises", distribution: "2008 - 2 / 2010 - 1 / 2012 - 2 / 2014 - 1 / 2016 - 2 / 2018 - 1 / 2020 - 2" },
      { name: "Fiscalité des particuliers", distribution: "2009 - 3 / 2011 - 3 / 2013 - 3 / 2015 - 3 / 2017 - 3 / 2019 - 3" }
    ],
    ue5: [
      { name: "Économie générale", distribution: "2008 - 1 / 2009 - 1 / 2011 - 1 / 2013 - 1 / 2015 - 1 / 2017 - 1 / 2019 - 1" },
      { name: "Économie d'entreprise", distribution: "2010 - 2 / 2012 - 2 / 2014 - 2 / 2016 - 2 / 2018 - 2 / 2020 - 2" }
    ],
    ue7: [
      { name: "Théories des organisations", distribution: "2008 - 1 / 2010 - 2 / 2012 - 1 / 2014 - 2 / 2016 - 1 / 2018 - 2 / 2020 - 1" },
      { name: "Management stratégique", distribution: "2009 - 3 / 2011 - 3 / 2013 - 3 / 2015 - 3 / 2017 - 3 / 2019 - 3" }
    ],
    ue8: [
      { name: "Systèmes d'information", distribution: "2008 - 1 / 2009 - 1 / 2011 - 1 / 2013 - 2 / 2015 - 2 / 2017 - 2 / 2019 - 2" },
      { name: "Bases de données", distribution: "2010 - 3 / 2012 - 3 / 2014 - 3 / 2016 - 3 / 2018 - 3 / 2020 - 3" }
    ],
    ue10: [
      { name: "Opérations complexes", distribution: "2008 - 1 / 2009 - 2 / 2011 - 1 / 2013 - 2 / 2015 - 1 / 2017 - 2 / 2019 - 1" },
      { name: "Consolidation", distribution: "2010 - 3 / 2012 - 3 / 2014 - 3 / 2016 - 3 / 2018 - 3 / 2020 - 3" }
    ],
    ue11: [
      { name: "Calculs des coûts", distribution: "2008 - 1 / 2009 - 1 / 2011 - 2 / 2013 - 1 / 2015 - 2 / 2017 - 1 / 2019 - 2" },
      { name: "Gestion budgétaire", distribution: "2010 - 3 / 2012 - 3 / 2014 - 3 / 2016 - 3 / 2018 - 3 / 2020 - 3" }
    ],
    ue12: [
      { name: "Communication professionnelle", distribution: "Épreuve orale - Toutes années" },
      { name: "Anglais des affaires", distribution: "Épreuve orale - Toutes années" }
    ],
    ue13: [
      { name: "Stage professionnel", distribution: "Rapport de stage - Toutes années" },
      { name: "Relations professionnelles", distribution: "Soutenance orale - Toutes années" }
    ]
  };
  
  return sampleTopicsMap[ueId] || [
    { name: "Thème général", distribution: "Répartition sur toutes les années disponibles" }
  ];
}

// DOM Elements
let navToggle, navMenu, navLinks, sections;
let ueGrid, ueSelector, ueSelectorRep, ueGridToggle, ueGridToggleRep;
let ueSelectorGrid, ueSelectorGridRep, ueCardsContainer, ueCardsContainerRep;
let annalesTableBody, repartitionsTableBody, yearSearch, resultCount;
let annalesPlaceholder, annalesUeContent, repartitionsPlaceholder, repartitionsUeContent;
let annalesBreadcrumb, repartitionsBreadcrumb, currentUeBreadcrumb, currentUeBreadcrumbRep;
let annalesUeInfo, repartitionsUeInfo, examInfo;
let pdfModal, modalTitle, modalDescription, downloadBtn, modalClose;
let contactForm, globalLoader;

// Application State
let currentSection = 'accueil';
let selectedUeAnnales = null;
let selectedUeRepartitions = null;
let filteredYears = [];
let isLoading = false;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  initializeElements();
  setupEventListeners();
  initializeNavigation();
  
  // Initialize file availability checking
  showGlobalLoader('Vérification des fichiers disponibles...');
  try {
    fileAvailability = await checkFileAvailability();
    console.log('File availability checked:', fileAvailability);
  } catch (error) {
    console.error('Error checking file availability:', error);
    fileAvailability = {}; // Fallback to empty object
  }
  hideGlobalLoader();
  
  initializeUeData();
  
  // Show welcome section immediately
  showSection('accueil');
  
  console.log('DCG - Application initialisée avec', appData.ueList.length, 'UE');
});

// Initialize DOM elements
function initializeElements() {
  navToggle = document.querySelector('.nav-toggle');
  navMenu = document.querySelector('.nav-menu');
  navLinks = document.querySelectorAll('.nav-link');
  sections = document.querySelectorAll('.section');
  
  // UE Grid and selectors
  ueGrid = document.getElementById('ueGrid');
  ueSelector = document.getElementById('ueSelector');
  ueSelectorRep = document.getElementById('ueSelectorRep');
  ueGridToggle = document.getElementById('ueGridToggle');
  ueGridToggleRep = document.getElementById('ueGridToggleRep');
  ueSelectorGrid = document.getElementById('ueSelectorGrid');
  ueSelectorGridRep = document.getElementById('ueSelectorGridRep');
  ueCardsContainer = document.getElementById('ueCardsContainer');
  ueCardsContainerRep = document.getElementById('ueCardsContainerRep');
  
  // Content areas
  annalesTableBody = document.getElementById('annalesTableBody');
  repartitionsTableBody = document.getElementById('repartitionsTableBody');
  yearSearch = document.getElementById('yearSearch');
  resultCount = document.getElementById('resultCount');
  
  // Placeholders and content
  annalesPlaceholder = document.getElementById('annalesPlaceholder');
  annalesUeContent = document.getElementById('annalesUeContent');
  repartitionsPlaceholder = document.getElementById('repartitionsPlaceholder');
  repartitionsUeContent = document.getElementById('repartitionsUeContent');
  
  // Breadcrumbs
  annalesBreadcrumb = document.getElementById('annalesBreadcrumb');
  repartitionsBreadcrumb = document.getElementById('repartitionsBreadcrumb');
  currentUeBreadcrumb = document.getElementById('currentUeBreadcrumb');
  currentUeBreadcrumbRep = document.getElementById('currentUeBreadcrumbRep');
  
  // UE Info
  annalesUeInfo = document.getElementById('annalesUeInfo');
  repartitionsUeInfo = document.getElementById('repartitionsUeInfo');
  examInfo = document.getElementById('examInfo');
  
  // Modal and other elements
  pdfModal = document.getElementById('pdfModal');
  modalTitle = document.getElementById('modalTitle');
  modalDescription = document.getElementById('modalDescription');
  downloadBtn = document.getElementById('downloadBtn');
  modalClose = document.querySelector('.modal-close');
  
  contactForm = document.querySelector('.contact-form');
  globalLoader = document.getElementById('globalLoader');
  
  console.log('Elements initialized - Sections found:', sections.length);
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // UE Selection
  if (ueSelector) {
    ueSelector.addEventListener('change', (e) => selectUe('annales', e.target.value));
  }
  
  if (ueSelectorRep) {
    ueSelectorRep.addEventListener('change', (e) => selectUe('repartitions', e.target.value));
  }
  
  if (ueGridToggle) {
    ueGridToggle.addEventListener('click', () => toggleUeGrid('annales'));
  }
  
  if (ueGridToggleRep) {
    ueGridToggleRep.addEventListener('click', () => toggleUeGrid('repartitions'));
  }
  
  // Search functionality
  if (yearSearch) {
    yearSearch.addEventListener('input', handleSearchInput);
  }
  
  // Modal
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }
  
  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Initialize UE data
function initializeUeData() {
  generateUeOverviewGrid();
  generateUeSelectors();
  generateUeSelectionCards();
}

// Generate UE overview grid for homepage
function generateUeOverviewGrid() {
  if (!ueGrid) return;
  
  ueGrid.innerHTML = '';
  
  appData.ueList.forEach((ue, index) => {
    const ueCard = document.createElement('div');
    ueCard.className = 'ue-card';
    ueCard.style.setProperty('--ue-color', ue.color);
    ueCard.setAttribute('tabindex', '0');
    ueCard.setAttribute('role', 'button');
    ueCard.setAttribute('aria-label', `UE ${ue.number} - ${ue.name}`);
    
    // Check availability for this UE
    const availability = fileAvailability[ue.id];
    const availableCount = availability ? Object.values(availability.years).filter(year => year.subject || year.correction).length : appData.years.length;
    
    ueCard.innerHTML = `
      <div class="ue-header">
        <div class="ue-number">UE${ue.number}</div>
        <div class="ue-credits">${ue.credits} crédits</div>
      </div>
      <div class="ue-name">${ue.name}</div>
      <div class="ue-description">${ue.description}</div>
      <div class="ue-meta">
        <span>${ue.duration}</span>
        <span>${availableCount} années</span>
      </div>
    `;
    
    // Add click handler
    ueCard.addEventListener('click', () => {
      showSection('annales');
      setTimeout(() => {
        selectUe('annales', ue.id);
      }, 100);
    });
    
    // Add keyboard support
    ueCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showSection('annales');
        setTimeout(() => {
          selectUe('annales', ue.id);
        }, 100);
      }
    });
    
    // Animation
    ueCard.style.opacity = '0';
    ueCard.style.transform = 'translateY(20px)';
    ueGrid.appendChild(ueCard);
    
    setTimeout(() => {
      ueCard.style.transition = 'all 0.4s ease';
      ueCard.style.opacity = '1';
      ueCard.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

// Generate UE selector dropdowns
function generateUeSelectors() {
  const selectors = [ueSelector, ueSelectorRep];
  
  selectors.forEach(selector => {
    if (!selector) return;
    
    // Clear existing options except first
    while (selector.children.length > 1) {
      selector.removeChild(selector.lastChild);
    }
    
    appData.ueList.forEach(ue => {
      const option = document.createElement('option');
      option.value = ue.id;
      option.textContent = `UE ${ue.number} - ${ue.name}`;
      selector.appendChild(option);
    });
  });
}

// Generate UE selection cards for grid view
function generateUeSelectionCards() {
  const containers = [
    { element: ueCardsContainer, section: 'annales' },
    { element: ueCardsContainerRep, section: 'repartitions' }
  ];
  
  containers.forEach(({ element, section }) => {
    if (!element) return;
    
    element.innerHTML = '';
    
    appData.ueList.forEach(ue => {
      const card = document.createElement('div');
      card.className = 'ue-selection-card';
      card.style.setProperty('--ue-color', ue.color);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Sélectionner UE ${ue.number} - ${ue.name}`);
      card.dataset.ueId = ue.id;
      
      card.innerHTML = `
        <div class="ue-selection-number">UE${ue.number}</div>
        <div class="ue-selection-name">${ue.name}</div>
      `;
      
      // Add click handler
      card.addEventListener('click', () => {
        selectUe(section, ue.id);
        toggleUeGrid(section); // Close grid after selection
      });
      
      // Add keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectUe(section, ue.id);
          toggleUeGrid(section);
        }
      });
      
      element.appendChild(card);
    });
  });
}

// Navigation functions
function toggleMobileMenu() {
  if (!navToggle || !navMenu) return;
  
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
}

function handleNavClick(e) {
  e.preventDefault();
  const target = e.target.getAttribute('href');
  if (!target) return;
  
  const sectionId = target.substring(1);
  
  // Close mobile menu
  if (navToggle && navMenu) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  
  // Update active link
  navLinks.forEach(link => link.classList.remove('active'));
  e.target.classList.add('active');
  
  // Show target section
  showSection(sectionId);
}

function initializeNavigation() {
  // Set initial active state
  const firstLink = document.querySelector('.nav-link[href="#accueil"]');
  if (firstLink) {
    firstLink.classList.add('active');
  }
}

// Section display function
function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  currentSection = sectionId;
  
  // Hide all sections first
  sections.forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    console.log('Target section found:', sectionId);
    targetSection.style.display = 'block';
    requestAnimationFrame(() => {
      targetSection.classList.add('active');
    });
  } else {
    console.error('Target section not found:', sectionId);
  }
  
  // Update URL without reloading page
  if (history.pushState) {
    history.pushState({section: sectionId}, '', `#${sectionId}`);
  }
}

// UE Selection functions
function selectUe(section, ueId) {
  if (!ueId) {
    clearUeSelection(section);
    return;
  }
  
  const ue = appData.ueList.find(u => u.id === ueId);
  if (!ue) return;
  
  if (section === 'annales') {
    selectedUeAnnales = ue;
    updateUeSelector(ueSelector, ueId);
    updateUeSelectionCards(ueCardsContainer, ueId);
    showAnnalesContent(ue);
  } else if (section === 'repartitions') {
    selectedUeRepartitions = ue;
    updateUeSelector(ueSelectorRep, ueId);
    updateUeSelectionCards(ueCardsContainerRep, ueId);
    showRepartitionsContent(ue);
  }
}

function clearUeSelection(section) {
  if (section === 'annales') {
    selectedUeAnnales = null;
    hideAnnalesContent();
    updateUeSelector(ueSelector, '');
    updateUeSelectionCards(ueCardsContainer, '');
  } else if (section === 'repartitions') {
    selectedUeRepartitions = null;
    hideRepartitionsContent();
    updateUeSelector(ueSelectorRep, '');
    updateUeSelectionCards(ueCardsContainerRep, '');
  }
}

function updateUeSelector(selector, ueId) {
  if (selector) {
    selector.value = ueId;
  }
}

function updateUeSelectionCards(container, ueId) {
  if (!container) return;
  
  const cards = container.querySelectorAll('.ue-selection-card');
  cards.forEach(card => {
    if (card.dataset.ueId === ueId) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function toggleUeGrid(section) {
  const grid = section === 'annales' ? ueSelectorGrid : ueSelectorGridRep;
  const toggle = section === 'annales' ? ueGridToggle : ueGridToggleRep;
  
  if (grid && toggle) {
    grid.classList.toggle('hidden');
    const isVisible = !grid.classList.contains('hidden');
    toggle.setAttribute('aria-expanded', isVisible);
    
    // Update toggle icon
    const icon = toggle.querySelector('.toggle-icon');
    if (icon) {
      icon.textContent = isVisible ? '⊟' : '⊞';
    }
  }
}

// Content display functions
function showAnnalesContent(ue) {
  if (!annalesPlaceholder || !annalesUeContent) return;
  
  // Hide placeholder, show content
  annalesPlaceholder.classList.add('hidden');
  annalesUeContent.classList.remove('hidden');
  
  // Update breadcrumb
  updateBreadcrumb(annalesBreadcrumb, currentUeBreadcrumb, ue);
  
  // Update UE info
  updateUeInfo(annalesUeInfo, ue);
  
  // Load annales data
  loadAnnalesData(ue);
}

function hideAnnalesContent() {
  if (annalesPlaceholder && annalesUeContent) {
    annalesUeContent.classList.add('hidden');
    annalesPlaceholder.classList.remove('hidden');
  }
  
  if (annalesBreadcrumb) {
    annalesBreadcrumb.classList.add('hidden');
  }
}

function showRepartitionsContent(ue) {
  if (!repartitionsPlaceholder || !repartitionsUeContent) return;
  
  // Hide placeholder, show content
  repartitionsPlaceholder.classList.add('hidden');
  repartitionsUeContent.classList.remove('hidden');
  
  // Update breadcrumb
  updateBreadcrumb(repartitionsBreadcrumb, currentUeBreadcrumbRep, ue);
  
  // Update UE info
  updateUeInfo(repartitionsUeInfo, ue);
  
  // Load repartitions data
  loadRepartitionsData(ue);
}

function hideRepartitionsContent() {
  if (repartitionsPlaceholder && repartitionsUeContent) {
    repartitionsUeContent.classList.add('hidden');
    repartitionsPlaceholder.classList.remove('hidden');
  }
  
  if (repartitionsBreadcrumb) {
    repartitionsBreadcrumb.classList.add('hidden');
  }
}

function updateBreadcrumb(breadcrumb, currentElement, ue) {
  if (breadcrumb && currentElement) {
    breadcrumb.classList.remove('hidden');
    currentElement.textContent = `UE ${ue.number} - ${ue.name}`;
  }
}

function updateUeInfo(infoElement, ue) {
  if (!infoElement) return;
  
  // Get availability stats for this UE
  const availability = fileAvailability[ue.id];
  const availableCount = availability ? Object.values(availability.years).filter(year => year.subject || year.correction).length : appData.years.length;
  
  infoElement.style.setProperty('--ue-color', ue.color);
  infoElement.innerHTML = `
    <div class="ue-info-title">UE ${ue.number} - ${ue.name}</div>
    <div class="ue-info-description">${ue.description}</div>
    <div class="ue-info-meta">
      <div class="ue-info-meta-item">
        <span class="ue-info-meta-value">${ue.credits}</span> crédits ECTS
      </div>
      <div class="ue-info-meta-item">
        <span class="ue-info-meta-value">${ue.duration}</span> de formation
      </div>
      <div class="ue-info-meta-item">
        <span class="ue-info-meta-value">${availableCount}</span> années disponibles
      </div>
    </div>
  `;
}

// Data loading functions
function loadAnnalesData(ue) {
  if (!annalesTableBody) return;
  
  const yearsData = generateYearsData();
  filteredYears = [...yearsData];
  
  const annalesLoader = document.getElementById('annalesLoader');
  if (annalesLoader) {
    annalesLoader.classList.remove('hidden');
  }
  
  setTimeout(() => {
    renderAnnalesTable(ue);
    if (annalesLoader) {
      annalesLoader.classList.add('hidden');
    }
  }, 300);
}

function renderAnnalesTable(ue) {
  if (!annalesTableBody) return;
  
  annalesTableBody.innerHTML = '';
  
  const availability = fileAvailability[ue.id] || {};
  
  appData.years.forEach((year, index) => {
    const row = document.createElement('tr');
    const yearAvailability = availability.years ? availability.years[year] : { subject: true, correction: true };
    
    row.innerHTML = `
      <td>${year}</td>
      <td class="pdf-cell">
        ${yearAvailability?.subject ? 
          `<button class="pdf-link" onclick="handlePdfClick('${ue.id}', 'subject', ${year})" aria-label="Ouvrir sujet ${year}">
            <span class="pdf-icon-adobe"></span>
          </button>` : 
          '<span class="unavailable">Non disponible</span>'
        }
      </td>
      <td class="pdf-cell">
        ${yearAvailability?.correction ? 
          `<button class="pdf-link" onclick="handlePdfClick('${ue.id}', 'correction', ${year})" aria-label="Ouvrir corrigé ${year}">
            <span class="pdf-icon-adobe"></span>
          </button>` : 
          '<span class="unavailable">Non disponible</span>'
        }
      </td>
    `;
    
    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    annalesTableBody.appendChild(row);
    
    setTimeout(() => {
      row.style.transition = 'all 0.3s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, index * 50);
  });
  
  // Update result count
  updateResultCount(appData.years.length);
}

function loadRepartitionsData(ue) {
  if (!repartitionsTableBody) return;
  
  setTimeout(() => {
    renderRepartitionsTable(ue);
    updateExamInfo(ue);
  }, 200);
}

function renderRepartitionsTable(ue) {
  if (!repartitionsTableBody) return;
  
  // Update table header color
  const table = repartitionsTableBody.closest('.repartitions-table');
  if (table) {
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      header.style.backgroundColor = ue.color;
    });
  }
  
  repartitionsTableBody.innerHTML = '';
  
  const topics = appData.ueTopics[ue.id] || generateSampleTopics(ue.id);
  
  topics.forEach((topic, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="topic-cell">
        <strong>${topic.name}</strong>
      </td>
      <td class="distribution-cell">
        ${formatDistribution(topic.distribution)}
      </td>
    `;
    
    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    repartitionsTableBody.appendChild(row);
    
    setTimeout(() => {
      row.style.transition = 'all 0.4s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
    }, index * 80);
  });
}

function updateExamInfo(ue) {
  if (!examInfo) return;
  
  const examDetails = document.getElementById('examDetails');
  if (!examDetails) return;
  
  examDetails.innerHTML = `
    <ul>
      <li><strong>Durée :</strong> 3 à 4 heures</li>
      <li><strong>Coefficient :</strong> 1</li>
      <li><strong>Crédits :</strong> ${ue.credits} ECTS</li>
      <li><strong>Type :</strong> Épreuve écrite portant sur l'étude d'une ou plusieurs situations pratiques</li>
    </ul>
  `;
}

function formatDistribution(distribution) {
  return distribution.split(' / ').map(part => 
    `<span class="distribution-item">${part}</span>`
  ).join(' ');
}

// Search functionality
function handleSearchInput(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  if (!selectedUeAnnales) return;
  
  const allYears = generateYearsData();
  
  if (searchTerm === '') {
    filteredYears = [...allYears];
  } else {
    filteredYears = allYears.filter(yearData => 
      yearData.year.toString().includes(searchTerm)
    );
  }
  
  renderAnnalesTable(selectedUeAnnales);
}

function updateResultCount(count) {
  if (resultCount) {
    const yearText = count === 1 ? 'année' : 'années';
    resultCount.textContent = `${count} ${yearText} disponible${count > 1 ? 's' : ''}`;
  }
}

// Modal functions
function openPdfModal(title, type, year, ueId) {
  if (!pdfModal) return;
  
  const ue = appData.ueList.find(u => u.id === ueId);
  
  if (modalTitle) modalTitle.textContent = title;
  if (modalDescription) modalDescription.textContent = `Document PDF ${ue ? `pour UE ${ue.number}` : ''} - Année ${year}`;
  
  if (downloadBtn) {
    downloadBtn.onclick = () => downloadPdf(type, year, ueId);
  }
  
  pdfModal.classList.remove('hidden');
  
  setTimeout(() => {
    if (modalClose) modalClose.focus();
  }, 100);
  
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!pdfModal) return;
  
  pdfModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function downloadPdf(type, year, ueId) {
  const ue = appData.ueList.find(u => u.id === ueId);
  showGlobalLoader('Préparation du téléchargement...');
  
  setTimeout(() => {
    hideGlobalLoader();
    closeModal();
    
    const fileName = `${ue ? `UE${ue.number}_` : ''}${type}_${year}.pdf`;
    showNotification(`Téléchargement démarré: ${fileName}`, 'success');
  }, 1000);
}

// Form handling
function handleFormSubmit(e) {
  e.preventDefault();
  
  const nameField = document.getElementById('contactName');
  const emailField = document.getElementById('contactEmail');
  const messageField = document.getElementById('contactMessage');
  
  if (!nameField || !emailField || !messageField) return;
  
  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const message = messageField.value.trim();
  
  if (!name || !email || !message) {
    showNotification('Veuillez remplir tous les champs requis.', 'error');
    return;
  }
  
  showGlobalLoader('Envoi du message...');
  
  setTimeout(() => {
    hideGlobalLoader();
    showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
    e.target.reset();
  }, 1500);
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
  if (e.key === 'Escape' && pdfModal && !pdfModal.classList.contains('hidden')) {
    closeModal();
  }
  
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
    if (e.key === 'ArrowLeft') {
      navigateSection(-1);
    } else if (e.key === 'ArrowRight') {
      navigateSection(1);
    }
  }
}

function navigateSection(direction) {
  const sectionIds = ['accueil', 'annales', 'repartitions', 'contact'];
  const currentIndex = sectionIds.indexOf(currentSection);
  let newIndex = currentIndex + direction;
  
  if (newIndex < 0) newIndex = sectionIds.length - 1;
  if (newIndex >= sectionIds.length) newIndex = 0;
  
  const targetLink = document.querySelector(`.nav-link[href="#${sectionIds[newIndex]}"]`);
  if (targetLink) {
    targetLink.click();
  }
}

// Loading states
function showGlobalLoader(message = 'Chargement...') {
  if (!globalLoader) return;
  
  const messageSpan = globalLoader.querySelector('span');
  if (messageSpan) messageSpan.textContent = message;
  globalLoader.classList.remove('hidden');
  isLoading = true;
  
  setTimeout(() => {
    if (isLoading) {
      hideGlobalLoader();
      console.warn('Global loader auto-hidden after timeout');
    }
  }, 10000);
}

function hideGlobalLoader() {
  if (globalLoader) {
    globalLoader.classList.add('hidden');
    isLoading = false;
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: var(--color-surface);
    color: var(--color-text);
    padding: 16px 20px;
    border-radius: 8px;
    border: 1px solid var(--color-card-border);
    box-shadow: var(--shadow-lg);
    z-index: 2000;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  if (type === 'success') {
    notification.style.borderLeftColor = 'var(--color-success)';
    notification.style.borderLeftWidth = '4px';
  } else if (type === 'error') {
    notification.style.borderLeftColor = 'var(--color-error)';
    notification.style.borderLeftWidth = '4px';
  }
  
  const closeBtn = notification.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--color-text-secondary);
      padding: 0;
      margin-left: auto;
    `;
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Handle browser back/forward
window.addEventListener('popstate', function(e) {
  const section = e.state?.section || 'accueil';
  
  navLinks.forEach(link => link.classList.remove('active'));
  const targetLink = document.querySelector(`.nav-link[href="#${section}"]`);
  if (targetLink) {
    targetLink.classList.add('active');
  }
  
  showSection(section);
});

// Export functions for global access
window.openPdfModal = openPdfModal;
window.closeModal = closeModal;
window.downloadPdf = downloadPdf;
window.handlePdfClick = handlePdfClick;

// Error handling
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  hideGlobalLoader();
  showNotification('Une erreur inattendue s\'est produite. Veuillez rafraîchir la page.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  hideGlobalLoader();
  showNotification('Une erreur de réseau s\'est produite.', 'error');
});