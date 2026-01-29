import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const CafeteriaManagerDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cafeteria');
      const data = await response.json();
      setMenuItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (item) => {
    try {
      const response = await fetch('/api/cafeteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      setMenuItems([...menuItems, data]);
      alert('Menu item added successfully!');
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleUpdateItem = async (id, updates) => {
    try {
      const response = await fetch(`/api/cafeteria/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setMenuItems(menuItems.map(item => item._id === id ? data : item));
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <DashboardLayout title="Cafeteria Manager Dashboard">
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Management */}
        <div className="card menu-card">
          <h2>Menu Management</h2>
          {menuItems.length > 0 ? (
            <ul>
              {menuItems.map((item) => (
                <li key={item._id}>
                  <h3>{item.itemName}</h3>
                  <p>Category: {item.category}</p>
                  <p>Price: ${item.price}</p>
                  <p>Available: {item.availableQuantity}</p>
                  <p>Rating: {item.rating}/5 ({item.reviews.length} reviews)</p>
                  <button onClick={() => handleUpdateItem(item._id, { availableQuantity: item.availableQuantity + 5 })}>
                    Restock
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No menu items yet.</p>
          )}
        </div>

        {/* Add New Item */}
        <div className="card add-item-card">
          <h2>Add New Item</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleAddMenuItem({
              itemName: formData.get('itemName'),
              description: formData.get('description'),
              price: parseFloat(formData.get('price')),
              category: formData.get('category'),
              availableQuantity: parseInt(formData.get('quantity')),
            });
            e.target.reset();
          }}>
            <input type="text" name="itemName" placeholder="Item Name" required />
            <textarea name="description" placeholder="Description..."></textarea>
            <input type="number" step="0.01" name="price" placeholder="Price" required />
            <select name="category" required>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Snacks</option>
              <option>Beverages</option>
            </select>
            <input type="number" name="quantity" placeholder="Available Quantity" required />
            <button type="submit">Add Item</button>
          </form>
        </div>

        {/* Sales Overview */}
        <div className="card sales-card">
          <h2>Sales Overview</h2>
          {sales ? (
            <div>
              <p>Today's Sales: ${sales.todaySales}</p>
              <p>This Week: ${sales.weeklySales}</p>
              <p>This Month: ${sales.monthlySales}</p>
            </div>
          ) : (
            <p>No sales data available.</p>
          )}
        </div>

        {/* Customer Feedback */}
        <div className="card feedback-card">
          <h2>Customer Feedback</h2>
          {feedback.length > 0 ? (
            <ul>
              {feedback.map((fb) => (
                <li key={fb.id}>
                  <p>{fb.comment}</p>
                  <small>Rating: {fb.rating}/5</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No feedback yet.</p>
          )}
        </div>
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Loading dashboard...</p>}
      </div>
    </DashboardLayout>
  );
};

export default CafeteriaManagerDashboard;
