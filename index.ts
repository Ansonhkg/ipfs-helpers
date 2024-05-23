import { importer } from "ipfs-unixfs-importer";

/**
 * Converts a string to a CID (Content Identifier) using IPFS.
 * @param str The input string to be converted.
 * @returns The CID (Content Identifier) generated from the input string.
 * @throws An error if the generated CID does not start with "Qm".
 */
export const stringToCidV0 = async (str: string) => {
  const blockput = {
    put: async (block: any) => {
      return block.cid;
    },
  };

  // Convert the input string to a Buffer
  const content = Buffer.from(str);

  // Import the content to create an IPFS file
  const files = importer([{ content }], blockput as any);

  // Get the first (and only) file result
  const result = (await files.next()).value;

  const ipfsHash = (result as any).cid.toString();

  if (!ipfsHash.startsWith("Qm")) {
    throw new Error("Generated hash does not start with Qm");
  }

  return ipfsHash;
};
