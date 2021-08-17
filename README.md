# HackFS 2021


## Description
This is a mobile first, web application, that is meant to be used on mobile devices. It allows you to easily create an NFT of your meditation session. There is a timer, when the meditation session is complete, you can enter various meta data like your name, location, start and end time stamps, any notes and an auto generated image or one  of your own of your meditation space or anything you like. Users can buy and sell their meditation nfts inside the app marketplace. On the profile page they can update their user information. On the meditations list page they can view their nft collection of completed session, and ones that were bought and sold.


## How It's Made
Tell us about how you built this project; the nitty-gritty details. What technologies did you use?
The NFT and marketplace smart contracts were written in solidity using open zeppelin libraries. The App was built with Next.js and React. Tailwind CSS was used for styling, following the atomic styles methodology. Local storage was used for storing  user data. The navigation API  in the browser was used for getting the user geo coordinates. Nft.Storage was used for storing NFT meta data, as well as IPFS. Ethers.js was used for interacting with the Metamask wallet. Hardhat was used for running a local ethereum network, deploying  to Mumbai Polygon test net and the main net of Polygon. Hardhat and Waffle were also used to run the unit tests for the smart contracts.
