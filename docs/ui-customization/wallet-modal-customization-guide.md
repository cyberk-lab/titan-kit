# Wallet Modal Customization Guide

## 1. Basic Usage

The simplest way to use the wallet modal is to use the default `TitanKitModal`:

```typescript
import { TitanKitModal, TitanKitProvider } from '@titan-kit/react';

function App() {
  return (
    <TitanKitProvider
      chains={_chains}
      wallets={_wallets}
      assetLists={_assetLists}
      walletModal={TitanKitModal}  // Use default modal
    >
      <YourApp />
    </TitanKitProvider>
  );
}
```

## 2. Custom Modal Component

You can create your own modal component using shadcn/ui components:

```typescript
import { useWalletModal, WalletModalProps } from '@titan-kit/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Custom modal component
function CustomWalletModal({ isOpen, wallets, currentWallet, open, close }: WalletModalProps) {
  const { connect } = useWalletModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.info.name}
              variant="outline"
              className="flex items-center gap-3 h-auto py-4"
              onClick={() => connect(wallet)}
            >
              <img 
                src={wallet.info.logo} 
                alt={wallet.info.name} 
                className="w-8 h-8"
              />
              <span>{wallet.info.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## 3. Modal Props

The custom modal component should accept these props from `WalletModalProps`:

```typescript
interface WalletModalProps {
  isOpen: boolean;           // Controls modal visibility
  wallets: StatefulWallet[]; // List of available wallets
  currentWallet?: StatefulWallet; // Currently selected wallet
  open: () => void;          // Function to open modal
  close: () => void;         // Function to close modal
}
```

## 4. Using Modal Hook

The `useWalletModal` hook provides access to wallet functionality:

```typescript
const {
  wallets,           // List of available wallets
  connect,           // Function to connect wallet
  disconnect,        // Function to disconnect wallet
  isConnecting,      // Connection status
  error,            // Connection error
  selectedWallet,   // Currently selected wallet
} = useWalletModal();
```

## 5. Advanced Custom Modal Example

```typescript
import { useWalletModal, WalletModalProps } from '@titan-kit/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function CustomWalletModal({ isOpen, wallets, currentWallet, open, close }: WalletModalProps) {
  const { connect, isConnecting, error } = useWalletModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to your account
          </DialogDescription>
        </DialogHeader>

        {isConnecting ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Connecting...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
            {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-4">
            {wallets.map((wallet) => (
              <Button
                key={wallet.info.name}
                variant="outline"
                className={cn(
                  "flex items-center gap-3 h-auto py-4",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200"
                )}
                onClick={() => connect(wallet)}
              >
                <img 
                  src={wallet.info.logo} 
                  alt={wallet.info.name} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{wallet.info.name}</span>
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## 6. Best Practices

1. **Modal Design**
   * Use shadcn/ui components for consistent design
   * Follow Tailwind CSS best practices
   * Implement responsive design
   * Handle loading and error states
2. **Wallet Integration**
   * Support all provided wallets
   * Handle connection errors gracefully
   * Show connection status
   * Provide clear disconnect option
3. **User Experience**
   * Make wallet selection intuitive
   * Show wallet logos and names clearly
   * Provide helpful error messages
   * Allow easy modal closing

## 7. Common Issues

1. **Modal Visibility**
   * Ensure proper isOpen state management
   * Handle onOpenChange properly
   * Check z-index conflicts
2. **Wallet Connection**
   * Handle connection errors
   * Show loading states
   * Validate wallet availability
3. **Styling Issues**
   * Use Tailwind CSS classes effectively
   * Maintain consistent spacing
   * Handle dark/light mode
   * Ensure proper component composition
