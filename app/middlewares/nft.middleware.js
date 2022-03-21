const path = require('path');
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

// Save it to IPFS
const saveNftToStorage = async (name, description, filePath, mimeType) => {
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_KEY,
  });
  const fileExtension = mimeType.split('/')[1];
  try {
    const metadata = await client.store({
      name,
      description,
      image: new File([fs.readFileSync(filePath)], `${name}.${fileExtension}`, {
        type: mimeType,
      }),
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

    const metaData = await saveNftToStorage(
      req.body.name,
      req.body.description,
      filePath,
      req.files.image.mimetype
    );

    if (!metaData.success) {
      return res.status(500).send({
        message: metaData.error,
      });
    }

    req.body.filePath = filePath;
    req.body.metadataUrl = metaData.data;
    return next();
  });
	return next();
};
