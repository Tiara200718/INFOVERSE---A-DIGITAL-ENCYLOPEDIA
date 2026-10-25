/**
 * INFOVERSE ENCYCLOPEDIA & DISCOVERY ENGINE (MODULE 2 & 3)
 * Handles:
 * - Module 2: Category Taxonomy, Real-time Search Engine & Auto-suggest Dropdown
 * - Module 3: Information Display Module (Structured text layout, headings, supporting images,
 *             interactive Table of Contents, typography scaling, line-height controls,
 *             Web Speech API Read Aloud, and continuous topic navigation)
 */

class InfoVerseEncyclopedia {
  constructor() {
    this.db = window.infoVerseDB;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentReaderArticle = null;
    this.currentDisplayArticleId = 'art-001';
    
    // Web Speech API
    this.speechSynth = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentUtterance = null;
    
    // Typography state
    this.currentFontSize = 18; // base px
    this.displayFontSize = 18;
    this.displayFontFamily = 'serif';
    this.displayLineSpacing = 'comfortable';

    this.init();
  }

  init() {
    this.renderArticles();
    this.renderTrendingTags();
    this.initInformationDisplayModule();
    this.initContentManagementModule();
    this.bindEvents();
  }

  bindEvents() {
    // Category Tabs
    document.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.getAttribute('data-category');
        
        // Sync search dropdown if present
        const categorySelect = document.getElementById('search-category-filter');
        if (categorySelect) {
          categorySelect.value = this.currentCategory;
        }

        this.renderArticles();

        // Navigate directly to encyclopedia information display
        if (this.currentCategory !== 'all') {
          const articles = this.db.getArticles();
          const match = articles.find(a => a.categorySlug === this.currentCategory || a.category === this.currentCategory);
          if (match) {
            this.loadTopicIntoDisplay(match.id, true);
          }
        }
      });
    });

    // Search Input Real-time Filter, Enter Key Direct Jump & Auto-suggest
    const searchInput = document.getElementById('hero-search-input');
    const categorySelect = document.getElementById('search-category-filter');
    const suggestionsBox = document.getElementById('search-suggestions');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.handleSearchSuggestions(e.target.value);
        this.renderArticles();
      });

      // Direct Jump to matching topic when user presses Enter
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const filtered = this.getFilteredArticles();
          if (filtered.length > 0) {
            this.loadTopicIntoDisplay(filtered[0].id, true);
            if (suggestionsBox) suggestionsBox.classList.remove('active');
            if (window.showToast) {
              window.showToast('Topic Found', `Displaying "${filtered[0].title}" in Encyclopedia`, '📖');
            }
          }
        }
      });

      // Search button icon click
      const searchBtn = document.getElementById('hero-search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          const filtered = this.getFilteredArticles();
          if (filtered.length > 0) {
            this.loadTopicIntoDisplay(filtered[0].id, true);
            if (suggestionsBox) suggestionsBox.classList.remove('active');
            if (window.showToast) {
              window.showToast('Topic Found', `Displaying "${filtered[0].title}" in Encyclopedia`, '📖');
            }
          }
        });
      }

      searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
          if (suggestionsBox) suggestionsBox.classList.add('active');
        }
      });

      // Close suggestion on click outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && suggestionsBox) {
          suggestionsBox.classList.remove('active');
        }
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        // Sync tabs if matches
        document.querySelectorAll('.category-tab-btn').forEach(btn => {
          if (btn.getAttribute('data-category') === this.currentCategory) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        this.renderArticles();

        // Directly jump to encyclopedia topic in this discipline and show information
        const articles = this.db.getArticles();
        let match = null;
        if (this.currentCategory !== 'all') {
          match = articles.find(a => a.categorySlug === this.currentCategory || a.category === this.currentCategory);
        } else if (articles.length > 0) {
          match = articles[0];
        }

        if (match) {
          this.loadTopicIntoDisplay(match.id, true);
          if (window.showToast) {
            window.showToast(`Discipline Selected: ${match.category}`, `Displaying "${match.title}" in Encyclopedia`, '📚');
          }
        }
      });
    }

    // Article Reader Modal Close
    const closeReaderBtn = document.getElementById('reader-modal-close');
    const readerOverlay = document.getElementById('reader-modal');
    if (closeReaderBtn) {
      closeReaderBtn.addEventListener('click', () => this.closeArticleReader());
    }
    if (readerOverlay) {
      readerOverlay.addEventListener('click', (e) => {
        if (e.target === readerOverlay) this.closeArticleReader();
      });
    }

    // Reader Text-To-Speech Button
    const ttsBtn = document.getElementById('reader-tts-btn');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => this.toggleTextToSpeech());
    }

    // Reader Font Size Buttons
    const fontIncBtn = document.getElementById('reader-font-inc');
    const fontDecBtn = document.getElementById('reader-font-dec');
    if (fontIncBtn && fontDecBtn) {
      fontIncBtn.addEventListener('click', () => this.changeFontSize(2));
      fontDecBtn.addEventListener('click', () => this.changeFontSize(-2));
    }
  }

  // ==========================================================================
  // MODULE 3: INFORMATION DISPLAY MODULE INITIALIZATION & CONTROLS
  // ==========================================================================
  initInformationDisplayModule() {
    const topicSelect = document.getElementById('display-topic-select');
    const articles = this.db.getArticles();

    if (topicSelect) {
      // Group articles by category in dropdown
      const categories = [
        { label: 'Computer Science & AI', slug: 'cs-ai' },
        { label: 'World History', slug: 'history' },
        { label: 'Astrophysics & Space', slug: 'space' },
        { label: 'Natural Sciences', slug: 'science' },
        { label: 'Philosophy & Literature', slug: 'philosophy' }
      ];

      topicSelect.innerHTML = categories.map(cat => {
        const catArticles = articles.filter(a => a.categorySlug === cat.slug);
        return `
          <optgroup label="${cat.label}">
            ${catArticles.map(a => `<option value="${a.id}">${a.title}</option>`).join('')}
          </optgroup>
        `;
      }).join('');

      topicSelect.addEventListener('change', (e) => {
        this.loadTopicIntoDisplay(e.target.value, false);
      });
    }

    // Typography Controls in Information Display Module
    const dispFontInc = document.getElementById('display-font-inc');
    const dispFontDec = document.getElementById('display-font-dec');
    const dispFontVal = document.getElementById('display-font-val');
    const dispContent = document.getElementById('display-article-content');

    if (dispFontInc && dispFontDec && dispContent) {
      dispFontInc.addEventListener('click', () => {
        this.displayFontSize = Math.min(26, this.displayFontSize + 2);
        dispContent.style.fontSize = `${this.displayFontSize}px`;
        if (dispFontVal) dispFontVal.textContent = `${this.displayFontSize}px`;
      });

      dispFontDec.addEventListener('click', () => {
        this.displayFontSize = Math.max(14, this.displayFontSize - 2);
        dispContent.style.fontSize = `${this.displayFontSize}px`;
        if (dispFontVal) dispFontVal.textContent = `${this.displayFontSize}px`;
      });
    }

    // Font Family Switches (Serif vs Sans)
    const fontSerifBtn = document.getElementById('display-font-serif');
    const fontSansBtn = document.getElementById('display-font-sans');

    if (fontSerifBtn && fontSansBtn && dispContent) {
      fontSerifBtn.addEventListener('click', () => {
        fontSerifBtn.classList.add('active');
        fontSansBtn.classList.remove('active');
        dispContent.classList.remove('font-sans');
        this.displayFontFamily = 'serif';
      });

      fontSansBtn.addEventListener('click', () => {
        fontSansBtn.classList.add('active');
        fontSerifBtn.classList.remove('active');
        dispContent.classList.add('font-sans');
        this.displayFontFamily = 'sans';
      });
    }

    // Line Spacing Controls (Comfortable 1.85 vs Compact 1.55)
    const spacingComfBtn = document.getElementById('display-spacing-comf');
    const spacingCompBtn = document.getElementById('display-spacing-comp');

    if (spacingComfBtn && spacingCompBtn && dispContent) {
      spacingComfBtn.addEventListener('click', () => {
        spacingComfBtn.classList.add('active');
        spacingCompBtn.classList.remove('active');
        dispContent.style.lineHeight = '1.85';
      });

      spacingCompBtn.addEventListener('click', () => {
        spacingCompBtn.classList.add('active');
        spacingComfBtn.classList.remove('active');
        dispContent.style.lineHeight = '1.55';
      });
    }

    // Display Module Text-To-Speech Button
    const dispTtsBtn = document.getElementById('display-tts-btn');
    if (dispTtsBtn) {
      dispTtsBtn.addEventListener('click', () => this.toggleDisplayAudioReader());
    }

    // Display Module Bookmark Button
    const dispBookmarkBtn = document.getElementById('display-bookmark-btn');
    if (dispBookmarkBtn) {
      dispBookmarkBtn.addEventListener('click', (e) => {
        this.handleBookmarkClick(this.currentDisplayArticleId, e);
        this.updateDisplayBookmarkState();
      });
    }

    // Display Module Modal Expand Button
    const dispModalBtn = document.getElementById('display-modal-expand-btn');
    if (dispModalBtn) {
      dispModalBtn.addEventListener('click', () => {
        this.openArticleReader(this.currentDisplayArticleId);
      });
    }

    // Previous & Next Topic Navigators
    const prevBtn = document.getElementById('display-prev-topic-btn');
    const nextBtn = document.getElementById('display-next-topic-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateAdjacentTopic(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateAdjacentTopic(1));
    }

    // Scroll Reading Progress Listener
    window.addEventListener('scroll', () => {
      this.updateReadingProgress();
    });

    // Load initial article into Display Module
    this.loadTopicIntoDisplay('art-001', false);
  }

  loadTopicIntoDisplay(articleId, scrollIntoView = false) {
    const article = this.db.getArticleById(articleId);
    if (!article) return;

    this.currentDisplayArticleId = articleId;

    // 1. Populate Header & Badges
    const badgeCategory = document.getElementById('display-badge-category');
    const badgeTag = document.getElementById('display-badge-tag');
    const badgeDate = document.getElementById('display-badge-date');
    const titleEl = document.getElementById('display-article-title');
    const summaryEl = document.getElementById('display-article-summary');

    if (badgeCategory) badgeCategory.textContent = article.category;
    if (badgeTag) badgeTag.textContent = article.tag;
    if (badgeDate) badgeDate.textContent = article.date;
    if (titleEl) titleEl.textContent = article.title;
    if (summaryEl) summaryEl.textContent = article.summary;

    // 2. Author and Read Stats
    const authorNameEl = document.getElementById('display-author-name');
    const authorRoleEl = document.querySelector('.display-author-role');
    const readTimeEl = document.getElementById('display-read-time');
    const levelEl = document.getElementById('display-level');

    if (authorNameEl) authorNameEl.textContent = article.author;
    if (authorRoleEl && article.affiliation) authorRoleEl.textContent = article.affiliation;
    if (readTimeEl) readTimeEl.textContent = `⏳ ${article.readTime}`;
    if (levelEl) levelEl.textContent = `Level: ${article.difficulty}`;

    // 3. Sidebar Metadata
    const sbCat = document.getElementById('display-sidebar-category');
    const sbDiff = document.getElementById('display-sidebar-difficulty');
    const sbTime = document.getElementById('display-sidebar-time');
    const sbAuthor = document.getElementById('display-sidebar-author');

    if (sbCat) sbCat.textContent = article.category;
    if (sbDiff) sbDiff.textContent = article.difficulty;
    if (sbTime) sbTime.textContent = article.readTime;
    if (sbAuthor) sbAuthor.textContent = article.author;

    // 4. Supporting Image & Caption & Schematics
    const imgEl = document.getElementById('display-article-image');
    const captionEl = document.getElementById('display-figure-caption');
    const badgeImg = document.getElementById('display-img-badge');

    if (imgEl && article.image) {
      imgEl.src = article.image;
      imgEl.alt = `${article.title} supporting visualization`;
    }

    if (captionEl) {
      const captionMap = {
        'art-001': '📷 <strong>Supporting Figure 1.1:</strong> Multi-layered deep learning architecture detailing feed-forward synapse matrices, backpropagation loss feedback, and multi-head attention projection weights.',
        'art-002': '📷 <strong>Supporting Figure 2.1:</strong> Classical architectural rendering of the Great Mouseion of Alexandria housing antiquity\'s papyrus scroll codices and astronomical instruments.',
        'art-003': '📷 <strong>Supporting Figure 3.1:</strong> Conceptual spacetime geometry depicting non-local EPR pair quantum entanglement and holographic Einstein-Rosen wormhole bridges.',
        'art-004': '📷 <strong>Supporting Figure 4.1:</strong> Atomic-scale molecular visualization of Cas9 endonuclease guided by synthetic single-guide RNA (sgRNA) cleaving double-stranded target DNA.',
        'art-005': '📷 <strong>Supporting Figure 5.1:</strong> Classical Hellenistic marble representation of Marcus Aurelius illustrating the Dichotomy of Control and Stoic emotional homeostasis.',
        'art-006': '📷 <strong>Supporting Figure 6.1:</strong> Relational database storage topology illustrating B+ Tree clustered index trees, ACID transactional WAL logs, and relational algebraic join processing.'
      };
      captionEl.innerHTML = captionMap[article.id] || `📷 <strong>Supporting Figure:</strong> High-resolution curated scholarly visual for ${article.title}.`;
    }

    if (badgeImg) {
      badgeImg.textContent = `${article.tag} • High-Resolution Visual`;
    }

    // 5. Key Takeaways Highlight Box
    const takeawayContainer = document.getElementById('display-takeaways-box');
    if (takeawayContainer) {
      if (article.keyTakeaways && Array.isArray(article.keyTakeaways)) {
        takeawayContainer.innerHTML = `
          <div class="takeaways-header">
            <span>💡</span>
            <strong>Key Scholarly Takeaways & Core Concepts</strong>
          </div>
          <ul class="takeaways-list">
            ${article.keyTakeaways.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      } else {
        takeawayContainer.innerHTML = `
          <div class="takeaways-header">
            <span>💡</span>
            <strong>Key Takeaway & Topic Core</strong>
          </div>
          <p id="display-takeaway-text">${article.summary}</p>
        `;
      }
    }

    // 6. Body Content & Table of Contents Generation
    const contentEl = document.getElementById('display-article-content');
    const tocList = document.getElementById('display-toc-list');

    if (contentEl) {
      contentEl.innerHTML = article.content;

      // Extract H2 headings and inject IDs for TOC navigation
      if (tocList) {
        const headings = contentEl.querySelectorAll('h2');
        if (headings.length > 0) {
          tocList.innerHTML = Array.from(headings).map((h2, idx) => {
            const sectionId = `section-${article.id}-${idx + 1}`;
            h2.id = sectionId;
            return `
              <a href="#${sectionId}" class="toc-link" data-target="${sectionId}">
                <span class="toc-num">0${idx + 1}.</span>
                <span>${h2.innerText.replace(/^\d+\.\s*/, '')}</span>
              </a>
            `;
          }).join('');

          // Smooth scroll for TOC links
          tocList.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const targetId = link.getAttribute('data-target');
              const targetEl = document.getElementById(targetId);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                tocList.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
              }
            });
          });
        } else {
          tocList.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted);">Overview section</span>';
        }
      }
    }

    // 7. Sync Dropdown Value
    const topicSelect = document.getElementById('display-topic-select');
    if (topicSelect && topicSelect.value !== articleId) {
      topicSelect.value = articleId;
    }

    // 8. Update Adjacent Topic Titles
    this.updateAdjacentTopicButtons();

    // 9. Update Bookmark Button State
    this.updateDisplayBookmarkState();

    // 10. Reset TTS if playing
    this.stopSpeaking();

    // 11. Optional Smooth Scroll into View (with navbar offset)
    if (scrollIntoView) {
      const section = document.getElementById('info-display-section');
      if (section) {
        const yOffset = -75;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  updateAdjacentTopicButtons() {
    const articles = this.db.getArticles();
    const currIndex = articles.findIndex(a => a.id === this.currentDisplayArticleId);
    if (currIndex === -1) return;

    const prevIndex = (currIndex - 1 + articles.length) % articles.length;
    const nextIndex = (currIndex + 1) % articles.length;

    const prevTitle = document.getElementById('display-prev-topic-title');
    const nextTitle = document.getElementById('display-next-topic-title');

    if (prevTitle) prevTitle.textContent = articles[prevIndex].title;
    if (nextTitle) nextTitle.textContent = articles[nextIndex].title;
  }

  navigateAdjacentTopic(direction) {
    const articles = this.db.getArticles();
    const currIndex = articles.findIndex(a => a.id === this.currentDisplayArticleId);
    if (currIndex === -1) return;

    const newIndex = (currIndex + direction + articles.length) % articles.length;
    this.loadTopicIntoDisplay(articles[newIndex].id, true);
  }

  updateDisplayBookmarkState() {
    const btn = document.getElementById('display-bookmark-btn');
    if (!btn) return;

    const currentSession = this.db.getCurrentSession();
    const isBookmarked = currentSession && currentSession.user 
      ? this.db.getUserBookmarks(currentSession.user.id).includes(this.currentDisplayArticleId)
      : false;

    if (isBookmarked) {
      btn.innerHTML = '★ Bookmarked in Scholar Profile';
      btn.classList.add('active');
    } else {
      btn.innerHTML = '⭐ Bookmark Topic';
      btn.classList.remove('active');
    }
  }

  toggleDisplayAudioReader() {
    if (!this.speechSynth) {
      alert('Speech synthesis is not supported on your browser.');
      return;
    }

    const ttsBtn = document.getElementById('display-tts-btn');
    const article = this.db.getArticleById(this.currentDisplayArticleId);
    if (!article) return;

    if (this.isSpeaking) {
      this.stopSpeaking();
      if (ttsBtn) {
        ttsBtn.innerHTML = '🔊 Read Topic Aloud';
        ttsBtn.classList.remove('active');
      }
    } else {
      const contentEl = document.getElementById('display-article-content');
      const textToRead = `${article.title}. ${article.summary}. ${contentEl ? contentEl.innerText : ''}`;

      this.currentUtterance = new SpeechSynthesisUtterance(textToRead);
      this.currentUtterance.rate = 1.0;
      this.currentUtterance.pitch = 1.0;

      this.currentUtterance.onend = () => {
        this.isSpeaking = false;
        if (ttsBtn) {
          ttsBtn.innerHTML = '🔊 Read Topic Aloud';
          ttsBtn.classList.remove('active');
        }
      };

      this.speechSynth.speak(this.currentUtterance);
      this.isSpeaking = true;
      if (ttsBtn) {
        ttsBtn.innerHTML = '⏹️ Pause Speech';
        ttsBtn.classList.add('active');
      }
      if (window.showToast) {
        window.showToast('Audio Synthesis Active', `Reading aloud "${article.title}"`, '🔊');
      }
    }
  }

  updateReadingProgress() {
    const progressBar = document.getElementById('display-reading-progress');
    const displayCard = document.querySelector('.display-layout-card');
    if (!progressBar || !displayCard) return;

    const rect = displayCard.getBoundingClientRect();
    const cardHeight = rect.height;
    const windowHeight = window.innerHeight;

    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      const scrolled = Math.abs(rect.top);
      const totalScrollable = cardHeight - windowHeight;
      const progressPercent = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));
      progressBar.style.width = `${progressPercent}%`;
    } else if (rect.top > 0) {
      progressBar.style.width = '0%';
    } else if (rect.bottom < windowHeight) {
      progressBar.style.width = '100%';
    }
  }

  // ==========================================================================
  // MODULE 2: SEARCH ENGINE & CATEGORY GRID METHODS (ULTRA-DETAILED CARDS)
  // ==========================================================================
  getFilteredArticles() {
    let articles = this.db.getArticles();

    // Category Filter
    if (this.currentCategory && this.currentCategory !== 'all') {
      articles = articles.filter(a => a.categorySlug === this.currentCategory);
    }

    // Search Query Filter
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase().trim();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      );
    }

    return articles;
  }

  renderArticles() {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    const articles = this.getFilteredArticles();
    const currentSession = this.db.getCurrentSession();
    const userBookmarks = currentSession && currentSession.user ? this.db.getUserBookmarks(currentSession.user.id) : [];

    if (articles.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No Scholarly Entries Found</h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem;">
            No encyclopedia entries matched your query "<strong>${this.searchQuery}</strong>". Try clearing your search filter or selecting another category.
          </p>
          <button class="btn btn-outline-gold" onclick="document.getElementById('hero-search-input').value=''; window.infoVerseApp.encyclopedia.searchQuery=''; window.infoVerseApp.encyclopedia.renderArticles();">
            Clear Search Filter
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = articles.map(art => {
      const isBookmarked = userBookmarks.includes(art.id);
      const schematicHtml = art.schematicTags && art.schematicTags.length > 0
        ? `<div class="article-schematic-bar">${art.schematicTags.slice(0, 3).map(t => `<span class="schematic-tag">${t}</span>`).join('<span class="schematic-dot">•</span>')}</div>`
        : '';

      return `
        <article class="article-card" data-id="${art.id}">
          <div class="article-image-wrap" style="background-image: url('${art.image}');" onclick="window.infoVerseApp.encyclopedia.loadTopicIntoDisplay('${art.id}', true)">
            <div class="article-image-overlay"></div>
            
            <div class="article-header-overlay">
              <span class="article-badge">${art.tag}</span>
              <button class="article-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}" onclick="window.infoVerseApp.encyclopedia.handleBookmarkClick('${art.id}', event)">
                ${isBookmarked ? '★' : '☆'}
              </button>
            </div>

            ${schematicHtml}
          </div>

          <div class="article-body">
            <div class="article-meta">
              <span class="meta-disc">🏛️ ${art.category}</span>
              <span class="meta-sep">•</span>
              <span class="meta-diff">${art.difficulty}</span>
            </div>

            <h3 class="article-card-title" onclick="window.infoVerseApp.encyclopedia.loadTopicIntoDisplay('${art.id}', true)">
              ${this.highlightMatch(art.title)}
            </h3>

            <p class="article-summary">
              ${this.highlightMatch(art.summary)}
            </p>

            <div class="article-card-footer">
              <span class="read-time">⏳ ${art.readTime}</span>
              <button class="read-btn" onclick="window.infoVerseApp.encyclopedia.loadTopicIntoDisplay('${art.id}', true)">
                View in Display Module <span>→</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  highlightMatch(text) {
    if (!this.searchQuery || this.searchQuery.trim().length === 0) return text;
    const regex = new RegExp(`(${this.searchQuery.trim()})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(168, 85, 247, 0.45); color: #ffffff; padding: 0 3px; border-radius: 4px; font-weight: bold; border-bottom: 2px solid #c084fc;">$1</mark>');
  }

  handleSearchSuggestions(query) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!suggestionsBox) return;

    if (!query || query.trim().length === 0) {
      suggestionsBox.classList.remove('active');
      return;
    }

    const q = query.toLowerCase().trim();
    const articles = this.db.getArticles().filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.category.toLowerCase().includes(q) ||
      a.tag.toLowerCase().includes(q)
    ).slice(0, 5);

    if (articles.length === 0) {
      suggestionsBox.innerHTML = `
        <div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">
          No direct encyclopedia matches. Press Enter or explore categories.
        </div>
      `;
      suggestionsBox.classList.add('active');
      return;
    }

    suggestionsBox.innerHTML = articles.map(art => `
      <div class="suggestion-item" onclick="window.infoVerseApp.encyclopedia.loadTopicIntoDisplay('${art.id}', true); document.getElementById('search-suggestions').classList.remove('active');">
        <div>
          <div class="suggestion-title">${this.highlightMatch(art.title)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${art.tag} • ${art.readTime}</div>
        </div>
        <span class="suggestion-category">${art.category}</span>
      </div>
    `).join('');

    suggestionsBox.classList.add('active');
  }

  renderTrendingTags() {
    const container = document.getElementById('trending-tags-container');
    if (!container) return;

    const tags = ['Artificial Intelligence', 'Library of Alexandria', 'Quantum Entanglement', 'CRISPR Cas9', 'Stoic Virtues', 'Relational SQL'];
    container.innerHTML = tags.map(tag => `
      <span class="trending-pill" onclick="window.infoVerseApp.encyclopedia.setSearchFromPill('${tag}')">
        #${tag}
      </span>
    `).join('');
  }

  setSearchFromPill(tag) {
    const input = document.getElementById('hero-search-input');
    if (input) {
      input.value = tag;
      this.searchQuery = tag;
      this.renderArticles();
      
      const filtered = this.getFilteredArticles();
      if (filtered.length > 0) {
        this.loadTopicIntoDisplay(filtered[0].id, true);
        if (window.showToast) {
          window.showToast('Displaying Topic', `Loaded "${filtered[0].title}" in Encyclopedia`, '📚');
        }
      }
    }
  }

  handleBookmarkClick(articleId, event) {
    if (event) event.stopPropagation();
    const currentSession = this.db.getCurrentSession();
    if (!currentSession || !currentSession.user) {
      if (window.showToast) {
        window.showToast('Authentication Required', 'Please log in to save bookmarks to your profile.', '🔐');
      }
      if (window.infoVerseApp && window.infoVerseApp.auth) {
        window.infoVerseApp.auth.openAuthModal('login');
      }
      return;
    }

    const isBookmarked = this.db.toggleBookmark(currentSession.user.id, articleId);
    this.renderArticles();
    this.updateDisplayBookmarkState();

    if (window.showToast) {
      window.showToast(
        isBookmarked ? 'Article Bookmarked' : 'Bookmark Removed',
        isBookmarked ? 'Saved to your scholar profile' : 'Removed from saved articles',
        isBookmarked ? '⭐' : '🗑️'
      );
    }
  }

  // Reader Modal Methods (Module 3 Auxiliary Fullscreen View)
  openArticleReader(articleId) {
    const article = this.db.getArticleById(articleId);
    if (!article) return;

    this.currentReaderArticle = article;
    const modal = document.getElementById('reader-modal');
    if (!modal) return;

    // Also sync the display module in background
    this.loadTopicIntoDisplay(articleId, false);

    // Populate Reader Data
    document.getElementById('reader-article-category').textContent = article.category;
    document.getElementById('reader-article-tag').textContent = article.tag;
    document.getElementById('reader-article-title').textContent = article.title;
    document.getElementById('reader-article-author').textContent = article.author;
    document.getElementById('reader-article-date').textContent = article.date;
    document.getElementById('reader-article-time').textContent = article.readTime;
    document.getElementById('reader-article-body').innerHTML = article.content;

    const coverImg = document.getElementById('reader-article-cover');
    if (coverImg && article.image) {
      coverImg.src = article.image;
    }

    // Reset TTS
    this.stopSpeaking();

    // Log to Search History
    this.db.addSearchHistory(article.title);

    modal.classList.add('active');
  }

  closeArticleReader() {
    const modal = document.getElementById('reader-modal');
    if (modal) modal.classList.remove('active');
    this.stopSpeaking();
  }

  toggleTextToSpeech() {
    if (!this.speechSynth) {
      alert('Speech synthesis is not supported on your browser.');
      return;
    }

    const ttsBtn = document.getElementById('reader-tts-btn');

    if (this.isSpeaking) {
      this.stopSpeaking();
    } else {
      if (!this.currentReaderArticle) return;
      const textToRead = `${this.currentReaderArticle.title}. ${document.getElementById('reader-article-body').innerText}`;
      
      this.currentUtterance = new SpeechSynthesisUtterance(textToRead);
      this.currentUtterance.rate = 1.0;
      this.currentUtterance.pitch = 1.0;
      
      this.currentUtterance.onend = () => {
        this.isSpeaking = false;
        if (ttsBtn) {
          ttsBtn.innerHTML = '🔊 Read Aloud';
          ttsBtn.classList.remove('active');
        }
      };

      this.speechSynth.speak(this.currentUtterance);
      this.isSpeaking = true;
      if (ttsBtn) {
        ttsBtn.innerHTML = '⏹️ Pause Speech';
        ttsBtn.classList.add('active');
      }
      if (window.showToast) {
        window.showToast('Audio Reader Active', 'Synthesizing voice playback...', '🔊');
      }
    }
  }

  stopSpeaking() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
    this.isSpeaking = false;
    const ttsBtn = document.getElementById('reader-tts-btn');
    if (ttsBtn) {
      ttsBtn.innerHTML = '🔊 Read Aloud';
      ttsBtn.classList.remove('active');
    }
    const dispTtsBtn = document.getElementById('display-tts-btn');
    if (dispTtsBtn) {
      dispTtsBtn.innerHTML = '🔊 Read Topic Aloud';
      dispTtsBtn.classList.remove('active');
    }
  }

  changeFontSize(delta) {
    this.currentFontSize = Math.max(14, Math.min(26, this.currentFontSize + delta));
    const contentEl = document.getElementById('reader-article-body');
    if (contentEl) {
      contentEl.style.fontSize = `${this.currentFontSize}px`;
    }
  }

  // ==========================================================================
  // MODULE 4: CONTENT MANAGEMENT MODULE (CMS / TOPIC STUDIO)
  // ==========================================================================
  initContentManagementModule() {
    // CMS Inventory Search
    const cmsSearch = document.getElementById('cms-article-search');
    if (cmsSearch) {
      cmsSearch.addEventListener('input', (e) => {
        const catFilter = document.getElementById('cms-category-filter') ? document.getElementById('cms-category-filter').value : 'all';
        this.renderCmsArticlesTable(e.target.value, catFilter);
      });
    }

    // CMS Inventory Category Filter
    const cmsCatFilter = document.getElementById('cms-category-filter');
    if (cmsCatFilter) {
      cmsCatFilter.addEventListener('change', (e) => {
        const searchVal = document.getElementById('cms-article-search') ? document.getElementById('cms-article-search').value : '';
        this.renderCmsArticlesTable(searchVal, e.target.value);
      });
    }

    // CMS Tabs Switching (Inventory vs Studio)
    document.querySelectorAll('.cms-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        document.querySelectorAll('.cms-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.cms-tab-pane').forEach(p => p.classList.remove('active'));

        e.currentTarget.classList.add('active');
        const pane = document.getElementById(targetTab);
        if (pane) pane.classList.add('active');
      });
    });

    // CMS New Topic Button
    const newTopicBtn = document.getElementById('cms-new-topic-btn');
    if (newTopicBtn) {
      newTopicBtn.addEventListener('click', () => {
        this.handleCmsResetForm();
        // Switch to studio tab
        const studioTabBtn = document.querySelector('[data-tab="cms-pane-studio"]');
        if (studioTabBtn) studioTabBtn.click();
      });
    }

    // CMS Form Submit (Create / Update Topic)
    const cmsForm = document.getElementById('cms-article-form');
    if (cmsForm) {
      cmsForm.addEventListener('submit', (e) => this.handleCmsFormSubmit(e));
    }

    // CMS Form Reset Button
    const cmsResetBtn = document.getElementById('cms-form-reset-btn');
    if (cmsResetBtn) {
      cmsResetBtn.addEventListener('click', () => this.handleCmsResetForm());
    }

    // CMS Live Preview Trigger
    const previewBtn = document.getElementById('cms-live-preview-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => this.handleCmsLivePreview());
    }

    // Initial render of CMS Articles table
    this.renderCmsArticlesTable();
  }

  renderCmsArticlesTable(searchQuery = '', categoryFilter = 'all') {
    const tableBody = document.getElementById('cms-articles-table-body');
    const totalBadge = document.getElementById('cms-total-topics-badge');
    if (!tableBody) return;

    let articles = this.db.getArticles();
    if (totalBadge) totalBadge.textContent = `${articles.length} Published Topics`;

    if (categoryFilter && categoryFilter !== 'all') {
      articles = articles.filter(a => a.categorySlug === categoryFilter || a.category === categoryFilter);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      );
    }

    if (articles.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No articles found matching filters. Click "+ Author New Topic" to publish one!
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = articles.map(art => {
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <img src="${art.image}" alt="" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-purple);">
              <div>
                <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem;">${art.title}</div>
                <div style="font-size: 0.76rem; color: var(--accent-purple-light);">${art.tag} • ${art.doi || '10.1016/infoverse.2026'}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="category-pill-sm">${art.category}</span>
          </td>
          <td>
            <div style="font-size: 0.88rem; color: #ffffff;">${art.author}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${art.affiliation || 'Editorial Board'}</div>
          </td>
          <td>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">${art.difficulty} • ⏳ ${art.readTime}</span>
          </td>
          <td>
            <span style="font-size: 0.82rem; color: var(--text-muted);">${art.date}</span>
          </td>
          <td style="text-align: right;">
            <div class="cms-table-actions">
              <button class="table-action-btn edit-btn" title="Edit Topic Details & Content" onclick="window.infoVerseApp.encyclopedia.handleCmsEditArticle('${art.id}')">
                ✏️ Edit
              </button>
              <button class="table-action-btn view-btn" title="View in Information Display Module" onclick="window.infoVerseApp.encyclopedia.loadTopicIntoDisplay('${art.id}', true)">
                👁️ View
              </button>
              <button class="table-action-btn delete-btn" title="Delete Topic from Platform" onclick="window.infoVerseApp.encyclopedia.handleCmsDeleteArticle('${art.id}')">
                🗑️ Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  handleCmsEditArticle(articleId) {
    const article = this.db.getArticleById(articleId);
    if (!article) return;

    // Switch to studio tab
    const studioTabBtn = document.querySelector('[data-tab="cms-pane-studio"]');
    if (studioTabBtn) studioTabBtn.click();

    // Populate Form
    document.getElementById('cms-form-id').value = article.id;
    document.getElementById('cms-form-title').value = article.title;
    document.getElementById('cms-form-category').value = article.category;
    document.getElementById('cms-form-tag').value = article.tag;
    document.getElementById('cms-form-readtime').value = article.readTime;
    document.getElementById('cms-form-difficulty').value = article.difficulty;
    document.getElementById('cms-form-author').value = article.author;
    document.getElementById('cms-form-affiliation').value = article.affiliation || '';
    document.getElementById('cms-form-doi').value = article.doi || '';
    document.getElementById('cms-form-image').value = article.image;
    document.getElementById('cms-form-schematic-tags').value = Array.isArray(article.schematicTags) ? article.schematicTags.join(', ') : '';
    document.getElementById('cms-form-takeaways').value = Array.isArray(article.keyTakeaways) ? article.keyTakeaways.join('\n') : '';
    document.getElementById('cms-form-summary').value = article.summary;
    document.getElementById('cms-form-content').value = article.content;

    // Update Form Header
    const formTitle = document.getElementById('cms-studio-heading');
    const submitBtn = document.getElementById('cms-form-submit-btn');
    if (formTitle) formTitle.textContent = `Editing Topic: "${article.title}"`;
    if (submitBtn) submitBtn.innerHTML = `💾 Save Changes to Topic`;

    // Scroll to form
    const formEl = document.getElementById('cms-article-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (window.showToast) {
      window.showToast('Topic Loaded in Studio', `Editing "${article.title}"`, '✏️');
    }
  }

  handleCmsDeleteArticle(articleId) {
    const article = this.db.getArticleById(articleId);
    if (!article) return;

    if (confirm(`Are you sure you want to permanently delete "${article.title}" from the encyclopedia? This action cannot be undone.`)) {
      try {
        this.db.deleteArticle(articleId);
        this.syncAllTopicViews();

        if (window.showToast) {
          window.showToast('Topic Deleted', `Removed "${article.title}" from catalog.`, '🗑️');
        }
      } catch (err) {
        if (window.showToast) {
          window.showToast('Delete Failed', err.message, '⚠️');
        }
      }
    }
  }

  handleCmsFormSubmit(e) {
    e.preventDefault();
    const articleId = document.getElementById('cms-form-id').value;
    const title = document.getElementById('cms-form-title').value;
    const category = document.getElementById('cms-form-category').value;
    const tag = document.getElementById('cms-form-tag').value;
    const readTime = document.getElementById('cms-form-readtime').value;
    const difficulty = document.getElementById('cms-form-difficulty').value;
    const author = document.getElementById('cms-form-author').value;
    const affiliation = document.getElementById('cms-form-affiliation').value;
    const doi = document.getElementById('cms-form-doi').value;
    const image = document.getElementById('cms-form-image').value;
    const schematicTags = document.getElementById('cms-form-schematic-tags').value;
    const takeaways = document.getElementById('cms-form-takeaways').value;
    const summary = document.getElementById('cms-form-summary').value;
    const content = document.getElementById('cms-form-content').value;

    const payload = {
      title,
      category,
      tag,
      readTime,
      difficulty,
      author,
      affiliation,
      doi,
      image,
      schematicTags,
      keyTakeaways: takeaways,
      summary,
      content
    };

    try {
      if (articleId && articleId.trim().length > 0) {
        // Update existing
        this.db.updateArticle(articleId, payload);
        if (window.showToast) {
          window.showToast('Topic Updated Successfully', `"${title}" has been updated and published.`, '✅');
        }
      } else {
        // Create new
        const newArt = this.db.addArticle(payload);
        if (window.showToast) {
          window.showToast('New Topic Published', `"${title}" added to encyclopedia.`, '🎉');
        }
      }

      this.handleCmsResetForm();
      this.syncAllTopicViews();

      // Switch back to inventory
      const invTabBtn = document.querySelector('[data-tab="cms-pane-inventory"]');
      if (invTabBtn) invTabBtn.click();

    } catch (err) {
      alert('Error saving topic: ' + err.message);
    }
  }

  handleCmsResetForm() {
    const form = document.getElementById('cms-article-form');
    if (form) form.reset();

    const idInput = document.getElementById('cms-form-id');
    if (idInput) idInput.value = '';

    const formTitle = document.getElementById('cms-studio-heading');
    const submitBtn = document.getElementById('cms-form-submit-btn');
    if (formTitle) formTitle.textContent = 'Author & Publish New Topic';
    if (submitBtn) submitBtn.innerHTML = '🚀 Publish Topic to Encyclopedia';

    const previewPane = document.getElementById('cms-preview-pane');
    if (previewPane) previewPane.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Click "👁️ Generate Live Preview" above to see formatted preview.</div>';
  }

  handleCmsLivePreview() {
    const title = document.getElementById('cms-form-title').value || 'Topic Title Preview';
    const category = document.getElementById('cms-form-category').value;
    const tag = document.getElementById('cms-form-tag').value || 'Subject Tag';
    const summary = document.getElementById('cms-form-summary').value || 'Summary synopsis preview...';
    const content = document.getElementById('cms-form-content').value || '<p>Detailed scholarly body content preview...</p>';
    const author = document.getElementById('cms-form-author').value || 'Author Name';
    const readTime = document.getElementById('cms-form-readtime').value || '5 min read';

    const previewPane = document.getElementById('cms-preview-pane');
    if (previewPane) {
      previewPane.innerHTML = `
        <div style="background: rgba(147, 51, 234, 0.1); border: 1px solid var(--border-purple); border-radius: 12px; padding: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="category-pill-sm">${category}</span>
            <span class="article-badge" style="position: static;">${tag}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: auto;">⏳ ${readTime} • by ${author}</span>
          </div>
          <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: #ffffff; margin: 0.5rem 0;">${title}</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; font-style: italic;">${summary}</p>
          <hr style="border: 0; border-top: 1px solid rgba(168, 85, 247, 0.2); margin: 1rem 0;">
          <div class="display-content-typography" style="font-size: 1rem; line-height: 1.75; color: var(--text-primary);">
            ${content}
          </div>
        </div>
      `;
    }
  }

  syncAllTopicViews() {
    this.renderArticles();
    this.renderCmsArticlesTable();

    // Rebuild topic select dropdown in Module 3
    const topicSelect = document.getElementById('display-topic-select');
    if (topicSelect) {
      const articles = this.db.getArticles();
      topicSelect.innerHTML = articles.map(art => `
        <option value="${art.id}">${art.title} (${art.category})</option>
      `).join('');
    }

    // Refresh display module if current article still exists or default to first
    const articles = this.db.getArticles();
    if (articles.length > 0) {
      const exists = articles.some(a => a.id === this.currentDisplayArticleId);
      if (!exists) {
        this.loadTopicIntoDisplay(articles[0].id, false);
      }
    }
  }
}

// Global Export
window.InfoVerseEncyclopedia = InfoVerseEncyclopedia;


