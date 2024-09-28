import { useState, useEffect } from 'preact/hooks'
import './output.css'

enum Color {
    off,
    red,
    green,
    blue,
}

type RGB = [number, number, number];
const colors: RGB[] = [
    [0, 0, 0],
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255]
];

/*
const Colors = () => {
    return (
    );
}
*/

export function App() {
    const [isOn, setIsOn] = useState<boolean>(true);
    const [color, setColor] = useState<RGB>(colors[Color.red]);
    const [lastColor, setLastColor] = useState<RGB>(color);

    function updateColor(c: RGB): void {
        if (c == colors[Color.off])
            setIsOn(false);
        else
            setIsOn(true);
        // if last color was "off" don't overwrite lastColor
        if (color != colors[Color.off])
            setLastColor(color);
        setColor(c);
        return;
    }

    function toggle(): void {
        // if it was on, switch it off
        if (isOn)
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
            <button class={isOn ? "on" : "off"}
                onClick={() => toggle()}>
                {isOn ? "ON" : "OFF"}
            </button>
        </div>
    );
}
