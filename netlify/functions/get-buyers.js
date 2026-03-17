const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const store = getStore("buyers");
    const data = await store.get("list");
    const buyers = data ? JSON.parse(data) : [];
    return { statusCode: 200, headers, body: JSON.stringify({ buyers }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message, buyers: [] }) };
  }
};
