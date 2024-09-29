import { v4 as uuidv4 } from 'uuid';
import { ExcelValue } from '../types';

interface TelemetryEvent {
    timestamp: number;
    eventName: string;
    eventData: Record<string, ExcelValue>;
}

export class TelemetryService {
    private endpoint: string;
    private sessionId: string;
    private events: TelemetryEvent[];

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.sessionId = uuidv4();
        this.events = [];
    }

    /**
     * Logs a telemetry event
     * @param eventName The name of the event
     * @param eventData The data associated with the event
     */
    public logEvent(eventName: string, eventData: Record<string, ExcelValue>): void {
        const event: TelemetryEvent = {
            timestamp: Date.now(),
            eventName,
            eventData,
        };
        this.events.push(event);
    }

    /**
     * Sends collected telemetry data to the specified endpoint
     * @returns A promise that resolves when the telemetry data is sent
     */
    public async sendTelemetry(): Promise<void> {
        if (this.events.length === 0) {
            console.log('No events to send');
            return;
        }

        const payload = {
            sessionId: this.sessionId,
            events: this.events,
        };

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Telemetry data sent successfully');
            this.events = []; // Clear the events array after successful transmission
        } catch (error) {
            console.error('Error sending telemetry data:', error);
            // TODO: Implement retry logic here
        }
    }
}

// TODO: Implement error handling and retry logic for failed telemetry transmissions
// TODO: Add configuration options for telemetry data retention and transmission frequency
// TODO: Implement data anonymization or encryption for sensitive information in telemetry events
// TODO: Create unit tests for the TelemetryService class
```

This implementation of the TelemetryService class provides the core functionality for collecting and sending telemetry data. Here's a breakdown of the implementation:

1. We import the `v4` function from the `uuid` package to generate a unique session ID.
2. We define the `TelemetryEvent` interface to represent the structure of a telemetry event.
3. The `TelemetryService` class is implemented with private properties for the endpoint, session ID, and events array.
4. The constructor initializes these properties, generating a new UUID for the session ID.
5. The `logEvent` method creates a new `TelemetryEvent` object and adds it to the events array.
6. The `sendTelemetry` method checks if there are events to send, creates a payload with the session ID and events, and sends a POST request to the specified endpoint.
7. After successful transmission, the events array is cleared.
8. Basic error handling is implemented, logging any errors that occur during the transmission process.

The TODOs at the end of the file represent the pending human tasks from the specification. These tasks include:

1. Implementing error handling and retry logic for failed telemetry transmissions.
2. Adding configuration options for telemetry data retention and transmission frequency.
3. Implementing data anonymization or encryption for sensitive information in telemetry events.
4. Creating unit tests for the TelemetryService class.

These tasks are marked as comments to remind developers of the additional work needed to enhance the telemetry service's functionality and reliability.

To use this TelemetryService in other parts of the application, you would typically create an instance of it early in the application lifecycle and use it to log events as needed. For example:

```typescript
const telemetryService = new TelemetryService('https://your-telemetry-endpoint.com/api/telemetry');

// Log an event
telemetryService.logEvent('spreadsheet_opened', { workbookId: '12345', userId: 'user789' });

// Send telemetry data (you might want to do this periodically or before the application closes)
await telemetryService.sendTelemetry();