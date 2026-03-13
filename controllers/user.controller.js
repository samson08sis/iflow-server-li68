exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
