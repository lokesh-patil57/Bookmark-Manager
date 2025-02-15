class BookmarkManager {
  constructor() {
    this.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    this.form = document.getElementById("addBookmarkForm");
    this.bookmarksList = document.getElementById("bookmarksList");
    this.searchInput = document.getElementById("searchInput");
    this.categoryFilters = document.getElementById("categoryFilters");
    this.currentFilter = "all";
    this.searchTerm = "";

    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.searchInput.addEventListener("input", (e) => this.handleSearch(e));
    this.categoryFilters.addEventListener("click", (e) => this.handleFilter(e));
    this.initThemeToggle();
    this.renderBookmarks();
  }

  initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", currentTheme);

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const category = document.getElementById("category").value;

    this.addBookmark(title, url, category);
    this.form.reset();
  }

  handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
    this.renderBookmarks();
  }

  handleFilter(e) {
    if (e.target.classList.contains("filter-btn")) {
      this.categoryFilters.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      this.currentFilter = e.target.dataset.category;
      this.renderBookmarks();
    }
  }

  addBookmark(title, url, category) {
    const bookmark = {
      id: Date.now(),
      title,
      url,
      category,
      createdAt: new Date().toLocaleString(),
    };

    this.bookmarks.unshift(bookmark);
    this.saveBookmarks();
    this.renderBookmarks();
  }

  deleteBookmark(id) {
    const element = document.querySelector(`[data-id="${id}"]`);
    element.style.transform = "translateX(-100%)";
    element.style.opacity = "0";

    setTimeout(() => {
      this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
      this.saveBookmarks();
      this.renderBookmarks();
    }, 300);
  }

  saveBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  }

  filterBookmarks() {
    return this.bookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(this.searchTerm) ||
        bookmark.url.toLowerCase().includes(this.searchTerm);
      const matchesCategory =
        this.currentFilter === "all" ||
        bookmark.category === this.currentFilter;
      return matchesSearch && matchesCategory;
    });
  }

  renderBookmarks() {
    const filteredBookmarks = this.filterBookmarks();

    if (filteredBookmarks.length === 0) {
      this.bookmarksList.innerHTML = `
                        <div class="empty-state">
                            <p>No bookmarks found. ${
                              this.bookmarks.length === 0
                                ? "Add some above! ✨"
                                : ""
                            }</p>
                        </div>
                    `;
      return;
    }

    this.bookmarksList.innerHTML = filteredBookmarks
      .map(
        (bookmark) => `
                        <div class="bookmark-item" data-id="${bookmark.id}">
                            <div class="bookmark-info">
                                <h3>${bookmark.title}</h3>
                                <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
                                <span class="bookmark-category">${bookmark.category}</span>
                            </div>
                            <div class="bookmark-actions">
                                <button onclick="bookmarkManager.deleteBookmark(${bookmark.id})">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `
      )
      .join("");
  }
}

const bookmarkManager = new BookmarkManager();
