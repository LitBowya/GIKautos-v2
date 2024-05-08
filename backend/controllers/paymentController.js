import dotenv from "dotenv";
import https from "https";

dotenv.config();

const payStack = {
  acceptPayment: async (req, res) => {
    try {
      const { email, amount, name } = req.body;

      const params = JSON.stringify({
        email: email,
        amount: amount * 100,
        name: name,
      });

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };

      const clientReq = https
        .request(options, (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => {
            data += chunk;
          });
          apiRes.on("end", () => {
            res.status(200).json(JSON.parse(data));
          });
        })
        .on("error", (error) => {
          console.error(error);
          res.status(400).json(error.message);
        });

      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },

  verifyPayment: async (req, res) => {
    const reference = req.params.reference;
    try {
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      const apiReq = https.request(options, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          const responseData = JSON.parse(data);
          res.status(200).json(responseData);
        });
      });

      apiReq.on("error", (error) => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      });

      apiReq.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },

  chargeCard: async (req, res) => {
    try {
      let { email, amount, authorization_code } = req.body;

      const params = JSON.stringify({
        email: email,
        amount: amount,
        authorization_code: authorization_code,
      });

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/charge_authorization",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };

      const request = https
        .request(options, (apiRes) => {
          let data = "";

          apiRes.on("data", (chunk) => {
            data += chunk;
          });

          apiRes.on("end", () => {
            console.log(JSON.parse(data));
            res.status(200).json(JSON.parse(data));
          });
        })
        .on("error", (error) => {
          console.error(error.message);
          res.status(500).json(error.message);
        });

      request.write(params);
      request.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

const initializePayment = payStack;
export default initializePayment;
