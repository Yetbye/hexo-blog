---
category: blue
---
<div class="blue-gallery">
  <div class="gallery-header">
  </div>
  <div class="image-grid">
    <div class="image-card">
      <img src="/image/gallery/blue/1.jpg">
      <div class="image-info">
      </div>
    </div>
    <div class="image-card">
      <img src="/image/gallery/blue/2.jpg">
      <div class="image-info">
      </div>
    </div>
    <div class="image-card">
      <img src="/image/gallery/blue/3.jpg">
      <div class="image-info">
      </div>
    </div>
    <!-- 更多图片... -->
  </div>
</div>
<style>
.blue-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 15px;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
.image-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}
.image-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(25, 118, 210, 0.2);
}
.image-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}
.image-info {
  padding: 1.5rem;
  background: white;
}
.image-info h3 {
  margin-top: 0;
  color: #1976d2;
}
.image-info p {
  color: #666;
  margin-bottom: 0;
}
</style>