const router = require("express").Router();
const User = require("../../models/User");

const auth = require("../../middleware/auth");

// @route   GET api/login
// @desc    Get information of Authenticated User
// @access  Private

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
});

module.exports = router;
