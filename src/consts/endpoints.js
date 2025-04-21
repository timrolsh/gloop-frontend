export const Endpoints = {
  "/api/auth": [
    {name: "user-login", address: "user/login"},
    {name: "user-refresh", address: "user/refresh-token"},
    {name: "greeting", address: "greeting"}
  ],

  "/api/liquidation": [{name: "liquidation-list", address: ""}],

  "/api/user": [
    {name: "referral", address: "referral"},
    {name: "leaderboard", address: "leaderboard"},
    {name: "me", address: "me"}
  ]
};
