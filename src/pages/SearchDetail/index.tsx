import React from "react";
import { useNom } from "hooks/useNom";
import {
  useContractKit,
  useGetConnectedSigner,
  useProvider,
} from "@celo-tools/use-contractkit";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Spinner,
  Image,
  Text,
  Select,
} from "theme-ui";
import { ethers } from "ethers";
import { BlockText } from "components/BlockText";
import { shortenAddress } from "utils/address";
import { NOM, USD } from "config";
import { toastTx } from "utils/toastTx";
import { toast } from "react-toastify";
import { isAddress, parseUnits } from "ethers/lib/utils";
import { QRNameModal } from "components/QRNameModal";
import { SearchBar } from "components/SearchBar";
import { AccountProfile } from "components/AccountProfile";
import { ZERO_ADDRESS } from "utils/constants";
import QRCode from "qrcode.react";
import { BlockscoutAddressLink } from "components/BlockscoutAddressLink";
import { ERC20__factory, Nom__factory } from "generated";
import { useNomSetSetting } from "hooks/useNomSetSetting";
import { normalize } from "eth-ens-namehash";

/* ASSETS */
import pfp from "./assets/pfp.png";
import banner from "./assets/banner.png";

// connections
import discord from "./assets/discord.png";
import twitter from "./assets/twitter.png";
import telegram from "./assets/telegram.png";

/* DEMO PURPOSES, DELETE LATER */
// nfts
import nft1 from "./assets/nft1.png";
import nft2 from "./assets/nft2.png";
import nft3 from "./assets/nft3.png";

// tokens
import t1 from "./assets/t1.png";
import t2 from "./assets/t2.png";
import t3 from "./assets/t3.png";
import t4 from "./assets/t4.png";
import t5 from "./assets/t5.png";
import t6 from "./assets/t6.png";
import t7 from "./assets/t7.png";
import t8 from "./assets/t8.png";

// stats
import life2 from "./assets/life1.png";
import life1 from "./assets/life2.png";
import networth from "./assets/networth.png";
import whale from "./assets/whale.png";

// sources
import s1 from "./assets/s1.png";
import s2 from "./assets/s2.png";
import s3 from "./assets/s3.png";

// nomstronaut
import nomstronaut from "./assets/astro.png";

//noms
import nom1 from "./assets/nom1.png";
import nom2 from "./assets/nom2.png";

const noms = [
  { img: nom1, name: "gza", date: "08/18/23" },
  { img: nom2, name: "zatoichi", date: "12/03/22" },
];

const connections = [
  {
    img: discord,
    src: "aaaa",
  },
  {
    img: twitter,
    src: "bbbb",
  },
  {
    img: telegram,
    src: "cccc",
  },
];
const tags = [
  { name: "farmer", color: "green" },
  { name: "lender", color: "blue" },
  { name: "borrower", color: "red" },
  { name: "staker", color: "yellow" },
];
const nfts = [
  {
    img: nft1,
    name: "Alice Red or Blue Pill",
    id: "00001",
    os: "",
  },
  {
    img: nft2,
    name: "CeloPunk",
    id: "00420",
    os: "",
  },
  {
    img: nft3,
    name: "Zatoichi",
    id: "003",
    os: "",
  },
];
const tokens = [
  {
    img: t1,
    name: "",
  },
  {
    img: t2,
    name: "",
  },
  {
    img: t3,
    name: "",
  },
  {
    img: t4,
    name: "",
  },
  {
    img: t5,
    name: "",
  },
  {
    img: t6,
    name: "",
  },
  {
    img: t7,
    name: "",
  },
  {
    img: t8,
    name: "",
  },
];
const stats = { life: 10.3, netWorth: 42.69, nomWhaleInd: "0.71" };
const sources = [{ img: s1 }, { img: s2 }, { img: s3 }];

/* DEMO PURPOSES, DELETE LATER */

