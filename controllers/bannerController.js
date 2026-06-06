const Banner = require("../model/banner");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

const uploadBannerImage = async (req, bannerData) => {
    if (req.file) {
        const filePath = req.file.path;
        const uploadRes = await cloudinary.uploader.upload(filePath, {
            folder: "banners",
        });
        bannerData.image_url = uploadRes.secure_url;

        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            /* ignore temp-file cleanup failure */
        }
    }

    return bannerData;
};

exports.getAllBanners = (req, res) => {
    Banner.getAll((err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.getActiveBanners = (req, res) => {
    Banner.getActive((err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.getBannerById = (req, res) => {
    const { id_banner } = req.params;
    Banner.getById(id_banner, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.createBanner = async (req, res) => {
    try {
        const bannerData = await uploadBannerImage(req, { ...req.body });

        if (!bannerData.image_url) {
            return res.status(400).send("Vui lòng chọn ảnh banner hoặc nhập URL ảnh.");
        }

        Banner.create(bannerData, (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Banner created successfully");
        });
    } catch (err) {
        console.error("Error creating banner:", err);
        res.status(500).send(err.message || err);
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const { id_banner } = req.params;
        const bannerData = await uploadBannerImage(req, { ...req.body });

        if (!bannerData.image_url) {
            return res.status(400).send("Vui lòng chọn ảnh banner hoặc nhập URL ảnh.");
        }

        Banner.update(id_banner, bannerData, (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Banner updated successfully");
        });
    } catch (err) {
        console.error("Error updating banner:", err);
        res.status(500).send(err.message || err);
    }
};

exports.deleteBanner = (req, res) => {
    const { id_banner } = req.params;
    Banner.delete(id_banner, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Banner deleted successfully");
    });
};
