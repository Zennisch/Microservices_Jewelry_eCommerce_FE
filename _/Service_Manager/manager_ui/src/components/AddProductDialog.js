"use client"

import { useState } from "react"
import ImageSelectionDialog from "./ImageSelectionDialog"
import "../assets/css/AddProductDialog.css"

const AddProductDialog = ({ onSave, onCancel }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0.0,
    gender: 0,
    material: "",
    goldKarat: "",
    color: "",
    brand: "",
    viewCount: 0,
    categoryId: null,
    collectionId: null,
    imageSet: [],
  })

  const [showImageDialog, setShowImageDialog] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  // Update the handleImagesSelected function to handle both new and existing images
  const handleImagesSelected = async (selectedImages) => {
    setShowImageDialog(false)

    try {
      const processedImages = []

      // Process each selected image
      for (const imageObj of selectedImages) {
        // If it's a new image (has file property), upload it
        if (imageObj.file) {
          const uploadedImage = await uploadImage(imageObj.file)
          if (uploadedImage) {
            processedImages.push({
              url: uploadedImage.url,
              thumbnail: imageObj.thumbnail,
            })
          }
        }
        // If it's an existing image (has url property), keep it
        else if (imageObj.url) {
          processedImages.push({
            url: imageObj.url,
            thumbnail: imageObj.thumbnail,
          })
        }
      }

      if (processedImages.length > 0) {
        setProduct({
          ...product,
          imageSet: processedImages,
        })
      }
    } catch (error) {
      console.error("Error processing images:", error)
      alert("Có lỗi xảy ra khi xử lý hình ảnh.")
    }
  }

  const uploadImage = async (file) => {
    console.log("Uploading image to Cloudinary:", file)

    if (!file) {
      alert("Vui lòng chọn một hình ảnh.")
      return null
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "jewry-app")
    formData.append("cloud_name", "dvzehrklw")

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dvzehrklw/image/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("Cloudinary response:", result)

      if (response.ok) {
        return {
          url: result.url,
        }
      } else {
        console.error("Upload to Cloudinary failed:", result)
        alert("Không thể tải ảnh lên Cloudinary.")
        return null
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      alert("Có lỗi xảy ra khi tải ảnh lên Cloudinary.")
      return null
    }
  }

  const handleSubmit = async () => {
    console.log("Submitting form with product:", product)
    if (product.imageSet.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh trước khi lưu.")
      return
    }

    console.log("Final product data to save:", product)
    onSave(product)
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2 className="dialog-title">Thêm sản phẩm mới</h2>
        <div className="dialog-body">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Tên sản phẩm"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-input"
              name="description"
              placeholder="Mô tả sản phẩm"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Số lượng</label>
            <input
              className="form-input"
              type="number"
              name="stock"
              placeholder="Số lượng"
              value={product.stock}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Giá</label>
            <input
              className="form-input"
              type="number"
              step="0.01"
              name="price"
              placeholder="Giá"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <select className="form-input" name="gender" value={product.gender} onChange={handleInputChange}>
              <option value={0}>Unisex</option>
              <option value={1}>Nam</option>
              <option value={2}>Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Chất liệu</label>
            <input
              className="form-input"
              type="text"
              name="material"
              placeholder="Chất liệu"
              value={product.material}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tuổi vàng</label>
            <input
              className="form-input"
              type="text"
              name="goldKarat"
              placeholder="Tuổi vàng"
              value={product.goldKarat}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Màu sắc</label>
            <input
              className="form-input"
              type="text"
              name="color"
              placeholder="Màu sắc"
              value={product.color}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thương hiệu</label>
            <input
              className="form-input"
              type="text"
              name="brand"
              placeholder="Thương hiệu"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <input
              className="form-input"
              type="number"
              name="categoryId"
              placeholder="Danh mục ID"
              value={product.categoryId}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bộ sưu tập</label>
            <input
              className="form-input"
              type="number"
              name="collectionId"
              placeholder="Bộ sưu tập ID"
              value={product.collectionId}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hình ảnh</label>
            <button type="button" className="form-input image-select-button" onClick={() => setShowImageDialog(true)}>
              {product.imageSet.length > 0 ? `Đã chọn ${product.imageSet.length} ảnh` : "Chọn hình ảnh"}
            </button>
          </div>
        </div>

        <div className="dialog-actions">
          <button className="dialog-cancel-button" onClick={onCancel}>
            Hủy
          </button>
          <button className="dialog-save-button" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>
      {showImageDialog && (
        <ImageSelectionDialog
          onSave={handleImagesSelected}
          onCancel={() => setShowImageDialog(false)}
          existingImages={product.imageSet} // Pass existing images
        />
      )}
    </div>
  )
}

export default AddProductDialog

