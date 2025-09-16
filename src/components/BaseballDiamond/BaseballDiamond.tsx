import React from 'react';

interface BaseballDiamondProps {
    basePathColor?: string;
    basesOccupied?: [boolean, boolean, boolean];
}

export default function BaseballDiamond({
    basePathColor = '#000000',
    basesOccupied = [false, false, false]  // third, second, first
}: BaseballDiamondProps) {
    return (
        <svg
            className="baseball-diamond"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width="22px"
            viewBox="0 0 24 17.25"
            aria-label="base"
            style={{ '--gameday-basepath-color': basePathColor } as React.CSSProperties}
        >
            <title>Bases</title>

            {/* First Base */}
            <rect
                data-testid="first-base"
                className={`baseball-diamond__base ${basesOccupied[0] ? 'baseball-diamond__base--occupied' : ''}`}
                width="6"
                height="6"
                transform="translate(5.25, 7.25) rotate(-315)"
            />

            {/* Second Base */}
            <rect
                data-testid="second-base"
                className={`baseball-diamond__base ${basesOccupied[1] ? 'baseball-diamond__base--occupied' : ''}`}
                width="6"
                height="6"
                transform="translate(12, 0.75) rotate(-315)"
            />

            {/* Third Base */}
            <rect
                data-testid="third-base"
                className={`baseball-diamond__base ${basesOccupied[2] ? 'baseball-diamond__base--occupied' : ''}`}
                width="6"
                height="6"
                transform="translate(18.75, 7.25) rotate(-315)"
            />
        </svg>
    );
}
