const validateImage = (req, res, next) => {
    if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Invalid image format. Only JPG, PNG, and WEBP are allowed." });
        }

        if (req.file.size > maxSize) {
            return res.status(400).json({ message: "Image size exceeds 2MB limit." });
        }
    }

    next();
};

module.exports = { validateImage };
