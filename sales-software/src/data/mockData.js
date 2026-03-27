export const ADMIN_SALES = [
    { id: 'SALE-1001', customer: 'Acme Corporation', product: 'Enterprise Software License', amount: 48500, dueDate: 'Mar 12, 2026', status: 'Pending' },
    { id: 'SALE-1002', customer: 'Global Tech Solutions', product: 'Annual Support Package', amount: 12400, dueDate: 'Feb 28, 2026', status: 'Paid' },
    { id: 'SALE-1003', customer: 'Sunrise Industries', product: 'Professional Services', amount: 15200, dueDate: 'Mar 15, 2026', status: 'Pending' },
    { id: 'SALE-1004', customer: 'BlueStar Trading Co.', product: 'Software Upgrade Plan', amount: 8900, dueDate: 'Mar 22, 2026', status: 'Paid' },
    { id: 'SALE-1005', customer: 'Horizon Logistics', product: 'Consulting Package', amount: 22000, dueDate: 'Apr 1, 2026', status: 'Pending' },
];

export const ADMIN_CUSTOMERS = [
    { id: 'CUST-001', name: 'Acme Corporation', email: 'contact@acme.com', phone: '+1 (800) 123-4567', totalSales: 48500 },
    { id: 'CUST-002', name: 'Global Tech Solutions', email: 'info@globaltech.com', phone: '+1 (800) 234-5678', totalSales: 12400 },
    { id: 'CUST-003', name: 'Sunrise Industries', email: 'admin@sunrise.com', phone: '+1 (800) 345-6789', totalSales: 15200 },
    { id: 'CUST-004', name: 'BlueStar Trading Co.', email: 'sales@bluestar.com', phone: '+1 (800) 456-7890', totalSales: 8900 },
    { id: 'CUST-005', name: 'Horizon Logistics', email: 'info@horizon.com', phone: '+1 (800) 567-8901', totalSales: 22000 },
];

export const CUSTOMER_SALES = [
    { id: 'SALE-1001', product: 'Enterprise Software License', amount: 48500, dueDate: 'Mar 12, 2026', status: 'Pending' },
    { id: 'SALE-1004', product: 'Software Upgrade Plan', amount: 8900, dueDate: 'Mar 22, 2026', status: 'Paid' },
    { id: 'SALE-1005', product: 'Consulting Package', amount: 22000, dueDate: 'Apr 1, 2026', status: 'Pending' },
];

export const INVOICES = [
    { id: 'INV-2026-001', amount: 8900, status: 'Paid', date: 'Feb 22, 2026' },
    { id: 'INV-2026-002', amount: 48500, status: 'Pending', date: 'Mar 12, 2026' },
    { id: 'INV-2026-003', amount: 22000, status: 'Pending', date: 'Apr 1, 2026' },
];
