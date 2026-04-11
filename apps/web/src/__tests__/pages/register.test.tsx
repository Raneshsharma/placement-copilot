import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RegisterPage from "../../app/(auth)/register/page";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/stores/auth-store", () => ({
  useAuthStore: () => ({
    login: jest.fn(),
  }),
}));

jest.mock("@/lib/api", () => ({
  authApi: {
    register: jest.fn(),
  },
}));

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn((name) => ({ name, ref: jest.fn() })),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
  }),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(),
}));

describe("RegisterPage", () => {
  it("renders the registration page heading", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders the create account button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders a link to login page", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("renders the brand name", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Placement Copilot")).toBeInTheDocument();
  });
});
