/**
 * assets/js/modules/news.js
 * Modul untuk menangani halaman berita & artikel.
 */

function loadNewsAndArticles() {
    const featuredNewsContainer = document.getElementById('featured-news-container');
    if (!featuredNewsContainer) return;

    const articlesLeftContainer = document.getElementById('organizational-articles-left');
    const articlesRightContainer = document.getElementById('organizational-articles-right');

    fetch('api/get_news.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Tampilkan Berita Utama
                const featuredNews = data.data.featured_news;
                featuredNewsContainer.innerHTML = ''; 
                featuredNews.forEach(news => {
                    const imagePath = (news.image_url.startsWith('http') ? news.image_url : `assets/images/${news.image_url}`);
                    featuredNewsContainer.innerHTML += `
                        <a href="${news.article_link}" target="_blank" class="featured-card" style="background-image: url('${imagePath}')">
                            <p class="news-title">${news.title}</p>
                        </a>`;
                });

                // Tampilkan Artikel Organisasi
                const orgArticles = data.data.organizational_articles;
                articlesLeftContainer.innerHTML = ''; 
                articlesRightContainer.innerHTML = ''; 

                const middleIndex = Math.ceil(orgArticles.length / 2);
                orgArticles.forEach((article, index) => {
                    const articleHTML = `
                        <div class="article-item-text-only">
                            <a href="${article.article_link}" target="_blank" class="article-link-wrapper">
                                <h4 class="article-title">${article.title}</h4>
                                <p class="article-description">${article.article_link}</p>
                            </a>
                        </div>`;

                    if (index < middleIndex) {
                        articlesLeftContainer.innerHTML += articleHTML;
                    } else {
                        articlesRightContainer.innerHTML += articleHTML;
                    }
                });
            }
        }).catch(error => console.error("Error memuat berita:", error));
}


export function initNews() {
    loadNewsAndArticles();
}