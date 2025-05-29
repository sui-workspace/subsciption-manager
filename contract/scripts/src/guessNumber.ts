import { Transaction } from "@mysten/sui/transactions";
import { SuiClient, getFullnodeUrl, SuiEvent } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { packageId, vaultObjectId } from "./constant";
import { getKeypairFromBech32Priv } from "./helpers";

const GUESER_PRIVATE_KEY = "suiprivkey1";

const guessedNumber = 42; // The number to guess
const SUI_NETWORK: "mainnet" | "testnet" | "devnet" | "localnet" = "mainnet"; // Ensure this is the network your contract is on

// Define the expected event type string for your new event.
// This usually follows the format: <package_id>::<module_name>::<EventStructName>
// Assuming your module is named 'vault' and event struct is 'GuessMade'. Adjust if different.
const GUESS_EVENT_TYPE = `${packageId}::vault::GuessMade`;

async function callGuessFunction() {
  const client = new SuiClient({ url: getFullnodeUrl(SUI_NETWORK) });
  let keypair: Ed25519Keypair;
  try {
    keypair = getKeypairFromBech32Priv(GUESER_PRIVATE_KEY);
  } catch (error) {
    console.error("Failed to initialize keypair:", error);
    return;
  }

  const userAddress = keypair.getPublicKey().toSuiAddress();
  console.log(`Using address: ${userAddress} on ${SUI_NETWORK} network.`);
  console.log(
    `Attempting to guess the number: ${guessedNumber} for vault: ${vaultObjectId}`
  );

  const txb = new Transaction();

  txb.moveCall({
    target: `${packageId}::vault::guess`,
    arguments: [txb.object(vaultObjectId), txb.pure.u64(guessedNumber)],
  });

  try {
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true, // Crucial for reading the event data
      },
    });

    console.log("Transaction Digest:", result.digest);

    if (result.effects?.status.status === "success") {
      console.log("Transaction to call 'guess' was successful!");

      if (result.events && result.events.length > 0) {
        const guessMadeEvent = result.events.find(
          (event: SuiEvent) => event.type === GUESS_EVENT_TYPE
        );

        if (guessMadeEvent) {
          console.log("GuessMade Event Found:", guessMadeEvent.parsedJson);

          const eventData = guessMadeEvent.parsedJson as {
            user?: string;
            guessed_number?: string | number; // Event field might be string representation of u64
            is_correct?: boolean;
            timestamp_ms?: string | number; // Event field might be string representation of u64
            [key: string]: any;
          };

          if (typeof eventData.is_correct === "boolean") {
            console.log(
              `Your guess of ${guessedNumber} was: ${
                eventData.is_correct ? "Correct! :-)" : "Incorrect :-("
              }`
            );
            console.log(
              `Guesser: ${eventData.user}, Guessed Number (from event): ${eventData.guessed_number}, Timestamp: ${eventData.timestamp_ms}`
            );
          } else {
            console.warn(
              "Could not determine guess correctness from GuessMade event. 'is_correct' field missing or not a boolean.",
              eventData
            );
          }
        } else {
          console.warn(
            `Could not find event of type '${GUESS_EVENT_TYPE}'. Please check:
            1. The GUESS_EVENT_TYPE string in the script ('${GUESS_EVENT_TYPE}') matches your contract event signature (<packageId>::<moduleName>::GuessMade).
            2. Your contract module is named 'vault' (or update in GUESS_EVENT_TYPE).
            3. The contract actually emitted the event.`
          );
          console.log("Available events from this transaction:");
          result.events.forEach((e: SuiEvent) =>
            console.log(`- Type: ${e.type}, Content:`, e.parsedJson)
          );
        }
      } else {
        console.warn(
          "No events found in the transaction result. Was the GuessMade event emitted?"
        );
      }
    } else {
      console.error("Transaction failed:", result.effects?.status.error);
    }
  } catch (error) {
    console.error("Error executing transaction:", error);
  }
}

callGuessFunction().catch((err) => {
  console.error("Unhandled error in script:", err);
});
