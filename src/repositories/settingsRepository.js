const Settings = require("../schema/settingsSchema");

class SettingsRepository {
  async getSettings() {
    return await Settings.findOne({});
  }

  async updateSettings(data) {
    // We pass an empty filter {} because we only have one settings document
    return await Settings.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true }
    );
  }
}

module.exports = new SettingsRepository();
