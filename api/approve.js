export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { paymentId } = req.body;
        const piApiKey = process.env.PI_API_KEY; // API Key dari Pi Developer Portal

        // Memanggil API Resmi Pi Network untuk Approve
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${piApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return res.status(200).json({ message: "Approved successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Approval error", error: error.message });
    }
}
