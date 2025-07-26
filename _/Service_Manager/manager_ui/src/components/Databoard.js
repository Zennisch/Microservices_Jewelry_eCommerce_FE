import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  AreaChart,
  Area,
} from "recharts"
import "../assets/css/Databoard.css"

const Dashboard = ({ products, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview")


  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#D0ED57",
  ]


  const prepareData = () => {
    const stockData = products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10)
      .map((product) => ({
        name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
        stock: product.stock || 0,
      }))

    const priceData = products
      .sort((a, b) => b.price - a.price)
      .slice(0, 10)
      .map((product) => ({
        name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
        price: product.price / 1000000, // Convert to millions for better display
      }))


    const brandData = products.reduce((acc, product) => {
      if (!product.brand) return acc
      acc[product.brand] = (acc[product.brand] || 0) + 1
      return acc
    }, {})

    const brandChartData = Object.entries(brandData)
      .map(([brand, count]) => ({
        name: brand,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)


    const materialData = products.reduce((acc, product) => {
      if (!product.material) return acc
      acc[product.material] = (acc[product.material] || 0) + 1
      return acc
    }, {})

    const materialChartData = Object.entries(materialData)
      .map(([material, count]) => ({
        name: material,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)


    const genderMap = { 0: "Unisex", 1: "Nam", 2: "Nữ" }
    const genderData = products.reduce((acc, product) => {
      const gender = genderMap[product.gender] || "Không xác định"
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {})

    const genderChartData = Object.entries(genderData).map(([gender, count]) => ({
      name: gender,
      value: count,
    }))


    const priceRanges = [
      { range: "< 1M", min: 0, max: 1000000 },
      { range: "1M - 5M", min: 1000000, max: 5000000 },
      { range: "5M - 10M", min: 5000000, max: 10000000 },
      { range: "10M - 20M", min: 10000000, max: 20000000 },
      { range: "> 20M", min: 20000000, max: Number.POSITIVE_INFINITY },
    ]

    const priceRangeData = priceRanges.map((range) => {
      const count = products.filter((product) => product.price >= range.min && product.price < range.max).length
      return {
        name: range.range,
        count: count,
      }
    })

    const stockRanges = [
      { range: "Hết hàng", min: 0, max: 1 },
      { range: "Sắp hết", min: 1, max: 10 },
      { range: "Bình thường", min: 10, max: 50 },
      { range: "Dồi dào", min: 50, max: Number.POSITIVE_INFINITY },
    ]

    const stockStatusData = stockRanges.map((range) => {
      const count = products.filter((product) => product.stock >= range.min && product.stock < range.max).length
      return {
        name: range.range,
        count: count,
      }
    })

    const karatData = products.reduce((acc, product) => {
      if (!product.goldKarat) return acc
      acc[product.goldKarat] = (acc[product.goldKarat] || 0) + 1
      return acc
    }, {})

    const karatChartData = Object.entries(karatData)
      .map(([karat, count]) => ({
        name: karat,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)


    const colorData = products.reduce((acc, product) => {
      if (!product.color) return acc
      acc[product.color] = (acc[product.color] || 0) + 1
      return acc
    }, {})

    const colorChartData = Object.entries(colorData)
      .map(([color, count]) => ({
        name: color,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)

    const brandValueData = products.reduce((acc, product) => {
      if (!product.brand) return acc
      const value = (product.price || 0) * (product.stock || 0)
      acc[product.brand] = (acc[product.brand] || 0) + value
      return acc
    }, {})

    const brandValueChartData = Object.entries(brandValueData)
      .map(([brand, value]) => ({
        name: brand,
        value: value / 1000000, 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) 


    const radarData = [
      { subject: "Số lượng SP", A: products.length, fullMark: products.length },
      {
        subject: "Tổng tồn kho",
        A: products.reduce((sum, product) => sum + (product.stock || 0), 0),
        fullMark: products.reduce((sum, product) => sum + (product.stock || 0), 0),
      },
      {
        subject: "Giá TB ",
        A: products.reduce((sum, product) => sum + (product.price || 0), 0) / (products.length * 1000000),
        fullMark: products.reduce((sum, product) => sum + (product.price || 0), 0) / (products.length * 1000000),
      },
      {
        subject: "Số thương hiệu",
        A: Object.keys(brandData).length,
        fullMark: Object.keys(brandData).length,
      },
      {
        subject: "Số chất liệu",
        A: Object.keys(materialData).length,
        fullMark: Object.keys(materialData).length,
      },
    ]


    const treemapData = Object.entries(brandData).map(([brand, count]) => ({
      name: brand,
      size: count,
    }))

    return {
      stockData,
      priceData,
      brandChartData,
      materialChartData,
      genderChartData,
      priceRangeData,
      stockStatusData,
      karatChartData,
      colorChartData,
      brandValueChartData,
      radarData,
      treemapData,
    }
  }

  const data = prepareData()


  const PriceTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name} : ${(payload[0].value * 1000000).toLocaleString()}đ`}</p>
        </div>
      )
    }
    return null
  }


  const ValueTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name} : ${(payload[0].value * 1000000).toLocaleString()}đ`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="dashboard-modal">
      <div className="dashboard-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Thống Kê Sản Phẩm</h2>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Tổng quan
          </button>
          <button
            className={`tab-button ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            Tồn kho
          </button>
          <button
            className={`tab-button ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => setActiveTab("pricing")}
          >
            Giá cả
          </button>
          <button
            className={`tab-button ${activeTab === "attributes" ? "active" : ""}`}
            onClick={() => setActiveTab("attributes")}
          >
            Thuộc tính
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="dashboard-summary">
              <div className="summary-card">
                <h3>Tổng sản phẩm</h3>
                <p>{products.length}</p>
              </div>
              <div className="summary-card">
                <h3>Tổng tồn kho</h3>
                <p>{products.reduce((sum, product) => sum + (product.stock || 0), 0)}</p>
              </div>
              <div className="summary-card">
                <h3>Giá trung bình</h3>
                <p>
                  {(
                    products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length
                  ).toLocaleString()}
                  đ
                </p>
              </div>
              <div className="summary-card">
                <h3>Số thương hiệu</h3>
                <p>{new Set(products.map((p) => p.brand).filter(Boolean)).size}</p>
              </div>
            </div>

            

            <div className="chart-container">
              <div className="chart">
                <h3>Phân bố theo thương hiệu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.brandChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.brandChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h3>Phân bố theo giới tính</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.genderChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.genderChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart chart-large">
                <h3>Phân bố thương hiệu (Treemap)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <Treemap data={data.treemapData} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8">
                    {data.treemapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "inventory" && (
          <>
            <div className="chart-container">
              <div className="chart">
                <h3>Top 10 sản phẩm tồn kho nhiều nhất</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.stockData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stock" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h3>Trạng thái tồn kho</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.stockStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart chart-large">
                <h3>Phân bố tồn kho theo thương hiệu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={data.brandChartData.slice(0, 10)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "pricing" && (
          <>
            <div className="chart-container">
              <div className="chart">
                <h3>Top 10 sản phẩm giá cao nhất </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.priceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip content={<PriceTooltip />} />
                    <Legend />
                    <Bar dataKey="price" fill="#82ca9d" name="Giá " />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h3>Phân bố theo khoảng giá</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.priceRangeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.priceRangeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart chart-large">
                <h3>Giá trị tồn kho theo thương hiệu </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.brandValueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ValueTooltip />} />
                    <Legend />
                    <Bar dataKey="value" fill="#ffc658" name="Giá trị" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "attributes" && (
          <>
            <div className="chart-container">
              <div className="chart">
                <h3>Phân bố theo chất liệu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.materialChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.materialChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h3>Phân bố theo tuổi vàng</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.karatChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.karatChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart">
                <h3>Phân bố theo màu sắc</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.colorChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.colorChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h3>Phân bố theo thương hiệu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.brandChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.brandChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard

