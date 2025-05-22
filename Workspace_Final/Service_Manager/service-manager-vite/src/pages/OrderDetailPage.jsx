import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cartOrderService from 'container/cartOrderService';
import { format } from 'date-fns';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { toast } from '../components/ui/toast';

// Order status progression sequence
const STATUS_PROGRESSION = [
  'PENDING',
  'PROCESSING',
  'READY_FOR_DELIVERY',
  'ASSIGNED_TO_DELIVERER',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'DELIVERY_CONFIRMED'
];

// Statuses that should not be manually set by manager
const RESTRICTED_STATUSES = [
  'DELIVERY_CONFIRMED', // Set by customer when receiving order
  'OUT_FOR_DELIVERY',   // Set by deliverer
  'DELIVERED'           // Set by deliverer
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliverers, setDeliverers] = useState([]);
  const [selectedDeliverer, setSelectedDeliverer] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await cartOrderService.getOrderById(parseInt(id, 10));
        setOrder(orderData);
        setSelectedStatus(orderData.status);
        
        // If order is at READY_FOR_DELIVERY status, fetch available deliverers
        if (orderData.status === 'READY_FOR_DELIVERY') {
          fetchDeliverers();
        }
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Could not load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // Fetch available deliverers
  const fetchDeliverers = async () => {
    try {
      const deliverersList = await cartOrderService.getDeliverers();
      setDeliverers(deliverersList);
    } catch (err) {
      console.error('Failed to fetch deliverers:', err);
      toast({
        title: "Error",
        description: "Could not load available deliverers",
        variant: "destructive"
      });
    }
  };
  
  // Handle status change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    
    // If changing to READY_FOR_DELIVERY status, fetch deliverers
    if (e.target.value === 'READY_FOR_DELIVERY') {
      fetchDeliverers();
    }
  };
  
  // Handle deliverer selection change
  const handleDelivererChange = (e) => {
    setSelectedDeliverer(e.target.value);
  };
  
  // Update order status
  const updateOrderStatus = async () => {
    if (selectedStatus === order.status) {
      toast({
        title: "No Changes",
        description: "Order status is unchanged",
      });
      return;
    }
    
    // Check if trying to move backwards in status progression
    const currentIndex = STATUS_PROGRESSION.indexOf(order.status);
    const newIndex = STATUS_PROGRESSION.indexOf(selectedStatus);
    
    if (newIndex < currentIndex) {
      toast({
        title: "Invalid Status Change",
        description: "Cannot revert to a previous status",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Update the order status
      await cartOrderService.updateOrder(order.id, { status: selectedStatus });
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
        variant: "success"
      });
      
      // Refresh order data
      const updatedOrder = await cartOrderService.getOrderById(parseInt(id, 10));
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Assign deliverer
  const assignDeliverer = async () => {
    if (!selectedDeliverer) {
      toast({
        title: "Selection Required",
        description: "Please select a deliverer",
        variant: "warning"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      await cartOrderService.assignDeliverer(
        order.id, 
        parseInt(selectedDeliverer, 10)
      );
      
      toast({
        title: "Success",
        description: "Deliverer assigned successfully",
        variant: "success"
      });
      
      // Refresh order data
      const updatedOrder = await cartOrderService.getOrderById(parseInt(id, 10));
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Failed to assign deliverer:', err);
      toast({
        title: "Error",
        description: "Failed to assign deliverer",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Get next available status options
  const getAvailableStatuses = () => {
    if (!order) return [];
    
    const currentIndex = STATUS_PROGRESSION.indexOf(order.status);
    
    return STATUS_PROGRESSION
      .filter((status, index) => {
        // Include current status and next status only
        return index === currentIndex || index === currentIndex + 1;
      })
      .filter(status => !RESTRICTED_STATUSES.includes(status));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error || 'Order not found'}</p>
        <Button 
          onClick={() => navigate('/manager/orders')}
          className="mt-4"
        >
          Back to Orders
        </Button>
      </div>
    );
  }
  
  // Get status badge color
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
  
  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  // Calculate total order amount
  const calculateTotal = () => {
    return order.orderDetails.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <Button 
          variant="outline"
          onClick={() => navigate('/manager/orders')}
        >
          Back to Orders
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Summary Card */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p>{format(new Date(order.updatedAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={`mt-1 ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <Badge className={`mt-1 ${order.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-orange-500'}`}>
                {order.paymentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p>{order.paymentMethod || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p>{order.transactionId || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-gray-700">{order.address}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Customer Information</h3>
            <p>Name: {order.user?.name || 'N/A'}</p>
            <p>Email: {order.user?.email || 'N/A'}</p>
          </div>
          
          {order.deliverer && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Deliverer Information</h3>
              <p>Name: {order.deliverer?.name || 'N/A'}</p>
              <p>Email: {order.deliverer?.email || 'N/A'}</p>
            </div>
          )}
          
          {order.deliveryProof && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Delivery Proof</h3>
              <div className="mt-2">
                <img 
                  src={order.deliveryProof.imageUrl} 
                  alt="Delivery proof" 
                  className="w-40 h-auto rounded-md"
                />
              </div>
              {order.deliveryProof.notes && (
                <p className="mt-2 text-gray-700">{order.deliveryProof.notes}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Status Management Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status Management</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Update Status</label>
            <Select 
              value={selectedStatus} 
              onChange={handleStatusChange}
              disabled={order.status === 'CANCELED' || order.status === 'DELIVERY_CONFIRMED'}
            >
              {getAvailableStatuses().map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Button
              className="w-full mt-2"
              onClick={updateOrderStatus}
              disabled={
                isUpdating || 
                selectedStatus === order.status || 
                order.status === 'CANCELED' || 
                order.status === 'DELIVERY_CONFIRMED'
              }
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
          
          {order.status === 'READY_FOR_DELIVERY' && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-4">Assign Deliverer</h3>
              <Select 
                value={selectedDeliverer} 
                onChange={handleDelivererChange}
                disabled={isUpdating}
              >
                <option value="">Select a Deliverer</option>
                {deliverers.map((deliverer) => (
                  <option key={deliverer.id} value={deliverer.id}>
                    {deliverer.name}
                  </option>
                ))}
              </Select>
              <Button
                className="w-full mt-2"
                onClick={assignDeliverer}
                disabled={isUpdating || !selectedDeliverer}
              >
                {isUpdating ? 'Assigning...' : 'Assign Deliverer'}
              </Button>
            </div>
          )}
          
          {(order.status !== 'CANCELED' && order.status !== 'DELIVERY_CONFIRMED') && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-4 text-red-600">Cancel Order</h3>
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                    try {
                      setIsUpdating(true);
                      await cartOrderService.updateOrder(order.id, { status: 'CANCELED' });
                      toast({
                        title: "Order Canceled",
                        description: "The order has been canceled successfully",
                        variant: "success"
                      });
                      
                      const updatedOrder = await cartOrderService.getOrderById(parseInt(id, 10));
                      setOrder(updatedOrder);
                    } catch (err) {
                      console.error('Failed to cancel order:', err);
                      toast({
                        title: "Error",
                        description: "Failed to cancel order",
                        variant: "destructive"
                      });
                    } finally {
                      setIsUpdating(false);
                    }
                  }
                }}
                disabled={isUpdating}
              >
                {isUpdating ? 'Canceling...' : 'Cancel Order'}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Order Items</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.orderDetails.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.product?.imageSet?.[0] && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img 
                            src={item.product.imageSet[0].image_url} 
                            alt={item.product.name}
                            className="h-10 w-10 object-cover rounded" 
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.product?.name || 'Unknown Product'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.productId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan="3" className="px-6 py-4 text-right font-medium">
                  Total
                </td>
                <td className="px-6 py-4 text-right font-bold">
                  {formatPrice(calculateTotal())}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;