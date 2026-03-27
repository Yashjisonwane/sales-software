import React, { createContext, useContext, useState } from 'react';
import { ADMIN_SALES, ADMIN_CUSTOMERS } from '../data/mockData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [sales, setSales] = useState(ADMIN_SALES);
    const [customers, setCustomers] = useState(ADMIN_CUSTOMERS);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'alert', title: 'Payment Reminder', message: 'Payment for Enterprise Plan is due on March 1, 2026.', date: 'Today, 10:00 AM', unread: true },
        { id: 2, type: 'info', title: 'Invoice Generated', message: 'Invoice INV-2026-001 has been generated successfully.', date: 'Yesterday, 2:30 PM', unread: false },
    ]);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addSale = (newSale) => {
        const id = `SALE-${Math.floor(1000 + Math.random() * 9000)}`;
        setSales(prev => [
            { id, ...newSale },
            ...prev
        ]);

        addNotification({
            type: 'success',
            title: 'New Sale Added',
            message: `Sale ${id} has been recorded successfully.`,
        });
    };

    const updateSale = (id, updatedSale) => {
        setSales(prev => prev.map(sale => sale.id === id ? { ...sale, ...updatedSale } : sale));
    };

    const deleteSale = (id) => {
        setSales(prev => prev.filter(sale => sale.id !== id));
        addNotification({
            type: 'alert',
            title: 'Sale Deleted',
            message: `Sale record ${id} has been removed.`,
        });
    };

    const addCustomer = (newCustomer) => {
        const id = `CUST-${Math.floor(100 + Math.random() * 900)}`;
        setCustomers(prev => [
            { id, totalSales: 0, ...newCustomer },
            ...prev
        ]);
    };

    const updateCustomer = (id, updatedCustomer) => {
        setCustomers(prev => prev.map(cust => cust.id === id ? { ...cust, ...updatedCustomer } : cust));
    };

    const deleteCustomer = (id) => {
        setCustomers(prev => prev.filter(cust => cust.id !== id));
    };

    const addNotification = (notif) => {
        setNotifications(prev => [
            {
                id: Date.now(),
                date: 'Just Now',
                unread: true,
                ...notif
            },
            ...prev
        ]);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    return (
        <DataContext.Provider value={{
            sales,
            customers,
            notifications,
            addSale,
            updateSale,
            deleteSale,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            addNotification,
            markAllAsRead,
            toast,
            showToast
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
