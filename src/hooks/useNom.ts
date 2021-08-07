import React from "react";
import NomMetadata from "src/abis/nomspace/Nom.json";
import { Nom } from "src/generated/Nom";
import { useContractKit } from "@celo-tools/use-contractkit";
import { ethers } from "ethers";
import { NOM } from "src/config";
import { AbiItem } from "web3-utils";
import { useAsyncState } from "./useAsyncState";

export const useNom = (name: string) => {
  const { kit, network } = useContractKit();

  const call = React.useCallback(async () => {
    const nom = new kit.web3.eth.Contract(
      NomMetadata.abi as AbiItem[],
      NOM[network.chainId]
    ) as unknown as Nom;

    const resolution = await nom.methods
      .resolve(ethers.utils.formatBytes32String(name))
      .call();

    const owner = await nom.methods
      .nameOwner(ethers.utils.formatBytes32String(name))
      .call();

    const expiration = await nom.methods
      .expirations(ethers.utils.formatBytes32String(name))
      .call();

    return { resolution, owner, expiration };
  }, [kit, network, name]);

  return useAsyncState(null, call);
};