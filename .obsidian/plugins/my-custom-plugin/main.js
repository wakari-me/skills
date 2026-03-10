module.exports = class MyCustomPlugin extends require('obsidian').Plugin {
    async onload() {
        try {
            console.log("Loading My Custom Plugin");

            this.addCommand({
                id: "toggle-vim-mode",
                name: "Toggle Vim Mode",
                callback: async () => {
                    try {
                        console.log("Toggle Vim Mode command triggered");
                        const vimMode = this.app.vault.getConfig("vimMode");
                        console.log("Current Vim Mode:", vimMode);
                        this.app.vault.setConfig("vimMode", !vimMode);
                        await this.saveData();
                        console.log("Vim Mode Toggled:", !vimMode);
                    } catch (error) {
                        console.error("Error in Toggle Vim Mode command:", error);
                    }
                }
            });

            console.log("My Custom Plugin loaded successfully");
        } catch (error) {
            console.error("Failed to load My Custom Plugin:", error);
        }
    }

    onunload() {
        console.log("Unloading My Custom Plugin");
    }
};
