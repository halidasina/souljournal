const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { buyerId, oldPassword, newPassword } = JSON.parse(event.body);
    
    const store = getStore("buyers");
    const data = await store.get("list");
    const buyers = data ? JSON.parse(data) : [];
    
    const buyer = buyers.find(b => b.id === buyerId);
    if (!buyer) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Buyer not found' }) };
    if (buyer.password.toLowerCase() !== oldPassword.toLowerCase()) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Current password incorrect' }) };
    }
    if (newPassword.length < 6) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Password too short' }) };
    
    const updated = buyers.map(b => b.id === buyerId ? { ...b, password: newPassword.trim() } : b);
    await store.set("list", JSON.stringify(updated));
    
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
