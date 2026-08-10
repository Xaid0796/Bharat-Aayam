// Configuration & News Integration
let localNewsData = null;

// ── Archive Configuration ──────────────────────────────────────
const HOMEPAGE_LIMIT = 10;          // Change to 15, 20 etc. to show more on homepage
const ARCHIVE_KEY = 'ba_archive';   // localStorage key for permanent news archive

// Translation Dictionaries
const translations = {
  en: {
    brandName: 'Bharat Aayam',
    tagline: 'Latest Indian & Global News',
    searchPlaceholder: 'Search news by title or content...',
    articlesCount: 'Articles',
    articlesCountSingle: 'Article',
    fetching: 'Fetching articles...',
    offlineMsg: 'Internet disconnected. Showing cached news.',
    retry: 'Retry',
    failedFetch: 'Failed to Fetch News',
    tryAgain: 'Try Again',
    noArticles: 'No Articles Found',
    noArticlesDesc: 'We couldn\'t find any articles matching your request. Try adjusting your search keywords or switching categories.',
    readFull: 'Read Full Article',
    shareSuccess: 'Article shared successfully.',
    copySuccess: 'Link copied to clipboard!',
    copyFail: 'Failed to copy link.',
    offlineToast: 'Internet connection lost. Displaying cached data.',
    offlineModeToast: 'Offline mode: showing cached news.',
    offlineBackupToast: 'Showing offline backup news.',
    connectionRetryToast: 'Connection still unavailable.',
    bookmarkAdded: 'Article added to bookmarks.',
    bookmarkRemoved: 'Article removed from bookmarks.',
    bookmarkedNewsTitle: 'Bookmarked News',
    bookmarkedPlaceholderTitle: 'Bookmarked News Link',
    bookmarkedPlaceholderDesc: 'This article was saved. Click Read Full Article below to open.',
    bookmarkedLinkSource: 'Bookmarked Link',
    home: 'Home',
    bookmarks: 'Bookmarks',
    copyright: '&copy; 2026 Bharat Aayam.',
    recent: 'Recent',
    justNow: 'Just now',
    minAgo: 'min ago',
    minsAgo: 'mins ago',
    hourAgo: 'hour ago',
    hoursAgo: 'hours ago',
    loadMore: 'Load More',
    // Categories
    national: 'Trendings',
    politics: 'Politics',
    sports: 'Sports',
    entertainment: 'Entertainment',
    tech: 'Tech',
    business: 'Business',
    health: 'Health',
    science: 'Science',
    world: 'World',
    headlinesSuffix: ' Headlines'
  },
  hi: {
    brandName: 'भारत आयाम',
    tagline: 'ताज़ा भारतीय और वैश्विक समाचार',
    searchPlaceholder: 'शीर्षक या सामग्री द्वारा समाचार खोजें...',
    articlesCount: 'लेख',
    articlesCountSingle: 'लेख',
    fetching: 'समाचार लोड हो रहे हैं...',
    offlineMsg: 'इंटरनेट डिस्कनेक्ट हो गया है। ऑफ़लाइन समाचार दिखाए जा रहे हैं।',
    retry: 'पुनः प्रयास',
    failedFetch: 'समाचार प्राप्त करने में विफल',
    tryAgain: 'पुनः प्रयास करें',
    noArticles: 'कोई लेख नहीं मिला',
    noArticlesDesc: 'हमें आपकी खोज से मेल खाता कोई लेख नहीं मिला। कृपया अन्य कीवर्ड आज़माएं या श्रेणी बदलें।',
    readFull: 'पूरा लेख पढ़ें',
    shareSuccess: 'लेख सफलतापूर्वक साझा किया गया।',
    copySuccess: 'लिंक क्लिपबोर्ड पर कॉपी हो गया!',
    copyFail: 'लिंक कॉपी करने में विफल।',
    offlineToast: 'इंटरनेट कनेक्शन कट गया। कैश डेटा दिखाया जा रहा है।',
    offlineModeToast: 'ऑफ़लाइन मोड: कैश किए गए समाचार दिखाए जा रहे हैं।',
    offlineBackupToast: 'ऑफ़लाइन बैकअप समाचार दिखाए जा रहे हैं।',
    connectionRetryToast: 'कनेक्शन अभी भी अनुपलब्ध है।',
    bookmarkAdded: 'लेख बुकमार्क में जोड़ा गया।',
    bookmarkRemoved: 'लेख बुकमार्क से हटाया गया।',
    bookmarkedNewsTitle: 'बुकमार्क समाचार',
    bookmarkedPlaceholderTitle: 'बुकमार्क समाचार लिंक',
    bookmarkedPlaceholderDesc: 'यह लेख सहेजा गया था। इसे खोलने के लिए नीचे पूरा लेख पढ़ें पर क्लिक करें।',
    bookmarkedLinkSource: 'बुकमार्क लिंक',
    home: 'होम',
    bookmarks: 'बुकमार्क',
    copyright: '&copy; 2026 भारत आयाम।',
    recent: 'हालिया',
    justNow: 'अभी-अभी',
    minAgo: 'मिनट पहले',
    minsAgo: 'मिनट पहले',
    hourAgo: 'घंटा पहले',
    hoursAgo: 'घंटे पहले',
    loadMore: 'और लोड करें',
    // Categories
    national: 'ट्रेंडिंग',
    politics: 'राजनीति',
    sports: 'खेल',
    entertainment: 'मनोरंजन',
    tech: 'तकनीक',
    business: 'व्यापार',
    health: 'स्वास्थ्य',
    science: 'विज्ञान',
    world: 'दुनिया',
    headlinesSuffix: ' मुख्य समाचार'
  }
};

