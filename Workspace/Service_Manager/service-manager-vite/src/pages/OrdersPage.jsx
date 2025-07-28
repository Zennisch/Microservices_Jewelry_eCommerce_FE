import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cartOrderService from 'container/cartOrderService';
import { format } from 'date-fns';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Assuming there's an endpoint to get all orders for managers
        const response = await cartOrderService.getOrders();
        setOrders(response);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'PROCESSING': return 'bg-blue-500';
      case 'READY_FOR_DELIVERY': return 'bg-purple-500';
      case 'ASSIGNED_TO_DELIVERER': return 'bg-indigo-500';
      case 'OUT_FOR_DELIVERY': return 'bg-teal-500';
      case 'DELIVERED': return 'bg-green-500';
      case 'DELIVERY_CONFIRMED': return 'bg-emerald-600';
      case 'FAILED': return 'bg-red-600';
      case 'CANCELED': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      // Filter by search term (order ID or customer name)
      const searchMatch = 
        order.id.toString().includes(searchTerm) || 
        (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        
      // Filter by status
      const statusMatch = !statusFilter || order.status === statusFilter;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;
      
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === 'paymentStatus') {
        comparison = a.paymentStatus.localeCompare(b.paymentStatus);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      {/* Filters and sorting */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <Input 
            type="text"
            placeholder="Search by order ID or customer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Filter by Status</label>
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
            <option value="ASSIGNED_TO_DELIVERER">Assigned to Deliverer</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="DELIVERY_CONFIRMED">Delivery Confirmed</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELED">Canceled</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Creation Date</option>
            <option value="id">Order ID</option>
            <option value="status">Status</option>
            <option value="paymentStatus">Payment Status</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sort Direction</label>
          <Select 
            value={sortDirection} 
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deliverer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.user?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={order.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-orange-500'}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.deliverer?.name || 'Not Assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      to={`/manager/order/${order.id}`}
                      className="text-amber-600 hover:text-amber-900 font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;