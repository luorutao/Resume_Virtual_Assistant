import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

// Mock next/link to render a plain anchor in the test environment
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// ThemeToggle uses next-themes which needs a provider — mock it out
jest.mock("@/components/ThemeToggle", () => {
  return function MockThemeToggle() {
    return <button aria-label="Toggle theme">Theme</button>;
  };
});

describe("Navbar component", () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it("renders the logo link", () => {
    const logo = screen.getByRole("link", { name: /RL/i });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders main navigation landmark", () => {
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("renders all nav section links", () => {
    const expectedLabels = ["Experience", "Skills", "Education", "Publications", "Contact"];
    expectedLabels.forEach((label) => {
      expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
    });
  });

  it("renders the mobile menu toggle button", () => {
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("opens the mobile drawer when menu button is clicked", async () => {
    const user = userEvent.setup();
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);
    // After opening, button label changes to "Close menu"
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
  });
});