// State Variables
let currentLang = localStorage.getItem('bp_lang') || 'en';
let currentCategory = 'national';
let loadedArticles = [];     // Store current category's loaded articles
let displayedArticles = [];  // Store currently filtered/searched articles
let bookmarkedUrls = JSON.parse(localStorage.getItem('bp_bookmarks')) || [];
let isShowingBookmarks = false;
let lazyObserver = null;

// Pagination state for infinite scroll in Trending section
let trendingPage = 1;
let isLoadingMore = false;
let hasMoreTrending = true;
// Pagination for Load More button
const BATCH_SIZE = 10;
let currentBatchSize = BATCH_SIZE;

// ── Archive State ──────────────────────────────────────────────
let archiveSelectedDate = null; // Currently selected date key in archive (YYYY-MM-DD)

// ── Archive Storage Functions ──────────────────────────────────

/** Load the full permanent archive from localStorage */
function loadArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    console.warn('Archive read error:', e);
    return [];
  }
}

/** Save the full archive array to localStorage */
function saveArchive(articles) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(articles));
  } catch(e) {
    console.warn('Archive save error (localStorage may be full):', e);
  }
}

/**
 * Merge new articles into the permanent archive.
 * Deduplicates by URL. Attaches category and dateAdded.
 * Returns the updated archive array.
 */
function mergeIntoArchive(newArticles, category) {
  const archive = loadArchive();
  const existingUrls = new Set(archive.map(a => a.url));
  let added = 0;
  const dateAdded = new Date().toISOString();

  newArticles.forEach(article => {
    if (!article.url || existingUrls.has(article.url)) return; // skip duplicate
    existingUrls.add(article.url);
    archive.push({
      ...article,
      ba_category: category,       // attach category for archive filter
      ba_dateAdded: dateAdded      // when we first saved this article
    });
    added++;
  });

  if (added > 0) {
    // Sort newest publishedAt first
    archive.sort((a, b) => {
      const da = new Date(a.publishedAt || a.ba_dateAdded).getTime();
      const db = new Date(b.publishedAt || b.ba_dateAdded).getTime();
      return db - da;
    });
    saveArchive(archive);
  }
  return archive;
}

/**
 * One-time migration: import any existing bp_gnews_data_* cache entries
 * into the permanent archive so no old news is lost.
 */
function migrateOldCacheToArchive() {
  const migrationDoneKey = 'ba_migration_done_v1';
  if (localStorage.getItem(migrationDoneKey)) return; // already done

  const categories = ['national','politics','sports','entertainment','tech','business','health','science','world'];
  const langs = ['en','hi'];
  let total = 0;

  categories.forEach(cat => {
    langs.forEach(lang => {
      const raw = localStorage.getItem(`bp_gnews_data_${cat}_${lang}`);
      if (raw) {
        try {
          const arts = JSON.parse(raw);
          if (Array.isArray(arts) && arts.length > 0) {
            mergeIntoArchive(arts, cat);
            total += arts.length;
          }
        } catch(e) {}
      }
    });
  });

  localStorage.setItem(migrationDoneKey, '1');
  if (total > 0) console.log(`Archive: migrated ${total} existing articles from old cache.`);
}

// ── Archive UI Functions ───────────────────────────────────────

/** Human-readable label for a category key */
function getCategoryLabel(cat) {
  const labels = {
    national: 'Trending',
    politics: 'Politics',
    sports: 'Sports',
    entertainment: 'Entertainment',
    tech: 'Tech',
    business: 'Business',
    health: 'Health',
    science: 'Science',
    world: 'World'
  };
  return labels[cat] || cat;
}

/** Update the archive-link-banner text to reflect the current active category */
function updateArchiveBanner() {
  const label = getCategoryLabel(currentCategory);
  const bannerP = document.querySelector('#archive-link-banner p');
  const bannerBtn = document.getElementById('archive-open-btn');
  if (bannerP) bannerP.textContent = `Looking for older ${label} news?`;
  if (bannerBtn) bannerBtn.innerHTML = `Previous ${label} Headlines &rarr;`;
}

function openArchive() {
  const label = getCategoryLabel(currentCategory);
  // Filter the full archive to show only the current category and language
  const allArchive = loadArchive();
  const catArchive = allArchive.filter(a => a.ba_category === currentCategory && (a.lang === currentLang || (!a.lang && currentLang === 'en')));

  // Update overlay header dynamically
  const headerH2 = document.querySelector('#archive-overlay .archive-header-left h2');
  if (headerH2) headerH2.textContent = `${label} Archive`;

  // Update search input placeholder dynamically
  const searchInput = document.getElementById('archive-search-input');
  if (searchInput) {
    searchInput.placeholder = `Search all ${label} headlines by title, source, or description...`;
  }

  const overlay = document.getElementById('archive-overlay');
  overlay.classList.add('open');
  // Always open with sidebar open on mobile
  overlay.classList.add('sidebar-open');

  document.body.style.overflow = 'hidden';
  document.getElementById('archive-search-input').value = '';
  archiveSelectedDate = null;
  renderArchiveSidebar(catArchive);
}

