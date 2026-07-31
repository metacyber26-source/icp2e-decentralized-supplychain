module.exports = async (req, res) => {
  // Pengaturan Header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { paymentId } = req.body || {};
    const piApiKey = process.env.PI_API_KEY; // API Key dari Portal Developer Pi Network

    if (!paymentId) {
      return res.status(400).json({ success: false, message: "Payment ID wajib diisi" });
    }

    if (!piApiKey || piApiKey.trim() === "") {
      return res.status(500).json({ success: false, message: "PI_API_KEY belum dikonfigurasi pada Environment Variables Vercel." });
    }

    // Panggil API Resmi Pi Platform untuk Approve
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${piApiKey.trim()}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(200).json({
        success: false,
        message: `Respons non-JSON dari Server Pi (${response.status}): ${responseText.substring(0, 100)}`
      });
    }

    return res.status(200).json({ success: true, data: data });

  } catch (error) {
    return res.status(500).json({ success: false, message: `System Error: ${error.message}` });
  }
};