export const SearchDetail: React.FC = () => {
  let { name } = useParams<{ name: string }>();
  name = normalize(name);

  const { address, network } = useContractKit();
  const provider = useProvider();
  const getConnectedSigner = useGetConnectedSigner();
  const [nom, refetchNom] = useNom(name);
  console.log("NOM", nom);
  const { setNomSetting, loading } = useNomSetSetting(name);
  const [changeOwnerLoading, setChangeOwnerLoading] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);
  const history = useHistory();
  const sendCUSD = React.useCallback(
    async (amount: string) => {
      const usdAddress = USD[network.chainId];
      if (!usdAddress || !nom) return;
      const signer = await getConnectedSigner();
      const usd = ERC20__factory.connect(usdAddress, signer);
      const decimals = await usd.decimals();
      const gasPrice = await provider.getGasPrice();
      const tx = await usd.transfer(
        nom.resolution,
        parseUnits(amount, decimals),
        { gasPrice: gasPrice }
      );
      toastTx(tx.hash);
    },
    [getConnectedSigner, network.chainId, nom, provider]
  );

  const isOwner =
    address && nom && nom.owner.toLowerCase() === address.toLowerCase();
  return (
    <>
      {/* Modals */}
      <Flex>
        {/* Sidebar */}
        <Box variant="search.sidebar.container">
          <Flex variant="search.sidebar.walletContainer">
            <AccountProfile />{" "}
            <select>
              {sources.map((e) => {
                return (
                  <option value="celo">
                    <b>basdf</b>
                    {/* <Box sx={{ backgroundImage: `url(${e.img})` }}></Box> */}
                  </option>
                );
              })}
            </select>
          </Flex>
          <Box variant="search.sidebar.noms.container">
            <Heading variant="search.sidebar.heading">My Noms</Heading>
            {noms.map((e) => {
              return (
                <Box
                  variant="search.sidebar.item"
                  sx={{ "::before": { display: "none" } }}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Flex sx={{ alignItems: "center" }}>
                      <Box variant="search.sidebar.nom.container">
                        <Box
                          variant="search.sidebar.nom.image"
                          sx={{ backgroundImage: `url(${e.img})` }}
                        ></Box>
                      </Box>
                      <Text variant="search.sidebar.nom.name">{e.name}</Text>
                    </Flex>
                    <Text variant="search.sidebar.nom.date">{e.date}</Text>
                  </Flex>
                </Box>
              );
            })}
          </Box>
          <Box variant="search.sidebar.settings.container">
            <Heading variant="search.sidebar.heading">Settings</Heading>
            <Text variant="search.sidebar.item">Light / Dark Mode</Text>
            <Text variant="search.sidebar.item">Default Currency</Text>
            <Text variant="search.sidebar.item">Language</Text>
          </Box>
          <Box variant="search.sidebar.search">
            <SearchBar />
          </Box>
        </Box>
        {/* Page */}
        <Flex
          sx={{
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {/* Banner */}
          <Box variant="search.banner.container">
            <Box
              variant="search.banner.image"
              sx={{
                backgroundImage: `url(${banner})`,
              }}
            />
            <Image variant="search.banner.avatar" src={pfp} />
            {/* nomstronaut + tip */}
            <Flex variant="search.nomstronautTip.container">
              <Box variant="search.nomstronautTip.imageContainer">
                <Box
                  variant="search.nomstronautTip.image"
                  sx={{
                    backgroundImage: `url(${nomstronaut})`,
                  }}
                ></Box>
              </Box>
              <Box variant="search.nomstronautTip.connectionsContainer">
                {/* Connections */}
                <Flex>
                  {connections.map((e) => {
                    return (
                      <Box variant="search.connection.imageContainer">
                        <Box
                          variant="search.connection.image"
                          sx={{
                            backgroundImage: `url(${e.img})`,
                          }}
                        ></Box>
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
              <Button variant="search.nomstronautTip.tip">TIP</Button>
            </Flex>
          </Box>

          {/* Main Body */}
          <Box variant="search.details.container">
            <Flex variant="search.details.heading">
              {/* Name & Description */}
              <Box variant="search.name.container">
                <Flex variant="search.name.nameContainer">
                  <Heading variant="search.name.heading">{name}</Heading>
                  <Heading
                    variant="search.name.heading"
                    sx={{ color: "#D9D9D9" }}
                  >
                    .nom
                  </Heading>
                  {sources.map((e) => {
                    return (
                      <Box variant="search.name.source.imageContainer">
                        <Box
                          variant="search.name.source.image"
                          sx={{
                            backgroundImage: `url(${e.img})`,
                          }}
                        ></Box>
                      </Box>
                    );
                  })}
                </Flex>
                <Heading variant="search.name.subHeading">
                  don't test my liquid swords
                </Heading>
              </Box>
              <Box>
                {/* Connections */}
                <Flex variant="search.connection.container">
                  {connections.map((e) => {
                    return (
                      <Box variant="search.connection.imageContainer">
                        <Box
                          variant="search.connection.image"
                          sx={{
                            backgroundImage: `url(${e.img})`,
                          }}
                        ></Box>
                      </Box>
                    );
                  })}
                </Flex>
                {/* Tags */}
                <Box variant="search.rowScrollContainer">
                  {tags.map((e) => {
                    return (
                      <Box variant={`search.tag.${e.color}`}>{e.name}</Box>
                    );
                  })}
                </Box>
              </Box>
            </Flex>
            {/* NFTs */}
            <Heading variant="search.heading">NFTs</Heading>
            <Box variant="search.rowScrollContainer">
              {nfts.map((e) => {
                return (
                  <Box variant="search.nft.imageContainer">
                    <Box
                      variant="search.nft.image"
                      sx={{
                        backgroundImage: `url(${e.img})`,
                      }}
                    ></Box>
                  </Box>
                );
              })}
            </Box>
            {/* Tokens */}
            <Heading variant="search.heading">Tokens</Heading>
            <Box variant="search.rowScrollContainer">
              {tokens.map((e) => {
                return (
                  <Box variant="search.token.imageContainer">
                    <Box
                      variant="search.token.image"
                      sx={{
                        backgroundImage: `url(${e.img})`,
                      }}
                    ></Box>
                  </Box>
                );
              })}
            </Box>
            {/* Stats */}
            <Heading variant="search.heading">Stats</Heading>
            <Box variant="search.stat.container">
              <Flex variant="search.stat.row">
                <Box variant="search.stat.icon">
                  <Image src={life1} variant="search.stat.life1Icon" />
                  <Image src={life2} variant="search.stat.life2Icon" />
                </Box>
                <Heading variant="search.stat.heading">Life:&nbsp;</Heading>
                <Text variant="search.stat.text">
                  {new Intl.NumberFormat().format(stats.life)} Blocks
                </Text>
              </Flex>
              <Box variant="search.stat.divider"></Box>
              <Flex variant="search.stat.row">
                <Image src={networth} variant="search.stat.icon" />
                <Heading variant="search.stat.heading">
                  Net Worth:&nbsp;
                </Heading>
                <Text variant="search.stat.text">
                  ${new Intl.NumberFormat().format(stats.netWorth)}
                </Text>
              </Flex>
              <Box variant="search.stat.divider"></Box>
              <Flex variant="search.stat.row">
                <Image src={whale} variant="search.stat.icon" />
                <Heading variant="search.stat.heading">
                  Nom Whale Index:&nbsp;
                </Heading>
                <Text variant="search.stat.text">{stats.nomWhaleInd}%</Text>
              </Flex>
            </Box>
            {/* Sources */}
            <Heading variant="search.heading">Sources</Heading>
            <Box variant="search.rowScrollContainer">
              <Text variant="search.source.text">
                View on Block Explorers: &nbsp;&nbsp;
              </Text>
              {sources.map((e) => {
                return (
                  <Box variant="search.source.imageContainer">
                    <Box
                      variant="search.source.image"
                      sx={{
                        backgroundImage: `url(${e.img})`,
                      }}
                    ></Box>
                  </Box>
                );
              })}
            </Box>
            {/* Footer */}
            {/* absolutely positioned */}
            <Box variant="search.footer.container">
              <Box variant="search.footer.wallet"></Box>
              <Box variant="search.footer.moreContainer">
                <Box variant="search.footer.more"></Box>
                <Box variant="search.footer.search"></Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