function closeArchive() {
  const overlay = document.getElementById('archive-overlay');
  overlay.classList.remove('open');
  overlay.classList.remove('sidebar-open');
  document.body.style.overflow = '';
  archiveSelectedDate = null;
}

function showArchiveSidebarOnMobile() {
  document.getElementById('archive-overlay').classList.add('sidebar-open');
}

/** Group archive articles by date (YYYY-MM-DD) and build sidebar */
function renderArchiveSidebar(articles) {
  const sidebar = document.getElementById('archive-sidebar');
  sidebar.innerHTML = '';

  if (!articles || articles.length === 0) {
    sidebar.innerHTML = '<p style="padding:20px;color:var(--text-muted);font-size:13px;">No archived articles yet. Browse news to start building your archive.</p>';
    return;
  }

  // Group by YYYY-MM-DD
  const byDate = {};
  articles.forEach(a => {
    const d = (a.publishedAt || a.ba_dateAdded || '').substring(0, 10);
    if (!d) return;
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(a);
  });

  // Sort dates descending
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  // Group by month
  const byMonth = {};
  sortedDates.forEach(dateKey => {
    const d = new Date(dateKey + 'T00:00:00');
    const monthKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const monthLabel = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!byMonth[monthKey]) byMonth[monthKey] = { label: monthLabel, dates: [] };
    byMonth[monthKey].dates.push({ dateKey, articles: byDate[dateKey] });
  });

  // Build sidebar HTML
  Object.keys(byMonth).sort((a,b) => b.localeCompare(a)).forEach(monthKey => {
    const group = byMonth[monthKey];
    const monthDiv = document.createElement('div');
    monthDiv.className = 'archive-month-group';
    monthDiv.innerHTML = `<div class="archive-month-label">${group.label}</div>`;

    group.dates.forEach(({ dateKey, articles: dateArts }) => {
      const d = new Date(dateKey + 'T00:00:00');
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      const btn = document.createElement('button');
      btn.className = 'archive-day-btn' + (archiveSelectedDate === dateKey ? ' active' : '');
      btn.dataset.dateKey = dateKey;
      btn.innerHTML = `<span>${dayLabel}</span>`;
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.archive-day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        archiveSelectedDate = dateKey;
        renderArchiveArticles(dateArts, dayLabel);
        // On mobile, hide the sidebar after selecting a date to reveal the articles
        // Only trigger this if it's a real user click (isTrusted), keeping sidebar open initially
        if (e.isTrusted) {
          document.getElementById('archive-overlay').classList.remove('sidebar-open');
        }
      });
      monthDiv.appendChild(btn);
    });

    sidebar.appendChild(monthDiv);
  });

  // Auto-select the most recent date
  if (sortedDates.length > 0 && !archiveSelectedDate) {
    const firstBtn = sidebar.querySelector('.archive-day-btn');
    if (firstBtn) firstBtn.click();
  }
}

