import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useSignMessage,
} from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "@/wagmi";

export function ConnectAndSIWE() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const client = usePublicClient();

  const [signature, setSignature] = useState<Hex | undefined>(undefined);
  const [message, setMessage] = useState<SiweMessage | undefined>(undefined);
  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (sig) => {
        setSignature(sig);
      },
    },
  });

  const { connect } = useConnect({
    mutation: {
      onSuccess: (data) => {
        const addr = data.accounts[0];
        const chainId = data.chainId;

        const m = new SiweMessage({
          domain: window.location.host,
          address: addr,
          chainId,
          uri: window.location.origin,
          version: "1",
          statement: "Smart Wallet SIWE Example",
          nonce: "12345678", // in production, fetch from backend
        });

        setMessage(m);
        signMessage({ message: m.prepareMessage() });
      },
    },
  });

  const checkValid = useCallback(async () => {
    if (!signature || !address || !client || !message) return;

    const isValid = await client.verifyMessage({
      address,
      message: message.prepareMessage(),
      signature,
    });

    setValid(isValid);
  }, [signature, address, client, message]);

  useEffect(() => {
    checkValid();
  }, [signature]);

  function truncateAddress(address: string, chars = 4) {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: cbWalletConnector })}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Smart Wallet
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <p className="text-green-600">{truncateAddress(address || "")}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      )}

      {valid !== undefined && (
        <p className={valid ? "text-green-500" : "text-red-500"}>
          SIWE Verified: {valid.toString()}
        </p>
      )}
    </div>
  );
}
