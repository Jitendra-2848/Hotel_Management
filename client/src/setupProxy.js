const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const backendTarget =
    process.env.API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8000";

  app.use(
    ["/auth", "/rooms", "/api"],
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      secure: false,
    })
  );
};
