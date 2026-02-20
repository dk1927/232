export type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
}

class Logger {
    private log(level: LogLevel, message: string, context?: Record<string, any>) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        };

        // In production, this would send to a structured logging service (Datadog, CloudWatch, etc.)
        // For now, we print to console with serialization for readability
        const output = process.env.NODE_ENV === "development"
            ? `[${entry.timestamp}] ${level.toUpperCase()}: ${message} ${context ? JSON.stringify(context) : ""}`
            : JSON.stringify(entry);

        switch (level) {
            case "info":
                console.log(output);
                break;
            case "warn":
                console.warn(output);
                break;
            case "error":
                console.error(output);
                break;
            case "debug":
                if (process.env.NODE_ENV === "development") console.debug(output);
                break;
        }
    }

    info(message: string, context?: Record<string, any>) {
        this.log("info", message, context);
    }

    warn(message: string, context?: Record<string, any>) {
        this.log("warn", message, context);
    }

    error(message: string, context?: Record<string, any>) {
        this.log("error", message, context);
    }

    debug(message: string, context?: Record<string, any>) {
        this.log("debug", message, context);
    }
}

export const logger = new Logger();
