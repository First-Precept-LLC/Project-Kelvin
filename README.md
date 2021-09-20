# Project-Kelvin
Project Kelvin is a financial system in alignment with the first precept of Buddhism.  Just like google pagerank caused people to optimize their content for search engines (SEO), we're working to **create new algorithms that cause people to optimize their actions for wisdom.** (WEO)

There are several parts to it. 

reputationToken.sol is our **token minting contract**, it's deployed on ethereum (address listed in the comments of that file) and uses a bonding curve to mint new tokens. Those tokens are then immediately sent over the **rainbow bridge** (in the Rainbow Bridge Front End) contract, and tracked on NEAR using our indexer (in the kelvin-indexer folder, using code from Fayyr-indexer).

Those transactions are then sent to our **API** (near-wallet-API-server), which captures them in our database, and lists them in our **Venmo-like frontend** (frontend folder).  There, people's transactions can be voted on based on how good they are for the world, and those people can earn votes to vote on others' transactions (the **algorithm for this lives in the Javascript Translation** folder, and the data goes through our API).

In addition to this "subjective" ranking, all transactions can be ranked in a more "objective" way using our "Impact Analysis" framework.  By clicking on the "Analyze Impact" button, anyone can analyze the impact of a transaction.  Right now, we are **pinging a Carbon Impact API (carboninterface.com)** that can pull the carbon imapct of a flight into our impact analysis framework, (also in the near-wallet-api-server). In the future, we aim to allow many more automated, as well as manual tools to analyze complex systems for their imapct.

This impact then gets calculated back into the vote count.

Based on this vote count, token rewards from the minting process over time are sent to people who have had positive impact, via an **oracle that pings our API.**

