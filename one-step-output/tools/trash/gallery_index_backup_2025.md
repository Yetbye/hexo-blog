---
top_img: "/image/media/gallery.jpeg"
---

<style>
/* 新增交互效果样式 */
.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
}

.gallery-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  color: #6c757d;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.collection-card {
  position: relative;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.collection-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.collection-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.collection-card:hover .collection-cover {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem 1.5rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.4s ease;
}

.collection-card:hover .overlay {
  transform: translateY(0);
  opacity: 1;
}

.view-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 30px;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.view-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* 分类特定效果 */
#blue-card .overlay { background: linear-gradient(transparent, rgba(25, 118, 210, 0.8)); }
#green-card .overlay { background: linear-gradient(transparent, rgba(56, 142, 60, 0.8)); }
#Impressionism-card .overlay { background: linear-gradient(transparent, rgba(123, 31, 162, 0.8)); }

#blue-card .view-btn:hover { background: rgba(66, 133, 244, 0.5); }
#green-card .view-btn:hover { background: rgba(46, 125, 50, 0.5); }
#Impressionism-card .view-btn:hover { background: rgba(142, 36, 170, 0.5); }
</style>

<div class="gallery-container">
  <div class="gallery-header">
    <h1>调色盘</h1>
    <div class="gallery-stats">
      <span><i class="fas fa-images"></i> 3张珍藏</span>
      <span><i class="fas fa-folder"></i> 4个主题</span>
    </div>
  </div>
  
  <div class="collection-grid">
    <!-- Blue 专辑 -->
    <div class="collection-card" id="blue-card">
      <div class="collection-cover" style="background-image: url('/image/gallery/blue/cover.jpg')">
        <div class="overlay">
          <h3>Blue 系列</h3>
          <p>1张作品</p>
          <a href="blue/" class="view-btn">浏览专辑</a>
        </div>
      </div>
    </div>
    <!-- Green 专辑 -->
    <div class="collection-card" id="green-card">
      <div class="collection-cover" style="background-image: url('/image/gallery/green/cover.jpg')">
        <div class="overlay">
          <h3>Green 系列</h3>
          <p>1张作品</p>
          <a href="green/" class="view-btn">浏览专辑</a>
        </div>
      </div>
    </div>
    <!-- Impressionism 专辑 -->
    <div class="collection-card" id="Impressionism-card">
      <div class="collection-cover" style="background-image: url('/image/gallery/impressionism/cover.jpg')">
        <div class="overlay">
          <h3>Impressionism 精选</h3>
          <p>1张作品</p>
          <a href="Impressionism/" class="view-btn">浏览专辑</a>
        </div>
      </div>
    </div>
    <!-- Pink 专辑 -->
    <div class="collection-card" id="pink-card">
      <div class="collection-cover" style="background-image: url('/image/gallery/pink/cover.jpg')">
        <div class="overlay"> 
          <h3>Pink 系列</h3>
          <p>3张作品</p>
          <a href="pink/" class="view-btn">浏览专辑</a>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// 添加卡片悬停音效（可选）
document.querySelectorAll('.collection-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  });
  
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) return;
    const link = card.querySelector('a');
    window.location.href = link.href;
  });
});
</script>
