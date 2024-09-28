import { useState, useEffect } from 'preact/hooks';
import './output.css';

enum Color {
    off,
    red,
    green,
    blue,
};

type RGB = [number, number, number];
const colors: RGB[] = [
    [0, 0, 0],
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255]
];

export function App() {
    const [color, setColor] = useState<RGB>(colors[Color.red]);
    const [lastColor, setLastColor] = useState<RGB>(color);
    const [power, setPower] = useState<boolean>(true);

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => console.log('WebSocket Connected')

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'color')
                setColor(data.color);
            if (data.type === 'power')
                setPower(data.power);
        };

        ws.onerror = (error) => {
            console.error("WebSocket ERROR:", error);
        }

        setSocket(ws);

        return () => { ws.close(); };
    }, []);

    function sendColor(c: RGB): void {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type: 'color', color: c });
            socket.send(message);
        }
    }

    function sendPower(power: boolean): void {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type: 'power', color: power });
            socket.send(message);
        }
    }

    function updateColor(c: RGB): void {
        const isShuttingDown: boolean = c === colors[Color.off];
        if (isShuttingDown)
            setPower(false);
        else
            setPower(true);
        // if last color was "off" don't overwrite lastColor
        if (color != colors[Color.off])
            setLastColor(color);
        setColor(c);
        sendColor(c);
        sendPower(isShuttingDown);
        return;
    }

    function toggle(): void {
        // if it was on, switch it off
        if (power)
            updateColor(colors[Color.off]);
        else
            updateColor(lastColor ? lastColor : colors[Color.red]);
        return;
    }

    return (
        <div class="h-full w-full">
            <header
                style={`background-color: rgb(${color.join(", ")});`}
            >
                NINTENDO
            </header>
            {color.join(", ")}
            <ol>
                {colors.map((c) =>
                    <button
                        class="color"
                        style={`background-color: rgb(${c.join(', ')});`}
                        onClick={() => updateColor(c)}
                    />
                )}
            </ol>
            <button class={power ? "on" : "off"}
                onClick={() => toggle()}>
                {power ? "ON" : "OFF"}
            </button>
        </div>
    );
}