/** Render articles for a selected date into the right panel */
function renderArchiveArticles(articles, dayLabel) {
  const panel = document.getElementById('archive-articles-panel');

  if (!articles || articles.length === 0) {
    panel.innerHTML = '<div class="archive-empty"><span>No articles found for this date.</span></div>';
    return;
  }

  panel.innerHTML = `<h3>${dayLabel} &mdash; ${articles.length} headline${articles.length !== 1 ? 's' : ''}</h3>`;

  articles.forEach(article => {
    const img = article.image || article.urlToImage;
    const cat = article.ba_category || 'news';
    const pub = article.publishedAt ? new Date(article.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
    const src = (article.source && article.source.name) ? article.source.name : 'News';

    const item = document.createElement('div');
    item.className = 'archive-article-item';
    item.innerHTML = `
      ${img ? `<img class="archive-article-thumb" src="${escapeHtml(img)}" alt="" onerror="this.style.display='none'">` : ''}
      <div class="archive-article-info">
        <div class="archive-article-cat">${escapeHtml(cat)}</div>
        <div class="archive-article-title">${escapeHtml(article.title || '')}</div>
        <div class="archive-article-meta">
          <span>${escapeHtml(src)}</span>
          ${pub ? `<span>· ${pub}</span>` : ''}
        </div>
        <a class="archive-article-link" href="${escapeHtml(article.url || '#')}" target="_blank" rel="noopener noreferrer">
          Read Article →
        </a>
      </div>
    `;
    panel.appendChild(item);
  });
}

/** Search archived articles by keyword — restricted to the current category */
function onArchiveSearch(query) {
  const q = (query || '').trim().toLowerCase();
  const label = getCategoryLabel(currentCategory);
  // Always restrict to current category and language
  const catArchive = loadArchive().filter(a => a.ba_category === currentCategory && (a.lang === currentLang || (!a.lang && currentLang === 'en')));

  if (!q) {
    // Reset to full category date-based view
    archiveSelectedDate = null;
    // On mobile, show the sidebar dates list again when search is cleared
    document.getElementById('archive-overlay').classList.add('sidebar-open');
    renderArchiveSidebar(catArchive);
    return;
  }

  // On mobile, hide the sidebar to show search results directly
  document.getElementById('archive-overlay').classList.remove('sidebar-open');

  const results = catArchive.filter(a => {
    const title = (a.title || '').toLowerCase();
    const desc = (a.description || '').toLowerCase();
    const src = ((a.source && a.source.name) || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || src.includes(q);
  });

  const sidebar = document.getElementById('archive-sidebar');
  sidebar.innerHTML = `<p style="padding:16px 20px;color:var(--text-muted);font-size:13px;">Searching ${label} archive...</p>`;
  renderArchiveArticles(results, `${label} — Search: "${query}" — ${results.length} result${results.length !== 1 ? 's' : ''}`);
}



// DOM Elements
const elements = {
  header: document.getElementById('main-header'),
  newsGrid: document.getElementById('news-grid'),
  sectionTitle: document.getElementById('section-title'),
  articleCount: document.getElementById('article-count'),
  categoryBtns: document.querySelectorAll('.category-btn'),
  categoryBar: document.getElementById('category-bar'),
  categoryBarWrapper: document.getElementById('category-bar-wrapper'),
  themeToggle: document.getElementById('theme-toggle-btn'),
  sunIcon: document.querySelector('.sun-icon'),
  moonIcon: document.querySelector('.moon-icon'),
  langToggle: document.getElementById('lang-toggle-btn'),
  langToggleText: document.getElementById('lang-toggle-text'),
  searchToggle: document.getElementById('search-toggle-btn'),
  searchDrawer: document.getElementById('search-drawer'),
  searchField: document.getElementById('search-field'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  bookmarkToggle: document.getElementById('bookmark-toggle-btn'),
  offlineBanner: document.getElementById('offline-banner'),
  scrollToTopBtn: document.getElementById('scroll-to-top'),
  progressIndicator: document.getElementById('progress-indicator'),
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),
  brandLogoImg: document.getElementById('brand-logo-img'),
  brandLogoFallback: document.getElementById('brand-logo-fallback'),
  loadMoreBtn: document.getElementById('load-more-btn'),
};

// SVG Placeholder Content for missing images
const SVG_PLACEHOLDER = `
  <svg class="news-img-fallback" viewBox="0 0 400 225" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="svg-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF9933" stop-opacity="0.12"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#138808" stop-opacity="0.12"/>
      </linearGradient>
    </defs>
    <rect width="400" height="225" fill="url(#svg-pulse-grad)"/>
    <circle cx="200" cy="95" r="35" fill="none" stroke="var(--primary)" stroke-width="2" stroke-dasharray="6 6" opacity="0.3"/>
    <!-- Pulse graphic -->
    <path d="M130 110 h30 l15 -35 l15 65 l12 -45 l8 15 h60" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <text x="200" y="165" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" fill="var(--text-muted)" text-anchor="middle" opacity="0.5">BHARAT AAYAM</text>
    <text x="200" y="185" font-family="'Inter', sans-serif" font-size="10" font-weight="500" fill="var(--text-muted)" text-anchor="middle" opacity="0.4">No image available</text>
  </svg>
`;

// -------------------------------------------------------------
// Core Application Initialization
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initLazyLoader();
  registerEventListeners();
  checkOnlineStatus();
  migrateOldCacheToArchive(); // One-time import of existing cached articles
  loadNews(currentCategory);
  updateArchiveBanner(); // Initialize archive banner text for the active category
});

// Handle logo image failure (fallback to CSS badge)
function handleLogoError() {
  elements.brandLogoImg.style.display = 'none';
  elements.brandLogoFallback.style.display = 'flex';
}

// Reset view to main headlines
function resetToHome(e) {
  if (e) e.preventDefault();
  
  // Close search drawer if open
  elements.searchDrawer.classList.remove('open');
  elements.searchToggle.classList.remove('active');
  elements.searchField.value = '';
  elements.clearSearchBtn.classList.remove('show');
  
  // Reset bookmark status
  elements.bookmarkToggle.classList.remove('active');
  isShowingBookmarks = false;

  // Select general/national category
  switchCategory('national');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// -------------------------------------------------------------
// Event Listeners Registration
// -------------------------------------------------------------
function registerEventListeners() {
  // Category selection click
  elements.categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      switchCategory(category);
    });
  });

  // Sticky header background styling when scrolling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      elements.header.classList.add('scrolled');
    } else {
      elements.header.classList.remove('scrolled');
    }
  });

  // Scroll Progress & Scroll-to-Top Button
  initScrollProgress();

  // Theme toggle button
  elements.themeToggle.addEventListener('click', toggleTheme);

