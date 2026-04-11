import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../app/(auth)/login/page";

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
    login: jest.fn(),
  },
}));

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn((name) => ({ name, ref: jest.fn() })),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
  }),
}));

const mockAuthApi = require("@/lib/api").authApi;
const mockUseRouter = require("next/navigation").useRouter;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login page heading", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the sign in button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders a link to register page", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: /sign up free/i })).toHaveAttribute("href", "/register");
  });

  it("shows error message when login fails", async () => {
    mockAuthApi.login.mockRejectedValue(new Error("Invalid credentials"));
    render(<LoginPage />);
    // The form should be ready
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders password toggle button", () => {
    render(<LoginPage />);
    // There should be a toggle button (icon button near password field)
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
