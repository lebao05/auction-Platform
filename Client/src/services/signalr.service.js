import * as signalR from "@microsoft/signalr";

class SignalRService {
    constructor() {
        this.connection = null;
        this.callbacks = {}; // Stores event listeners (e.g., "NewMessage": [func1, func2])
    }

    /**
     * Initializes and starts the SignalR connection.
     * @param {string} token - The JWT Access Token for authentication.
     */
    async startConnection(token) {
        // Prevent duplicate connections
        if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }

        // 1. Build the connection
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7175/hubs/chat", { // REPLACE with your actual backend URL
                accessTokenFactory: () => token, // Pass JWT token here
            })
            .withAutomaticReconnect() // Auto-reconnect if network is lost
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // 2. Set up global event handlers *before* starting
        this._registerGlobalHandlers();

        // 3. Start the connection
        try {
            await this.connection.start();
            console.log("✅ SignalR Connected via WebSockets");
        } catch (err) {
            console.error("❌ SignalR Connection Error: ", err);
            // Optional: Retry logic could go here
        }
    }

    /**
     * Stops the connection manually (e.g., on logout).
     */
    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            this.callbacks = {}; // Clear callbacks
            console.log("🛑 SignalR Disconnected");
        }
    }

    /**
     * Subscribe to a backend event.
     * @param {string} eventName - The name of the Hub method (e.g., "NewMessage").
     * @param {function} callback - The function to run when the event arrives.
     */
    on(eventName, callback) {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = [];
        }
        this.callbacks[eventName].push(callback);
    }

    /**
     * Unsubscribe from an event.
     */
    off(eventName, callback) {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName] = this.callbacks[eventName].filter(cb => cb !== callback);
        }
    }

    /**
     * INTERNAL: Maps specific backend Hub events to our generic callback system.
     * Add any other Hub events you defined in C# here.
     */
    _registerGlobalHandlers() {
        if (!this.connection) return;

        // --- Event: NewMessage ---
        // Corresponds to backend: await Clients.User(...).SendAsync("NewMessage", messageDto);
        this.connection.on("NewMessage", (messageDto) => {
            this._trigger("NewMessage", messageDto);
        });

        // --- Event: UserIsOnline ---
        this.connection.on("UserIsOnline", (userId) => {
            this._trigger("UserIsOnline", userId);
        });

        // --- Event: UserIsOffline ---
        this.connection.on("UserIsOffline", (userId) => {
            this._trigger("UserIsOffline", userId);
        });
    }

    /**
     * INTERNAL: Triggers the callbacks registered by the UI components.
     */
    _trigger(eventName, data) {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`Error in SignalR callback for ${eventName}:`, err);
                }
            });
        }
    }
}

// Export a single instance (Singleton) so the connection is shared across the app
const signalRInstance = new SignalRService();
export default signalRInstance;