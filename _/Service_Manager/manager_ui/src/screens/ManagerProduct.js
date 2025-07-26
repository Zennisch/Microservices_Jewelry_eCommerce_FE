"use client"

import { useEffect, useState } from "react"
import "../assets/css/ManagerProduct.css"
import {
  ShoppingCart,
  MessageCircle,
  User,
  Bell,
  Search,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image,
} from "lucide-react"
import ConfirmationDialog from "../components/ComfirmationDialog"
import EditProductDialog from "../components/EditProductDialog"
import AddProductDialog from "../components/AddProductDialog"
import Dashboard from "../components/Databoard"
import UpdateStockModal from "../components/UpdateStockDialog"
import ManageProductImagesDialog from "../components/ManageProductImagesDialog"

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [allProduct, setAllProduct] = useState([])
  const [totalElement, setTotalElement] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [sortField, setSortField] = useState()
  const [sortOrder, setSortOrder] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState()
  const [totalPages, setTotalPages] = useState()

  const [updateProduct, setUpdateProduct] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  const [productToDelete, setProductToDelete] = useState(null)
  const [productToUpdateStock, setProductToUpdateStock] = useState(null)
  const [productToManageImages, setProductToManageImages] = useState(null)

  const handleAddNewProduct = () => {
    setShowAddDialog(true)
  }

  const toggleDashboard = () => {
    fetchAllProduct()
    setShowDashboard(!showDashboard)
  }
  

  const handleStockSubmit = async (newStock) => {
    try {
      const response = await fetch(
        `http://localhost:8080/products/${productToUpdateStock.productId}/update-stock?newStock=${newStock}`,
        {
          method: "PATCH",
        },
      )
      const data = await response.json()

      if (data.status === 200) {
        const updatedProducts = products.map((p) =>
          p.productId === productToUpdateStock.productId ? { ...p, stock: newStock } : p,
        )
        setProducts(updatedProducts)

        setProductToUpdateStock(null)
        alert("Cập nhật số lượng tồn kho thành công!")
      } else {
        console.error("Failed to update stock:", data.message)
      }
    } catch (error) {
      console.error("Error updating stock:", error)
    }
  }

  const handleImageSubmit = async () => {
    fetchProducts()
  }

  const fetchAllProduct = async () => {
    try {
      const allProductsResponse = await fetch(`http://localhost:8080/products?page=0&size=${totalElement}`)
      const allProductsData = await allProductsResponse.json()
      setAllProduct(allProductsData.data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchInitialProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/products")
      const data = await response.json()
      console.log("Initial products:", data)
      setProducts(data.data.products)
      setTotalElement(data.data.totalElements)

      const totalPages = data.data.totalPages
      setTotalPages(totalPages)

      const pageSize = data.data.pageSize
      setPageSize(pageSize)
    } catch (error) {
      console.error("Error fetching initial products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()

      if (searchKeyword) params.append("keyword", searchKeyword)
      if (sortField) params.append("column", sortField)
      if (sortOrder) params.append("direction", sortOrder)

      params.append("page", currentPage - 1)
      params.append("size", pageSize)

      const response = await fetch(`http://localhost:8080/products?${params.toString()}`)
      const data = await response.json()

      console.log("Search products:", data)
      setProducts(data.data.products)

      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching search products:", error)
    }
  }

  useEffect(() => {
    fetchInitialProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, pageSize, searchKeyword, sortField, sortOrder])

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    if (file) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("http://localhost:8080/products/import", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.text()
          alert(result)
        } else {
          const error = await response.text()
          alert(`Error: ${error}`)
        }
      } catch (error) {
        alert(`Error: ${error.message}`)
      }
    } else {
      alert("No file selected")
    }
  }

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${productId}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error(`Error: ${response.status}`)

      setProducts(products.filter((product) => product.productId !== productId))
      alert("Sản phẩm đã được xóa!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Không thể xóa sản phẩm.")
    }
  }

  const handleEdit = (product) => {
    setUpdateProduct(product)
    setShowEditDialog(true)
  }

  const handleSave = async (updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${updatedProduct.productId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) throw new Error("Lỗi khi cập nhật sản phẩm")

      alert("Cập nhật sản phẩm thành công!")
      fetchProducts()
      setShowEditDialog(false)
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error)
      alert("Cập nhật sản phẩm thất bại!")
    }
  }

  const handleCancel = () => {
    setShowEditDialog(false)
    setUpdateProduct(null)
  }

  const handleSaveNewProduct = async (newProduct) => {
    try {
      const response = await fetch("http://localhost:8080/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        alert("Thêm sản phẩm thành công!")
        setShowAddDialog(false)
        fetchProducts()
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.message}`)
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Không thể thêm sản phẩm.")
    }
  }

  return (
    <div className="container">
      <header className="header">
        <div className="top-bar">
          <div className="left-actions">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="action-link">
              <ShoppingCart size={18} />
              <span>Giỏ Hàng</span>
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="action-link">
              <Bell size={18} />
              <span>Liên Hệ</span>
            </a>
          </div>

          <div className="logo">
            <img
              src={require("../assets/images/logo.png") || "/placeholder.svg"}
              alt="TINH TÚ"
              className="logo-image"
            />
          </div>

          <div className="right-actions">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="action-link">
              <MessageCircle size={18} />
              <span>Chat Bot</span>
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="action-link">
              <User size={18} />
              <span>Tài Khoản</span>
            </a>
          </div>
        </div>
        <div>
          <div className="diamond-container">
            <div className="line"></div>
            <img
              src={require("../assets/images/Vector.png") || "/placeholder.svg"}
              alt="Diamond Icon"
              className="diamond-image"
            />
            <div className="line"></div>
          </div>
        </div>

        <nav className="main-nav">
          <div className="nav-links">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Trang Chủ
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Trang Sức
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Trang Sức Cưới
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Đồng Hồ
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Quà Tặng
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Khuyến Mãi
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="nav-link">
              Bộ Sưu Tập
            </a>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="search-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button className="search-button" onClick={fetchProducts}>
              <Search size={18} />
            </button>
          </div>
          <div className="sort-container">
            <label htmlFor="sortField" className="sort-label">
              Sắp xếp:
            </label>
            <select
              id="sortField"
              className="sort-select"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="productId">Mới nhất</option>
              <option value="price">Giá</option>
              <option value="name">Tên</option>
            </select>
            <select
              id="sortOrder"
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>
        </nav>
        <div className="task">
          <div className="import-csv-container">
            <label htmlFor="importCSV" className="import-label">
              Import CSV
            </label>
            <input id="importCSV" type="file" accept=".csv" className="import-input" onChange={handleFileUpload} />
          </div>
          <button className="add-new-button" onClick={handleAddNewProduct}>
            Thêm mới
          </button>
          <button className="statistics-button" onClick={toggleDashboard}>
            Thống Kê
          </button>
        </div>
        {showDashboard && <Dashboard products={allProduct} onClose={toggleDashboard} />}

        {showAddDialog && <AddProductDialog onSave={handleSaveNewProduct} onCancel={() => setShowAddDialog(false)} />}
      </header>

      <main className="product-grid">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            <img
              src={product.imageSet[0]?.imageURL || "/placeholder.svg"}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="original-price">{product.price.toLocaleString()}đ</p>
              <p className="sale-price">{(product.price * 0.9).toLocaleString()}đ</p>
            </div>
            <div className="item-actions">
              <button className="edit-button" onClick={() => handleEdit(product)}>
                Sửa
              </button>
              <button className="delete-button" onClick={() => setProductToDelete(product.productId)}>
                Xóa
              </button>
              <button className="stock-button" onClick={() => setProductToUpdateStock(product)}>
                Nhập kho
              </button>
              <button className="image-button" onClick={() => setProductToManageImages(product.productId)}>
                <Image size={16} className="button-icon" />
                Ảnh
              </button>
            </div>
          </div>
        ))}
      </main>

      {showEditDialog && updateProduct && (
        <EditProductDialog product={updateProduct} onSave={handleSave} onCancel={handleCancel} />
      )}

      {productToUpdateStock && (
        <UpdateStockModal
          product={productToUpdateStock}
          onSave={handleStockSubmit}
          onClose={() => setProductToUpdateStock(null)}
        />
      )}

      {productToDelete && (
        <ConfirmationDialog
          onConfirm={() => {
            handleDelete(productToDelete)
            setProductToDelete(null)
          }}
          onCancel={() => setProductToDelete(null)}
        />
      )}

      {productToManageImages && (
        <ManageProductImagesDialog productId={productToManageImages} onClose={() => setProductToManageImages(null)} onSave={handleImageSubmit} onImageChange={handleImageSubmit}/> 
      )}

      <div className="pagination">
        <button
          className="pagination-button previous"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>
        <text>{currentPage}</text>
        <button
          className="pagination-button next"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Bộ Trang Sức Mới</h3>
            <ul>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="#">Nhẫn Kim Cương</a>
              </li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="#">Vòng Cổ Vàng</a>
              </li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="#">Lắc Tay Bạc</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hỗ Trợ</h3>
            <ul>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="#">Giải Đáp</a>
              </li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="#">Chính Sách Bảo Mật</a>
              </li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="#">Điều Khoản & Điều Kiện</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Chăm Sóc Khách Hàng</h3>
            <div className="contact-info">
              <p>Thời Gian: 6:30AM-21:30PM (Hàng Ngày)</p>
              <p>Liên Hệ: +84 999222111</p>
              <p>Email: tinhtu@iuh.edu.vn</p>
            </div>
          </div>

          <div className="footer-section">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="contact-button">
              Liên Hệ Với Chúng Tôi
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
          <p className="copyright">Copyright © 2020 - Phát Triển Bởi Sinh Viên Đại học Công Nghiệp Tp. HCM</p>
        </div>
      </footer>
    </div>
  )
}

export default ProductList

