# Hướng dẫn thêm ảnh cho Slides

## Cách thêm ảnh vào slides:

### 1. Đặt ảnh vào thư mục này
- Copy ảnh của bạn vào thư mục `/public/images/`
- Đặt tên file rõ ràng, ví dụ: `dan-toc-viet-nam.jpg`, `54-dan-toc-viet-nam.jpg`

### 2. Cập nhật slide data
- Mở file `/data/slides.ts` 
- Thêm thuộc tính `image` vào slide với đường dẫn như sau:

```typescript
{
  id: 1,
  title: 'GIỚI THIỆU VẤN ĐỀ DÂN TỘC',
  image: '/images/ten-file-anh.jpg', // Thêm dòng này
  content: [
    // ... nội dung slide
  ]
}
```

### 3. Định dạng ảnh được hỗ trợ
- JPG/JPEG
- PNG
- WebP
- SVG

### 4. Kích thước ảnh khuyến nghị
- Tỷ lệ: 16:9 hoặc 4:3
- Độ phân giải: 1200x800px trở lên
- Dung lượng: < 2MB để tải nhanh

### 5. Ví dụ ảnh cho các slide:
- `dan-toc-viet-nam.jpg` - Ảnh về đa dạng dân tộc Việt Nam
- `54-dan-toc-viet-nam.jpg` - Ảnh 54 dân tộc anh em
- `van-hoa-dan-toc.jpg` - Ảnh văn hóa truyền thống
- `doan-ket-dan-toc.jpg` - Ảnh đoàn kết dân tộc
- `ton-giao-viet-nam.jpg` - Ảnh tôn giáo ở Việt Nam

## Ghi chú:
- Nếu ảnh không tồn tại, hệ thống sẽ hiển thị placeholder
- Ảnh sẽ được hiển thị ở bên trái nội dung trên desktop
- Trên mobile, ảnh sẽ hiển thị ở trên cùng