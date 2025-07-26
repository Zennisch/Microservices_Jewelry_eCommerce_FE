import { useState, useEffect } from "react"
import "../assets/css/ManageProductImagesDialog.css"

const ManageProductImagesDialog = ({ productId, onClose, onImageChange, onSave }) => {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

  const [thumbnailImage, setThumbnailImage] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [detailImages, setDetailImages] = useState([])
  const [detailPreviews, setDetailPreviews] = useState([])


  const [existingThumbnailId, setExistingThumbnailId] = useState(null)
  const [existingDetailIds, setExistingDetailIds] = useState([])

  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        console.log(`Fetching product details for ID: ${productId}`)
        const response = await fetch(`http://localhost:8080/products/${productId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Product data received:", data)

        if (!data || !data.data) {
          throw new Error("Invalid data format received from API")
        }

        setProduct(data.data)


        const images = data.data.imageSet || []
        console.log("Image set:", images)


        const thumbnail = images.find((img) => img.isThumbnail === true)
        if (thumbnail) {
          setExistingThumbnailId(thumbnail.id)
          setThumbnailPreview(thumbnail.imageURL)
        }


        const details = images.filter((img) => img.isThumbnail !== true)
        if (details.length > 0) {
          setExistingDetailIds(details.map((img) => img.id))
          setDetailPreviews(details.map((img) => img.imageURL))
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
        alert(`Không thể tải thông tin sản phẩm: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailImage(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setExistingThumbnailId(null) 
    }
  }

  const handleDetailChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const remainingSlots = 4 - detailImages.length - existingDetailIds.length
      const newFiles = filesArray.slice(0, remainingSlots)

      setDetailImages([...detailImages, ...newFiles])

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setDetailPreviews([...detailPreviews, ...newPreviews])
    }
  }

  const removeDetailImage = (index) => {
    
    const totalExistingDetails = existingDetailIds.length

    if (index < totalExistingDetails) {
      
      const imageId = existingDetailIds[index]
      deleteImage(imageId)
    } else {
      
      const newImageIndex = index - totalExistingDetails
      const newImages = [...detailImages]
      newImages.splice(newImageIndex, 1)
      setDetailImages(newImages)


      const newPreviews = [...detailPreviews]
      URL.revokeObjectURL(newPreviews[index]) 
      newPreviews.splice(index, 1)
      setDetailPreviews(newPreviews)
    }
  }

  const removeThumbnail = () => {
    if (existingThumbnailId) {
      deleteImage(existingThumbnailId)
    } else if (thumbnailImage) {
      URL.revokeObjectURL(thumbnailPreview)
      setThumbnailImage(null)
      setThumbnailPreview(null)
    }
  }

  const deleteImage = async (imageId) => {
    try {
      console.log(`Deleting image with ID: ${imageId} from product ${productId}`)

      const response = await fetch(`http://localhost:8080/products/${productId}/images/${imageId}/delete`, {
        method: "DELETE",
      })

      console.log("Delete response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete image: ${response.status} - ${errorText}`)
      }


      if (existingThumbnailId === imageId) {
        setExistingThumbnailId(null)
        setThumbnailPreview(null)
      } else {
        const index = existingDetailIds.indexOf(imageId)
        if (index !== -1) {
          const newIds = [...existingDetailIds]
          newIds.splice(index, 1)
          setExistingDetailIds(newIds)

          const newPreviews = [...detailPreviews]
          newPreviews.splice(index, 1)
          setDetailPreviews(newPreviews)
        }
      }


      if (onImageChange) {
        onImageChange()
      }

      console.log("Image deleted successfully")
    } catch (error) {
      console.error("Error deleting image:", error)
      alert(`Không thể xóa ảnh: ${error.message}`)
    }
  }

  const uploadImage = async (file) => {
    if (!file) return null

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "jewry-app")
    formData.append("cloud_name", "dvzehrklw")

    try {
      console.log("Uploading image to Cloudinary:", file.name)

      const response = await fetch("https://api.cloudinary.com/v1_1/dvzehrklw/image/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("Cloudinary upload result:", result)

      if (response.ok) {
        return result.url
      } else {
        console.error("Upload to Cloudinary failed:", result)
        return null
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      return null
    }
  }

  const handleSubmit = async () => {
    try {
      const imagesToAdd = []

 
      if (thumbnailImage) {
        console.log("Uploading new thumbnail image")
        const thumbnailUrl = await uploadImage(thumbnailImage)
        if (thumbnailUrl) {
          imagesToAdd.push({
            url: thumbnailUrl,
            isThumbnail: true,
          })
        }
      }


      for (const file of detailImages) {
        console.log("Uploading new detail image:", file.name)
        const imageUrl = await uploadImage(file)
        if (imageUrl) {
          imagesToAdd.push({
            url: imageUrl,
            isThumbnail: false,
          })
        }
      }

      if (imagesToAdd.length > 0) {
        console.log("Adding images to product:", imagesToAdd)

        const response = await fetch(`http://localhost:8080/products/${productId}/images/add-images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imagesToAdd),
        })

        console.log("Add images response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to add images: ${response.status} - ${errorText}`)
        }

        setThumbnailImage(null)
        setDetailImages([])

        if (onImageChange) {
          onImageChange()
        }

        alert("Thêm ảnh thành công")
        onSave()
        onClose()
      } else {
        onClose()
      }
    } catch (error) {
      console.error("Error adding images:", error)
      alert(`Không thể thêm ảnh mới: ${error.message}`)
    }
  }


  const availableDetailSlots = 4 - detailPreviews.length

  if (loading) {
    return (
      <div className="image-dialog-overlay">
        <div className="image-dialog-box">
          <h2 className="image-dialog-title">Đang tải...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="image-dialog-overlay">
      <div className="image-dialog-box">
        <h2 className="image-dialog-title">Quản lý hình ảnh: {product?.name}</h2>

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
          <button className="image-dialog-cancel-button" onClick={onClose}>
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

export default ManageProductImagesDialog

