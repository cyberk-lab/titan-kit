# Transaction Signing Notes

## TxRaw Construction After Signing

When working with transaction signing in the interchain ecosystem, there are important considerations when constructing the TxRaw object after receiving the signature response.

### Key Points

1. **Signature Response Format**
   - After receiving the signature response from the wallet, we need to construct a TxRaw object
   - The signature needs to be converted from base64 to Uint8Array using `toByteArray()`

2. **TxRaw Structure**
   ```typescript
   const txRaw: TxRaw = {
     bodyBytes: signDoc.bodyBytes,      // Must be Uint8Array
     authInfoBytes: signDoc.authInfoBytes, // Must be Uint8Array
     signatures: [toByteArray(signature)]  // Convert base64 signature to Uint8Array
   };
   ```

3. **Important Note About interchainjs**
   - The interchainjs library returns `bodyBytes` and `authInfoBytes` as base64 strings
   - This can cause issues when constructing the TxRaw object
   - These bytes must be in Uint8Array format, not base64 strings

4. **Required Conversions**
   - Convert base64 signature to Uint8Array: `toByteArray(signature)`
   - Ensure bodyBytes and authInfoBytes are in Uint8Array format
   - Use `fromByteArray()` for base64 to Uint8Array conversion if needed

### Example Code

```typescript
// After receiving signDirectResponse
const txRaw: TxRaw = {
  bodyBytes: signDoc.bodyBytes,  // Must be Uint8Array
  authInfoBytes: signDoc.authInfoBytes, // Must be Uint8Array
  signatures: [
    toByteArray(signDirectResponse.signature.signature)
  ]
};

// Encode to bytes for broadcasting
const txRawBytes = TxRaw.encode(txRaw).finish();
```

### Common Issues
- Using base64 strings instead of Uint8Array for bodyBytes and authInfoBytes
- Not converting the signature from base64 to Uint8Array
- Using the wrong encoding format for any of the TxRaw fields 