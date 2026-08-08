import { getDB } from './db';

export const addCustomer = async (name: string, phone: string, email: string, address: string = '') => {
  const db = getDB();
  const result = await db.runAsync(
    'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
    [name, phone, email, address]
  );
  return result.lastInsertRowId;
};

export const getCustomers = async () => {
  const db = getDB();
  return await db.getAllAsync('SELECT * FROM customers ORDER BY name ASC');
};

export const getCustomerById = async (id: number) => {
  const db = getDB();
  const result = await db.getAllAsync('SELECT * FROM customers WHERE id = ?', [id]);
  return result[0] || null;
};

export const addProduct = async (name: string, price: number, gstRate: number = 18, quantity: number = 0, hsnCode: string = '') => {
  const db = getDB();
  const result = await db.runAsync(
    'INSERT INTO products (name, price, gst_rate, quantity, hsn_code) VALUES (?, ?, ?, ?, ?)',
    [name, price, gstRate, quantity, hsnCode]
  );
  return result.lastInsertRowId;
};

export const getProducts = async () => {
  const db = getDB();
  return await db.getAllAsync('SELECT * FROM products ORDER BY name ASC');
};

export const updateProductQuantity = async (productId: number, quantity: number) => {
  const db = getDB();
  await db.runAsync('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, productId]);
};

export const createInvoice = async (
  customerId: number | null,
  items: Array<{ productId: number; quantity: number; price: number }>
) => {
  const db = getDB();
  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  let total = 0;
  for (const item of items) {
    total += item.quantity * item.price;
  }
  
  const cgst = total * 0.09;
  const sgst = total * 0.09;
  const grandTotal = total + cgst + sgst;

  const result = await db.runAsync(
    'INSERT INTO invoices (invoice_number, customer_id, total, cgst, sgst, grand_total) VALUES (?, ?, ?, ?, ?, ?)',
    [invoiceNumber, customerId, total, cgst, sgst, grandTotal]
  );
  const invoiceId = result.lastInsertRowId;

  for (const item of items) {
    await db.runAsync(
      'INSERT INTO invoice_items (invoice_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
      [invoiceId, item.productId, item.quantity, item.price, item.quantity * item.price]
    );
    await updateProductQuantity(item.productId, item.quantity);
  }

  return invoiceId;
};

export const getInvoices = async () => {
  const db = getDB();
  return await db.getAllAsync(`
    SELECT i.*, c.name as customer_name 
    FROM invoices i 
    LEFT JOIN customers c ON i.customer_id = c.id 
    ORDER BY i.created_at DESC
  `);
};

export const getInvoiceById = async (id: number) => {
  const db = getDB();
  const invoiceResult = await db.getAllAsync('SELECT * FROM invoices WHERE id = ?', [id]);
  const itemsResult = await db.getAllAsync(`
    SELECT ii.*, p.name as product_name 
    FROM invoice_items ii 
    LEFT JOIN products p ON ii.product_id = p.id 
    WHERE ii.invoice_id = ?
  `, [id]);
  
  return {
    invoice: invoiceResult[0],
    items: itemsResult
  };
};

export const updateInvoiceStatus = async (id: number, status: 'pending' | 'paid') => {
  const db = getDB();
  await db.runAsync('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
};
