const config = {};

config.passwordAlgorithm = process.env.PASSHASHALGO;
config.cryptoAlgo = process.env.CRYPTOALGO;
config.cryptoPass = process.env.CRYPTOPRIVATEKEY;
config.iv = process.env.IV;

module.exports = config;
