// api/cancel.js
export default async function handler(req, res) {
  // Atur Header CORS agar bisa dipanggil frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { paymentId } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY; // Pastikan PI_API_KEY sudah dipasang di Environment Variables Vercel

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId wajib diisi' });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pi API Cancel Error:', data);
      return res.status(response.status).json({ error: data.message || 'Gagal cancel pembayaran di Pi Network' });
    }

    return res.status(200).json({ success: true, message: 'Pembayaran gantung berhasil dibatalkan', data });
  } catch (err) {
    console.error('Server Cancel Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
