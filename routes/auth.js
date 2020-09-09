import axios from "axios";
import express from "express";
import querystring from "querystring";

const router = express.Router();

const client_id = "oauthtestclient";
const client_secret = "abcd123456789";
const redirect_uri = "http://127.0.0.1:8000/cb";

router.post("/getToken", async (req, res) => {
  try {
    const queryParameters = {
      code: req.body.code,
      client_id: client_id,
      client_secret,
      grant_type: "authorization_code",
      redirect_uri,
    };

    const result = await axios.post(
      "https://webrd.sinotrade.com.tw/oauth2/token",
      querystring.stringify(queryParameters)
    );

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.post("/refreshToken", async (req, res) => {
  try {
    const queryParameters = {
      refresh_token: req.body.refresh_token,
      client_id: client_id,
      client_secret,
      grant_type: "refresh_token",
    };

    const result = await axios.post(
      "https://webrd.sinotrade.com.tw/oauth2/token",
      querystring.stringify(queryParameters)
    );

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.post("/getTestToken", async (req, res) => {
  try {
    const result = await axios.post(
      "https://webrd.sinotrade.com.tw/oauth2/api/v1/trust/getTestToken",
      querystring.stringify({}),
      {
        headers: { Authorization: `Bearer ${req.body.token}` },
      }
    );

    return res.json(result.data);
  } catch (error) {
    res.status(500).end();
  }
});

export default router;
