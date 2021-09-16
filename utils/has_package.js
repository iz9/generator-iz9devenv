function hasPackage(pkg) {
  const pkgJson = this.packageJson
  const deps = pkgJson.get('dependencies')
  const devDeps = pkgJson.get('devDependencies')
  return !!(deps && deps[pkg]) || !!(devDeps && devDeps[pkg])
}

module.exports = hasPackage
