import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../components/ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with placeholder text", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts custom className", () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole("textbox").className).toContain("custom-input");
  });

  it("handles type prop", () => {
    render(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("handles text type by default", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("accepts and forwards native input props", async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} value="test@example.com" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test@example.com");
    await userEvent.clear(input);
    await userEvent.type(input, "new@example.com");
    expect(handleChange).toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
  });

  it("applies disabled styling", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("disabled:opacity-50");
    expect(input.className).toContain("disabled:cursor-not-allowed");
  });
});
