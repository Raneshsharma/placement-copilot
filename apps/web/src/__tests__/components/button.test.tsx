import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../components/ui/button";

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button.className).toContain("custom-class");
  });

  it("renders with different variants", () => {
    const variants = ["default", "outline", "secondary", "accent", "ghost", "destructive", "link", "ghost-gold"];
    variants.forEach((variant) => {
      const { container } = render(<Button variant={variant as any}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it("renders with different sizes", () => {
    const sizes = ["default", "sm", "lg", "icon"];
    sizes.forEach((size) => {
      const { container } = render(<Button size={size as any}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>With Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders with asChild when provided a child element", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "Link Button" })).toBeInTheDocument();
  });

  it("renders with loading state", () => {
    render(<Button disabled>Loading...</Button>);
    const button = screen.getByRole("button", { name: "Loading..." });
    expect(button).toBeDisabled();
    expect(button.className).toContain("opacity-50");
  });
});
