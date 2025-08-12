# Deployment Guide

## Mac App Distribution

This project uses GitHub Actions to automatically build Mac app bundles (.dmg and .app) for distribution.

### CI/CD Workflow

The `.github/workflows/build-mac.yml` workflow:
- Triggers on pushes to main branch and version tags
- Builds the Tauri app for macOS
- Uploads artifacts for download
- Creates releases automatically for version tags

### Code Signing Setup (Optional)

For distribution outside the App Store, you'll need to set up code signing:

1. **Get a Developer Certificate:**
   - Enroll in Apple Developer Program ($99/year)
   - Create a Developer ID Application certificate

2. **Export Private Key:**
   ```bash
   # Export from Keychain as .p12 file
   # Convert to base64 for GitHub secrets
   base64 -i certificate.p12 | pbcopy
   ```

3. **Set GitHub Secrets:**
   - `TAURI_SIGNING_PRIVATE_KEY`: Base64 encoded .p12 certificate
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: Certificate password

4. **Update tauri.conf.json:**
   ```json
   "macOS": {
     "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
   }
   ```

### Building Locally

```bash
# Install dependencies
bun install

# Build frontend
bun run build

# Build Mac app
cargo tauri build
```

The built app will be in `src-tauri/target/release/bundle/`.

### Distribution

- **Development**: Use the unsigned .app bundle
- **Public Distribution**: Use signed .dmg with notarization
- **App Store**: Requires additional configuration and review process

### Troubleshooting

- Ensure Xcode Command Line Tools are installed
- For signing issues, verify certificate in Keychain Access
- Check GitHub Actions logs for build errors