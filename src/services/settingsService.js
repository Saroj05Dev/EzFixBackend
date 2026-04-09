const settingsRepo = require("../repositories/settingsRepository");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

class SettingsService {
  async getSettings() {
    let settings = await settingsRepo.getSettings();
    if (!settings) {
      // Initialize with defaults if none exist
      settings = await settingsRepo.updateSettings({});
    }
    return settings;
  }

  async updateSettings(data, file) {
    const updatePayload = { ...data };

    if (file) {
      try {
        updatePayload.logo = await uploadToCloudinary(file.path, "settings");
      } catch (error) {
        throw new Error("Failed to upload file");
      }
    }

    // This creates or updates the single settings document
    return await settingsRepo.updateSettings(updatePayload);
  }
}

module.exports = new SettingsService();
