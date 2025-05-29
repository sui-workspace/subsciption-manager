import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { bcs } from "@mysten/sui/bcs";
import { packageId, vaultObjectId } from "./constant";

const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
const userAddress =
  "0x05d6467b14c230a7441f942d691375af659e321c7e67504a08215b603e9fdec5"; // Get this from the connected wallet

const txb = new Transaction();

txb.moveCall({
  target: `${packageId}::vault::fetch_credit`,
  arguments: [
    txb.object(vaultObjectId), // The shared Vault object
    txb.pure.address(userAddress),
  ],
});

async function getCreditBalance(userAddressToQuery: string) {
  try {
    const result = await client.devInspectTransactionBlock({
      sender: userAddressToQuery,
      transactionBlock: txb,
    });

    if (result.effects.status.status === "success") {
      // The return value of your fetch_credit function will be here.
      // It will likely be in a raw/BCS format and might need decoding.
      // For a u64 return, the Sui SDK often helps with this.
      // The exact path to the return value can vary based on the SDK version
      // and the complexity of the transaction. Check the 'result.results'
      // or a similar field in the response.
      // For a simple moveCall like this, it's often in:
      // result.results[0].returnValues[0] which would be [value, type_tag]

      // Example of trying to get the u64 value (may need adjustment)
      const returnValues = result.results?.[0]?.returnValues;
      if (returnValues && returnValues.length > 0) {
        const [rawValue, typeTag] = returnValues[0];
        // For u64, rawValue should be a Uint8Array,
        // you might need to convert it to a number/BigInt
        // bcs.de('u64', Uint8Array.from(rawValue))
        // For u64, you'd typically use a BCS deserializer
        // or the SDK might provide a more direct way.
        // Let's assume the SDK handles deserialization or
        // provides a helper.

        // A more robust way if the SDK does not auto-deserialize complex types:
        // You would need to use a BCS schema to deserialize.
        // For simple u64 returns, it might be parsed more easily.

        // Let's assume for now the SDK gives you something usable or you find
        // the right parsing method in the result object.
        // The actual parsing can be tricky depending on the exact structure of `returnValues`.
        // Often, for simple values like u64, it might be more straightforward.
        // Look for a field that seems to hold the parsed return value directly.
        // If it's a Uint8Array, you'll need to decode it as a u64.
        // The @mysten/bcs library can be used for this.

        // For demonstration, let's simulate finding the value if it was parsed
        // For a single u64 return, it's usually straightforward from returnValues
        // For example, if result.results[0].returnValues[0] is [ [byte array], 'u64' ]
        // you would use a bcs instance to deserialize:

        const deserializedBalance = bcs.U64.parse(Uint8Array.from(rawValue));
        return deserializedBalance.toString();
      }
    } else {
      console.error("devInspect failed:", result.effects.status.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching credit balance:", error);
    return null;
  }
}

getCreditBalance(userAddress).then((balance) => {
  if (balance !== null) {
    console.log("Credit Balance:", balance);
  }
});
