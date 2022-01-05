import React from "react";
import { TextKey } from "config";
import { BASE_ADDR, ENS_ADDR } from "addresses";
import { useAsyncState } from "./useAsyncState";
import { useCeloProvider } from "hooks/useCeloProvider";
import { useCeloChainId } from "hooks/useCeloChainId";
import { BaseRegistrarImplementation__factory } from "generated";
import ENS, { labelhash } from "@ensdomains/ensjs";
import { ZERO_ADDRESS } from "utils/constants";
import { ENSJS } from "types/ensjs";

type NomResult = {
  resolution: string;
  owner: string;
  expiration: number;
  bio: string;
  website: string;
  github: string;
  discord: string;
  telegram: string;
  twitter: string;
};

export const useNom = (name?: string | null) => {
  const celoProvider = useCeloProvider();
  const celoChainId = useCeloChainId();

  const call = React.useCallback(async (): Promise<NomResult | null> => {
    const baseAddress = BASE_ADDR[celoChainId];
    const ensAddress = ENS_ADDR[celoChainId];
    if (!baseAddress || !ensAddress) {
      return null;
    }
    const ens: ENSJS = new ENS({
      provider: celoProvider,
      ensAddress,
    });
    const nom = ens.name(`${name}.nom`);
    const base = BaseRegistrarImplementation__factory.connect(
      baseAddress,
      celoProvider
    );

    const tokenId = labelhash(name);
    // TODO: multicall
    const [
      resolution,
      bio,
      website,
      github,
      discord,
      telegram,
      twitter,
      owner,
      expiration,
    ] = await Promise.all([
      await nom.getAddress(),
      await nom.getText(TextKey.DESCRIPTION),
      await nom.getText(TextKey.URL),
      await nom.getText(TextKey.GITHUB),
      await nom.getText(TextKey.DISCORD),
      await nom.getText(TextKey.TELEGRAM),
      await nom.getText(TextKey.TWITTER),
      await base.ownerOf(tokenId).catch(() => ZERO_ADDRESS),
      await base.nameExpires(tokenId).then((e) => e.toNumber()),
    ]);
    return {
      resolution,
      owner,
      expiration,
      bio,
      website,
      github,
      discord,
      telegram,
      twitter,
    };
  }, [celoProvider, celoChainId, name]);

  return useAsyncState(null, call);
};