// Language switcher button
  elements.langToggle.addEventListener('click', toggleLanguage);
  
  // Load More button — show next batch, fetch from API if needed
  elements.loadMoreBtn.addEventListener('click', async () => {
    currentBatchSize += BATCH_SIZE;
    if (currentBatchSize <= displayedArticles.length) {
      // We already have enough loaded articles, just render more
      renderNews(displayedArticles);
    } else {
      // Need to fetch more from API
      elements.loadMoreBtn.textContent = 'Loading...';
      elements.loadMoreBtn.disabled = true;
      await loadMoreTrending();
      elements.loadMoreBtn.textContent = '🔄 Load More Articles';
      elements.loadMoreBtn.disabled = false;
    }
  });

  // Search bar toggling
  elements.searchToggle.addEventListener('click', () => {
    const isOpen = elements.searchDrawer.classList.toggle('open');
    elements.searchToggle.classList.toggle('active', isOpen);
    if (isOpen) {
      elements.searchField.focus();
    } else {
      elements.searchField.focus();
      applyFilters();
    }
  });

  // Real-time search input filtering
  elements.searchField.addEventListener('input', () => {
    const hasValue = elements.searchField.value.trim().length > 0;
    elements.clearSearchBtn.classList.toggle('show', hasValue);
    applyFilters();
  });

  // Clear search input action
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchField.value = '';
    elements.clearSearchBtn.classList.remove('show');
    elements.searchField.focus();
    applyFilters();
  });

  // Bookmarks page toggle
  elements.bookmarkToggle.addEventListener('click', () => {
    isShowingBookmarks = !isShowingBookmarks;
    elements.bookmarkToggle.classList.toggle('active', isShowingBookmarks);
    
    if (isShowingBookmarks) {
      // Deactivate categories look
      elements.categoryBtns.forEach(btn => btn.classList.remove('active'));
      showBookmarksOnly();
    } else {
      // Restore active category
      switchCategory(currentCategory);
    }
  });

  // Category menu horizontal scroll margins (fading edges layout)
  elements.categoryBar.addEventListener('scroll', updateScrollIndicators);
  window.addEventListener('resize', updateScrollIndicators);
  setTimeout(updateScrollIndicators, 300); // Wait for fonts/layout

  // Browser online / offline listeners
  window.addEventListener('online', checkOnlineStatus);
  window.addEventListener('offline', checkOnlineStatus);
}

// -------------------------------------------------------------
// News Fetching & Data Parsing
// -------------------------------------------------------------
async function loadNews(category) {
  if (isShowingBookmarks) {
    isShowingBookmarks = false;
    elements.bookmarkToggle.classList.remove('active');
  }

  currentCategory = category;
  renderSkeletons();
  
  updateSectionTitleText();
  elements.articleCount.textContent = translations[currentLang].fetching;

  try {
    if (!localNewsData) {
      const response = await fetch('./news.json');
      if (!response.ok) throw new Error('Failed to load news database.');
      localNewsData = await response.json();
    }

    const articles = (localNewsData[currentLang] && localNewsData[currentLang][category]) || [];

    if (articles.length > 0) {
      mergeIntoArchive(articles, category);
    }

    if (articles.length === 0) {
      const categoryArchive = loadArchive().filter(a => a.ba_category === category && (a.lang === currentLang || (!a.lang && currentLang === 'en')));
      loadedArticles = categoryArchive.slice(0, HOMEPAGE_LIMIT);
    } else {
      loadedArticles = articles.slice(0, HOMEPAGE_LIMIT);
    }

    applyFilters();
    
  } catch (err) {
    console.error('Error fetching news:', err);
    
    const categoryArchive = loadArchive().filter(a => a.ba_category === category && (a.lang === currentLang || (!a.lang && currentLang === 'en')));
    if (categoryArchive.length > 0) {
      loadedArticles = categoryArchive.slice(0, HOMEPAGE_LIMIT);
      showToast(translations[currentLang].offlineModeToast);
      applyFilters();
    } else {
      renderErrorState(err.message || 'Unable to load news. Check your connection.');
    }
  }
}

async function loadMoreTrending() {
  hasMoreTrending = false;
  elements.loadMoreBtn.parentElement.style.display = 'none';
  return;
}

