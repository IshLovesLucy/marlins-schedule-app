import { render, screen } from "@testing-library/react";
import BaseballDiamond from "./BaseballDiamond";

describe("<BaseballDiamond />", () => {
    it("renders SVG with default width", () => {
        render(<BaseballDiamond />);
        const svg = screen.getByRole("img", { name: /base/i });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("width", "22px");
    });

    it("shows only 2nd base occupied", () => {
        const { getByTestId } = render(
            <BaseballDiamond basesOccupied={[false, true, false]} />
        );
        expect(getByTestId("first-base")).not.toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("second-base")).toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("third-base")).not.toHaveClass("baseball-diamond__base--occupied");
    });

    it("shows only 3rd base occupied", () => {
        const { getByTestId } = render(
            <BaseballDiamond basesOccupied={[false, false, true]} />
        );
        expect(getByTestId("first-base")).not.toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("second-base")).not.toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("third-base")).toHaveClass("baseball-diamond__base--occupied");
    });

    it("shows only 1st base occupied", () => {
        const { getByTestId } = render(
            <BaseballDiamond basesOccupied={[true, false, false]} />
        );
        expect(getByTestId("first-base")).toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("second-base")).not.toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("third-base")).not.toHaveClass("baseball-diamond__base--occupied");
    });

    it("shows 1st and 2nd bases occupied", () => {
        const { getByTestId } = render(
            <BaseballDiamond basesOccupied={[true, true, false]} />
        );
        expect(getByTestId("first-base")).toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("second-base")).toHaveClass("baseball-diamond__base--occupied");
        expect(getByTestId("third-base")).not.toHaveClass("baseball-diamond__base--occupied");
    });
});

