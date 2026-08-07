// api/complete.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId dan txid wajib diisi' });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pi API Complete Error:', data);
      return res.status(response.status).json({ error: data.message || 'Gagal complete pembayaran di Pi Network' });
    }

    return res.status(200).json({ success: true, message: 'Pembayaran berhasil diselesaikan!', data });
  } catch (err) {
    console.error('Server Complete Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