function appendInfiniteLoader() {
  if (document.getElementById('infinite-scroll-loader')) return;
  const loader = document.createElement('div');
  loader.id = 'infinite-scroll-loader';
  loader.style.gridColumn = '1 / -1';
  loader.style.width = '100%';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.padding = '30px';
  loader.innerHTML = `
    <div class="loading-spinner" style="border: 3px solid var(--border-color); border-top: 3px solid var(--primary); border-radius: 50%; width: 30px; height: 30px; animation: infinite-spin 1s linear infinite;"></div>
  `;
  elements.newsGrid.appendChild(loader);

  if (!document.getElementById('infinite-spin-keyframes')) {
    const style = document.createElement('style');
    style.id = 'infinite-spin-keyframes';
    style.textContent = `
      @keyframes infinite-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function removeInfiniteLoader() {
  const loader = document.getElementById('infinite-scroll-loader');
  if (loader) loader.remove();
}

function switchCategory(category) {
  elements.categoryBtns.forEach(btn => {
    const active = btn.getAttribute('data-category') === category;
    btn.classList.toggle('active', active);
    
    if (active) {
      // Center the button in category-bar viewport
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  // Reset pagination states
  trendingPage = 1;
  hasMoreTrending = true;
  isLoadingMore = false;
  // Reset Load More batch size
  currentBatchSize = BATCH_SIZE;
  loadNews(category);
  // Update the archive banner to reflect the new category
  updateArchiveBanner();
}

// Cache news locally for offline access
function cacheArticlesLocally(category, articles) {
  try {
    localStorage.setItem(`bp_cache_${category}_${currentLang}`, JSON.stringify(articles));
  } catch (e) {
    console.warn('Failed caching news: localStorage quota full.', e);
  }
}

// -------------------------------------------------------------
// Display / Rendering Logic
// -------------------------------------------------------------
function renderNews(articles) {
  elements.newsGrid.innerHTML = '';
  
  if (!articles || articles.length === 0) {
    renderEmptyState();
    return;
  }

  const visibleArticles = articles.slice(0, currentBatchSize);

  visibleArticles.forEach((article, index) => {
    cacheArticleObject(article);

    const isBookmarked = bookmarkedUrls.includes(article.url);
    const imageSrc = article.image || article.urlToImage;
    const card = document.createElement('article');
    card.className = 'news-card';
    card.style.animationDelay = `${(index % 6) * 0.08}s`;

    card.innerHTML = `
      <div class="card-image-wrapper">
        ${imageSrc ? 
          `<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9'></svg>" data-src="${imageSrc}" class="news-img lazy-image" alt="News article Image" onerror="this.outerHTML=SVG_PLACEHOLDER">` 
          : SVG_PLACEHOLDER
        }
        <div class="card-badge">${escapeHtml(article.source.name || 'News')}</div>
        <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-url="${article.url}" onclick="toggleBookmark(event, '${escapeJs(article.url)}')" aria-label="Bookmark article">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="card-date">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${formatDate(article.publishedAt)}
          </span>
          <button class="share-btn" onclick="shareArticle(event, '${escapeJs(article.title)}', '${escapeJs(article.url)}')" aria-label="Share article" title="Share article">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
        <h3 class="card-title">${escapeHtml(article.title)}</h3>
        <p class="card-desc">${escapeHtml(article.description || (currentLang === 'en' ? 'Stay tuned to Bharat Aayam for live reports and full analyses on this breaking topic.' : 'इस ताज़ा खबर पर लाइव रिपोर्ट और पूर्ण विश्लेषण के लिए भारत आयाम के साथ बने रहें।'))}</p>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
          <span>${translations[currentLang].readFull}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `;
    
    elements.newsGrid.appendChild(card);
  });

  // Lazy observe the newly appended images
  observeLazyImages();
  // Always hide Load More button on the homepage since it is strictly capped to HOMEPAGE_LIMIT (10)
  elements.loadMoreBtn.parentElement.style.display = 'none';
}

// Render skeleton loaders for a modern loading feel
function renderSkeletons() {
  elements.newsGrid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-title-2"></div>
        <div class="skeleton-line skeleton-desc-1" style="margin-top: 10px;"></div>
        <div class="skeleton-line skeleton-desc-2"></div>
        <div class="skeleton-line skeleton-desc-3"></div>
        <div class="skeleton-line skeleton-btn"></div>
      </div>
    `;
    elements.newsGrid.appendChild(skeleton);
  }
}

function renderErrorState(message) {
  elements.newsGrid.innerHTML = `
    <div class="fallback-state">
      <div class="fallback-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.5"></path>
          <path d="M5 12.5a10.94 10.94 0 0 1 5.83-2.84"></path>
          <path d="M7.07 14.57a7.43 7.43 0 0 1 1.95-1.57"></path>
          <path d="M16.24 16.24a7.4 7.4 0 0 1-5.12 1.35"></path>
          <path d="M10.25 18.5a3.63 3.63 0 0 1 3.5 0"></path>
        </svg>
      </div>
      <h3>${translations[currentLang].failedFetch}</h3>
      <p>${escapeHtml(message)}</p>
      <button class="retry-btn" onclick="retryFetch()">${translations[currentLang].tryAgain}</button>
    </div>
  `;
  elements.articleCount.textContent = currentLang === 'en' ? 'Error' : 'त्रुटि';
}

function renderEmptyState() {
  elements.newsGrid.innerHTML = `
    <div class="fallback-state">
      <div class="fallback-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h3>${translations[currentLang].noArticles}</h3>
      <p>${translations[currentLang].noArticlesDesc}</p>
    </div>
  `;
}

function retryFetch() {
  if (isShowingBookmarks) {
    showBookmarksOnly();
  } else {
    loadNews(currentCategory);
  }
}

// -------------------------------------------------------------
// Advanced Filters & Search
// -------------------------------------------------------------
function applyFilters() {
  const searchVal = elements.searchField.value.trim().toLowerCase();
  let filtered = [...loadedArticles];

  // If viewing bookmarks
  if (isShowingBookmarks) {
    filtered = getBookmarkedArticles();
  } else {
    // Cache successful non-bookmark lists online
    if (filtered.length > 0) {
      cacheArticlesLocally(currentCategory, filtered);
    }
  }

  // Filter by search text if input is active
  if (searchVal.length > 0) {
    filtered = filtered.filter(article => {
      const titleText = (article.title || '').toLowerCase();
      const descText = (article.description || '').toLowerCase();
      const sourceText = (article.source.name || '').toLowerCase();
      return titleText.includes(searchVal) || descText.includes(searchVal) || sourceText.includes(searchVal);
    });
  }

  displayedArticles = filtered;
  currentBatchSize = BATCH_SIZE; // Reset to first 10 when filters change
  renderNews(displayedArticles);
}

