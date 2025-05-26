const fs = require('fs');
const path = require('path');

const folderToIgnore = ['packages/interchain-kit', 'packages/titan-kit'];

const packagesInPackageFolder = fs.readdirSync('./packages');
const packagesInWallets = fs.readdirSync('./wallets');

const needToInjectDevCommandPackages = [
  ...packagesInPackageFolder.map((n) => path.join('./packages', n)),
  ...packagesInWallets.map((n) => path.join('./wallets', n)),
].filter((n) => !folderToIgnore.includes(n));

needToInjectDevCommandPackages.forEach((packagePath) => {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
  let packageJson = JSON.parse(packageJsonString);

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  delete packageJson.scripts.dev;
  packageJson.scripts['watch:dev'] = `tsc -w -p tsconfig.esm.json & tsc -w`;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2).concat('\n')
  );
});
