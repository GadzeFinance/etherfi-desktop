module.exports = merge(base, {
    mode: "production",
    devtool: false,
    optimization: {
        minimize: true
    }
});