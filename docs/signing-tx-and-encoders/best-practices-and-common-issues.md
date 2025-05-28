# Best Practices and Common Issues

## Best Practices

1. **Wallet Usage**
   * Import wallet instance directly (e.g., untitledWallet)
   * Use wallet.info.name for chain wallet initialization
   * Ensure wallet is properly configured
2. **Add Encoders Early**
   * Add all required encoders before using the signing client
   * Add them in your component initialization or setup phase
3. **Error Handling**
   * Always wrap signing operations in try-catch blocks
   * Handle specific error types appropriately
   * Provide user feedback for transaction status
4. **Fee Estimation**
   * Always provide appropriate fees for transactions
   * Consider using fee estimation for complex transactions
   * Include enough gas for the operation
5. **Message Construction**
   * Use MessageComposer for type-safe message creation
   * Validate message parameters before sending
   * Include all required fields in messages

## Common Issues

1. **Wallet Configuration**
   * Error: "Wallet not properly configured"
   * Solution: Ensure wallet is properly imported and configured
2. **Missing Encoders**
   * Error: "Unknown message type"
   * Solution: Add the required encoder using `addEncoders`
3. **Invalid Message Format**
   * Error: "Invalid message format"
   * Solution: Use MessageComposer to create messages
4. **Insufficient Fees**
   * Error: "Insufficient fees"
   * Solution: Increase the fee amount or gas limit
5. **Contract Execution Errors**
   * Error: "Contract execution failed"
   * Solution: Check contract message format and parameters
