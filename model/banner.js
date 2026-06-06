const db = require("../config/config");

const Banner = {
    getAll: (callback) => {
        db.query(
            "SELECT * FROM banner ORDER BY sort_order ASC, id_banner DESC",
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    getActive: (callback) => {
        db.query(
            "SELECT * FROM banner WHERE is_active = 1 ORDER BY sort_order ASC, id_banner DESC",
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    getById: (id_banner, callback) => {
        db.query(
            "SELECT * FROM banner WHERE id_banner = ?",
            [id_banner],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    create: (bannerData, callback) => {
        const {
            title,
            subtitle,
            image_url,
            link_url,
            sort_order,
            is_active,
        } = bannerData;

        const sqlInsert = `
            INSERT INTO banner (
                title,
                subtitle,
                image_url,
                link_url,
                sort_order,
                is_active
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sqlInsert,
            [
                title || null,
                subtitle || null,
                image_url,
                link_url || null,
                Number(sort_order) || 0,
                Number(is_active ?? 1),
            ],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    update: (id_banner, bannerData, callback) => {
        const {
            title,
            subtitle,
            image_url,
            link_url,
            sort_order,
            is_active,
        } = bannerData;

        const sqlUpdate = `
            UPDATE banner SET
                title = ?,
                subtitle = ?,
                image_url = ?,
                link_url = ?,
                sort_order = ?,
                is_active = ?
            WHERE id_banner = ?
        `;

        db.query(
            sqlUpdate,
            [
                title || null,
                subtitle || null,
                image_url,
                link_url || null,
                Number(sort_order) || 0,
                Number(is_active ?? 1),
                id_banner,
            ],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    delete: (id_banner, callback) => {
        db.query(
            "DELETE FROM banner WHERE id_banner = ?",
            [id_banner],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },
};

module.exports = Banner;
