module.exports = {
  apps : [{
    name: "TakeBack API",
    script: "npm run start",
    watch: ["dist"],
    ignore_watch: ["node_modules"]
  }]
}
