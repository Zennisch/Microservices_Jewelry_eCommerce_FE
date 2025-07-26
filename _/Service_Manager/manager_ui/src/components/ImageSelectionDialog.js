"use client"

import { useState, useEffect } from "react"
import "../assets/css/ImageSelectionDialog.css"

const ImageSelectionDialog = ({ onSave, onCancel, existingImages = [] }) => {
  const [thumbnailImage, setThumbnailImage] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [detailImages, setDetailImages] = useState([])
  const [detailPreviews, setDetailPreviews] = useState([])

  // Track existing images separately since we don't have the File objects
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null)
  const [existingDetailUrls, setExistingDetailUrls] = useState([])

  // Initialize with existing images
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      // Find thumbnail image
      const thumbnail = existingImages.find((img) => img.thumbnail)
      if (thumbnail) {
        setExistingThumbnailUrl(thumbnail.url)
        setThumbnailPreview(thumbnail.url)
      }

      // Get detail images
      const details = existingImages.filter((img) => !img.thumbnail)
      if (details.length > 0) {
        setExistingDetailUrls(details.map((img) => img.url))
        setDetailPreviews(details.map((img) => img.url))
      }
    }
  }, [existingImages])

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailImage(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setExistingThumbnailUrl(null) // Clear existing thumbnail when new one is selected
    }
  }

  const handleDetailChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const remainingSlots = 4 - detailImages.length - existingDetailUrls.length
      const newFiles = filesArray.slice(0, remainingSlots)

      setDetailImages([...detailImages, ...newFiles])

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setDetailPreviews([...detailPreviews, ...newPreviews])
    }
  }

  const removeDetailImage = (index) => {
    // Check if we're removing an existing image or a new one
    const totalExistingDetails = existingDetailUrls.length

    if (index < totalExistingDetails) {
      // Removing an existing image
      const newExistingUrls = [...existingDetailUrls]
      newExistingUrls.splice(index, 1)
      setExistingDetailUrls(newExistingUrls)

      // Update previews
      const newPreviews = [...detailPreviews]
      newPreviews.splice(index, 1)
      setDetailPreviews(newPreviews)
    } else {
      // Removing a new image
      const newImageIndex = index - totalExistingDetails
      const newImages = [...detailImages]
      newImages.splice(newImageIndex, 1)
      setDetailImages(newImages)

      // Update previews
      const newPreviews = [...detailPreviews]
      URL.revokeObjectURL(newPreviews[index]) // Clean up URL object
      newPreviews.splice(index, 1)
      setDetailPreviews(newPreviews)
    }
  }

  const removeThumbnail = () => {
    if (thumbnailImage) {
      URL.revokeObjectURL(thumbnailPreview)
      setThumbnailImage(null)
    }
    setThumbnailPreview(null)
    setExistingThumbnailUrl(null)
  }

  const handleSubmit = () => {
    if (!thumbnailImage && !existingThumbnailUrl) {
      alert("Vui lòng chọn ít nhất một ảnh thumbnail")
      return
    }

    // Prepare result array
    const result = []

    // Add thumbnail
    if (thumbnailImage) {
      result.push({ file: thumbnailImage, thumbnail: true })
    } else if (existingThumbnailUrl) {
      result.push({ url: existingThumbnailUrl, thumbnail: true })
    }

    // Add new detail images
    detailImages.forEach((file) => {
      result.push({ file, thumbnail: false })
    })

    // Add existing detail images
    existingDetailUrls.forEach((url) => {
      result.push({ url, thumbnail: false })
    })

    onSave(result)
  }

  // Calculate how many detail slots are available
  const availableDetailSlots = 4 - detailPreviews.length

  return (
    <div className="image-dialog-overlay">
      <div className="image-dialog-box">
        <h2 className="image-dialog-title">Chọn hình ảnh sản phẩm</h2>

        <div className="image-dialog-body">
          <div className="image-section">
            <h3>Ảnh thumbnail (bắt buộc)</h3>
            <div className="thumbnail-container">
              {thumbnailPreview ? (
                <div className="image-preview-container">
                  <img src={thumbnailPreview || "/placeholder.svg"} alt="Thumbnail preview" className="image-preview" />
                  <button className="remove-image-button" onClick={removeThumbnail}>
                    ×
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <label htmlFor="thumbnail-upload" className="upload-label">
                    <span>+</span>
                    <span>Chọn ảnh</span>
                  </label>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden-input"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="image-section">
            <h3>Ảnh chi tiết (tối đa 4 ảnh)</h3>
            <div className="detail-images-container">
              {detailPreviews.map((preview, index) => (
                <div key={index} className="image-preview-container">
                  <img src={preview || "/placeholder.svg"} alt={`Detail preview ${index}`} className="image-preview" />
                  <button className="remove-image-button" onClick={() => removeDetailImage(index)}>
                    ×
                  </button>
                </div>
              ))}

              {availableDetailSlots > 0 && (
                <div className="image-upload-placeholder">
                  <label htmlFor="detail-upload" className="upload-label">
                    <span>+</span>
                    <span>Thêm ảnh</span>
                  </label>
                  <input
                    id="detail-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailChange}
                    className="hidden-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="image-dialog-actions">
          <button className="image-dialog-cancel-button" onClick={onCancel}>
            Hủy
          </button>
          <button className="image-dialog-save-button" onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageSelectionDialog

