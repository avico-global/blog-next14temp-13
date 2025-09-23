import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { first_name, last_name, email, phone, message, user_ip } = req.body;

    // Get the host from headers or use the domain directly
    let host = req.headers.host;
    // Clean the host by removing www. and https://
    host = host.replace(/^www\./, "").replace(/^https?:\/\//, "");

    const config = {
      method: "post",
      url: `${process.env.NEXT_PUBLIC_SITE_MANAGER}/api/public/contact_us`,
      data: {
        first_name,
        last_name,
        email,
        phone,
        message,
        user_ip,
        domain_name: host,
      },
    };

    console.log("Request headers:", req.headers); // Debug log
    console.log("API config:", config); // Debug log

    const response = await axios.request(config);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message,
    });
  }
}
