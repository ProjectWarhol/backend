const path = require('path');
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

// Save it to IPFS
const saveNftToStorage = async (req, filePath) => {
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_KEY,
  });
  const fileExtension = req.files.image.mimetype.split('/')[1];
  try {
    const metadata = await client.store({
      name: req.body.name,
      description: req.body.description,
      image: new File([fs.readFileSync(filePath)], `${req.body.name}.${fileExtension}`, {
        type: req.files.image.mimetype,
      }),
      attributes: {
        creatorUsername: req.body.creatorUsername,
        creatorAdress: req.body.creatorAdress,
        ownerAdress: req.body.ownerAdress,
        createdAt: req.body.date,
        location: req.body.location,
        positionInTree: req.body.positionInTree,
        amountSold: req.body.amountSold
      }
    });
    return { success: true, data: metadata.url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload NFT to NftStorage
exports.uploadNft = (req, res, next) => {
  if (!req.files) {
    return res.status(400).send({
      message: 'No files were uploaded',
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
