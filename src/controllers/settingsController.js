const settingsService = require("../services/settingsService");

class SettingsController {
  getSettings = async (req, res) => {
    try {
      const settings = await settingsService.getSettings();
      return res.status(200).json({ success: true, data: settings });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Handles both Create and Update
  updateSettings = async (req, res) => {
    try {
      const data = req.body;
      const file = req.file;

      const result = await settingsService.updateSettings(data, file);
      
      return res.status(200).json({ 
        success: true, 
        data: result, 
        message: "Settings saved successfully" 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new SettingsController();