// -------------------------------------------------------------
// Bookmarking Core Logic
// -------------------------------------------------------------
function showBookmarksOnly() {
  isShowingBookmarks = true;
  elements.bookmarkToggle.classList.add('active');
  
  updateSectionTitleText();
  
  // De-select category navigation visually
  elements.categoryBtns.forEach(btn => btn.classList.remove('active'));

  applyFilters();
}

function toggleBookmark(event, articleUrl) {
  event.preventDefault();
  event.stopPropagation();

  const btn = event.currentTarget;
  const index = bookmarkedUrls.indexOf(articleUrl);

  if (index === -1) {
    // Save to bookmarks list
    bookmarkedUrls.push(articleUrl);
    btn.classList.add('active');
    showToast(translations[currentLang].bookmarkAdded);
  } else {
    // Remove from list
    bookmarkedUrls.splice(index, 1);
    btn.classList.remove('active');
    showToast(translations[currentLang].bookmarkRemoved);
    
    // If currently viewing bookmarks tab, remove item from view immediately
    if (isShowingBookmarks) {
      applyFilters();
    }
  }

  localStorage.setItem('bp_bookmarks', JSON.stringify(bookmarkedUrls));
}

// Helpers to store full article content for offline bookmarks view
function cacheArticleObject(article) {
  try {
    localStorage.setItem(`bp_art_${article.url}`, JSON.stringify(article));
  } catch (e) {
    // Quota warnings ignored
  }
}

function getBookmarkedArticles() {
  const articles = [];
  bookmarkedUrls.forEach(url => {
    const data = localStorage.getItem(`bp_art_${url}`);
    if (data) {
      articles.push(JSON.parse(data));
    } else {
      // Placeholder article representation if details aren't stored
      articles.push({
        title: currentLang === 'en' ? 'Bookmarked News Link' : 'बुकमार्क समाचार लिंक',
        description: currentLang === 'en' ? 'This article was saved. Click Read Full Article below to open.' : 'यह लेख सहेजा गया था। इसे खोलने के लिए नीचे पूरा लेख पढ़ें पर क्लिक करें।',
        url: url,
        source: { name: currentLang === 'en' ? 'Bookmarked Link' : 'बुकमार्क लिंक' },
        publishedAt: new Date().toISOString(),
        urlToImage: null
      });
    }
  });
  
  // Sort bookmarks newest first
  return articles.reverse();
}

// -------------------------------------------------------------
// Language Toggle Implementations
// -------------------------------------------------------------
function initLanguage() {
  elements.langToggle.classList.toggle('active', currentLang === 'hi');
  elements.langToggleText.textContent = currentLang === 'en' ? 'हिं' : 'EN';
  elements.langToggle.title = currentLang === 'en' ? 'Translate to Hindi' : 'अंग्रेजी में अनुवाद करें';
  updateUiLanguage();
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('bp_lang', currentLang);
  
  elements.langToggle.classList.toggle('active', currentLang === 'hi');
  elements.langToggleText.textContent = currentLang === 'en' ? 'हिं' : 'EN';
  elements.langToggle.title = currentLang === 'en' ? 'Translate to Hindi' : 'अंग्रेजी में अनुवाद करें';
  
  updateUiLanguage();
  
  if (isShowingBookmarks) {
    showBookmarksOnly();
  } else {
    loadNews(currentCategory);
  }
}

function updateUiLanguage() {
  const trans = translations[currentLang];
  
  document.title = `${trans.brandName} - ${trans.tagline}`;
  
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute('content', `Get real-time, curated Indian news from ${trans.brandName}. Stay updated on national politics, sports, entertainment, tech, business, and global events.`);
  }
  
  const titleEl = document.querySelector('.brand-title');
  if (titleEl) {
    titleEl.childNodes[0].textContent = trans.brandName;
  }
  
  elements.brandLogoImg.alt = `${trans.brandName} Logo`;
  elements.brandLogoFallback.textContent = currentLang === 'en' ? 'BA' : 'भाआ';
  elements.searchField.placeholder = trans.searchPlaceholder;
  
  elements.categoryBtns.forEach(btn => {
    const cat = btn.getAttribute('data-category');
    btn.innerHTML = trans[cat];
  });

  updateSectionTitleText();

  const offlineSpan = elements.offlineBanner.querySelector('span');
  if (offlineSpan) offlineSpan.textContent = trans.offlineMsg;
  const offlineBtn = elements.offlineBanner.querySelector('button');
  if (offlineBtn) offlineBtn.textContent = trans.retry;
  
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) footerLogo.textContent = trans.brandName;
  
  const footerLinkHome = document.getElementById('footer-link-home');
  if (footerLinkHome) footerLinkHome.textContent = trans.home;
  const footerLinkBookmarks = document.getElementById('footer-link-bookmarks');
  if (footerLinkBookmarks) footerLinkBookmarks.textContent = trans.bookmarks;

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) loadMoreBtn.textContent = trans.loadMore;

  const copyrightEl = document.querySelector('.copyright');
  if (copyrightEl) copyrightEl.innerHTML = trans.copyright;
}

