module.exports = {
  siteUrl: "https://mysmme.com",
  generateRobotsTxt: true,

  exclude: [
    "/admin",
    "/admin/**",

    "/account",
    "/account/**",

    "/checkout",
    "/checkout/**",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/checkout"],
      },
    ],
  },
};
