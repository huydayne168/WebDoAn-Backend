const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Account = require('../model/taikhoan');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const OTP_EXPIRES_IN_MS = 5 * 60 * 1000;
const pendingRegistrations = new Map();

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const hashOtp = (email, otp) => {
    return crypto
        .createHash('sha256')
        .update(`${normalizeEmail(email)}:${otp}:${SECRET_KEY}`)
        .digest('hex');
};

const createOtp = () => crypto.randomInt(100000, 1000000).toString();

const getMailTransporter = () => {
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    if (!mailUser || !mailPass) {
        return null;
    }

    const port = Number(process.env.MAIL_PORT || 587);
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port,
        secure: process.env.MAIL_SECURE === 'true' || port === 465,
        auth: {
            user: mailUser,
            pass: mailPass,
        },
    });
};

const sendOtpEmail = async (email, otp) => {
    const transporter = getMailTransporter();

    if (!transporter) {
        throw new Error('MAIL_CONFIG_MISSING');
    }

    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: email,
        subject: 'Ma OTP dang ky tai khoan',
        text: `Ma OTP dang ky cua ban la ${otp}. Ma co hieu luc trong 5 phut.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Xac thuc dang ky tai khoan</h2>
                <p>Ma OTP cua ban la:</p>
                <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
                <p>Ma co hieu luc trong 5 phut. Neu ban khong yeu cau dang ky, vui long bo qua email nay.</p>
            </div>
        `,
    });
};

exports.loginAccount = (req, res) => {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
        return res.status(400).json({ message: "Vui long nhap day du email va mat khau." });
    }

    Account.login(normalizeEmail(email), mat_khau, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Da xay ra loi." });
        }

        if (result.message && result.message !== "Đăng nhập thành công.") {
            return res.status(400).json(result);
        }

        const user = result.user;
        const token = jwt.sign(
            {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Dang nhap thanh cong.",
            token,
            user: {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
            },
        });
    });
};

exports.sendRegisterOtp = (req, res) => {
    const accountData = req.body;
    const email = normalizeEmail(accountData.email);

    if (!accountData.ten_nguoi_dung || !accountData.mat_khau || !email || !accountData.sdt) {
        return res.status(400).json({ message: "Vui long nhap day du thong tin dang ky." });
    }

    Account.findByEmail(email, async (err, existingAccount) => {
        if (err) {
            return res.status(500).json({ message: "Da xay ra loi khi kiem tra email." });
        }

        if (existingAccount) {
            return res.status(400).json({ message: "Email nay da duoc dang ky." });
        }

        const otp = createOtp();
        pendingRegistrations.set(email, {
            accountData: {
                ...accountData,
                email,
            },
            otpHash: hashOtp(email, otp),
            expiresAt: Date.now() + OTP_EXPIRES_IN_MS,
        });

        try {
            await sendOtpEmail(email, otp);
            res.status(200).json({ message: "Ma OTP da duoc gui den email cua ban." });
        } catch (error) {
            pendingRegistrations.delete(email);

            if (error.message === 'MAIL_CONFIG_MISSING') {
                return res.status(500).json({ message: "Server chua cau hinh email gui OTP." });
            }

            res.status(500).json({ message: "Khong the gui email OTP. Vui long thu lai sau." });
        }
    });
};

exports.verifyRegisterOtp = (req, res) => {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();

    if (!email || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ message: "Vui long nhap ma OTP gom 6 so." });
    }

    const pending = pendingRegistrations.get(email);

    if (!pending) {
        return res.status(400).json({ message: "Khong tim thay yeu cau dang ky hoac OTP da het han." });
    }

    if (Date.now() > pending.expiresAt) {
        pendingRegistrations.delete(email);
        return res.status(400).json({ message: "Ma OTP da het han. Vui long gui lai ma moi." });
    }

    if (pending.otpHash !== hashOtp(email, otp)) {
        return res.status(400).json({ message: "Ma OTP khong chinh xac." });
    }

    Account.findByEmail(email, (findErr, existingAccount) => {
        if (findErr) {
            return res.status(500).json({ message: "Da xay ra loi khi kiem tra email." });
        }

        if (existingAccount) {
            pendingRegistrations.delete(email);
            return res.status(400).json({ message: "Email nay da duoc dang ky." });
        }

        Account.create(pending.accountData, (createErr) => {
            if (createErr) {
                return res.status(500).json({ message: "Da xay ra loi khi tao tai khoan." });
            }

            pendingRegistrations.delete(email);
            res.status(201).json({ message: "Tai khoan duoc tao thanh cong." });
        });
    });
};

exports.createAccount = (req, res) => {
    res.status(400).json({ message: "Vui long dang ky bang luong xac thuc OTP." });
};

exports.getAllAccount = (req, res) => {
    Account.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};