function updateSectionTitleText() {
  const trans = translations[currentLang];
  if (isShowingBookmarks) {
    elements.sectionTitle.textContent = trans.bookmarkedNewsTitle;
  } else {
    const rawCat = trans[currentCategory];
    let cleanCat = rawCat.replace(/^[^\s]+\s+/, '');
    if (currentCategory === 'national' && currentLang === 'en') {
      cleanCat = 'Trending';
    }
    elements.sectionTitle.textContent = cleanCat + trans.headlinesSuffix;
  }
}

// -------------------------------------------------------------
// Custom Lazy Loader Implementation
// -------------------------------------------------------------
function initLazyLoader() {
  if ('IntersectionObserver' in window) {
    lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '100px 0px', // Fetch slightly before coming into view
      threshold: 0.01
    });
  }
}

function observeLazyImages() {
  const lazyImages = document.querySelectorAll('.lazy-image');
  if (lazyObserver) {
    lazyImages.forEach(img => lazyObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

// -------------------------------------------------------------
// Scroll Behavior & Progress Indicator Ring
// -------------------------------------------------------------
function initScrollProgress() {
  const circle = elements.progressIndicator;
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  // Handle resize calculations on circumference
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Division by 0 guard
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollTop > 300) {
      elements.scrollToTopBtn.classList.add('visible');
    } else {
      elements.scrollToTopBtn.classList.remove('visible');
    }

    setProgress(Math.min(scrollPercent, 100));
  });

  // Smooth scroll back to top on click
  elements.scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// -------------------------------------------------------------
// Dynamic Fading Margins for Categories Navigation
// -------------------------------------------------------------
function updateScrollIndicators() {
  const el = elements.categoryBar;
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  
  const wrapper = elements.categoryBarWrapper;
  // Is there scroll room left?
  wrapper.classList.toggle('can-scroll-left', el.scrollLeft > 5);
  // Is there scroll room right?
  wrapper.classList.toggle('can-scroll-right', el.scrollLeft < maxScrollLeft - 5);
}

// -------------------------------------------------------------
// Theme Management
// -------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('bp_theme');
  
  // Default always to light theme unless explicitly savedTheme is 'dark'
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    elements.sunIcon.style.display = 'block';
    elements.moonIcon.style.display = 'none';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    elements.sunIcon.style.display = 'none';
    elements.moonIcon.style.display = 'block';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Perform rotate animation trigger
  const svg = elements.themeToggle.querySelector('svg:not([style*="display: none"])');
  if (svg) svg.style.transform = 'scale(0.8) rotate(90deg)';

  setTimeout(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('bp_theme', 'light');
      elements.sunIcon.style.display = 'none';
      elements.moonIcon.style.display = 'block';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('bp_theme', 'dark');
      elements.sunIcon.style.display = 'block';
      elements.moonIcon.style.display = 'none';
    }
    // Reset scale/rotation style
    elements.themeToggle.querySelectorAll('svg').forEach(icon => icon.style.transform = '');
  }, 150);
}

// -------------------------------------------------------------
// Offline Banner Status Checks
// -------------------------------------------------------------
function checkOnlineStatus() {
  if (navigator.onLine) {
    elements.offlineBanner.classList.remove('active');
  } else {
    elements.offlineBanner.classList.add('active');
    showToast(translations[currentLang].offlineToast);
  }
}

function checkConnectionRetry() {
  if (navigator.onLine) {
    checkOnlineStatus();
    retryFetch();
  } else {
    showToast(translations[currentLang].connectionRetryToast);
  }
}

// -------------------------------------------------------------
// Web Share API & Link Copying
// -------------------------------------------------------------
function shareArticle(event, title, url) {
  event.preventDefault();
  event.stopPropagation();

  const shareText = currentLang === 'en' ? `Check out this news on Bharat Aayam: ${title}` : `भारत आयाम पर यह समाचार देखें: ${title}`;

  if (navigator.share) {
    navigator.share({
      title: title,
      text: shareText,
      url: url
    }).then(() => {
      showToast(translations[currentLang].shareSuccess);
    }).catch(err => {
      // If share cancelled or errored
      console.log('Share action skipped: ', err);
    });
  } else {
    // Fallback to Clipboard copy
    navigator.clipboard.writeText(url).then(() => {
      showToast(translations[currentLang].copySuccess);
    }).catch(err => {
      showToast(translations[currentLang].copyFail);
    });
  }
}

// -------------------------------------------------------------
// Helper & Formatting Utilities
// -------------------------------------------------------------
function showToast(message) {
  elements.toastMessage.textContent = message;
  elements.toast.classList.add('show');
  
  // Auto dismiss
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 3000);
}

function formatDate(dateString) {
  if (!dateString) return translations[currentLang].recent;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return translations[currentLang].recent;

  // Smart relative time display
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  // Handle potential timezone/future adjustments
  if (diffMins < 1) return translations[currentLang].justNow;
  if (diffMins < 60) return `${diffMins} ${translations[currentLang][diffMins > 1 ? 'minsAgo' : 'minAgo']}`;
  if (diffHours < 24) return `${diffHours} ${translations[currentLang][diffHours > 1 ? 'hoursAgo' : 'hourAgo']}`;

  // Absolute date formatter fallback
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// Clean text strings before injecting dynamically
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Escape characters safely inside inline quotes inside DOM elements
function escapeJs(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}
