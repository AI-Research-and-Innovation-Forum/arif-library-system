// Calculate due date (default 14 days from now)
export const calculateDueDate = (days = 14) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
};

// Calculate fine for overdue books
export const calculateFine = (dueDate, returnDate = new Date()) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    
    if (returned <= due) return 0;
    
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // ₹5 per day fine
    return diffDays * 5;
}; 