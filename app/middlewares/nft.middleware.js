const path = require('path');
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

// Save it to IPFS
const saveNftToStorage = async (req, filePath) => {
  const {
    name,
    description,
    creatorUsername,
    creatorAdress,
    ownerAdress,
    date,
    location,
    positionInTree,
    amountSold,
  } = req.body;

  const fileExtension = req.files.image.mimetype.split('/')[1];
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_KEY,
  });

  try {
    const metadata = await client.store({
      name,
      description,
      image: new File([fs.readFileSync(filePath)], `${name}.${fileExtension}`, {
        type: req.files.image.mimetype,
      }),
      attributes: {
        creatorUsername,
        creatorAdress,
        ownerAdress,
        date,
        location,
        positionInTree,
        amountSold,
      },
    });
    return { success: true, data: metadata.url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload NFT to NftStorage
// eslint-disable-next-line consistent-return
exports.uploadNft = (req, res, next) => {
  if (!req.files) {
    return res.status(400).send({
      message: 'No file in body',
    });
  }

  if (!req.body.name) {
    return res.status(400).send({
      message: 'No name in body',
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      message: 'No description in body',
    });
  }

  if (!req.body.creatorUsername) {
    return res.status(400).send({
      message: 'No creatorUsername in body',
    });
  }

  if (!req.body.creatorAddress) {
    return res.status(400).send({
      message: 'No creatorAddress in body',
    });
  }

  if (!req.body.ownerAddress) {
    return res.status(400).send({
      message: 'No ownerAddress in body',
    });
  }

  if (!req.body.date) {
    return res.status(400).send({
      message: 'No date in body',
    });
  }

  if (!req.body.location) {
    return res.status(400).send({
      message: 'No location in body',
    });
  }

  if (!req.body.positionInTree) {
    return res.status(400).send({
      message: 'No positionInTree in body',
    });
  }

  if (!req.body.amountSold) {
    return res.status(400).send({
      message: 'No amountSold in body',
    });
  }

  const file = req.files.image;
  const filePath = path.join(__dirname, '/tmp_nft_sources/', file.name);

  file.mv(filePath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const metaData = await saveNftToStorage(req, filePath);

    if (!metaData.success) {
      return res.status(500).send({
        message: metaData.error,
      });
    }

    req.body.filePath = filePath;
    req.body.metadataUrl = metaData.data;
    return next();
  });
};
