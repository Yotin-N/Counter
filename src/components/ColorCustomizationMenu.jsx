// src/components/ColorCustomizationMenu.jsx
import React, { useEffect } from "react";

const ColorCustomizationMenu = ({
    isCountingDown,
    fontColor,
    setFontColor,
    backgroundColor,
    setBackgroundColor
}) => {
    // Gold color palette for font colors
    const goldPalette = [
        { name: "Classic Gold", value: "#d3af37" },
        { name: "Light Gold", value: "#f5e7a3" },
        { name: "Rich Gold", value: "#e5ad07" },
        { name: "Yellow Gold", value: "#ffce01" },
        { name: "BUU Gold", value: "#ffde16" },
        { name: "Antique Gold", value: "#cfb53b" }
    ];

    // Gray color palette for background colors
    const grayPalette = [
        { name: "Medium Gray", value: "#555555" },
        { name: "Dark Gray", value: "#2b2b2b" },

        { name: "BUU Gray", value: "#808e8e" },
        { name: "Slate Gray", value: "#4d4d4d" },
        { name: "Gunmetal", value: "#333333" },
        { name: "Deep Gray", value: "#222222" }
    ];

    // Save color preferences to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('countdownFontColor', fontColor);
        localStorage.setItem('countdownBackgroundColor', backgroundColor);
    }, [fontColor, backgroundColor]);

    return (
        <div className="control-section">
            <h3>Display Colors</h3>

            {/* Font Color Selection */}
            <div className="color-selection-group">
                <div className="color-selection-label">Font Color</div>
                <div className="color-palette">
                    {goldPalette.map((color) => (
                        <div
                            key={color.value}
                            className={`color-swatch ${fontColor === color.value ? 'selected' : ''}`}
                            style={{
                                backgroundColor: color.value,
                                cursor: isCountingDown ? 'not-allowed' : 'pointer',
                                opacity: isCountingDown ? 0.5 : 1
                            }}
                            onClick={() => !isCountingDown && setFontColor(color.value)}
                            title={color.name}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Background Color Selection */}
            <div className="color-selection-group">
                <div className="color-selection-label">Background Color</div>
                <div className="color-palette">
                    {grayPalette.map((color) => (
                        <div
                            key={color.value}
                            className={`color-swatch ${backgroundColor === color.value ? 'selected' : ''}`}
                            style={{
                                backgroundColor: color.value,
                                cursor: isCountingDown ? 'not-allowed' : 'pointer',
                                opacity: isCountingDown ? 0.5 : 1
                            }}
                            onClick={() => !isCountingDown && setBackgroundColor(color.value)}
                            title={color.name}
                        ></div>
                    ))}
                </div>
            </div>

            {/*            
            <div className="color-preview">
                <div className="preview-label">Preview</div>
                <div
                    className="preview-box"
                    style={{
                        backgroundColor: backgroundColor,
                        color: fontColor,
                    }}
                >
                    123
                </div>
            </div> */}
        </div>
    );
};

export default ColorCustomizationMenu;